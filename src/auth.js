const USERS_STORAGE_KEY = 'iou-users'
const CURRENT_USER_STORAGE_KEY = 'iou-current-user'

function readUsers() {
    try {
        const stored = localStorage.getItem(USERS_STORAGE_KEY)
        return stored ? JSON.parse(stored) : []
    } catch {
        return []
    }
}

function writeUsers(users) {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
}

export function registerUser({ name, email, password }) {
    const normalizedEmail = email.trim().toLowerCase()
    const users = readUsers()

    if (!name.trim() || !normalizedEmail || !password) {
        return { success: false, message: 'Please fill in all fields.' }
    }

    const emailExists = users.some((user) => user.email === normalizedEmail)
    if (emailExists) {
        return { success: false, message: 'An account with that email already exists.' }
    }

    const user = {
        id: crypto.randomUUID(),
        name: name.trim(),
        email: normalizedEmail,
        password,
    }

    users.push(user)
    writeUsers(users)
    localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user))

    return { success: true, user }
}

export function authenticateUser({ email, password }) {
    const normalizedEmail = email.trim().toLowerCase()
    const users = readUsers()
    const user = users.find(
        (entry) => entry.email === normalizedEmail && entry.password === password,
    )

    if (!user) {
        return { success: false, message: 'Invalid email or password.' }
    }

    localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user))
    return { success: true, user }
}

export function getCurrentUser() {
    try {
        const stored = localStorage.getItem(CURRENT_USER_STORAGE_KEY)
        return stored ? JSON.parse(stored) : null
    } catch {
        return null
    }
}

export function logoutUser() {
    localStorage.removeItem(CURRENT_USER_STORAGE_KEY)
}
