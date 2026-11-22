
import type { Project } from "@/types/project";

import NoProject from "./NoProject";
import ProjectExist from "./ProjectExist";

interface DecideProps {
  projects: Project[];
  isAuthenticated: boolean;
}

export default function Decide({
  projects,
  isAuthenticated,
}: DecideProps) {
  if (projects.length === 0) {
    return <NoProject isAuthenticated={isAuthenticated} />;
  }

  return <ProjectExist projects={projects} />;
}