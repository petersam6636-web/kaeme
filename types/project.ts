
import type { Day } from "./day";

export type ProjectStatus =
  | "pending"
  | "processing"
  | "sent"
  | "failed";

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  schedule_time: string;
  phone_number: string;
  message: string;
  status: ProjectStatus;
  created_at: string;
  sent_at: string | null;
  days: Day[];
}

export type ProjectRow = Omit<Project, "days">;

export type ProjectInsert = {
  id?: string;
  user_id: string;
  name: string;
  description?: string | null;
  schedule_time: string;
  phone_number: string;
  message: string;
  created_at?: string;
  last_sent_at?: string | null;
};

export type ProjectUpdate = Partial<
  Omit<Project, "id" | "user_id" | "days">
>;
