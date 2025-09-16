"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore, useAppStore } from "@/lib/store"
import { ComprehensiveAppraisalForm } from "@/components/comprehensive-appraisal-form"
import { Sidebar } from "@/components/sidebar"
import { Topbar } from "@/components/topbar"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, UserCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SelfAppraisalPageProps {
  params: {
    id: string
  }
}

export default function SelfAppraisalPage({ params }: SelfAppraisalPageProps) {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const { users, appraisals } = useAppStore()
  const [isLoading, setIsLoading] = useState(true)

  const employeeId = params.id
  const employee = users.find((u) => u.id === employeeId)

  // Find existing draft self-appraisal
  const existingAppraisal = appraisals.find(
    (appraisal) =>
      appraisal.employeeId === employeeId &&
      appraisal.createdBy === "appraisee" &&
      (appraisal.status === "draft" || appraisal.status === "pending-review"),
  )

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    // Only allow the employee themselves to access their self-appraisal
    if (user?.id !== employeeId) {
      router.push("/dashboard")
      return
    }

    // Check if user has a manager
    if (!user?.managerId || user.managerId === "none") {
      router.push("/dashboard")
      return
    }

    setIsLoading(false)
  }, [isAuthenticated, user, employeeId, router])

  const handleSave = () => {
    router.push("/dashboard")
  }

  const handleSubmit = () => {
    router.push("/dashboard")
  }

  if (isLoading || !isAuthenticated || !user || !employee) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-gradient-to-b from-blue-50 to-blue-100 grid grid-cols-[auto_1fr] grid-rows-[auto_1fr]">
      {/* Sidebar */}
      <div className="row-span-2 hidden md:block">
        <Sidebar />
      </div>

      {/* Topbar */}
      <div className="col-start-1 md:col-start-2 sticky top-0 z-10">
        <Topbar />
      </div>

      {/* Main content */}
      <main className="col-start-1 md:col-start-2 overflow-y-auto p-4 md:p-6">
        <div className="space-y-6">
          {/* Header */}
          <Card className="glass-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button variant="outline" size="sm" onClick={() => router.push("/dashboard")}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Dashboard
                  </Button>
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <UserCheck className="h-5 w-5 text-emerald-500" />
                      <span>Self-Appraisal</span>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Complete your self-assessment for review by your manager
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">{employee.name}</Badge>
                  <Badge variant="outline">
                    {existingAppraisal?.status === "draft"
                      ? "Draft"
                      : existingAppraisal?.status === "pending-review"
                        ? "Pending Review"
                        : "New"}
                  </Badge>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Self-Appraisal Form */}
          <ComprehensiveAppraisalForm
            employeeId={employeeId}
            onSave={handleSave}
            onSubmit={handleSubmit}
            mode="appraisee"
            existingAppraisal={existingAppraisal}
          />
        </div>
      </main>
    </div>
  )
}
