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
        return { success: false, message: error.message }
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
        return { success: false, message: error.message }
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
