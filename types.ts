export interface FileInput {
  file: File;
  previewUrl?: string;
  base64?: string;
  mimeType: string;
}

export enum Role {
  STUDENT = 'Student',
  SOFTWARE_ENGINEER = 'Software Engineer',
  RESEARCHER = 'Researcher',
  FREELANCER = 'Freelancer',
  OTHER = 'Other'
}

export interface UserProfile {
  role: Role;
  timezone: string;
  workingHours: string;
  hardEvents: string;
}

export interface DayStats {
  day: string;
  taskCount: number;
}

export interface WeeklyPlanResponse {
  // Structured data for Dashboard
  today_focus_items: string[];
  due_today_items: string[];
  week_glance: DayStats[];
  
  // Markdown content
  tasks_deadlines_markdown: string;
  today_focus_markdown: string;
  week_schedule_markdown: string;
  action_generators_markdown: string;
  summary: string;
}

export enum AppStatus {
  IDLE = 'idle',
  PROCESSING = 'processing',
  SUCCESS = 'success',
  ERROR = 'error'
}