
import type {
  ProjectInsert,
  ProjectRow,
  ProjectUpdate,
} from "./project";
import type { Day, DayInsert } from "./day";

export type Database = {
  public: {
    Tables: {
      projects: {
        Row: ProjectRow;
        Insert: ProjectInsert;
        Update: ProjectUpdate;
        Relationships: [];
      };
      days: {
        Row: Day;
        Insert: DayInsert;
        Update: Partial<DayInsert>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
