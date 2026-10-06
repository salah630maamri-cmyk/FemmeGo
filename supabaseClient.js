import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://bzlenlrpaoqtczvhqsyc.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_my4EvsIHRstj5YwC7HtvUg_K30Nv_9S'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
