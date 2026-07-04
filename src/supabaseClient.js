import { createClient } from '@supabase/supabase-js'

const fallbackSupabaseUrl = 'https://qnhlugcjrolicfeijafs.supabase.co'
const fallbackSupabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFuaGx1Z2Nqcm9saWNmZWlqYWZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMxNTI3NDUsImV4cCI6MjA5ODcyODc0NX0.D5xBZ48wjrX619li8baQYo_akK8q-LNAvpfr_HwsV4U'

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
