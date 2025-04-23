"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { useData } from "@/hooks/use-data"
import { useLanguage } from "@/hooks/use-language"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import dynamic from "next/dynamic"

// Import AdminMapComponent only on client side
const AdminMapComponent = dynamic(() => import("./admin-map-component"), { ssr: false })

export function AdminCrimeMap() {
  const { reports } = useData()
  const { t } = useLanguage()
  const [filterType, setFilterType] = useState("all")
  const [isClient, setIsClient] = useState(typeof window !== "undefined")

  // Get unique crime types for filter
  const crimeTypes = ["all", ...new Set(reports.map((report) => report.crimeType))]

  return (
    <div className="container py-6 md:py-10">
      <div className="flex flex-col space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Crime Heat Map</h1>
          <p className="mt-2 text-muted-foreground max-w-3xl">
            Visualize crime hotspots and analyze patterns across different regions.
          </p>
        </div>

        <div className="w-full sm:w-64 mb-4">
          <Label htmlFor="crime-type-filter" className="mb-2 block">
            Filter by Crime Type
          </Label>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger id="crime-type-filter">
              <SelectValue placeholder="Select crime type" />
            </SelectTrigger>
            <SelectContent>
              {crimeTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type === "all" ? "All Crimes" : type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Card className="w-full">
          <CardContent className="p-0">
            <div className="h-[calc(100vh-220px)] w-full">
              {isClient ? (
                <AdminMapComponent reports={reports} filterType={filterType} />
              ) : (
                <div className="h-full w-full bg-gray-100 animate-pulse flex items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
