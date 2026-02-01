"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { BarChart, LineChart, PieChart } from "@/components/ui/chart"
import { CheckCircle2, Clock, ArrowUpRight, ArrowDownRight, Calendar, CheckSquare, AlertCircle } from "lucide-react"
import { TaskModal } from "@/components/task-modal"
import type { Task } from "@/lib/types"

interface OverviewDashboardProps {
  tasks: Task[]
}

export function OverviewDashboard({ tasks }: OverviewDashboardProps) {
  const [timeframe, setTimeframe] = useState("week")
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [currentTask, setCurrentTask] = useState<Task | null>(null)

  // Calculate task statistics
  const totalTasks = tasks.length
  const completedTasks = tasks.filter((task) => task.status === "done").length
  const inProgressTasks = tasks.filter((task) => task.status === "inprogress").length
  const todoTasks = tasks.filter((task) => task.status === "todo").length
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  // Calculate priority distribution
  const highPriorityTasks = tasks.filter((task) => task.priority === "high").length
  const mediumPriorityTasks = tasks.filter((task) => task.priority === "medium").length
  const lowPriorityTasks = tasks.filter((task) => task.priority === "low").length

  // Get upcoming tasks (due in the next 7 days)
  const today = new Date()
  const nextWeek = new Date(today)
  nextWeek.setDate(today.getDate() + 7)

  const upcomingTasks = tasks
    .filter((task) => {
      if (!task.dueDate) return false
      const dueDate = new Date(task.dueDate)
      return dueDate >= today && dueDate <= nextWeek && task.status !== "done"
    })
    .sort((a, b) => {
      if (!a.dueDate || !b.dueDate) return 0
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    })
    .slice(0, 5)

  const handleEditTask = (task: Task) => {
    setCurrentTask(task)
    setIsTaskModalOpen(true)
  }

  // Chart data
  const taskCompletionData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Completed",
        data: [3, 5, 2, 6, 4, 3, 8],
        backgroundColor: "rgba(147, 51, 234, 0.8)",
        borderColor: "rgba(147, 51, 234, 1)",
        borderWidth: 2,
      },
      {
        label: "Created",
        data: [5, 8, 4, 9, 7, 5, 10],
        backgroundColor: "rgba(79, 70, 229, 0.8)",
        borderColor: "rgba(79, 70, 229, 1)",
        borderWidth: 2,
      },
    ],
  }

  const productivityTrendData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Productivity Score",
        data: [65, 78, 72, 84],
        borderColor: "rgba(236, 72, 153, 1)",
        backgroundColor: "rgba(236, 72, 153, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  }

  const priorityDistributionData = {
    labels: ["High", "Medium", "Low"],
    datasets: [
      {
        label: "Tasks by Priority",
        data: [highPriorityTasks, mediumPriorityTasks, lowPriorityTasks],
        backgroundColor: ["rgba(239, 68, 68, 0.8)", "rgba(245, 158, 11, 0.8)", "rgba(16, 185, 129, 0.8)"],
        borderColor: ["rgba(239, 68, 68, 1)", "rgba(245, 158, 11, 1)", "rgba(16, 185, 129, 1)"],
        borderWidth: 1,
      },
    ],
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="dark-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Tasks</p>
                <h3 className="text-2xl font-bold mt-1">{totalTasks}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center">
                <CheckSquare className="h-6 w-6 text-accent" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30">
                <ArrowUpRight className="mr-1 h-3 w-3" />
                12% increase
              </Badge>
              <span className="ml-2 text-muted-foreground">from last week</span>
            </div>
          </CardContent>
        </Card>

        <Card className="dark-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                <h3 className="text-2xl font-bold mt-1">{completionRate}%</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-purple-500" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/30">
                <ArrowUpRight className="mr-1 h-3 w-3" />
                5% increase
              </Badge>
              <span className="ml-2 text-muted-foreground">from last week</span>
            </div>
          </CardContent>
        </Card>

        <Card className="dark-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                <h3 className="text-2xl font-bold mt-1">{inProgressTasks}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Clock className="h-6 w-6 text-blue-500" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/30">
                <ArrowDownRight className="mr-1 h-3 w-3" />
                3% decrease
              </Badge>
              <span className="ml-2 text-muted-foreground">from last week</span>
            </div>
          </CardContent>
        </Card>

        <Card className="dark-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">High Priority</p>
                <h3 className="text-2xl font-bold mt-1">{highPriorityTasks}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-red-500/20 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-red-500" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/30">
                <ArrowUpRight className="mr-1 h-3 w-3" />2 new
              </Badge>
              <span className="ml-2 text-muted-foreground">since yesterday</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 dark-card">
          <CardHeader className="pb-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg font-medium text-white">Task Activity</CardTitle>
                <CardDescription>Task completion trends over time</CardDescription>
              </div>
              <Tabs defaultValue="week" className="w-full sm:w-[200px]">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="week">Week</TabsTrigger>
                  <TabsTrigger value="month">Month</TabsTrigger>
                  <TabsTrigger value="year">Year</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[300px]">
              <BarChart
                data={taskCompletionData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: {
                        color: "rgba(255, 255, 255, 0.1)",
                      },
                      ticks: {
                        color: "rgba(255, 255, 255, 0.7)",
                      },
                    },
                    x: {
                      grid: {
                        display: false,
                      },
                      ticks: {
                        color: "rgba(255, 255, 255, 0.7)",
                      },
                    },
                  },
                  plugins: {
                    legend: {
                      position: "top",
                      labels: {
                        color: "rgba(255, 255, 255, 0.7)",
                      },
                    },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="dark-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Priority Distribution</CardTitle>
            <CardDescription>Tasks by priority level</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[300px]">
              <PieChart
                data={priorityDistributionData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "bottom",
                      labels: {
                        color: "rgba(255, 255, 255, 0.7)",
                      },
                    },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Productivity Trend & Upcoming Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 dark-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Productivity Trend</CardTitle>
            <CardDescription>Your productivity score over time</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[250px]">
              <LineChart
                data={productivityTrendData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: {
                        color: "rgba(255, 255, 255, 0.1)",
                      },
                      ticks: {
                        color: "rgba(255, 255, 255, 0.7)",
                      },
                    },
                    x: {
                      grid: {
                        display: false,
                      },
                      ticks: {
                        color: "rgba(255, 255, 255, 0.7)",
                      },
                    },
                  },
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="dark-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Upcoming Deadlines</CardTitle>
            <CardDescription>Tasks due soon</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              {upcomingTasks.length > 0 ? (
                upcomingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors cursor-pointer border border-border/40"
                    onClick={() => handleEditTask(task)}
                  >
                    <div className="mr-3">
                      {task.priority === "high" ? (
                        <div className="h-8 w-8 rounded-full bg-red-500/20 flex items-center justify-center">
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        </div>
                      ) : task.priority === "medium" ? (
                        <div className="h-8 w-8 rounded-full bg-amber-500/20 flex items-center justify-center">
                          <Clock className="h-4 w-4 text-amber-500" />
                        </div>
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{task.title}</p>
                      <p className="text-xs text-muted-foreground flex items-center mt-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        {task.dueDate}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-sm">No upcoming deadlines</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {isTaskModalOpen && (
        <TaskModal
          task={currentTask}
          onClose={() => {
            setIsTaskModalOpen(false)
            setCurrentTask(null)
          }}
        />
      )}
    </div>
  )
}
