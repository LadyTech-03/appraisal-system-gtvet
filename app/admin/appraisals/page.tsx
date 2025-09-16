"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/store"
import { Sidebar } from "@/components/sidebar"
import { Topbar } from "@/components/topbar"
import { AppraisalStats } from "@/components/appraisal-stats"
import { AppraisalsTable } from "@/components/appraisals-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ClipboardCheck } from "lucide-react"

export default function AllSystemAppraisalsPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    if (user?.role !== "Director-General") {
      router.push("/dashboard")
      return
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.role !== "Director-General") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
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
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard")}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Dashboard</span>
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <ClipboardCheck className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-primary">All System Appraisals</h1>
                  <p className="text-muted-foreground">Global overview of all completed appraisals</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">System Administrator</p>
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-primary">Director General</p>
            </div>
          </div>

          {/* Summary Statistics */}
          <AppraisalStats />

          {/* Appraisals Table */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ClipboardCheck className="h-5 w-5" />
                <span>All Completed Appraisals</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AppraisalsTable />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
