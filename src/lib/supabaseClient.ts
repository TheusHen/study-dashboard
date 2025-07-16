import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_KEY as string

console.log('SUPABASE_URL:', supabaseUrl)
console.log('SUPABASE_KEY:', supabaseAnonKey)

export const supabase = createClient(supabaseUrl, supabaseAnonKey)