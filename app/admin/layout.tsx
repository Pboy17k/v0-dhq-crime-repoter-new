"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { NotificationSystem } from "@/components/notification-system"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Skip auth check for login page
    if (pathname === "/admin/login") {
      setIsLoading(false)
      return
    }

    // Check if user is authenticated
    const authData = localStorage.getItem("dhq-admin-auth")

    if (authData) {
      try {
        const auth = JSON.parse(authData)
        if (auth.isAuthenticated) {
          setIsAuthenticated(true)
          setIsLoading(false)
          return
        }
      } catch (error) {
        console.error("Error parsing auth data:", error)
      }
    }

    // Not authenticated, redirect to login
    router.push("/admin/login")
    setIsLoading(false)
  }, [pathname, router])

  // Show login page directly
  if (pathname === "/admin/login") {
    return children
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  // Show admin layout if authenticated
  if (isAuthenticated) {
    return (
      <div className="flex min-h-screen">
        <AdminSidebar />
        <div className="flex-1 overflow-auto flex flex-col">
          <header className="border-b p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex justify-end items-center gap-2">
              <NotificationSystem />
              <ModeToggle />
              <Button variant="outline" size="sm" onClick={() => router.push("/")}>
                View Public Site
              </Button>
            </div>
          </header>
          <div className="admin-container flex-1">{children}</div>
          <footer className="admin-footer">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Defence Headquarters, Abuja, Nigeria. All rights reserved.
            </p>
          </footer>
        </div>
      </div>
    )
  }

  // Fallback - should not reach here due to redirect
  return null
}
