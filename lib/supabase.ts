import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://znurndpjvcmoxsbskcev.supabase.co';
const supabaseKey = 'sb_publishable_B9xqlsxcepDAyX_xx89b8Q_UADJudHz';

export const supabase = createClient(supabaseUrl, supabaseKey);
