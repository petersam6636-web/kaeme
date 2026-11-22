import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  const supabaseUrl = "https://obdpeekrsprszsryrapx.supabase.co";
  const supabaseKey =
    "sb_publishable_cuNOsr_lBknUHQogaI4gqA_hegE2ZxN";

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },

      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Cookie updates may be unavailable in a Server Component.
          // Middleware can handle session refresh.
        }
      },
    },
  });
}
