"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/hooks/use-language"

export default function MapComponent({ reports }) {
  const { t, language } = useLanguage()
  const [isClient, setIsClient] = useState(false)
  const [map, setMap] = useState(null)

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

        // Create map container if it doesn't exist
        const mapContainer = document.getElementById("crime-map")
        if (!mapContainer) return

        // Initialize map
        const newMap = L.map("crime-map", {
          center: [9.082, 8.6753], // Nigeria's center
          zoom: 6,
          scrollWheelZoom: true,
        })

        // Add tile layer
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(newMap)

        // Fix icon paths
        const icon = L.icon({
          iconUrl: "/images/marker-icon.png",
          shadowUrl: "/images/marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        })

        // Process data for heatmap
        const heatmapData = processHeatmapData(reports)

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
        reports.forEach((report) => {
          if (!report.latitude || !report.longitude) return

          const lat = Number.parseFloat(report.latitude)
          const lng = Number.parseFloat(report.longitude)

          if (isNaN(lat) || isNaN(lng)) return

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
  }, [isClient, reports, t, language])

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

  // Return a div for the map
  return (
    <div id="crime-map" className="h-full w-full rounded-md overflow-hidden">
      {!isClient && (
        <div className="h-full w-full bg-gray-100 animate-pulse flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      )}
    </div>
  )
}
