"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useAppStore, useAuthStore } from "@/lib/store"
import { FileText, Clock, CheckCircle, Users, Target, TrendingUp } from "lucide-react"

export function DashboardStats() {
  const { user } = useAuthStore()
  const { users, appraisals, orgHierarchy } = useAppStore()

  // Calculate statistics based on user role
  const myAppraisals = appraisals.filter((a) => a.employeeId === user?.id)
  const appraisalsIManage = appraisals.filter((a) => a.appraiserId === user?.id)
  const teamMembers = orgHierarchy[user?.id || ""] || []

  const pendingAppraisals = [...myAppraisals, ...appraisalsIManage].filter((a) => a.status === "draft")
  const completedAppraisals = [...myAppraisals, ...appraisalsIManage].filter((a) => a.status === "closed")
  const inReviewAppraisals = [...myAppraisals, ...appraisalsIManage].filter((a) => a.status === "reviewed")

  const comprehensiveAppraisals = [...myAppraisals, ...appraisalsIManage].filter(
    (a) => a.coreCompetencies && a.keyResultAreas && a.keyResultAreas.length > 0,
  )

  const avgOverallRating =
    comprehensiveAppraisals.length > 0
      ? comprehensiveAppraisals.reduce((sum, a) => sum + (a.overallAssessment?.overallRating || 0), 0) /
        comprehensiveAppraisals.length
      : 0

  const isManager = user?.role.includes("Director") || user?.role.includes("Head")
  const isDG = user?.role === "Director-General"

  const stats = [
    {
      title: "My Appraisals",
      value: myAppraisals.length,
      description: "Total appraisals",
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Pending Reviews",
      value: pendingAppraisals.length,
      description: "Awaiting action",
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Completed",
      value: completedAppraisals.length,
      description: "This period",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    // {
    //   title: "Comprehensive",
    //   value: comprehensiveAppraisals.length,
    //   description: "Full assessments",
    //   icon: Target,
    //   color: "text-purple-600",
    //   bgColor: "bg-purple-50",
    // },
    ...(avgOverallRating > 0
      ? [
          {
            title: "Avg Rating",
            value: avgOverallRating.toFixed(1),
            description: "Performance score",
            icon: TrendingUp,
            color: "text-emerald-600",
            bgColor: "bg-emerald-50",
          },
        ]
      : []),
    ...(isManager
      ? [
          {
            title: "Team Members",
            value: teamMembers.length,
            description: "Direct reports",
            icon: Users,
            color: "text-indigo-600",
            bgColor: "bg-indigo-50",
          },
        ]
      : []),
    ...(isDG
      ? [
          {
            title: "Total Users",
            value: users.length,
            description: "Organization wide",
            icon: Users,
            color: "text-slate-600",
            bgColor: "bg-slate-50",
          },
        ]
      : []),
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index} className="glass-card hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
