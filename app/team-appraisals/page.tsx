"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore, useAppStore } from "@/lib/store"
import { Sidebar } from "@/components/sidebar"
import { Topbar } from "@/components/topbar"
import { AppraisalExport } from "@/components/appraisal-export"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { Users, Eye, Edit, Plus, Clock, CheckCircle, AlertCircle, Send, Download, UserCheck } from "lucide-react"

export default function TeamAppraisalsPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const { appraisals, users, orgHierarchy } = useAppStore()
  const [selectedAppraisals, setSelectedAppraisals] = useState<string[]>([])
  const [showBulkExport, setShowBulkExport] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    const canManageTeam = user?.role.includes("Director") || user?.role.includes("Head")
    if (!canManageTeam) {
      router.push("/dashboard")
      return
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  const teamAppraisals = appraisals.filter((a) => a.appraiserId === user.id)
  const subordinateIds = orgHierarchy[user.id] || []
  const subordinates = subordinateIds.map((id) => users.find((u) => u.id === id)).filter(Boolean)

  const pendingReviewAppraisals = teamAppraisals.filter((a) => a.status === "pending-review")
  const otherAppraisals = teamAppraisals.filter((a) => a.status !== "pending-review")

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "draft":
        return <Clock className="h-4 w-4 text-orange-500" />
      case "pending-review":
        return <UserCheck className="h-4 w-4 text-amber-500" />
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
      case "pending-review":
        return "bg-amber-100 text-amber-800"
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

  const handleBulkExport = () => {
    if (selectedAppraisals.length === 0) {
      alert("Please select at least one appraisal to export.")
      return
    }
    setShowBulkExport(true)
  }

  const toggleAppraisalSelection = (appraisalId: string) => {
    setSelectedAppraisals((prev) =>
      prev.includes(appraisalId) ? prev.filter((id) => id !== appraisalId) : [...prev, appraisalId],
    )
  }

  const selectAllAppraisals = () => {
    if (selectedAppraisals.length === teamAppraisals.length) {
      setSelectedAppraisals([])
    } else {
      setSelectedAppraisals(teamAppraisals.map((a) => a.id))
    }
  }

  const handleReviewAppraisal = (appraisalId: string) => {
    router.push(`/team-appraisals/${appraisalId}/review`)
  }

  if (showBulkExport) {
    const selectedAppraisalData = teamAppraisals.filter((a) => selectedAppraisals.includes(a.id))

    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Topbar />
          <main className="flex-1 p-6">
            <div className="mb-4 flex items-center justify-between">
              <Button variant="outline" onClick={() => setShowBulkExport(false)}>
                Back to Team Appraisals
              </Button>
              <Badge variant="secondary">{selectedAppraisalData.length} Selected for Export</Badge>
            </div>

            <div className="space-y-8">
              {selectedAppraisalData.map((appraisal, index) => {
                const employee = users.find((u) => u.id === appraisal.employeeId)
                const appraiser = users.find((u) => u.id === appraisal.appraiserId)

                if (!employee || !appraiser) return null

                return (
                  <div key={appraisal.id}>
                    {index > 0 && <div className="page-break" />}
                    <AppraisalExport appraisal={appraisal} employee={employee} appraiser={appraiser} />
                  </div>
                )
              })}
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Topbar />

        <main className="flex-1 p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary">Team Appraisals</h1>
              <p className="text-muted-foreground">Manage performance appraisals for your team members</p>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="secondary">{teamAppraisals.length} Active Appraisals</Badge>
              {pendingReviewAppraisals.length > 0 && (
                <Badge variant="destructive">{pendingReviewAppraisals.length} Pending Review</Badge>
              )}
              {teamAppraisals.length > 0 && (
                <>
                  <Button variant="outline" onClick={selectAllAppraisals}>
                    {selectedAppraisals.length === teamAppraisals.length ? "Deselect All" : "Select All"}
                  </Button>
                  {selectedAppraisals.length > 0 && (
                    <Button variant="outline" onClick={handleBulkExport}>
                      <Download className="h-4 w-4 mr-2" />
                      Export Selected ({selectedAppraisals.length})
                    </Button>
                  )}
                </>
              )}
              <Button onClick={() => router.push("/create-appraisal")}>
                <Plus className="h-4 w-4 mr-2" />
                Create New Appraisal
              </Button>
            </div>
          </div>

          {/* Team Overview */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-primary" />
                <span>Team Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{subordinates.length}</p>
                  <p className="text-sm text-muted-foreground">Team Members</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">
                    {teamAppraisals.filter((a) => a.status === "draft").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Draft Appraisals</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-amber-600">{pendingReviewAppraisals.length}</p>
                  <p className="text-sm text-muted-foreground">Pending Review</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {teamAppraisals.filter((a) => a.status === "submitted").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Submitted</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {teamAppraisals.filter((a) => a.status === "closed").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {pendingReviewAppraisals.length > 0 && (
            <Card className="glass-card border-amber-200 bg-amber-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-amber-800">
                  <UserCheck className="h-5 w-5" />
                  <span>Pending Review ({pendingReviewAppraisals.length})</span>
                </CardTitle>
                <p className="text-sm text-amber-700">
                  These self-appraisals have been submitted by your team members and are awaiting your review.
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {pendingReviewAppraisals.map((appraisal) => {
                    const employee = users.find((u) => u.id === appraisal.employeeId)

                    return (
                      <div
                        key={appraisal.id}
                        className="flex items-center justify-between p-4 bg-white rounded-lg border border-amber-200"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {employee?.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div>
                            <p className="font-semibold">{employee?.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {employee?.role} • Submitted{" "}
                              {formatDistanceToNow(new Date(appraisal.updatedAt), { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-amber-100 text-amber-800">Self-Assessment Complete</Badge>
                          <Button
                            size="sm"
                            onClick={() => handleReviewAppraisal(appraisal.id)}
                            className="bg-amber-600 hover:bg-amber-700"
                          >
                            <UserCheck className="h-4 w-4 mr-2" />
                            Review
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Appraisals List */}
          {teamAppraisals.length === 0 ? (
            <Card className="glass-card">
              <CardContent className="p-12 text-center">
                <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Team Appraisals Yet</h3>
                <p className="text-muted-foreground mb-6">
                  You haven't created any appraisals for your team members yet. Start by creating a new appraisal.
                </p>
                <Button onClick={() => router.push("/create-appraisal")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Appraisal
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {otherAppraisals.map((appraisal) => {
                const employee = users.find((u) => u.id === appraisal.employeeId)
                const completedObjectives = appraisal.objectives?.filter((obj) => obj.achievement > 0).length || 0
                const avgCompetencyRating =
                  appraisal.competencies?.reduce((sum, comp) => sum + comp.rating, 0) /
                    (appraisal.competencies?.length || 1) || 0

                return (
                  <Card key={appraisal.id} className="glass-card hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={selectedAppraisals.includes(appraisal.id)}
                            onChange={() => toggleAppraisalSelection(appraisal.id)}
                            className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
                          />
                          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                            {employee?.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div>
                            <CardTitle className="text-lg">{employee?.name}</CardTitle>
                            <p className="text-sm text-muted-foreground">
                              {employee?.role} • {employee?.staffId}
                              {appraisal.createdBy === "appraisee" && (
                                <span className="ml-2 text-emerald-600">• Self-initiated</span>
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(appraisal.status)}
                          <Badge className={`${getStatusColor(appraisal.status)}`}>
                            {appraisal.status === "pending-review" ? "PENDING REVIEW" : appraisal.status.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-primary">{appraisal.overallRating || "N/A"}</p>
                          <p className="text-sm text-muted-foreground">Overall Rating</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-600">
                            {completedObjectives}/{appraisal.objectives?.length || 0}
                          </p>
                          <p className="text-sm text-muted-foreground">Objectives Progress</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-blue-600">{avgCompetencyRating.toFixed(1)}</p>
                          <p className="text-sm text-muted-foreground">Avg Competency</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          <p>
                            Period: {new Date(appraisal.periodStart).toLocaleDateString()} -{" "}
                            {new Date(appraisal.periodEnd).toLocaleDateString()}
                          </p>
                          <p>Last updated {formatDistanceToNow(new Date(appraisal.updatedAt), { addSuffix: true })}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/appraisals/${appraisal.id}`)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                          {(appraisal.status === "draft" || appraisal.status === "submitted") && (
                            <Button size="sm" onClick={() => router.push(`/appraisals/${appraisal.id}/edit`)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                          )}
                        </div>
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
