import { createClient, SupabaseClient } from "@supabase/supabase-js";
import {
  SUPABASE_CLIENT_KEY,
  SUPABASE_CLIENT_URL,
} from "../../utils/params.ts";

const supabaseClient: SupabaseClient = createClient(
  SUPABASE_CLIENT_URL,
  SUPABASE_CLIENT_KEY,
);

export function getSupabaseClient() {
  return supabaseClient;
}
