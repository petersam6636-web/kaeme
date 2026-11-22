import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase-server";

import AddPage from "./AddProject";

export default async function ProjectPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/register");
  }

  return <AddPage />;
}