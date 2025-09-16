"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore, useAppStore } from "@/lib/store"
import { Sidebar } from "@/components/sidebar"
import { Topbar } from "@/components/topbar"
import { ComprehensiveAppraisalForm } from "@/components/comprehensive-appraisal-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Users } from "lucide-react"

export default function CreateAppraisalPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const { users, getReports } = useAppStore()
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("")
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    // Check if user has permission to create appraisals
    const canCreateAppraisals = user?.role.includes("Director") || user?.role.includes("Head")
    if (!canCreateAppraisals) {
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

  const subordinates = getReports(user.id)

  const handleEmployeeSelect = (employeeId: string) => {
    setSelectedEmployeeId(employeeId)
    setShowForm(true)
  }

  const handleFormSave = () => {
    router.push("/team-appraisals")
  }

  const handleFormSubmit = () => {
    router.push("/team-appraisals")
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
              <Button variant="outline" onClick={() => router.push("/dashboard")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-primary">Create New Appraisal</h1>
                <p className="text-muted-foreground">Start a new performance appraisal for your team member</p>
              </div>
            </div>
          </div>

          {!showForm ? (
            /* Employee Selection */
            <Card className="glass-card max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span>Select Employee to Appraise</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {subordinates.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No team members found</p>
                    <p className="text-sm text-muted-foreground">
                      You don't have any direct reports to appraise at this time.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label>Select Team Member</Label>
                      <Select value={selectedEmployeeId} onValueChange={setSelectedEmployeeId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose an employee to appraise" />
                        </SelectTrigger>
                        <SelectContent>
                          {subordinates.map((employee) => (
                            <SelectItem key={employee.id} value={employee.id}>
                              {employee.name} - {employee.role}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold">Your Team Members</h3>
                      <div className="grid gap-3">
                        {subordinates.map((employee) => (
                          <div
                            key={employee.id}
                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                                {employee.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </div>
                              <div>
                                <p className="font-medium">{employee.name}</p>
                                <p className="text-sm text-muted-foreground">{employee.role}</p>
                                <p className="text-xs text-muted-foreground">Staff ID: {employee.staffId}</p>
                              </div>
                            </div>
                            <Button onClick={() => handleEmployeeSelect(employee.id)}>Create Appraisal</Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ) : (
            /* Comprehensive Appraisal Form */
            <ComprehensiveAppraisalForm
              employeeId={selectedEmployeeId}
              onSave={handleFormSave}
              onSubmit={handleFormSubmit}
            />
          )}
        </main>
      </div>
    </div>
  )
}
