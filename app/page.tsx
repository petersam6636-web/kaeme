
import { Suspense } from "react";

import { createSupabaseServerClient } from "@/lib/supabase-server";

import Decide from "@/component/Decide";
import Loading from "@/component/Loading";

async function HomeContent() {
  const supabase = await createSupabaseServerClient();

  // Verify the authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return <Decide projects={[]} isAuthenticated={false} />;
  }

  // Retrieve projects belonging to this user
  const {
    data: projects,
    error: projectsError,
  } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (projectsError) {
    return <Decide projects={[]} isAuthenticated />;
  }

  return <Decide projects={projects ?? []} isAuthenticated />;
}

export default function HomePage() {
  return (
    <main className="min-h-[100dvh] w-full">
      <Suspense fallback={<Loading />}>
        <HomeContent />
      </Suspense>
    </main>
  );
}