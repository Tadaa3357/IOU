import { supabase } from './supabaseClient'

function ensureSupabaseClient() {
    if (!supabase) {
        return {
            success: false,
            message: 'Supabase is not configured yet. Add your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY values.',
        }
    }

    return null
}

export function getAuthErrorMessage(error) {
    const message = typeof error === 'string' ? error : error?.message || ''
    const normalizedMessage = message.toLowerCase()

    if (
        normalizedMessage.includes('email rate exceeded') ||
        normalizedMessage.includes('rate limit') ||
        normalizedMessage.includes('too many requests')
    ) {
        return 'We are getting a lot of sign-up requests right now. Please wait a few minutes and try again with a different email address.'
    }

    if (normalizedMessage.includes('already registered') || normalizedMessage.includes('already exists')) {
        return 'This email is already in use. Try logging in instead.'
    }

    return message
}

export async function registerUser({ name, email, password }) {
    const missingConfig = ensureSupabaseClient()
    if (missingConfig) {
        return missingConfig
    }

    const normalizedEmail = email.trim().toLowerCase()

    if (!name.trim() || !normalizedEmail || !password) {
        return { success: false, message: 'Please fill in all fields.' }
    }

    const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
            data: { name: name.trim() },
        },
    })

    if (error) {
        return { success: false, message: getAuthErrorMessage(error) }
    }

    return {
        success: true,
        user: {
            id: data.user?.id,
            name: data.user?.user_metadata?.name || name.trim(),
            email: normalizedEmail,
        },
    }
}

export async function authenticateUser({ email, password }) {
    const missingConfig = ensureSupabaseClient()
    if (missingConfig) {
        return missingConfig
    }

    const normalizedEmail = email.trim().toLowerCase()

    const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
    })

    if (error) {
        return { success: false, message: getAuthErrorMessage(error) }
    }

    return {
        success: true,
        user: {
            id: data.user?.id,
            name: data.user?.user_metadata?.name || data.user?.email,
            email: data.user?.email,
        },
    }
}

export async function getCurrentUser() {
    if (!supabase) {
        return null
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    return {
        id: user.id,
        name: user.user_metadata?.name || user.email,
        email: user.email,
    }
}

export async function logoutUser() {
    if (!supabase) {
        return
    }

    await supabase.auth.signOut()
}
