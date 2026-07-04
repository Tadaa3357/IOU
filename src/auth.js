import { supabase } from './supabaseClient'

export async function registerUser({ name, email, password }) {
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
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    return {
        id: user.id,
        name: user.user_metadata?.name || user.email,
        email: user.email,
    }
}

export async function logoutUser() {
    await supabase.auth.signOut()
}
