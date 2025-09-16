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

interface ReviewAppraisalPageProps {
  params: {
    id: string
  }
}

export default function ReviewAppraisalPage({ params }: ReviewAppraisalPageProps) {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const { users, appraisals } = useAppStore()
  const [isLoading, setIsLoading] = useState(true)

  const appraisalId = params.id
  const appraisal = appraisals.find((a) => a.id === appraisalId)
  const employee = appraisal ? users.find((u) => u.id === appraisal.employeeId) : null

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    // Only allow the appraiser to review
    if (!appraisal || appraisal.appraiserId !== user?.id) {
      router.push("/team-appraisals")
      return
    }

    // Only allow review of pending-review appraisals
    if (appraisal.status !== "pending-review") {
      router.push("/team-appraisals")
      return
    }

    setIsLoading(false)
  }, [isAuthenticated, user, appraisal, router])

  const handleSave = () => {
    router.push("/team-appraisals")
  }

  const handleSubmit = () => {
    router.push("/team-appraisals")
  }

  if (isLoading || !isAuthenticated || !user || !appraisal || !employee) {
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
                  <Button variant="outline" size="sm" onClick={() => router.push("/team-appraisals")}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Team Appraisals
                  </Button>
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <UserCheck className="h-5 w-5 text-amber-500" />
                      <span>Review Self-Appraisal</span>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Review and complete the appraisal submitted by {employee.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">{employee.name}</Badge>
                  <Badge variant="outline" className="bg-amber-100 text-amber-800">
                    Pending Review
                  </Badge>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Review Form */}
          <ComprehensiveAppraisalForm
            employeeId={appraisal.employeeId}
            onSave={handleSave}
            onSubmit={handleSubmit}
            mode="appraiser"
            existingAppraisal={appraisal}
          />
        </div>
      </main>
    </div>
  )
}
