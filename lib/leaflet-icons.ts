// This file will be dynamically imported on the client side only
import L from "leaflet"

// Define a function to initialize Leaflet icons
export function initializeLeafletIcons() {
  // This function will be called only on the client side
  if (typeof window !== "undefined" && typeof L !== "undefined") {
    // Fix Leaflet default icon paths
    delete L.Icon.Default.prototype._getIconUrl

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "/images/marker-icon-2x.png",
      iconUrl: "/images/marker-icon.png",
      shadowUrl: "/images/marker-shadow.png",
    })

    return true
  }
  return false
}

// Create a function to get a custom icon
export function createCustomIcon(color: string) {
  if (typeof window !== "undefined" && typeof L !== "undefined") {
    return L.divIcon({
      className: "custom-marker-icon",
      html: `<div style="background-color: ${color}; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white;"></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    })
  }
  return null
}
