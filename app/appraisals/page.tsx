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
import {
  FileText,
  Eye,
  Edit,
  Clock,
  CheckCircle,
  AlertCircle,
  Send,
  Download,
  ArrowLeft,
  UserCheck,
} from "lucide-react"

export default function AppraisalsPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const { appraisals, users } = useAppStore()
  const [exportingAppraisal, setExportingAppraisal] = useState<string | null>(null)

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

  const myAppraisals = appraisals.filter((a) => a.employeeId === user.id)

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
        return <FileText className="h-4 w-4 text-gray-500" />
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

  const getStatusDescription = (status: string, createdBy?: string) => {
    switch (status) {
      case "draft":
        return createdBy === "appraisee" ? "Draft self-assessment" : "Draft appraisal"
      case "pending-review":
        return "Submitted for manager review"
      case "submitted":
        return "Submitted and completed"
      case "reviewed":
        return "Under final review"
      case "closed":
        return "Completed and finalized"
      default:
        return "Unknown status"
    }
  }

  if (exportingAppraisal) {
    const appraisal = myAppraisals.find((a) => a.id === exportingAppraisal)
    const employee = users.find((u) => u.id === appraisal?.employeeId)
    const appraiser = users.find((u) => u.id === appraisal?.appraiserId)

    if (!appraisal || !employee || !appraiser) {
      setExportingAppraisal(null)
      return null
    }

    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Topbar />
          <main className="flex-1 p-6">
            <div className="mb-4">
              <Button variant="outline" onClick={() => setExportingAppraisal(null)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to My Appraisals
              </Button>
            </div>
            <AppraisalExport appraisal={appraisal} employee={employee} appraiser={appraiser} />
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
              <h1 className="text-2xl font-bold text-primary">My Appraisals</h1>
              <p className="text-muted-foreground">View and manage your performance appraisals</p>
            </div>
            <Badge variant="secondary">{myAppraisals.length} Total Appraisals</Badge>
          </div>

          {/* Appraisals List */}
          {myAppraisals.length === 0 ? (
            <Card className="glass-card">
              <CardContent className="p-12 text-center">
                <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Appraisals Yet</h3>
                <p className="text-muted-foreground mb-6">
                  You don't have any performance appraisals at this time. Your manager will create appraisals for you
                  during review periods.
                </p>
                <Button onClick={() => router.push("/dashboard")}>Back to Dashboard</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {myAppraisals.map((appraisal) => {
                const appraiser = users.find((u) => u.id === appraisal.appraiserId)
                const completedObjectives = appraisal.objectives?.filter((obj) => obj.achievement > 0).length || 0
                const avgCompetencyRating =
                  appraisal.competencies?.reduce((sum, comp) => sum + comp.rating, 0) /
                    (appraisal.competencies?.length || 1) || 0

                return (
                  <Card key={appraisal.id} className="glass-card hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(appraisal.status)}
                          <div>
                            <CardTitle className="text-lg">
                              Performance Appraisal - {new Date(appraisal.periodStart).getFullYear()}
                              {appraisal.createdBy === "appraisee" && (
                                <span className="ml-2 text-sm font-normal text-emerald-600">(Self-initiated)</span>
                              )}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                              Appraised by {appraiser?.name} • {appraiser?.role}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {getStatusDescription(appraisal.status, appraisal.createdBy)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
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
                          <Button variant="outline" size="sm" onClick={() => setExportingAppraisal(appraisal.id)}>
                            <Download className="h-4 w-4 mr-2" />
                            Export
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/appraisals/${appraisal.id}`)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          {appraisal.status === "draft" && appraisal.createdBy === "appraisee" && (
                            <Button size="sm" onClick={() => router.push(`/self-appraisal/${user.id}`)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Continue
                            </Button>
                          )}
                          {appraisal.status === "draft" && appraisal.createdBy !== "appraisee" && (
                            <Button size="sm" onClick={() => router.push(`/appraisals/${appraisal.id}/edit`)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Continue
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
