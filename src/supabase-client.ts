import { createClient } from "@supabase/supabase-js";
 
// const supabaseURL = "https://ytkovgzciutzuzuzsaco.supabase.co";
// ye ghalt tareeka hai as string
// const supabaseAnonKey = import.meta.env.supabaseAPIKEY as string
const supabaseURL = import.meta.env.VITE_SUPABASE_URL 
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ;


if (!supabaseURL || !supabaseAnonKey) {
  throw new Error("Supabase URL and Anon Key must be provided.");
}




export const supabase = createClient(supabaseURL, supabaseAnonKey)





