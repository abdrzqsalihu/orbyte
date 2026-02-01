import type { Task, Note } from "./types"

export const initialTasks: Task[] = [
  {
    id: "1",
    title: "Finalize Q3 report",
    description: "Complete the quarterly financial report with all metrics and KPIs",
    status: "todo",
    priority: "high",
    category: "work",
    dueDate: "2023-09-30",
  },
  {
    id: "2",
    title: "Website redesign",
    description: "Work with design team to implement new homepage layout",
    status: "inprogress",
    priority: "medium",
    category: "work",
    dueDate: "2023-10-15",
  },
  {
    id: "3",
    title: "Team meeting",
    description: "Weekly sync with product and engineering teams",
    status: "todo",
    priority: "medium",
    category: "work",
    dueDate: "2023-09-25",
  },
  {
    id: "4",
    title: "Gym session",
    description: "Cardio and strength training",
    status: "todo",
    priority: "low",
    category: "personal",
    dueDate: "2023-09-24",
  },
  {
    id: "5",
    title: "Read design book",
    description: "Finish reading 'Don't Make Me Think' by Steve Krug",
    status: "inprogress",
    priority: "low",
    category: "education",
    dueDate: "2023-10-10",
  },
  {
    id: "6",
    title: "Doctor appointment",
    description: "Annual checkup at Dr. Smith's office",
    status: "todo",
    priority: "high",
    category: "health",
    dueDate: "2023-09-28",
  },
  {
    id: "7",
    title: "Client presentation",
    description: "Present new marketing strategy to ABC Corp",
    status: "done",
    priority: "high",
    category: "work",
    dueDate: "2023-09-20",
  },
]

export const initialNotes: Note[] = [
  {
    id: "1",
    title: "Project Ideas",
    content: "- Mobile app for task management\n- AI-powered content generator\n- Community platform for developers",
    createdAt: "2023-09-15",
  },
  {
    id: "2",
    title: "Meeting Notes: Product Team",
    content:
      "Discussed roadmap for Q4\nPriority features:\n1. User authentication\n2. Dashboard redesign\n3. Export functionality",
    createdAt: "2023-09-18",
  },
  {
    id: "3",
    title: "Learning Resources",
    content:
      "React Advanced Patterns: https://example.com/react\nTypeScript Deep Dive: https://example.com/typescript\nUI/UX Design Principles: https://example.com/design",
    createdAt: "2023-09-20",
  },
]
