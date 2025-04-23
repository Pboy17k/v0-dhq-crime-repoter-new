"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CrimeOverviewChart } from "@/components/admin/crime-overview-chart"
import { CrimeByRegionChart } from "@/components/admin/crime-by-region-chart"
import { CrimeByTypeChart } from "@/components/admin/crime-by-type-chart"
import { RecentReportsTable } from "@/components/admin/recent-reports-table"
import { useData } from "@/hooks/use-data"
import { FileText, AlertTriangle, CheckCircle, Clock } from "lucide-react"

export default function AdminDashboardPage() {
  const { reports } = useData()
  const [adminName, setAdminName] = useState("Admin")

  useEffect(() => {
    const authData = localStorage.getItem("dhq-admin-auth")
    if (authData) {
      try {
        const { username } = JSON.parse(authData)
        if (username) setAdminName(username)
      } catch (error) {
        console.error("Error parsing auth data:", error)
      }
    }
  }, [])

  // Calculate report statistics
  const pendingReports = reports.filter((r) => r.status === "pending").length
  const investigatingReports = reports.filter((r) => r.status === "investigating").length
  const resolvedReports = reports.filter((r) => r.status === "resolved").length

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {adminName}. Here's an overview of crime reports.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.length}</div>
            <p className="text-xs text-muted-foreground">+{Math.floor(Math.random() * 10) + 1} from last week</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingReports}</div>
            <p className="text-xs text-muted-foreground">+{Math.floor(Math.random() * 5) + 1} since yesterday</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Investigating</CardTitle>
            <AlertTriangle className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{investigatingReports}</div>
            <p className="text-xs text-muted-foreground">+{Math.floor(Math.random() * 3)} from last week</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resolvedReports}</div>
            <p className="text-xs text-muted-foreground">+{Math.floor(Math.random() * 7) + 2} since last month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="regions">By Region</TabsTrigger>
          <TabsTrigger value="types">By Crime Type</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <Card className="chart-container">
            <CardHeader>
              <CardTitle>Crime Reports Overview</CardTitle>
              <CardDescription>Monthly crime report statistics for the current year</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <CrimeOverviewChart />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="regions" className="space-y-4">
          <Card className="chart-container">
            <CardHeader>
              <CardTitle>Crime Reports by Region</CardTitle>
              <CardDescription>Distribution of crime reports across different regions</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <CrimeByRegionChart />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="types" className="space-y-4">
          <Card className="chart-container">
            <CardHeader>
              <CardTitle>Crime Reports by Type</CardTitle>
              <CardDescription>Distribution of crime reports by crime category</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <CrimeByTypeChart />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
          <CardDescription>The latest crime reports submitted to the system</CardDescription>
        </CardHeader>
        <CardContent>
          <RecentReportsTable />
        </CardContent>
      </Card>
    </div>
  )
}
