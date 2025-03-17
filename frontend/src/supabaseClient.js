// supabaseClient.js (Supabase Setup)
import { createClient } from "@supabase/supabase-js";

console.log("supabaseClient.js loaded");

const supabase = createClient("https://your-project.supabase.co", "your-anon-key");
export { supabase };
