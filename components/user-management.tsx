"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAppStore, useAuthStore } from "@/lib/store"
import type { User } from "@/lib/types"
import { Plus, Upload, Download, Edit, Trash2, UserPlus, FileText, Search, Clock } from "lucide-react"
import { OrgChart } from "./org-chart"
import { AccessRequestsPanel } from "./access-requests-panel"

interface UserFormData {
  name: string
  staffId: string
  email: string
  role: string
  managerId: string
  division: string
  region: string
  passwordHash: string
}

export function UserManagement() {
  const { users, roles, addUser, updateUser, deleteUser, exportData, importData, filteredUsers, accessRequests } =
    useAppStore()
  const { user: currentUser, impersonate } = useAuthStore()
  const [activeTab, setActiveTab] = useState<"list" | "add" | "bulk" | "org" | "requests">("list")
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    staffId: "",
    email: "",
    role: "",
    managerId: "",
    division: "",
    region: "",
    passwordHash: "",
  })
  const [csvData, setCsvData] = useState("")
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const displayedUsers = filteredUsers(searchQuery)
  const pendingRequestsCount = accessRequests.filter((req) => req.status === "pending").length

  const resetForm = () => {
    setFormData({
      name: "",
      staffId: "",
      email: "",
      role: "",
      managerId: "",
      division: "",
      region: "",
      passwordHash: "",
    })
    setEditingUser(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingUser) {
        updateUser(editingUser.id, formData)
        setMessage({ type: "success", text: "User updated successfully!" })
      } else {
        addUser(formData)
        setMessage({ type: "success", text: "User added successfully!" })
      }
      resetForm()
      setActiveTab("list")
    } catch (error) {
      setMessage({ type: "error", text: "Failed to save user. Please try again." })
    }
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setFormData({
      name: user.name,
      staffId: user.staffId,
      email: user.email || "",
      role: user.role,
      managerId: user.managerId || "",
      division: user.division || "",
      region: user.region || "",
      passwordHash: user.passwordHash || "",
    })
    setActiveTab("add")
  }

  const handleDelete = (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      deleteUser(userId)
      setMessage({ type: "success", text: "User deleted successfully!" })
    }
  }

  const handleBulkImport = () => {
    try {
      const lines = csvData.trim().split("\n")
      const headers = lines[0].split(",").map((h) => h.trim())

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(",").map((v) => v.trim())
        const userData: any = {}

        headers.forEach((header, index) => {
          userData[header] = values[index] || ""
        })

        if (userData.name && userData.staffId && userData.role) {
          addUser(userData)
        }
      }

      setMessage({ type: "success", text: `Successfully imported ${lines.length - 1} users!` })
      setCsvData("")
      setActiveTab("list")
    } catch (error) {
      setMessage({ type: "error", text: "Failed to import users. Please check your CSV format." })
    }
  }

  const handleExport = () => {
    const data = exportData()
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "appraisal-data.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImpersonate = (user: User) => {
    if (confirm(`Impersonate ${user.name}? You will be logged in as this user.`)) {
      impersonate(user.id)
      setMessage({ type: "success", text: `Now logged in as ${user.name}` })
    }
  }

  const managerOptions = users.filter((u) => u.role.includes("Director") || u.role.includes("Head"))

  return (
    <div className="space-y-6">
      {message && (
        <Alert variant={message.type === "error" ? "destructive" : "default"}>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      {/* Tab Navigation */}
      <div className="flex space-x-2 border-b">
        {[
          { key: "list", label: "User List", icon: FileText },
          { key: "add", label: editingUser ? "Edit User" : "Add User", icon: editingUser ? Edit : Plus },
          { key: "bulk", label: "Bulk Import", icon: Upload },
          { key: "org", label: "Org Chart", icon: UserPlus },
          {
            key: "requests",
            label: `Access Requests${pendingRequestsCount > 0 ? ` (${pendingRequestsCount})` : ""}`,
            icon: Clock,
          },
        ].map(({ key, label, icon: Icon }) => (
          <Button
            key={key}
            variant={activeTab === key ? "default" : "ghost"}
            onClick={() => setActiveTab(key as any)}
            className="flex items-center space-x-2 relative"
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
            {key === "requests" && pendingRequestsCount > 0 && (
              <Badge variant="destructive" className="ml-1 px-1 py-0 text-xs min-w-[1.25rem] h-5">
                {pendingRequestsCount}
              </Badge>
            )}
          </Button>
        ))}
      </div>

      {/* User List Tab */}
      {activeTab === "list" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">All Users ({displayedUsers.length})</h3>
            <div className="flex space-x-2">
              <Button onClick={handleExport} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <Button onClick={() => setActiveTab("add")}>
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </div>
          </div>

          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, staff ID, role, or division..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background/50 border-border/50 focus:bg-background focus:border-primary/50 transition-colors"
            />
          </div>

          <div className="grid gap-4">
            {displayedUsers.length === 0 ? (
              <div className="text-center py-8">
                <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {searchQuery ? "No users found matching your search" : "No users found"}
                </p>
                {searchQuery && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Try adjusting your search terms or{" "}
                    <button onClick={() => setSearchQuery("")} className="text-primary hover:underline">
                      clear the search
                    </button>
                  </p>
                )}
              </div>
            ) : (
              displayedUsers.map((user) => (
                <Card key={user.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <h4 className="font-semibold">{user.name}</h4>
                          <p className="text-sm text-muted-foreground">{user.role}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline">{user.staffId}</Badge>
                            {user.email && <Badge variant="secondary">{user.email}</Badge>}
                            {user.division && <Badge>{user.division}</Badge>}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {currentUser?.role === "Director-General" && user.id !== currentUser.id && (
                          <Button variant="outline" size="sm" onClick={() => handleImpersonate(user)}>
                            Impersonate
                          </Button>
                        )}
                        <Button variant="outline" size="sm" onClick={() => handleEdit(user)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(user.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      )}

      {/* Add/Edit User Tab */}
      {activeTab === "add" && (
        <Card>
          <CardHeader>
            <CardTitle>{editingUser ? "Edit User" : "Add New User"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="staffId">Staff ID *</Label>
                  <Input
                    id="staffId"
                    value={formData.staffId}
                    onChange={(e) => setFormData((prev) => ({ ...prev, staffId: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role *</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, role: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="managerId">Manager</Label>
                  <Select
                    value={formData.managerId}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, managerId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select manager" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Manager</SelectItem>
                      {managerOptions.map((manager) => (
                        <SelectItem key={manager.id} value={manager.id}>
                          {manager.name} - {manager.role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="division">Division</Label>
                  <Input
                    id="division"
                    value={formData.division}
                    onChange={(e) => setFormData((prev) => ({ ...prev, division: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="region">Region</Label>
                  <Input
                    id="region"
                    value={formData.region}
                    onChange={(e) => setFormData((prev) => ({ ...prev, region: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.passwordHash}
                    onChange={(e) => setFormData((prev) => ({ ...prev, passwordHash: e.target.value }))}
                    placeholder="Leave blank to keep current password"
                  />
                </div>
              </div>

              <div className="flex space-x-2">
                <Button type="submit">{editingUser ? "Update User" : "Add User"}</Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Bulk Import Tab */}
      {activeTab === "bulk" && (
        <Card>
          <CardHeader>
            <CardTitle>Bulk Import Users</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="csvData">CSV Data</Label>
              <Textarea
                id="csvData"
                value={csvData}
                onChange={(e) => setCsvData(e.target.value)}
                placeholder="name,staffId,email,role,managerId,division,region,passwordHash&#10;John Doe,STF001,john@example.com,Staff Member,,HR,,password123"
                rows={10}
              />
            </div>
            <div className="text-sm text-muted-foreground">
              <p>Format: name,staffId,email,role,managerId,division,region,passwordHash</p>
              <p>Required fields: name, staffId, role</p>
            </div>
            <Button onClick={handleBulkImport} disabled={!csvData.trim()}>
              <Upload className="h-4 w-4 mr-2" />
              Import Users
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Organizational Chart Tab */}
      {activeTab === "org" && (
        <Card>
          <CardHeader>
            <CardTitle>Organizational Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <OrgChart onUserSelect={handleEdit} />
          </CardContent>
        </Card>
      )}

      {activeTab === "requests" && <AccessRequestsPanel />}
    </div>
  )
}
