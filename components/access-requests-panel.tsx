"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAppStore } from "@/lib/store"
import { Clock, CheckCircle, XCircle, User, Mail, Building, Calendar } from "lucide-react"
import type { AccessRequest } from "@/lib/types"

export function AccessRequestsPanel() {
  const { accessRequests, users, approveAccessRequest, rejectAccessRequest, updateAccessRequest } = useAppStore()
  const [selectedRequest, setSelectedRequest] = useState<AccessRequest | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState<Partial<AccessRequest>>({})

  const pendingRequests = accessRequests.filter((req) => req.status === "pending")
  const reviewedRequests = accessRequests.filter((req) => req.status !== "pending")

  const handleEditRequest = (request: AccessRequest) => {
    setSelectedRequest(request)
    setEditData({
      name: request.name,
      email: request.email,
      staffId: request.staffId,
      role: request.role,
      division: request.division,
      notes: request.notes,
    })
    setIsEditing(true)
  }

  const handleSaveEdit = () => {
    if (selectedRequest && editData) {
      updateAccessRequest(selectedRequest.id, editData)
      setIsEditing(false)
      setSelectedRequest(null)
      setEditData({})
    }
  }

  const handleApprove = (requestId: string) => {
    // Find a suitable manager based on division
    const request = accessRequests.find((r) => r.id === requestId)
    if (!request) return

    // Simple manager assignment logic - could be more sophisticated
    let managerId = "1" // Default to DG

    if (request.division === "Management Services") {
      managerId = "2" // DDG Management Services
    } else if (request.division === "Operations") {
      managerId = "3" // DDG Operations
    }

    approveAccessRequest(requestId, managerId)
    setSelectedRequest(null)
  }

  const handleReject = (requestId: string) => {
    rejectAccessRequest(requestId)
    setSelectedRequest(null)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />
      case "approved":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Pending
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            Rejected
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Pending Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-yellow-500" />
            Pending Access Requests ({pendingRequests.length})
          </CardTitle>
          <CardDescription>Review and approve or reject new access requests to the system.</CardDescription>
        </CardHeader>
        <CardContent>
          {pendingRequests.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No pending requests</p>
          ) : (
            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <div key={request.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{request.name}</span>
                        {getStatusBadge(request.status)}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="w-4 h-4" />
                        {request.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building className="w-4 h-4" />
                        {request.role} • {request.division}
                      </div>
                      {request.staffId && (
                        <div className="text-sm text-muted-foreground">Staff ID: {request.staffId}</div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        Submitted: {new Date(request.submittedAt).toLocaleDateString()}
                      </div>
                      {request.notes && (
                        <div className="text-sm bg-muted p-2 rounded">
                          <strong>Notes:</strong> {request.notes}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEditRequest(request)}>
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-green-600 hover:text-green-700 bg-transparent"
                        onClick={() => handleApprove(request.id)}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700 bg-transparent"
                        onClick={() => handleReject(request.id)}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reviewed Requests */}
      {reviewedRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Request History ({reviewedRequests.length})</CardTitle>
            <CardDescription>Previously reviewed access requests.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reviewedRequests.map((request) => (
                <div key={request.id} className="border rounded-lg p-4 opacity-75">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(request.status)}
                        <span className="font-medium">{request.name}</span>
                        {getStatusBadge(request.status)}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="w-4 h-4" />
                        {request.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building className="w-4 h-4" />
                        {request.role} • {request.division}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        Reviewed: {request.reviewedAt ? new Date(request.reviewedAt).toLocaleDateString() : "N/A"}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Request Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Access Request</DialogTitle>
            <DialogDescription>Review and modify the request details before approval.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="edit-name"
                  value={editData.name || ""}
                  onChange={(e) => setEditData((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email Address</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editData.email || ""}
                  onChange={(e) => setEditData((prev) => ({ ...prev, email: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-staffId">Staff ID</Label>
              <Input
                id="edit-staffId"
                value={editData.staffId || ""}
                onChange={(e) => setEditData((prev) => ({ ...prev, staffId: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-role">Role/Position</Label>
              <Select
                value={editData.role || ""}
                onValueChange={(value) => setEditData((prev) => ({ ...prev, role: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {useAppStore.getState().roles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-division">Division/Unit</Label>
              <Select
                value={editData.division || ""}
                onValueChange={(value) => setEditData((prev) => ({ ...prev, division: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select division" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "Management Services",
                    "Operations",
                    "Corporate Affairs",
                    "Internal Audit",
                    "Legal Services",
                    "EduTech",
                    "Infrastructure Planning & Development",
                    "Apprenticeship",
                    "Partnerships, WEL & Inclusion",
                    "Training, Assessment & Quality Assurance",
                    "Regional Office",
                  ].map((division) => (
                    <SelectItem key={division} value={division}>
                      {division}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-notes">Notes</Label>
              <Textarea
                id="edit-notes"
                value={editData.notes || ""}
                onChange={(e) => setEditData((prev) => ({ ...prev, notes: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit}>Save Changes</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
