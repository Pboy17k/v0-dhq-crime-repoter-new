"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useData } from "../hooks/use-data"
import { useLanguage } from "../hooks/use-language"
import { formatDistanceToNow } from "date-fns"

export function RecentReports() {
  const { reports } = useData()
  const { t } = useLanguage()

  // Helper function to safely parse dates - MOVED TO TOP
  function parseDate(dateString: string | number | Date | undefined): Date | null {
    if (!dateString) return null

    try {
      const date = new Date(dateString)
      // Check if date is valid
      return isNaN(date.getTime()) ? null : date
    } catch (error) {
      return null
    }
  }

  // Helper function to safely format dates - MOVED TO TOP
  function formatDate(dateString: string | number | Date | undefined): string {
    const date = parseDate(dateString)
    if (!date) return "Unknown date"

    try {
      return formatDistanceToNow(date, { addSuffix: true })
    } catch (error) {
      return "Date error"
    }
  }

  // Sort reports by timestamp (newest first) and take the first 5
  const recentReports = [...reports]
    .sort((a, b) => {
      // Safely parse dates with validation
      const dateA = parseDate(a.timestamp)
      const dateB = parseDate(b.timestamp)

      // If either date is invalid, handle gracefully
      if (!dateA && !dateB) return 0
      if (!dateA) return 1
      if (!dateB) return -1

      return dateB.getTime() - dateA.getTime()
    })
    .slice(0, 5)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("recentReports.title")}</CardTitle>
        <CardDescription>{t("recentReports.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        {recentReports.length > 0 ? (
          <div className="space-y-4">
            {recentReports.map((report) => (
              <div key={report.id} className="border-b pb-4 last:border-0 last:pb-0">
                <h3 className="font-medium">{report.title}</h3>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{report.location}</span>
                  <span>{formatDate(report.timestamp)}</span>
                </div>
                <p className="mt-1 text-sm line-clamp-2">{report.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-4">{t("recentReports.noReports")}</p>
        )}
      </CardContent>
    </Card>
  )
}
