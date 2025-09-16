"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuthStore, useAppStore } from "@/lib/store"
import { Sidebar } from "@/components/sidebar"
import { Topbar } from "@/components/topbar"
import { AppraisalForm } from "@/components/appraisal-form"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft } from "lucide-react"

export default function EditAppraisalPage() {
  const router = useRouter()
  const params = useParams()
  const { user, isAuthenticated } = useAuthStore()
  const { appraisals, users } = useAppStore()
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

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

    // Check if user can edit this appraisal
    const canEdit = appraisal.employeeId === user?.id || appraisal.appraiserId === user?.id
    const isEditable =
      appraisal.status === "draft" || (appraisal.status === "submitted" && appraisal.appraiserId === user?.id)

    if (!canEdit || !isEditable) {
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
  const isMyAppraisal = appraisal.employeeId === user.id

  const handleSave = () => {
    setMessage({ type: "success", text: "Appraisal saved successfully!" })
    setTimeout(() => {
      router.push(isMyAppraisal ? `/appraisals/${appraisal.id}` : `/team-appraisals/${appraisal.id}`)
    }, 1500)
  }

  const handleSubmit = () => {
    setMessage({ type: "success", text: "Appraisal submitted for review!" })
    setTimeout(() => {
      router.push(isMyAppraisal ? `/appraisals/${appraisal.id}` : `/team-appraisals/${appraisal.id}`)
    }, 1500)
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
              <Button
                variant="outline"
                onClick={() =>
                  router.push(isMyAppraisal ? `/appraisals/${appraisal.id}` : `/team-appraisals/${appraisal.id}`)
                }
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Appraisal
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-primary">
                  {isMyAppraisal ? "Edit My Appraisal" : `Edit ${employee?.name}'s Appraisal`}
                </h1>
                <p className="text-muted-foreground">
                  {employee?.name} • {employee?.role} • Period: {new Date(appraisal.periodStart).getFullYear()}
                </p>
              </div>
            </div>
            <Badge variant={appraisal.status === "draft" ? "secondary" : "default"}>
              {appraisal.status.toUpperCase()}
            </Badge>
          </div>

          {message && (
            <Alert variant={message.type === "error" ? "destructive" : "default"}>
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}

          {/* Edit Form */}
          <AppraisalForm appraisal={appraisal} onSave={handleSave} onSubmit={handleSubmit} />
        </main>
      </div>
    </div>
  )
}
