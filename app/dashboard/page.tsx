import { initialTasks } from "@/lib/data"
import { OverviewDashboard } from "@/components/overview-dashboard"

export default function DashboardPage() {
  return <OverviewDashboard tasks={initialTasks} />
}
