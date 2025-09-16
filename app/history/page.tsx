"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore, useAppStore } from "@/lib/store"
import { Sidebar } from "@/components/sidebar"
import { Topbar } from "@/components/topbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { formatDistanceToNow } from "date-fns"
import { Calendar, Filter, Search, Eye, Download, Clock, CheckCircle, AlertCircle, Send } from "lucide-react"

export default function HistoryPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const { appraisals, users } = useAppStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [yearFilter, setYearFilter] = useState("all")
  const [sortBy, setSortBy] = useState("updatedAt")

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  const safeAppraisals = appraisals || []
  const safeUsers = users || []

  // Get all appraisals related to the user (as employee or appraiser)
  const allUserAppraisals = safeAppraisals.filter((a) => a.employeeId === user.id || a.appraiserId === user.id)

  // Apply filters
  const filteredAppraisals = allUserAppraisals
    .filter((appraisal) => {
      const employee = safeUsers.find((u) => u.id === appraisal.employeeId)
      const appraiser = safeUsers.find((u) => u.id === appraisal.appraiserId)

      const matchesSearch =
        searchTerm === "" ||
        employee?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appraiser?.name.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "all" || appraisal.status === statusFilter

      const appraisalYear = new Date(appraisal.periodStart).getFullYear().toString()
      const matchesYear = yearFilter === "all" || appraisalYear === yearFilter

      return matchesSearch && matchesStatus && matchesYear
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "updatedAt":
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        case "periodStart":
          return new Date(b.periodStart).getTime() - new Date(a.periodStart).getTime()
        case "status":
          return a.status.localeCompare(b.status)
        default:
          return 0
      }
    })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "draft":
        return <Clock className="h-4 w-4 text-orange-500" />
      case "submitted":
        return <Send className="h-4 w-4 text-blue-500" />
      case "reviewed":
        return <AlertCircle className="h-4 w-4 text-purple-500" />
      case "closed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-orange-100 text-orange-800"
      case "submitted":
        return "bg-blue-100 text-blue-800"
      case "reviewed":
        return "bg-purple-100 text-purple-800"
      case "closed":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const exportHistory = () => {
    const data = filteredAppraisals.map((appraisal) => {
      const employee = safeUsers.find((u) => u.id === appraisal.employeeId)
      const appraiser = safeUsers.find((u) => u.id === appraisal.appraiserId)
      return {
        employee: employee?.name,
        appraiser: appraiser?.name,
        period: `${appraisal.periodStart} to ${appraisal.periodEnd}`,
        status: appraisal.status,
        overallRating: appraisal.overallRating,
        updatedAt: appraisal.updatedAt,
      }
    })

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "appraisal-history.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  // Get unique years for filter
  const availableYears = [...new Set(allUserAppraisals.map((a) => new Date(a.periodStart).getFullYear()))].sort(
    (a, b) => b - a,
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Topbar />

        <main className="flex-1 p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary">Appraisal History</h1>
              <p className="text-muted-foreground">Browse and filter your performance appraisal history</p>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="secondary">
                {filteredAppraisals.length} of {allUserAppraisals.length} appraisals
              </Badge>
              <Button variant="outline" onClick={exportHistory}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Filters */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-primary" />
                <span>Filters</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="submitted">Submitted</SelectItem>
                      <SelectItem value="reviewed">Reviewed</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Year</Label>
                  <Select value={yearFilter} onValueChange={setYearFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Years</SelectItem>
                      {availableYears.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Sort By</Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="updatedAt">Last Updated</SelectItem>
                      <SelectItem value="periodStart">Period Start</SelectItem>
                      <SelectItem value="status">Status</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* History List */}
          {filteredAppraisals.length === 0 ? (
            <Card className="glass-card">
              <CardContent className="p-12 text-center">
                <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Appraisals Found</h3>
                <p className="text-muted-foreground mb-6">
                  {searchTerm || statusFilter !== "all" || yearFilter !== "all"
                    ? "No appraisals match your current filters. Try adjusting your search criteria."
                    : "You don't have any appraisal history yet."}
                </p>
                {(searchTerm || statusFilter !== "all" || yearFilter !== "all") && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("")
                      setStatusFilter("all")
                      setYearFilter("all")
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredAppraisals.map((appraisal) => {
                const employee = safeUsers.find((u) => u.id === appraisal.employeeId)
                const appraiser = safeUsers.find((u) => u.id === appraisal.appraiserId)
                const isMyAppraisal = appraisal.employeeId === user.id
                const completedObjectives = (appraisal.objectives || []).filter((obj) => obj.achievement > 0).length

                return (
                  <Card key={appraisal.id} className="glass-card hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(appraisal.status)}
                          <div>
                            <h3 className="font-semibold">
                              {isMyAppraisal ? "My Appraisal" : `${employee?.name}'s Appraisal`}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {isMyAppraisal ? `Appraised by ${appraiser?.name}` : `You appraised ${employee?.name}`}
                            </p>
                          </div>
                        </div>
                        <Badge className={`${getStatusColor(appraisal.status)}`}>
                          {appraisal.status.toUpperCase()}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center">
                          <p className="text-lg font-bold text-primary">{appraisal.overallRating || "N/A"}</p>
                          <p className="text-xs text-muted-foreground">Overall Rating</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-green-600">
                            {completedObjectives}/{(appraisal.objectives || []).length}
                          </p>
                          <p className="text-xs text-muted-foreground">Objectives</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-blue-600">
                            {new Date(appraisal.periodStart).getFullYear()}
                          </p>
                          <p className="text-xs text-muted-foreground">Year</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-purple-600">
                            {formatDistanceToNow(new Date(appraisal.updatedAt), { addSuffix: true })}
                          </p>
                          <p className="text-xs text-muted-foreground">Last Updated</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          <p>
                            Period: {new Date(appraisal.periodStart).toLocaleDateString()} -{" "}
                            {new Date(appraisal.periodEnd).toLocaleDateString()}
                          </p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => router.push(`/appraisals/${appraisal.id}`)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
