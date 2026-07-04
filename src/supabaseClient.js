import { createClient } from '@supabase/supabase-js'

const fallbackSupabaseUrl = 'https://qnhlugcjrolicfeijafs.supabase.co'
const fallbackSupabaseAnonKey = 'sb_publishable_Xt61klO04qFlrMRBkO7BDg_ldLpg4tV'

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || fallbackSupabaseUrl).trim()
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || fallbackSupabaseAnonKey).trim()

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
