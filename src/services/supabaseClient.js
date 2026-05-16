import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://iwlsshnimbvtnjkpvwak.supabase.co'
const supabaseAnonKey = 'sb_publishable_HtJJq9dVkuwvlDsTXjNEPQ_XZWNtudy'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)