"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/lib/store"
import type { User } from "@/lib/types"
import { ChevronDown, ChevronRight, Users, Mail } from "lucide-react"

interface OrgNodeProps {
  user: User
  subordinates: User[]
  level: number
  onUserSelect?: (user: User) => void
}

function OrgNode({ user, subordinates, level, onUserSelect }: OrgNodeProps) {
  const [isExpanded, setIsExpanded] = useState(level < 2)
  const hasSubordinates = subordinates.length > 0

  return (
    <div className="space-y-2">
      <Card className={`transition-all hover:shadow-md ${level === 0 ? "border-primary" : ""}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {hasSubordinates && (
                <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="p-1 h-6 w-6">
                  {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
              )}
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <h4 className="font-semibold text-sm">{user.name}</h4>
                <p className="text-xs text-muted-foreground">{user.role}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {user.staffId}
                  </Badge>
                  {user.division && (
                    <Badge variant="secondary" className="text-xs">
                      {user.division}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {user.email && (
                <Button variant="ghost" size="sm" className="p-1 h-6 w-6">
                  <Mail className="h-3 w-3" />
                </Button>
              )}
              <Badge variant="outline" className="text-xs">
                {hasSubordinates ? `${subordinates.length} reports` : "No reports"}
              </Badge>
              {onUserSelect && (
                <Button variant="outline" size="sm" onClick={() => onUserSelect(user)}>
                  Manage
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {hasSubordinates && isExpanded && (
        <div className="ml-8 space-y-2 border-l-2 border-muted pl-4">
          {subordinates.map((subordinate) => {
            const { users, orgHierarchy } = useAppStore.getState()
            const subSubordinates = (orgHierarchy[subordinate.id] || [])
              .map((id) => users.find((u) => u.id === id))
              .filter(Boolean) as User[]

            return (
              <OrgNode
                key={subordinate.id}
                user={subordinate}
                subordinates={subSubordinates}
                level={level + 1}
                onUserSelect={onUserSelect}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

export function OrgChart({ onUserSelect }: { onUserSelect?: (user: User) => void }) {
  const { users, orgHierarchy } = useAppStore()

  // Find the root user (Director-General)
  const rootUser = users.find((u) => u.role === "Director-General")
  if (!rootUser) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No organizational structure found</p>
        </CardContent>
      </Card>
    )
  }

  const rootSubordinates = (orgHierarchy[rootUser.id] || [])
    .map((id) => users.find((u) => u.id === id))
    .filter(Boolean) as User[]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Organizational Structure</h3>
        <Badge variant="secondary">{users.length} Total Users</Badge>
      </div>
      <OrgNode user={rootUser} subordinates={rootSubordinates} level={0} onUserSelect={onUserSelect} />
    </div>
  )
}
