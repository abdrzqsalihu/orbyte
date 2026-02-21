export interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  category: string;
  dueDate?: string;
}

export interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}
