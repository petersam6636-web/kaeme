
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://obdpeekrsprszsryrapx.supabase.co'

const supabaseKey =
  "sb_publishable_cuNOsr_lBknUHQogaI4gqA_hegE2ZxN";

export const supabase = createClient(
  supabaseUrl,
  supabaseKey,
  {
    auth: {
      flowType: "implicit",
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  }
);
