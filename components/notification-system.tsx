"use client"

import { useState, useEffect } from "react"
import { useData } from "@/hooks/use-data"
import { useToast } from "@/hooks/use-toast"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { useRouter } from "next/navigation"

export function NotificationSystem() {
  const { reports } = useData()
  const { toast } = useToast()
  const router = useRouter()
  const [notifications, setNotifications] = useState<Array<{ id: string; read: boolean; timestamp: string }>>([])
  const [lastCheckedTimestamp, setLastCheckedTimestamp] = useState<string | null>(null)

  // Initialize notifications from localStorage
  useEffect(() => {
    try {
      const savedNotifications = localStorage.getItem("dhq-notifications")
      if (savedNotifications) {
        setNotifications(JSON.parse(savedNotifications))
      }

      const savedTimestamp = localStorage.getItem("dhq-last-checked")
      if (savedTimestamp) {
        setLastCheckedTimestamp(savedTimestamp)
      } else {
        // If no timestamp exists, set it to now
        const now = new Date().toISOString()
        localStorage.setItem("dhq-last-checked", now)
        setLastCheckedTimestamp(now)
      }
    } catch (error) {
      console.error("Error loading notifications from localStorage:", error)
    }
  }, [])

  // Check for new reports
  useEffect(() => {
    if (!lastCheckedTimestamp) return

    // Find reports newer than last checked timestamp
    const newReports = reports.filter(
      (report) =>
        new Date(report.timestamp) > new Date(lastCheckedTimestamp) && !notifications.some((n) => n.id === report.id),
    )

    if (newReports.length > 0) {
      // Add new notifications
      const newNotifications = newReports.map((report) => ({
        id: report.id,
        read: false,
        timestamp: report.timestamp,
      }))

      const updatedNotifications = [...notifications, ...newNotifications]
      setNotifications(updatedNotifications)

      // Save to localStorage
      localStorage.setItem("dhq-notifications", JSON.stringify(updatedNotifications))

      // Show toast for new notifications
      if (newReports.length === 1) {
        toast({
          title: "New Crime Report",
          description: `A new report has been submitted: ${newReports[0].title}`,
        })
      } else {
        toast({
          title: "New Crime Reports",
          description: `${newReports.length} new reports have been submitted`,
        })
      }
    }
  }, [reports, lastCheckedTimestamp, notifications, toast])

  // Mark all as read
  const markAllAsRead = () => {
    const updatedNotifications = notifications.map((notification) => ({
      ...notification,
      read: true,
    }))
    setNotifications(updatedNotifications)
    localStorage.setItem("dhq-notifications", JSON.stringify(updatedNotifications))

    // Update last checked timestamp
    const now = new Date().toISOString()
    localStorage.setItem("dhq-last-checked", now)
    setLastCheckedTimestamp(now)
  }

  // View a notification
  const viewNotification = (notificationId: string) => {
    // Mark this notification as read
    const updatedNotifications = notifications.map((notification) =>
      notification.id === notificationId ? { ...notification, read: true } : notification,
    )
    setNotifications(updatedNotifications)
    localStorage.setItem("dhq-notifications", JSON.stringify(updatedNotifications))

    // Find the report
    const report = reports.find((r) => r.id === notificationId)
    if (report) {
      // Navigate to admin reports page
      router.push("/admin/reports")
    }
  }

  // Get unread count
  const unreadCount = notifications.filter((notification) => !notification.read).length

  // Sort notifications by timestamp (newest first)
  const sortedNotifications = [...notifications].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  )

  // Take only the 5 most recent notifications
  const recentNotifications = sortedNotifications.slice(0, 5)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="h-8 text-xs">
              Mark all as read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {recentNotifications.length > 0 ? (
          <>
            {recentNotifications.map((notification) => {
              const report = reports.find((r) => r.id === notification.id)
              return (
                <DropdownMenuItem
                  key={notification.id}
                  className={`flex flex-col items-start p-3 cursor-pointer ${!notification.read ? "bg-muted/50" : ""}`}
                  onClick={() => viewNotification(notification.id)}
                >
                  <div className="flex w-full justify-between items-start">
                    <div className="font-medium text-sm">
                      {report ? report.title : "Crime Report"}
                      {!notification.read && (
                        <span className="ml-2 h-2 w-2 rounded-full bg-primary inline-block"></span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {report ? `${report.crimeType} in ${report.location}` : "View report details"}
                  </div>
                </DropdownMenuItem>
              )
            })}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex justify-center text-sm font-medium text-primary cursor-pointer"
              onClick={() => router.push("/admin/reports")}
            >
              View All Reports
            </DropdownMenuItem>
          </>
        ) : (
          <div className="py-4 text-center text-sm text-muted-foreground">No notifications</div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
