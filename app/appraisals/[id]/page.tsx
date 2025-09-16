"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuthStore, useAppStore } from "@/lib/store"
import { Sidebar } from "@/components/sidebar"
import { Topbar } from "@/components/topbar"
import { AppraisalExport } from "@/components/appraisal-export"
import { AppraisalView } from "@/components/appraisal-view"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Edit, CheckCircle, AlertCircle, Download } from "lucide-react"

export default function AppraisalDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { user, isAuthenticated } = useAuthStore()
  const { appraisals, users, updateAppraisal } = useAppStore()
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [showExport, setShowExport] = useState(false)

  const appraisalId = params.id as string
  const appraisal = appraisals.find((a) => a.id === appraisalId)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    if (!appraisal) {
      router.push("/dashboard")
      return
    }

    const canView = appraisal.employeeId === user?.id || appraisal.appraiserId === user?.id
    if (!canView) {
      router.push("/dashboard")
      return
    }
  }, [isAuthenticated, user, appraisal, router])

  if (!isAuthenticated || !user || !appraisal) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  const employee = users.find((u) => u.id === appraisal.employeeId)
  const appraiser = users.find((u) => u.id === appraisal.appraiserId)
  const isMyAppraisal = appraisal.employeeId === user.id
  const canEdit =
    appraisal.status === "draft" || (appraisal.status === "submitted" && appraisal.appraiserId === user.id)

  const handleStatusChange = (newStatus: "reviewed" | "closed") => {
    try {
      updateAppraisal(appraisal.id, { status: newStatus })
      setMessage({
        type: "success",
        text: `Appraisal ${newStatus === "reviewed" ? "marked as reviewed" : "closed"} successfully!`,
      })
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update appraisal status. Please try again." })
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

  if (showExport && employee && appraiser) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Topbar />
          <main className="flex-1 p-6">
            <div className="mb-4">
              <Button variant="outline" onClick={() => setShowExport(false)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Appraisal
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
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => router.push(isMyAppraisal ? "/appraisals" : "/team-appraisals")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-primary">
                  {isMyAppraisal ? "My Appraisal Details" : `${employee?.name}'s Appraisal`}
                </h1>
                <p className="text-muted-foreground">
                  {employee?.name} • {employee?.role} • Period: {new Date(appraisal.periodStart).getFullYear()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className={getStatusColor(appraisal.status)}>{appraisal.status.toUpperCase()}</Badge>
              <Button variant="outline" onClick={() => setShowExport(true)}>
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
              {canEdit && (
                <Button onClick={() => router.push(`/appraisals/${appraisal.id}/edit`)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>
          </div>

          {message && (
            <Alert variant={message.type === "error" ? "destructive" : "default"}>
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}

          {appraisal.appraiserId === user.id && appraisal.status === "submitted" && (
            <Card className="glass-card border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-blue-600" />
                  <span>Review Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  This appraisal has been submitted and is ready for your review.
                </p>
                <div className="flex space-x-3">
                  <Button onClick={() => handleStatusChange("reviewed")}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark as Reviewed
                  </Button>
                  <Button variant="outline" onClick={() => handleStatusChange("closed")}>
                    Complete Appraisal
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {appraisal.appraiserId === user.id && appraisal.status === "reviewed" && (
            <Card className="glass-card border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Final Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  This appraisal has been reviewed. You can now close it to complete the process.
                </p>
                <Button onClick={() => handleStatusChange("closed")}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Close Appraisal
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Appraisal Details */}
          <AppraisalView appraisal={appraisal} employee={employee!} appraiser={appraiser!} />
        </main>
      </div>
    </div>
  )
}
