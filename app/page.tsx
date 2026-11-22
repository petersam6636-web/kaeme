
import { Suspense } from "react";

import { createSupabaseServerClient } from "@/lib/supabase-server";

import Decide from "@/component/Decide";
import Loading from "@/component/Loading";
import type { Day } from "@/types/day";
import type { Project, ProjectRow } from "@/types/project";

function getMetadataString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null;
}

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

  const projectRows: ProjectRow[] = projects ?? [];
  const daysByProject = new Map<string, Day[]>();

  if (projectRows.length > 0) {
    const {
      data: days,
      error: daysError,
    } = await supabase
      .from("days")
      .select("*")
      .in(
        "project_id",
        projectRows.map((project) => project.id)
      );

    if (daysError) {
      throw daysError;
    }

    for (const day of (days ?? []) as Day[]) {
      const projectDays = daysByProject.get(day.project_id);
      if (projectDays) {
        projectDays.push(day);
      } else {
        daysByProject.set(day.project_id, [day]);
      }
    }
  }

  const projectsWithDays: Project[] = projectRows.map((project) => ({
    ...project,
    days: daysByProject.get(project.id) ?? [],
  }));
  const metadata = user.user_metadata;
  const profile = {
    name:
      getMetadataString(metadata.full_name) ??
      getMetadataString(metadata.name) ??
      user.email ??
      null,
    email: user.email ?? null,
    avatar_url:
      getMetadataString(metadata.avatar_url) ??
      getMetadataString(metadata.picture) ??
      getMetadataString(metadata.avatar),
  };

  return (
    <Decide
      projects={projectsWithDays}
      isAuthenticated
      user={profile}
    />
  );
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