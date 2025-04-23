"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ReportsTable } from "@/components/admin/reports-table"
import { useData } from "@/hooks/use-data"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Search, Filter, X } from "lucide-react"

export default function AdminReportsPage() {
  const { reports } = useData()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined)
  const [filteredReports, setFilteredReports] = useState(reports)
  const [activeFilters, setActiveFilters] = useState(0)

  // Get unique crime types from reports
  const crimeTypes = Array.from(new Set(reports.map((report) => report.crimeType || "Unknown")))

  // Apply filters when any filter changes
  useEffect(() => {
    // Filter reports based on search and filters
    const filtered = reports.filter((report) => {
      // Search term filter
      const searchMatch =
        searchTerm === "" ||
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.location.toLowerCase().includes(searchTerm.toLowerCase())

      // Status filter
      const statusMatch = statusFilter === "all" || report.status === statusFilter

      // Type filter
      const typeMatch = typeFilter === "all" || report.crimeType === typeFilter

      // Date filter
      let dateMatch = true
      if (dateFilter) {
        const reportDate = new Date(report.timestamp)
        dateMatch =
          reportDate.getDate() === dateFilter.getDate() &&
          reportDate.getMonth() === dateFilter.getMonth() &&
          reportDate.getFullYear() === dateFilter.getFullYear()
      }

      return searchMatch && statusMatch && typeMatch && dateMatch
    })

    setFilteredReports(filtered)

    // Count active filters
    let count = 0
    if (searchTerm) count++
    if (statusFilter !== "all") count++
    if (typeFilter !== "all") count++
    if (dateFilter) count++
    setActiveFilters(count)
  }, [reports, searchTerm, statusFilter, typeFilter, dateFilter])

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
    setTypeFilter("all")
    setDateFilter(undefined)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Manage Reports</h1>
        <p className="text-muted-foreground">View, filter, and manage all crime reports in the system</p>
      </div>

      <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2 text-primary" />
            Filter Reports
          </CardTitle>
          <CardDescription>Use the filters below to find specific reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by title, description, location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="investigating">Investigating</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Crime Type</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {crimeTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal" id="date">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFilter ? format(dateFilter, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={dateFilter} onSelect={setDateFilter} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <div>
              {activeFilters > 0 && (
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">{filteredReports.length}</span> reports found with{" "}
                  <span className="font-medium">{activeFilters}</span> active{" "}
                  {activeFilters === 1 ? "filter" : "filters"}
                </div>
              )}
            </div>
            <Button variant="outline" onClick={resetFilters} className="gap-2" disabled={activeFilters === 0}>
              <X className="h-4 w-4" />
              Reset Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Crime Reports</CardTitle>
          <CardDescription>{filteredReports.length} reports found</CardDescription>
        </CardHeader>
        <CardContent>
          <ReportsTable reports={filteredReports} />
        </CardContent>
      </Card>
    </div>
  )
}
