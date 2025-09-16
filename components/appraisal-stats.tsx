"use client"

import { useMemo } from "react"
import { useAppStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ClipboardCheck, Calendar, Building, Users } from "lucide-react"

export function AppraisalStats() {
  const { appraisals, users } = useAppStore()

  const stats = useMemo(() => {
    // Get completed appraisals only
    const completedAppraisals = appraisals.filter((appraisal) =>
      ["submitted", "reviewed", "closed"].includes(appraisal.status),
    )

    // Calculate this year's appraisals
    const currentYear = new Date().getFullYear()
    const thisYearAppraisals = completedAppraisals.filter(
      (appraisal) => new Date(appraisal.updatedAt).getFullYear() === currentYear,
    )

    // Calculate breakdown by division
    const divisionBreakdown = new Map<string, number>()
    const unitBreakdown = new Map<string, number>()

    completedAppraisals.forEach((appraisal) => {
      const employee = users.find((u) => u.id === appraisal.employeeId)
      if (employee) {
        if (employee.division) {
          divisionBreakdown.set(employee.division, (divisionBreakdown.get(employee.division) || 0) + 1)
        }
        if (employee.unit) {
          unitBreakdown.set(employee.unit, (unitBreakdown.get(employee.unit) || 0) + 1)
        }
      }
    })

    return {
      totalCompleted: completedAppraisals.length,
      completedThisYear: thisYearAppraisals.length,
      divisionBreakdown: Array.from(divisionBreakdown.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5), // Top 5 divisions
      unitBreakdown: Array.from(unitBreakdown.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5), // Top 5 units
      totalDivisions: divisionBreakdown.size,
      totalUnits: unitBreakdown.size,
    }
  }, [appraisals, users])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Completed Appraisals */}
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Completed</CardTitle>
          <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{stats.totalCompleted}</div>
          <p className="text-xs text-muted-foreground">All completed appraisals</p>
        </CardContent>
      </Card>

      {/* Completed This Year */}
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">This Year</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{stats.completedThisYear}</div>
          <p className="text-xs text-muted-foreground">Completed in {new Date().getFullYear()}</p>
        </CardContent>
      </Card>

      {/* Division Breakdown */}
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">By Division</CardTitle>
          <Building className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{stats.totalDivisions}</div>
          <p className="text-xs text-muted-foreground">Active divisions</p>
          <div className="mt-2 space-y-1">
            {stats.divisionBreakdown.slice(0, 2).map(([division, count]) => (
              <div key={division} className="flex items-center justify-between text-xs">
                <span className="truncate max-w-[120px]" title={division}>
                  {division.length > 15 ? `${division.substring(0, 15)}...` : division}
                </span>
                <Badge variant="secondary" className="text-xs">
                  {count}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Unit Breakdown */}
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">By Unit</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">{stats.totalUnits}</div>
          <p className="text-xs text-muted-foreground">Active units</p>
          <div className="mt-2 space-y-1">
            {stats.unitBreakdown.slice(0, 2).map(([unit, count]) => (
              <div key={unit} className="flex items-center justify-between text-xs">
                <span className="truncate max-w-[120px]" title={unit}>
                  {unit.length > 15 ? `${unit.substring(0, 15)}...` : unit}
                </span>
                <Badge variant="secondary" className="text-xs">
                  {count}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
