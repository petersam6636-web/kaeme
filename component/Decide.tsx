
import type { Project } from "@/types/project";

import NoProject from "./NoProject";
import ProjectExist from "./ProjectExist";

interface DecideProps {
  projects: Project[];
}

export default function Decide({ projects }: DecideProps) {
  if (projects.length === 0) {
    return <NoProject />;
  }

  return <ProjectExist projects={projects} />;
}