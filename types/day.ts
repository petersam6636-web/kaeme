export interface Day {
  id: string;
  project_id: string;
  days: string;
  created_at: string;
}

export type DayInsert = {
  id?: string;
  project_id: string;
  days: string;
  created_at?: string;
};
