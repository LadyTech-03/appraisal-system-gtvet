"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/store"
import { Sidebar } from "@/components/sidebar"
import { Topbar } from "@/components/topbar"
import { DashboardStats } from "@/components/dashboard-stats"
import { RecentActivity } from "@/components/recent-activity"
import { QuickActions } from "@/components/quick-actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Target, TrendingUp } from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  return (
    <div className="h-screen bg-gradient-to-b from-blue-50 to-blue-100 grid grid-cols-[auto_1fr] grid-rows-[auto_1fr]">
      {/* Sidebar - Fixed positioning, spans full height */}
      <div className="row-span-2 hidden md:block">
        <Sidebar />
      </div>

      {/* Topbar - Fixed at top, spans remaining width */}
      <div className="col-start-1 md:col-start-2 sticky top-0 z-10">
        <Topbar />
      </div>

      {/* Main content area - Scrollable */}
      <main className="col-start-1 md:col-start-2 overflow-y-auto p-4 md:p-6">
        <div className="space-y-6">
          {/* Hero Section */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-blue-700 p-6 md:p-8 text-white">
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex-1">
                  <h1 className="text-2xl md:text-3xl font-bold mb-2">
                    {getGreeting()}, {user.name.split(" ")[0]}!
                  </h1>
                  <p className="text-blue-100 mb-4">Welcome to your performance management dashboard</p>
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge variant="secondary" className="bg-blue-900/80 text-white border-blue-800">
                      {user.role === "Director-General" ? "Director General" : user.role}
                    </Badge>
                    <Badge variant="secondary" className="bg-blue-900/80 text-white border-blue-800">
                      {user.staffId}
                    </Badge>
                  </div>
                </div>
                <div className="hidden lg:flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Target className="w-8 h-8" />
                  </div>
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <TrendingUp className="w-8 h-8" />
                  </div>
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Sparkles className="w-8 h-8" />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  variant="secondary"
                  className="bg-blue-900/80 text-white border-blue-800 hover:bg-blue-900"
                  onClick={() => router.push("/appraisals")}
                >
                  View My Appraisals
                </Button>
                {(user.role.includes("Director") || user.role.includes("Head")) && (
                  <Button
                    variant="outline"
                    className="border-white/50 text-white hover:bg-white/20 bg-transparent"
                    onClick={() => router.push("/create-appraisal")}
                  >
                    Start New Appraisal
                  </Button>
                )}
              </div>
            </div>

            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
          </div>

          {/* Stats Cards */}
          <DashboardStats />

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Recent Activity - Takes 2 columns on xl screens */}
            <div className="xl:col-span-2">
              <RecentActivity />
            </div>

            {/* Quick Actions - Takes 1 column */}
            <div className="xl:col-span-1">
              <QuickActions />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
