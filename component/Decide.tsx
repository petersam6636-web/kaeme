
import type { Project } from "@/types/project";

import NoProject from "./NoProject";
import ProjectExist from "./ProjectExist";

interface DecideProps {
  projects: Project[];
  isAuthenticated: boolean;
  user?: {
    name?: string | null;
    email?: string | null;
    avatar_url?: string | null;
  };
}

export default function Decide({
  projects,
  isAuthenticated,
  user,
}: DecideProps) {
  if (projects.length === 0) {
    return <NoProject isAuthenticated={isAuthenticated} />;
  }

  return <ProjectExist projects={projects} user={user} />;
}