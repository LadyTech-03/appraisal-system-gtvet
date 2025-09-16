"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore, useAppStore } from "@/lib/store"
import { Sidebar } from "@/components/sidebar"
import { Topbar } from "@/components/topbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { TrendingUp, Users, Target, Award, BarChart3 } from "lucide-react"

export default function AnalyticsPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const { appraisals, users, orgHierarchy } = useAppStore()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    // Check if user has permission to view analytics
    const canViewAnalytics = user?.role.includes("Director")
    if (!canViewAnalytics) {
      router.push("/dashboard")
      return
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  const safeAppraisals = appraisals || []
  const safeUsers = users || []

  // Calculate analytics data
  const totalUsers = safeUsers.length
  const totalAppraisals = safeAppraisals.length
  const completedAppraisals = safeAppraisals.filter((a) => a.status === "closed").length
  const avgOverallRating =
    safeAppraisals
      .filter((a) => a.overallRating && a.overallRating > 0)
      .reduce((sum, a) => sum + (a.overallRating || 0), 0) /
      safeAppraisals.filter((a) => a.overallRating && a.overallRating > 0).length || 0

  // Status distribution data
  const statusData = [
    { name: "Draft", value: safeAppraisals.filter((a) => a.status === "draft").length, color: "#f59e0b" },
    { name: "Submitted", value: safeAppraisals.filter((a) => a.status === "submitted").length, color: "#3b82f6" },
    { name: "Reviewed", value: safeAppraisals.filter((a) => a.status === "reviewed").length, color: "#8b5cf6" },
    { name: "Closed", value: safeAppraisals.filter((a) => a.status === "closed").length, color: "#10b981" },
  ]

  // Rating distribution data
  const ratingData = [
    { rating: "1", count: safeAppraisals.filter((a) => a.overallRating === 1).length },
    { rating: "2", count: safeAppraisals.filter((a) => a.overallRating === 2).length },
    { rating: "3", count: safeAppraisals.filter((a) => a.overallRating === 3).length },
    { rating: "4", count: safeAppraisals.filter((a) => a.overallRating === 4).length },
    { rating: "5", count: safeAppraisals.filter((a) => a.overallRating === 5).length },
  ]

  const competencyData = safeAppraisals
    .filter((a) => a.competencies && Array.isArray(a.competencies))
    .flatMap((a) => a.competencies)
    .filter((comp) => comp && comp.name && typeof comp.rating === "number")
    .reduce(
      (acc, comp) => {
        if (!acc[comp.name]) {
          acc[comp.name] = { name: comp.name, total: 0, count: 0 }
        }
        acc[comp.name].total += comp.rating
        acc[comp.name].count += 1
        return acc
      },
      {} as Record<string, { name: string; total: number; count: number }>,
    )

  const competencyAvgData = Object.values(competencyData).map((comp) => ({
    name: comp.name,
    average: (comp.total / comp.count).toFixed(1),
  }))

  // Monthly trend data (mock data for demonstration)
  const monthlyTrendData = [
    { month: "Jan", completed: 5, average: 3.2 },
    { month: "Feb", completed: 8, average: 3.4 },
    { month: "Mar", completed: 12, average: 3.6 },
    { month: "Apr", completed: 15, average: 3.5 },
    { month: "May", completed: 18, average: 3.7 },
    { month: "Jun", completed: 22, average: 3.8 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      <div className="flex h-screen">
        {/* Sidebar - Fixed positioning */}
        <div className="flex-shrink-0">
          <Sidebar />
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Topbar - Fixed at top */}
          <div className="flex-shrink-0">
            <Topbar />
          </div>

          {/* Scrollable main content */}
          <main className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-primary">Analytics Dashboard</h1>
                <p className="text-muted-foreground">Performance insights and organizational metrics</p>
              </div>
              <Badge variant="secondary">Organization-wide Analytics</Badge>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="glass-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                      <p className="text-3xl font-bold text-foreground">{totalUsers}</p>
                      <p className="text-xs text-muted-foreground mt-1">Active employees</p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Appraisals</p>
                      <p className="text-3xl font-bold text-foreground">{totalAppraisals}</p>
                      <p className="text-xs text-muted-foreground mt-1">All time</p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                      <Target className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                      <p className="text-3xl font-bold text-foreground">
                        {totalAppraisals > 0 ? Math.round((completedAppraisals / totalAppraisals) * 100) : 0}%
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{completedAppraisals} completed</p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                      <Award className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Avg Rating</p>
                      <p className="text-3xl font-bold text-foreground">{avgOverallRating.toFixed(1)}</p>
                      <p className="text-xs text-muted-foreground mt-1">Out of 5.0</p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Status Distribution */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    <span>Appraisal Status Distribution</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Rating Distribution */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Overall Rating Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={ratingData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="rating" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Competency Analysis */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Average Competency Ratings</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={competencyAvgData} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 5]} />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip />
                      <Bar dataKey="average" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Monthly Trends */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Monthly Performance Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Bar yAxisId="left" dataKey="completed" fill="#8b5cf6" />
                      <Line yAxisId="right" type="monotone" dataKey="average" stroke="#f59e0b" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Insights */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Key Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <TrendingUp className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-lg">Performance Trend</h3>
                    <p className="text-sm text-muted-foreground">
                      Overall performance ratings have been{" "}
                      {avgOverallRating >= 3.5 ? "consistently strong" : "showing room for improvement"}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Target className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-lg">Completion Rate</h3>
                    <p className="text-sm text-muted-foreground">
                      {Math.round((completedAppraisals / totalAppraisals) * 100)}% of appraisals have been completed,
                      {completedAppraisals / totalAppraisals >= 0.8
                        ? " exceeding targets"
                        : " with room for improvement"}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Award className="h-8 w-8 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-lg">Top Competency</h3>
                    <p className="text-sm text-muted-foreground">
                      {competencyAvgData.length > 0
                        ? `${
                            competencyAvgData.reduce((max, comp) =>
                              Number.parseFloat(comp.average) > Number.parseFloat(max.average) ? comp : max,
                            ).name
                          } shows the highest average rating`
                        : "No competency data available"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  )
}
