"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { useData } from "@/hooks/use-data"
import { useToast } from "@/hooks/use-toast"
import { formatDistanceToNow } from "date-fns"
import { Eye, Send, CheckCircle, AlertTriangle } from "lucide-react"
import type { CrimeReport } from "@/types/crime-report"

export function RecentReportsTable() {
  const { reports, updateReport } = useData()
  const { toast } = useToast()
  const [page, setPage] = useState(1)
  const [selectedReport, setSelectedReport] = useState<CrimeReport | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const pageSize = 5

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

  // Sort reports by timestamp (newest first)
  const sortedReports = [...reports].sort((a, b) => {
    // Safely parse dates with validation
    const dateA = parseDate(a.timestamp)
    const dateB = parseDate(b.timestamp)

    // If either date is invalid, handle gracefully
    if (!dateA && !dateB) return 0
    if (!dateA) return 1
    if (!dateB) return -1

    return dateB.getTime() - dateA.getTime()
  })

  // Paginate reports
  const paginatedReports = sortedReports.slice((page - 1) * pageSize, page * pageSize)
  const totalPages = Math.ceil(sortedReports.length / pageSize)

  // View report details
  const viewReportDetails = (report: CrimeReport) => {
    setSelectedReport(report)
    setIsDialogOpen(true)
  }

  // Handle status change
  const handleStatusChange = (reportId: string, newStatus: string) => {
    updateReport(reportId, { status: newStatus })
    toast({
      title: "Status updated",
      description: `Report status changed to ${newStatus}`,
    })
  }

  // Handle report assignment
  const handleAssignReport = () => {
    if (selectedReport) {
      toast({
        title: "Report assigned",
        description: "This report has been assigned to the investigation team",
      })
      handleStatusChange(selectedReport.id, "investigating")
    }
  }

  // Handle report resolution
  const handleResolveReport = () => {
    if (selectedReport) {
      toast({
        title: "Report resolved",
        description: "This report has been marked as resolved",
      })
      handleStatusChange(selectedReport.id, "resolved")
    }
  }

  // Handle sending update to reporter
  const handleSendUpdate = () => {
    if (selectedReport && selectedReport.wantsUpdate && selectedReport.contactInfo) {
      toast({
        title: "Update sent",
        description: "An update has been sent to the reporter",
      })
    } else {
      toast({
        title: "Cannot send update",
        description: "The reporter did not request updates or did not provide contact information",
        variant: "destructive",
      })
    }
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
      case "investigating":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
      case "closed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100"
      default:
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border overflow-hidden">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="h-10 px-4 text-left align-middle font-medium">Title</th>
                <th className="h-10 px-4 text-left align-middle font-medium">Location</th>
                <th className="h-10 px-4 text-left align-middle font-medium">Type</th>
                <th className="h-10 px-4 text-left align-middle font-medium">Time</th>
                <th className="h-10 px-4 text-left align-middle font-medium">Status</th>
                <th className="h-10 px-4 text-left align-middle font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedReports.length > 0 ? (
                paginatedReports.map((report) => (
                  <tr key={report.id} className="border-b transition-colors hover:bg-muted/50 group">
                    <td className="p-2 align-middle font-medium">{report.title}</td>
                    <td className="p-2 align-middle text-sm">{report.location}</td>
                    <td className="p-2 align-middle text-sm">{report.crimeType}</td>
                    <td className="p-2 align-middle text-sm">{formatDate(report.timestamp)}</td>
                    <td className="p-2 align-middle">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="p-2 align-middle">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => viewReportDetails(report)}
                        className="opacity-70 group-hover:opacity-100"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-muted-foreground">
                    No reports found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <div className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Report Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          {selectedReport && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedReport.title}</DialogTitle>
                <DialogDescription>Reported {formatDate(selectedReport.timestamp)}</DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="font-medium">Status:</span>
                  <div className="col-span-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedReport.status)}`}
                    >
                      {selectedReport.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="font-medium">Crime Type:</span>
                  <span className="col-span-3">{selectedReport.crimeType}</span>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="font-medium">Location:</span>
                  <span className="col-span-3">{selectedReport.location}</span>
                </div>

                <div className="grid grid-cols-4 items-start gap-4">
                  <span className="font-medium">Description:</span>
                  <div className="col-span-3">
                    <p className="whitespace-pre-wrap">{selectedReport.description}</p>
                  </div>
                </div>

                {selectedReport.audio && (
                  <div className="grid grid-cols-4 items-start gap-4">
                    <span className="font-medium">Audio Recording:</span>
                    <div className="col-span-3">
                      <audio src={selectedReport.audio} controls className="w-full" />
                    </div>
                  </div>
                )}

                {selectedReport.media && selectedReport.media.length > 0 && (
                  <div className="grid grid-cols-4 items-start gap-4">
                    <span className="font-medium">Media:</span>
                    <div className="col-span-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {selectedReport.media.map((media, index) => (
                        <div key={index} className="relative rounded-md overflow-hidden border">
                          <img
                            src={media || "/placeholder.svg"}
                            alt={`Evidence ${index + 1}`}
                            className="h-24 w-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedReport.wantsUpdate && selectedReport.contactInfo && (
                  <div className="grid grid-cols-4 items-start gap-4">
                    <span className="font-medium">Contact Info:</span>
                    <div className="col-span-3">
                      {selectedReport.contactInfo.email && <p>Email: {selectedReport.contactInfo.email}</p>}
                      {selectedReport.contactInfo.phone && <p>Phone: {selectedReport.contactInfo.phone}</p>}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-4 items-start gap-4">
                  <span className="font-medium">Coordinates:</span>
                  <div className="col-span-3">
                    <p>Latitude: {selectedReport.coordinates?.lat?.toFixed(6) || "N/A"}</p>
                    <p>Longitude: {selectedReport.coordinates?.lng?.toFixed(6) || "N/A"}</p>
                  </div>
                </div>
              </div>

              <DialogFooter className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 w-full">
                  <Button
                    variant="default"
                    onClick={handleAssignReport}
                    disabled={selectedReport.status === "investigating"}
                    className="w-full"
                  >
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Assign to Investigation
                  </Button>
                  <Button
                    variant="default"
                    onClick={handleResolveReport}
                    disabled={selectedReport.status === "resolved"}
                    className="w-full"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Mark as Resolved
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleSendUpdate}
                    disabled={!selectedReport.wantsUpdate || !selectedReport.contactInfo}
                    className="w-full"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Send Update to Reporter
                  </Button>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
