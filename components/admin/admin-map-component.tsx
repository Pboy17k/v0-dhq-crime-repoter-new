"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/hooks/use-language"
import { useData } from "@/hooks/use-data"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

export default function AdminMapComponent({ reports, filterType }) {
  const { t, language } = useLanguage()
  const { updateReport } = useData()
  const { toast } = useToast()
  const [isClient, setIsClient] = useState(false)
  const [map, setMap] = useState(null)
  const [selectedReport, setSelectedReport] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Filter reports based on type
  const filteredReports =
    filterType === "all"
      ? reports
      : reports.filter((report) => report.crimeType?.toLowerCase() === filterType.toLowerCase())

  useEffect(() => {
    setIsClient(true)

    // Check if Leaflet is available in the global scope
    const initializeMap = () => {
      try {
        // Wait for Leaflet to be available
        if (typeof window === "undefined" || !window.L) {
          // If Leaflet is not available yet, try again in 100ms
          setTimeout(initializeMap, 100)
          return
        }

        const L = window.L

        // If map exists, remove it before creating a new one
        if (map) {
          map.remove()
        }

        // Create map container if it doesn't exist
        const mapContainer = document.getElementById("admin-map")
        if (!mapContainer) return

        // Initialize map
        const newMap = L.map("admin-map", {
          center: [9.082, 8.6753], // Nigeria's center
          zoom: 6,
          scrollWheelZoom: true,
        })

        // Add tile layer
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(newMap)

        // Add zoom control
        L.control.zoom({ position: "bottomright" }).addTo(newMap)

        // Process data for heatmap
        const heatmapData = processHeatmapData(filteredReports)

        // Add heatmap points
        heatmapData.forEach((point) => {
          const circle = L.circleMarker([point.lat, point.lng], {
            radius: Math.min(20, 5 + point.count * 3),
            fillColor: "#ff3b30",
            color: "#ff3b30",
            weight: 1,
            opacity: 0.5,
            fillOpacity: 0.5,
          }).addTo(newMap)

          circle.bindPopup(`
            <div class="p-2">
              <p class="font-bold">${t("crimeHotspot") || "Crime Hotspot"}</p>
              <p>${t("reportCount") || "Report count"}: ${point.count}</p>
            </div>
          `)
        })

        // Add markers for reports
        filteredReports.forEach((report) => {
          if (!report.latitude || !report.longitude) return

          const lat = Number.parseFloat(report.latitude)
          const lng = Number.parseFloat(report.longitude)

          if (isNaN(lat) || isNaN(lng)) return

          // Get marker color based on status
          const getMarkerColor = (status) => {
            switch (status) {
              case "resolved":
                return "#10b981" // green
              case "investigating":
                return "#f59e0b" // amber
              case "dismissed":
                return "#6b7280" // gray
              default:
                return "#ef4444" // red
            }
          }

          // Create custom icon
          const icon = L.divIcon({
            className: "custom-marker-icon",
            html: `<div style="background-color: ${getMarkerColor(report.status)}; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white;"></div>`,
            iconSize: [16, 16],
            iconAnchor: [8, 8],
          })

          // Create marker
          const marker = L.marker([lat, lng], { icon }).addTo(newMap)

          // Add popup
          marker.bindPopup(`
            <div class="p-2">
              <h3 class="font-bold text-sm">${report.crimeType || "Unknown"}</h3>
              <p class="text-xs">${report.location || "Unknown location"}</p>
              <p class="text-xs mt-1">${report.status || "Pending"}</p>
              <p class="text-xs mt-1">${formatDate(report.date)}</p>
            </div>
          `)

          // Add click handler
          marker.on("click", () => {
            setSelectedReport(report)
            setIsDialogOpen(true)
          })
        })

        setMap(newMap)
      } catch (error) {
        console.error("Error initializing map:", error)
      }
    }

    if (isClient) {
      initializeMap()
    }

    // Cleanup function
    return () => {
      if (map) {
        map.remove()
      }
    }
  }, [isClient, filteredReports, filterType, t, language, map])

  // Helper function to process heatmap data
  const processHeatmapData = (reports) => {
    const locationCounts = {}

    reports.forEach((report) => {
      if (!report.latitude || !report.longitude) return

      const lat = Number.parseFloat(report.latitude)
      const lng = Number.parseFloat(report.longitude)

      if (isNaN(lat) || isNaN(lng)) return

      const key = `${lat},${lng}`
      if (!locationCounts[key]) {
        locationCounts[key] = {
          lat,
          lng,
          count: 0,
        }
      }
      locationCounts[key].count++
    })

    return Object.values(locationCounts)
  }

  // Helper function to format date
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString)
      return isNaN(date.getTime()) ? "Date unavailable" : date.toLocaleDateString(language === "en" ? "en-US" : "fr-FR")
    } catch (error) {
      return "Date unavailable"
    }
  }

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            {t("pending") || "Pending"}
          </Badge>
        )
      case "investigating":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
            {t("investigating") || "Investigating"}
          </Badge>
        )
      case "resolved":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            {t("resolved") || "Resolved"}
          </Badge>
        )
      case "dismissed":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
            {t("dismissed") || "Dismissed"}
          </Badge>
        )
      default:
        return <Badge variant="outline">{status || "Unknown"}</Badge>
    }
  }

  // Handle status change
  const handleStatusChange = (reportId, newStatus) => {
    updateReport(reportId, { status: newStatus })
    toast({
      title: "Status Updated",
      description: `Report status changed to ${newStatus}`,
    })
  }

  return (
    <>
      <div id="admin-map" className="h-full w-full rounded-md overflow-hidden">
        {!isClient && (
          <div className="h-full w-full bg-gray-100 animate-pulse flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        )}
      </div>

      {/* Report Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          {selectedReport && (
            <>
              <DialogHeader>
                <DialogTitle>
                  Report #{selectedReport.id} - {selectedReport.crimeType}
                </DialogTitle>
                <DialogDescription>
                  Reported on {formatDate(selectedReport.date)} at {selectedReport.location}
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="font-medium">Status:</span>
                  <div className="col-span-3">{getStatusBadge(selectedReport.status)}</div>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="font-medium">Reporter:</span>
                  <span className="col-span-3">{selectedReport.reporterName}</span>
                </div>

                <div className="grid grid-cols-4 items-start gap-4">
                  <span className="font-medium">Description:</span>
                  <div className="col-span-3">
                    <p className="whitespace-pre-wrap">{selectedReport.description}</p>
                  </div>
                </div>

                {selectedReport.evidence && selectedReport.evidence.length > 0 && (
                  <div className="grid grid-cols-4 items-start gap-4">
                    <span className="font-medium">Evidence:</span>
                    <div className="col-span-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {selectedReport.evidence.map((media, index) => (
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

                <div className="grid grid-cols-4 items-start gap-4">
                  <span className="font-medium">Coordinates:</span>
                  <div className="col-span-3">
                    <p>Latitude: {selectedReport.latitude}</p>
                    <p>Longitude: {selectedReport.longitude}</p>
                  </div>
                </div>
              </div>

              <DialogFooter className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full">
                  <Button
                    variant="default"
                    onClick={() => {
                      handleStatusChange(selectedReport.id, "investigating")
                      setIsDialogOpen(false)
                    }}
                    disabled={selectedReport.status === "investigating"}
                    className="w-full"
                  >
                    Assign to Investigation
                  </Button>
                  <Button
                    variant="default"
                    onClick={() => {
                      handleStatusChange(selectedReport.id, "resolved")
                      setIsDialogOpen(false)
                    }}
                    disabled={selectedReport.status === "resolved"}
                    className="w-full"
                  >
                    Mark as Resolved
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <Button
                    variant={selectedReport.status === "pending" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleStatusChange(selectedReport.id, "pending")}
                  >
                    Pending
                  </Button>
                  <Button
                    variant={selectedReport.status === "investigating" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleStatusChange(selectedReport.id, "investigating")}
                  >
                    Investigating
                  </Button>
                  <Button
                    variant={selectedReport.status === "resolved" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleStatusChange(selectedReport.id, "resolved")}
                  >
                    Resolved
                  </Button>
                  <Button
                    variant={selectedReport.status === "dismissed" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleStatusChange(selectedReport.id, "dismissed")}
                  >
                    Dismissed
                  </Button>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
