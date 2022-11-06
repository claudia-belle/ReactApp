import { createClient } from '@supabase/supabase-js'

// opcional para poder personalizar diferentes aspectos
const options = {
    schema: 'public',
    headers: { 'x-my-custom-header': 'my-app-name' },
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
}

export const supabase = createClient(
    process.env.REACT_APP_SUPBASE_URL,
    process.env.REACT_APP_SUPBASE_ANON_KEY, 
    options
)
