import { useEffect, useMemo, useState } from 'react'
import './App.css'
import {
  authenticateUser,
  getCurrentUser,
  logoutUser,
  registerUser,
} from './auth'

const initialForm = {
  name: '',
  email: '',
  password: '',
}

function App() {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState(initialForm)
  const [message, setMessage] = useState('')
  const [user, setUser] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const title = useMemo(() => (mode === 'login' ? 'Log in' : 'Sign up'), [mode])

  useEffect(() => {
    let mounted = true

    const loadUser = async () => {
      const currentUser = await getCurrentUser()
      if (mounted) {
        setUser(currentUser)
      }
    }

    loadUser()

    return () => {
      mounted = false
    }
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (isSubmitting) {
      return
    }

    setMessage('')
    setIsSubmitting(true)

    try {
      if (mode === 'login') {
        const result = await authenticateUser({ email: form.email, password: form.password })
        if (!result.success) {
          setMessage(result.message)
          return
        }

        setUser(result.user)
        setForm(initialForm)
        return
      }

      const result = await registerUser({ name: form.name, email: form.email, password: form.password })
      if (!result.success) {
        setMessage(result.message)
        return
      }

      setUser(result.user)
      setForm(initialForm)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLogout = async () => {
    await logoutUser()
    setUser(null)
  }

  return (
    <main className="app-shell">
      <section className="hero-card">
        <p className="eyebrow">IOU</p>
        <h1>I Owe You</h1>
        <p className="subtitle">
          A friendly React app for tracking favors, loans, and little reminders.
        </p>

        {!user ? (
          <div className="auth-panel">
            <div className="mode-switch" role="tablist" aria-label="Authentication mode">
              <button
                type="button"
                className={mode === 'login' ? 'active' : ''}
                onClick={() => {
                  setMode('login')
                  setMessage('')
                }}
              >
                Login
              </button>
              <button
                type="button"
                className={mode === 'signup' ? 'active' : ''}
                onClick={() => {
                  setMode('signup')
                  setMessage('')
                }}
              >
                Sign up
              </button>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              <h2>{title}</h2>
              {mode === 'signup' && (
                <label>
                  <span>Name</span>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                  />
                </label>
              )}

              <label>
                <span>Email</span>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                />
              </label>

              <label>
                <span>Password</span>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
              </label>

              {message ? <p className="message">{message}</p> : null}

              <button className="submit-btn" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Please wait...' : mode === 'login' ? 'Log in' : 'Create account'}
              </button>
            </form>
          </div>
        ) : (
          <div className="dashboard-card">
            <h2>Welcome back, {user.name}</h2>
            <p>You are signed in and ready to manage your IOU moments.</p>
            <button className="submit-btn" type="button" onClick={handleLogout}>
              Log out
            </button>
          </div>
        )}

        <div className="pill-row">
          <span className="pill">Track balances</span>
          <span className="pill">Remember favors</span>
          <span className="pill">Stay friendly</span>
        </div>
      </section>
    </main>
  )
}

export default App
