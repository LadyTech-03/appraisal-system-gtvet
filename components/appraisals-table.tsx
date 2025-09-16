"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/lib/store"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Filter, X, Eye, Calendar } from "lucide-react"
import { format } from "date-fns"

interface FilterState {
  search: string
  division: string
  unit: string
  role: string
  status: string
  dateRange: string
}

export function AppraisalsTable() {
  const router = useRouter()
  const { appraisals, users } = useAppStore()
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    division: "",
    unit: "",
    role: "",
    status: "",
    dateRange: "",
  })

  // Get completed appraisals only
  const completedAppraisals = useMemo(() => {
    return appraisals.filter((appraisal) => ["submitted", "reviewed", "closed"].includes(appraisal.status))
  }, [appraisals])

  // Get unique filter options
  const filterOptions = useMemo(() => {
    const divisions = new Set<string>()
    const units = new Set<string>()
    const roles = new Set<string>()
    const statuses = new Set<string>()

    completedAppraisals.forEach((appraisal) => {
      const employee = users.find((u) => u.id === appraisal.employeeId)
      if (employee) {
        if (employee.division) divisions.add(employee.division)
        if (employee.unit) units.add(employee.unit)
        if (employee.role) roles.add(employee.role)
        statuses.add(appraisal.status)
      }
    })

    return {
      divisions: Array.from(divisions).sort(),
      units: Array.from(units).sort(),
      roles: Array.from(roles).sort(),
      statuses: Array.from(statuses).sort(),
    }
  }, [completedAppraisals, users])

  // Filter appraisals based on current filters
  const filteredAppraisals = useMemo(() => {
    return completedAppraisals.filter((appraisal) => {
      const employee = users.find((u) => u.id === appraisal.employeeId)
      const appraiser = users.find((u) => u.id === appraisal.appraiserId)

      if (!employee) return false

      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase()
        const matchesSearch =
          employee.name.toLowerCase().includes(searchTerm) ||
          employee.staffId.toLowerCase().includes(searchTerm) ||
          appraiser?.name.toLowerCase().includes(searchTerm) ||
          employee.role.toLowerCase().includes(searchTerm)

        if (!matchesSearch) return false
      }

      // Division filter
      if (filters.division && employee.division !== filters.division) return false

      // Unit filter
      if (filters.unit && employee.unit !== filters.unit) return false

      // Role filter
      if (filters.role && employee.role !== filters.role) return false

      // Status filter
      if (filters.status && appraisal.status !== filters.status) return false

      // Date range filter (simplified - could be enhanced with actual date range picker)
      if (filters.dateRange) {
        const now = new Date()
        const appraisalDate = new Date(appraisal.updatedAt)

        switch (filters.dateRange) {
          case "last-30-days":
            if (now.getTime() - appraisalDate.getTime() > 30 * 24 * 60 * 60 * 1000) return false
            break
          case "last-90-days":
            if (now.getTime() - appraisalDate.getTime() > 90 * 24 * 60 * 60 * 1000) return false
            break
          case "this-year":
            if (appraisalDate.getFullYear() !== now.getFullYear()) return false
            break
        }
      }

      return true
    })
  }, [completedAppraisals, users, filters])

  const clearFilters = () => {
    setFilters({
      search: "",
      division: "",
      unit: "",
      role: "",
      status: "",
      dateRange: "",
    })
  }

  const hasActiveFilters = Object.values(filters).some((value) => value !== "")

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "submitted":
        return <Badge variant="secondary">Submitted</Badge>
      case "reviewed":
        return <Badge variant="default">Reviewed</Badge>
      case "closed":
        return <Badge variant="outline">Closed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Bar */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by employee name, staff ID, appraiser, or role..."
              value={filters.search}
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
              className="pl-10"
            />
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap gap-2">
          <Select
            value={filters.division}
            onValueChange={(value) => setFilters((prev) => ({ ...prev, division: value }))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Division" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-divisions">All Divisions</SelectItem>
              {filterOptions.divisions.map((division) => (
                <SelectItem key={division} value={division}>
                  {division}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.unit} onValueChange={(value) => setFilters((prev) => ({ ...prev, unit: value }))}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-units">All Units</SelectItem>
              {filterOptions.units.map((unit) => (
                <SelectItem key={unit} value={unit}>
                  {unit}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.role} onValueChange={(value) => setFilters((prev) => ({ ...prev, role: value }))}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-roles">All Roles</SelectItem>
              {filterOptions.roles.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.status} onValueChange={(value) => setFilters((prev) => ({ ...prev, status: value }))}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-status">All Status</SelectItem>
              {filterOptions.statuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.dateRange}
            onValueChange={(value) => setFilters((prev) => ({ ...prev, dateRange: value }))}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-time">All Time</SelectItem>
              <SelectItem value="last-30-days">Last 30 Days</SelectItem>
              <SelectItem value="last-90-days">Last 90 Days</SelectItem>
              <SelectItem value="this-year">This Year</SelectItem>
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button variant="outline" onClick={clearFilters} className="flex items-center space-x-2 bg-transparent">
              <X className="h-4 w-4" />
              <span>Clear Filters</span>
            </Button>
          )}
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Showing {filteredAppraisals.length} of {completedAppraisals.length} completed appraisals
        </span>
        {hasActiveFilters && (
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span>Filters active</span>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Staff ID</TableHead>
              <TableHead>Role/Position</TableHead>
              <TableHead>Division/Unit</TableHead>
              <TableHead>Manager/Appraiser</TableHead>
              <TableHead>Period</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date Submitted</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAppraisals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  No appraisals found matching your criteria
                </TableCell>
              </TableRow>
            ) : (
              filteredAppraisals.map((appraisal) => {
                const employee = users.find((u) => u.id === appraisal.employeeId)
                const appraiser = users.find((u) => u.id === appraisal.appraiserId)

                if (!employee) return null

                return (
                  <TableRow key={appraisal.id}>
                    <TableCell className="font-medium">{employee.name}</TableCell>
                    <TableCell>{employee.staffId}</TableCell>
                    <TableCell className="max-w-[200px] truncate" title={employee.role}>
                      {employee.role}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">{employee.division}</div>
                        {employee.unit && <div className="text-xs text-muted-foreground">{employee.unit}</div>}
                      </div>
                    </TableCell>
                    <TableCell>{appraiser?.name || "N/A"}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {format(new Date(appraisal.createdAt), "MMM yyyy")} -
                          {format(new Date(appraisal.updatedAt), "MMM yyyy")}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(appraisal.status)}</TableCell>
                    <TableCell>{format(new Date(appraisal.updatedAt), "MMM dd, yyyy")}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/appraisals/${appraisal.id}`)}
                        className="flex items-center space-x-2"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
