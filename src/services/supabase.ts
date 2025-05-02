import { createClient } from '@supabase/supabase-js';

// Supabase configuration - replace these with your actual Supabase project URL and anon key
// For development, we're using placeholder values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://cfjrmmcyssbemtpxlehk.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmanJtbWN5c3NiZW10cHhsZWhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxNzk5NDUsImV4cCI6MjA2MTc1NTk0NX0.MU-buP9pBqAuH5JXkj9Ypac1fDcILS9WTl8WN2albIw';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase; 