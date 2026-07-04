import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

export const supabase = (() => {
    if (!supabaseUrl || !supabaseAnonKey) {
        return null
    }

    try {
        return createClient(supabaseUrl, supabaseAnonKey)
    } catch (error) {
        console.error('Failed to initialize Supabase client:', error)
        return null
    }
})()
