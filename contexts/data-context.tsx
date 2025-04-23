"use client"

import { createContext, useState } from "react"

// Sample data
const sampleReports = [
  {
    id: "CR001",
    date: "2023-05-15",
    crimeType: "Robbery",
    location: "Lagos, Nigeria",
    description: "Armed robbery at a convenience store",
    reporterName: "John Doe",
    reporterEmail: "john@example.com",
    reporterPhone: "+234 800 123 4567",
    status: "pending",
    latitude: "6.5244",
    longitude: "3.3792",
    evidence: ["/placeholder.svg?height=200&width=300", "/placeholder.svg?height=200&width=300"],
  },
  {
    id: "CR002",
    date: "2023-05-20",
    crimeType: "Assault",
    location: "Abuja, Nigeria",
    description: "Physical assault in a public park",
    reporterName: "Jane Smith",
    reporterEmail: "jane@example.com",
    reporterPhone: "+234 800 765 4321",
    status: "investigating",
    latitude: "9.0765",
    longitude: "7.3986",
    evidence: ["/placeholder.svg?height=200&width=300"],
  },
  {
    id: "CR003",
    date: "2023-06-01",
    crimeType: "Fraud",
    location: "Port Harcourt, Nigeria",
    description: "Online banking fraud",
    reporterName: "Michael Johnson",
    reporterEmail: "michael@example.com",
    reporterPhone: "+234 800 987 6543",
    status: "resolved",
    latitude: "4.8156",
    longitude: "7.0498",
  },
  {
    id: "CR004",
    date: "2023-06-10",
    crimeType: "Kidnapping",
    location: "Kano, Nigeria",
    description: "Attempted kidnapping near a school",
    reporterName: "Sarah Williams",
    reporterEmail: "sarah@example.com",
    reporterPhone: "+234 800 456 7890",
    status: "dismissed",
    latitude: "12.0022",
    longitude: "8.5920",
  },
  {
    id: "CR005",
    date: "2023-06-15",
    crimeType: "Theft",
    location: "Enugu, Nigeria",
    description: "Shoplifting at a mall",
    reporterName: "David Brown",
    reporterEmail: "david@example.com",
    reporterPhone: "+234 800 234 5678",
    status: "pending",
    latitude: "6.4698",
    longitude: "7.5804",
  },
]

export const DataContext = createContext(null)

export function DataProvider({ children }) {
  const [reports, setReports] = useState(sampleReports)

  // Function to update a report's status
  const updateReport = (reportId, updates) => {
    setReports((prevReports) =>
      prevReports.map((report) => (report.id === reportId ? { ...report, ...updates } : report)),
    )
  }

  // Function to add a new report
  const addReport = (newReport) => {
    setReports((prevReports) => [...prevReports, newReport])
  }

  return (
    <DataContext.Provider
      value={{
        reports,
        updateReport,
        addReport,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}
