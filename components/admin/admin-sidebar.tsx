"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { Home, LayoutDashboard, FileText, Map, Settings, LogOut, ChevronLeft, ChevronRight } from "lucide-react"

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const navItems = [
    {
      title: "Dashboard",
      href: "/admin/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: "Reports",
      href: "/admin/reports",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: "Map",
      href: "/admin/map",
      icon: <Map className="h-5 w-5" />,
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: <Settings className="h-5 w-5" />,
    },
    {
      title: "Public Site",
      href: "/",
      icon: <Home className="h-5 w-5" />,
      divider: true,
    },
  ]

  const handleLogout = () => {
    // Clear admin auth from localStorage
    localStorage.removeItem("dhq-admin-auth")

    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    })

    // Redirect to login page
    router.push("/admin/login")
  }

  return (
    <div
      className={cn(
        "flex h-screen flex-col border-r bg-muted/40 transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex h-14 items-center border-b px-3 py-4">
        <Link
          href="/admin/dashboard"
          className={cn("flex items-center gap-2 font-semibold", isCollapsed && "justify-center")}
        >
          <div className="dhq-logo-icon" style={{ width: "24px", height: "24px" }}>
            <div className="dhq-logo-segment dhq-logo-army"></div>
            <div className="dhq-logo-segment dhq-logo-navy"></div>
            <div className="dhq-logo-segment dhq-logo-airforce"></div>
          </div>
          {!isCollapsed && <span>DHQ Admin</span>}
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className={cn("ml-auto h-8 w-8")}
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      </div>
      <nav className="flex-1 overflow-auto py-4">
        <ul className="grid gap-1 px-2">
          {navItems.map((item) => (
            <li key={item.href} className={item.divider ? "mt-4 pt-4 border-t" : ""}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent hover:text-accent-foreground",
                  pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                  isCollapsed && "justify-center py-3",
                )}
              >
                {item.icon}
                {!isCollapsed && <span>{item.title}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto border-t p-4">
        <Button
          variant="outline"
          className={cn("w-full justify-start gap-2", isCollapsed && "justify-center px-0")}
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          {!isCollapsed && <span>Logout</span>}
        </Button>
      </div>
    </div>
  )
}
