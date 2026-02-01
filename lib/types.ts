export interface Task {
  id: string
  title: string
  description?: string
  status: string
  priority: string
  category: string
  dueDate?: string
}

export interface Note {
  id: string
  title: string
  content: string
  createdAt: string
}
