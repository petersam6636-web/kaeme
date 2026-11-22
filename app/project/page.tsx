import { Suspense } from "react";
import { redirect } from "next/navigation";
import CreateProject from "@/component/project/CreateProject";
import { createSupabaseServerClient } from "@/lib/supabase-server";

import Loading from "@/component/Loading";


async function ProjectContent() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/register");
  }

  return <CreateProject />;
}

export default function ProjectPage() {
  return (
    <main className="h-[100dvh] w-full overflow-hidden">
      <Suspense fallback={<Loading />}>
        <ProjectContent />
      </Suspense>
    </main>
  );
}