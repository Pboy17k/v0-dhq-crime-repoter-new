export interface CrimeReport {
  id: string
  title: string
  description: string
  location: string
  crimeType: string
  timestamp: string // When the report was submitted
  crimeDateTime: string // When the crime occurred
  isAtScene?: boolean // Whether the reporter is at the crime scene
  status: "pending" | "investigating" | "resolved" | "closed"
  media?: string[] // Base64 encoded images/videos
  audio?: string | null // Base64 encoded audio
  wantsUpdate: boolean
  contactInfo: {
    email?: string
    phone?: string
  } | null
  coordinates: {
    lat: number
    lng: number
  }
}
