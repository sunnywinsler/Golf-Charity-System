import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder'

// Service role key used on backend to bypass RLS when performing admin actions
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})
