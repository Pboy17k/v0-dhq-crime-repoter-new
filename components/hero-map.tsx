"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/hooks/use-language"

// Nigeria's center coordinates
const NIGERIA_CENTER = [9.082, 8.6753]
const DEFAULT_ZOOM = 6

export default function HeroMap({ reports }) {
  const { t } = useLanguage()
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
        const mapContainer = document.getElementById("hero-map")
        if (!mapContainer) return

        // Initialize map
        const newMap = L.map("hero-map", {
          center: NIGERIA_CENTER,
          zoom: DEFAULT_ZOOM,
          scrollWheelZoom: false,
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
  }, [isClient, reports])

  // Return a div for the map
  return (
    <div id="hero-map" className="h-[400px] w-full rounded-md overflow-hidden">
      {!isClient && (
        <div className="h-full w-full bg-gray-100 animate-pulse flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      )}
    </div>
  )
}
