
import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = 'https://obdpeekrsprszsryrapx.supabase.co'

const supabaseKey =
  "sb_publishable_cuNOsr_lBknUHQogaI4gqA_hegE2ZxN";

export const supabase = createBrowserClient(
  supabaseUrl,
  supabaseKey,
  {
    auth: {
      flowType: "pkce",
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  }
);
