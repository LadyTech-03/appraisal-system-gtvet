"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuthStore, useAppStore } from "@/lib/store"
import {
  Home,
  Users,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Calendar,
  Target,
  Menu,
  ClipboardCheck,
} from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Image from "next/image"

interface MenuItem {
  icon: React.ComponentType<{ className?: string }>
  label: string
  href: string
  badge?: string
  roles?: string[]
}

const menuItems: MenuItem[] = [
  {
    icon: Home,
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    icon: FileText,
    label: "My Appraisals",
    href: "/appraisals",
  },
  {
    icon: UserCheck,
    label: "Team Appraisals",
    href: "/team-appraisals",
    roles: [
      "Director-General",
      "Deputy Director – General, Management Services",
      "Deputy Director – General, Operations",
      "HR Management & Development Division Head",
      "Finance Division Head",
      "Administration Division Head",
    ],
  },
  {
    icon: ClipboardCheck,
    label: "All System Appraisals",
    href: "/admin/appraisals",
    roles: ["Director-General"],
  },
  {
    icon: Target,
    label: "Create Appraisal",
    href: "/create-appraisal",
    roles: [
      "Director-General",
      "Deputy Director – General, Management Services",
      "Deputy Director – General, Operations",
      "HR Management & Development Division Head",
      "Finance Division Head",
      "Administration Division Head",
    ],
  },
  {
    icon: Calendar,
    label: "Appraisal History",
    href: "/history",
  },
  {
    icon: BarChart3,
    label: "Analytics",
    href: "/analytics",
    roles: [
      "Director-General",
      "Deputy Director – General, Management Services",
      "Deputy Director – General, Operations",
    ],
  },
  {
    icon: Users,
    label: "User Management",
    href: "/admin",
    roles: ["Director-General"],
    // badge: "System Admin",
  },
  {
    icon: Settings,
    label: "Settings",
    href: "/settings",
  },
]

function SidebarContent() {
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const { users, appraisals } = useAppStore()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const filteredMenuItems = menuItems.filter((item) => !item.roles || item.roles.includes(user?.role || ""))

  const pendingAppraisals = appraisals.filter(
    (a) => a.status === "draft" && (a.employeeId === user?.id || a.appraiserId === user?.id),
  ).length

  const comprehensiveAppraisals = appraisals.filter(
    (a) =>
      (a.employeeId === user?.id || a.appraiserId === user?.id) &&
      a.coreCompetencies &&
      a.keyResultAreas &&
      a.keyResultAreas.length > 0,
  ).length

  return (
    <div
      className={`bg-sidebar border-r border-sidebar-border transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      } flex flex-col h-full`}
    >
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <Image src="/logos/logo.png" alt="Appraisal System Logo" width={40} height={40} />
              <div>
                <h2 className="text-sm font-semibold text-sidebar-foreground">APPRAISAL SYSTEM</h2>
                <p className="text-xs font-semibold text-sidebar-foreground/60">GTVET HR</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 h-8 w-8 hidden md:flex"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* User Info */}
      {!isCollapsed && user && (
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-sidebar-primary rounded-full flex items-center justify-center text-sidebar-primary-foreground font-semibold">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sidebar-foreground truncate">{user.name}</p>
              <p className="text-xs text-sidebar-foreground/60 truncate">
                {user.role === "Director-General" ? "Director General" : user.role}
              </p>
              <Badge variant="outline" className="text-xs mt-1">
                {user.staffId}
              </Badge>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {filteredMenuItems.map((item) => {
          const Icon = item.icon
          const isActive = typeof window !== "undefined" && window.location.pathname === item.href

          return (
            <Button
              key={item.href}
              variant={isActive ? "secondary" : "ghost"}
              className={`w-full justify-start ${isCollapsed ? "px-2" : "px-3"}`}
              onClick={() => router.push(item.href)}
            >
              <Icon className={`h-4 w-4 ${isCollapsed ? "" : "mr-3"}`} />
              {!isCollapsed && (
                <>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="text-xs">
                      {item.badge}
                    </Badge>
                  )}
                  {item.label === "My Appraisals" && pendingAppraisals > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {pendingAppraisals}
                    </Badge>
                  )}
                  {item.label === "Team Appraisals" && comprehensiveAppraisals > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {comprehensiveAppraisals}
                    </Badge>
                  )}
                </>
              )}
            </Button>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-2 border-t border-sidebar-border">
        <Button
          variant="ghost"
          className={`w-full justify-start text-destructive hover:text-destructive ${isCollapsed ? "px-2" : "px-3"}`}
          onClick={handleLogout}
        >
          <LogOut className={`h-4 w-4 ${isCollapsed ? "" : "mr-3"}`} />
          {!isCollapsed && <span>Logout</span>}
        </Button>
      </div>
    </div>
  )
}

export function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <div className="md:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="fixed top-4 left-4 z-50">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      <div className="hidden md:block h-screen sticky top-0">
        <SidebarContent />
      </div>
    </>
  )
}
