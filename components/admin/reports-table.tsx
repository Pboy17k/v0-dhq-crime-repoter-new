"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { CheckCircle, Clock, AlertTriangle, XCircle, Send, Eye, MessageSquare } from "lucide-react"
import { useData } from "@/hooks/use-data"

export function ReportsTable() {
  const { reports, updateReport } = useData()
  const { toast } = useToast()
  const [selectedReport, setSelectedReport] = useState(null)
  const [updateMessage, setUpdateMessage] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [reportDetailsOpen, setReportDetailsOpen] = useState(false)
  const [reportToView, setReportToView] = useState(null)

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="flex items-center gap-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
          >
            <Clock className="h-3 w-3" /> Pending
          </Badge>
        )
      case "investigating":
        return (
          <Badge
            variant="outline"
            className="flex items-center gap-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
          >
            <AlertTriangle className="h-3 w-3" /> Investigating
          </Badge>
        )
      case "resolved":
        return (
          <Badge
            variant="outline"
            className="flex items-center gap-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
          >
            <CheckCircle className="h-3 w-3" /> Resolved
          </Badge>
        )
      case "dismissed":
        return (
          <Badge
            variant="outline"
            className="flex items-center gap-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
          >
            <XCircle className="h-3 w-3" /> Dismissed
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleStatusChange = (reportId, newStatus) => {
    // Use updateReport instead of updateReportStatus
    updateReport(reportId, { status: newStatus })
    toast({
      title: "Status Updated",
      description: `Report status changed to ${newStatus}`,
    })
  }

  const handleSendUpdate = () => {
    if (!updateMessage.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message to send",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Update Sent",
      description: `Message sent to reporter: ${selectedReport.reporterName}`,
    })
    setUpdateMessage("")
    setIsDialogOpen(false)
  }

  const openUpdateDialog = (report) => {
    setSelectedReport(report)
    setIsDialogOpen(true)
  }

  const viewReportDetails = (report) => {
    setReportToView(report)
    setReportDetailsOpen(true)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crime Reports</CardTitle>
        <CardDescription>Manage and respond to crime reports from citizens</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Reporter</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.id} className="group cursor-pointer" onClick={() => viewReportDetails(report)}>
                <TableCell className="font-medium">{report.id}</TableCell>
                <TableCell>{new Date(report.date).toLocaleDateString()}</TableCell>
                <TableCell>{report.crimeType}</TableCell>
                <TableCell>{report.location}</TableCell>
                <TableCell>{report.reporterName}</TableCell>
                <TableCell>{getStatusBadge(report.status)}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <div className="action-buttons flex space-x-1">
                      <div className="tooltip">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-70 hover:opacity-100 hover:bg-blue-100 dark:hover:bg-blue-900 transition-all duration-200 transform hover:scale-110"
                          onClick={(e) => {
                            e.stopPropagation()
                            viewReportDetails(report)
                          }}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Button>
                        <span className="tooltiptext">View Details</span>
                      </div>

                      <div className="tooltip">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="opacity-70 hover:opacity-100 hover:bg-green-100 dark:hover:bg-green-900 transition-all duration-200 transform hover:scale-110"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MessageSquare className="h-4 w-4" />
                              <span className="sr-only">Send Update</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent onClick={(e) => e.stopPropagation()}>
                            <DialogHeader>
                              <DialogTitle>Send Update to Reporter</DialogTitle>
                              <DialogDescription>
                                Send a message to {report.reporterName} regarding their report.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <span className="text-sm font-medium">Email:</span>
                                <span className="col-span-3">{report.reporterEmail || "email@example.com"}</span>
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <span className="text-sm font-medium">Phone:</span>
                                <span className="col-span-3">{report.reporterPhone || "+234 800 123 4567"}</span>
                              </div>
                              <div className="grid gap-2">
                                <span className="text-sm font-medium">Message:</span>
                                <Textarea
                                  placeholder="Type your update message here..."
                                  className="col-span-3"
                                  value={updateMessage}
                                  onChange={(e) => setUpdateMessage(e.target.value)}
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button type="submit" onClick={handleSendUpdate} className="gap-1">
                                <Send className="h-4 w-4" /> Send Message
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <span className="tooltiptext">Send Update</span>
                      </div>

                      <div className="status-buttons flex space-x-1 ml-2 border-l pl-2">
                        <div className="tooltip">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-70 hover:opacity-100 hover:bg-yellow-100 dark:hover:bg-yellow-900 transition-all duration-200 transform hover:scale-110"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleStatusChange(report.id, "investigating")
                            }}
                          >
                            <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                            <span className="sr-only">Investigating</span>
                          </Button>
                          <span className="tooltiptext">Mark as Investigating</span>
                        </div>

                        <div className="tooltip">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-70 hover:opacity-100 hover:bg-green-100 dark:hover:bg-green-900 transition-all duration-200 transform hover:scale-110"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleStatusChange(report.id, "resolved")
                            }}
                          >
                            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                            <span className="sr-only">Resolved</span>
                          </Button>
                          <span className="tooltiptext">Mark as Resolved</span>
                        </div>

                        <div className="tooltip">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-70 hover:opacity-100 hover:bg-red-100 dark:hover:bg-red-900 transition-all duration-200 transform hover:scale-110"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleStatusChange(report.id, "dismissed")
                            }}
                          >
                            <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                            <span className="sr-only">Dismissed</span>
                          </Button>
                          <span className="tooltiptext">Mark as Dismissed</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      {/* Report Details Dialog */}
      <Dialog open={reportDetailsOpen} onOpenChange={setReportDetailsOpen}>
        <DialogContent className="max-w-3xl">
          {reportToView && (
            <>
              <DialogHeader>
                <DialogTitle>
                  Report #{reportToView.id} - {reportToView.crimeType}
                </DialogTitle>
                <DialogDescription>
                  Reported on {new Date(reportToView.date).toLocaleDateString()} at {reportToView.location}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="text-sm font-medium">Status:</span>
                  <div className="col-span-3">{getStatusBadge(reportToView.status)}</div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="text-sm font-medium">Reporter:</span>
                  <span className="col-span-3">{reportToView.reporterName}</span>
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <span className="text-sm font-medium">Description:</span>
                  <div className="col-span-3">
                    <p className="text-sm">{reportToView.description}</p>
                  </div>
                </div>
                {reportToView.evidence && (
                  <div className="grid grid-cols-4 items-start gap-4">
                    <span className="text-sm font-medium">Evidence:</span>
                    <div className="col-span-3">
                      <div className="grid grid-cols-2 gap-2">
                        {reportToView.evidence.map((item, index) => (
                          <div key={index} className="border rounded-md p-2">
                            <img
                              src={item || "/placeholder.svg"}
                              alt={`Evidence ${index + 1}`}
                              className="w-full h-auto"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleStatusChange(reportToView.id, "investigating")
                      setReportDetailsOpen(false)
                    }}
                  >
                    <AlertTriangle className="h-4 w-4 mr-2" /> Mark as Investigating
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleStatusChange(reportToView.id, "resolved")
                      setReportDetailsOpen(false)
                    }}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" /> Mark as Resolved
                  </Button>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
}
