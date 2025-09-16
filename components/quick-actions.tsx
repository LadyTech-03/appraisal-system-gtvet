"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useAuthStore, useAppStore } from "@/lib/store"
import { Plus, FileText, Users, BarChart3, Calendar, Settings, Download, UserCheck } from "lucide-react"

export function QuickActions() {
  const router = useRouter()
  const { user } = useAuthStore()
  const { users, appraisals } = useAppStore()

  const isManager = user?.role.includes("Director") || user?.role.includes("Head")
  const isDG = user?.role === "Director-General"

  const hasManager = user?.managerId && user.managerId !== "none"

  const hasPendingSelfAppraisal = appraisals.some(
    (appraisal) =>
      appraisal.employeeId === user?.id &&
      appraisal.createdBy === "appraisee" &&
      (appraisal.status === "draft" || appraisal.status === "pending-review"),
  )

  const actions = [
    {
      title: "Start Self-Appraisal",
      description: "Begin your self-assessment",
      icon: UserCheck,
      color: "bg-emerald-500 text-white",
      onClick: () => router.push(`/self-appraisal/${user?.id}`),
      show: hasManager && !hasPendingSelfAppraisal,
    },
    {
      title: "Start New Appraisal",
      description: "Create a comprehensive appraisal",
      icon: Plus,
      color: "bg-primary text-primary-foreground",
      onClick: () => router.push("/create-appraisal"),
      show: isManager,
    },
    {
      title: "View My Appraisals",
      description: "Check your performance reviews",
      icon: FileText,
      color: "bg-blue-500 text-white",
      onClick: () => router.push("/appraisals"),
      show: true,
    },
    {
      title: "Team Overview",
      description: "Manage team appraisals",
      icon: Users,
      color: "bg-green-500 text-white",
      onClick: () => router.push("/team-appraisals"),
      show: isManager,
    },
    {
      title: "Export Reports",
      description: "Download PDF appraisals",
      icon: Download,
      color: "bg-purple-500 text-white",
      onClick: () => router.push("/team-appraisals"),
      show: isManager,
    },
    {
      title: "Analytics Dashboard",
      description: "View performance analytics",
      icon: BarChart3,
      color: "bg-orange-500 text-white",
      onClick: () => router.push("/analytics"),
      show: isDG,
    },
    {
      title: "Appraisal History",
      description: "Browse past appraisals",
      icon: Calendar,
      color: "bg-teal-500 text-white",
      onClick: () => router.push("/history"),
      show: true,
    },
    {
      title: "User Management",
      description: "Manage system users",
      icon: Settings,
      color: "bg-red-500 text-white",
      onClick: () => router.push("/admin"),
      show: isDG,
    },
  ].filter((action) => action.show)

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {actions.map((action, index) => {
            const Icon = action.icon
            return (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-4 flex flex-col items-start space-y-2 hover:shadow-md transition-shadow bg-transparent"
                onClick={action.onClick}
              >
                <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-sm">{action.title}</p>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </div>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
