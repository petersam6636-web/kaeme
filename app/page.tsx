
import { Suspense } from "react";
import { redirect } from "next/navigation";

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
    redirect("/");
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
    throw new Error(
      `Unable to fetch projects: ${projectsError.message}`
    );
  }

  return <Decide projects={projects ?? []} />;
}

export default function HomePage() {
  return (
    <main className="w-full px-1.5 md:px-3">
      <Suspense fallback={<Loading />}>
        <HomeContent />
      </Suspense>
    </main>
  );
}