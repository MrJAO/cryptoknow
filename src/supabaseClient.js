// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://your-project-url.supabase.co'; // Replace with your project URL
const supabaseAnonKey = 'your-anon-key'; // Replace with your anon public key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
