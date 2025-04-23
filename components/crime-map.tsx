"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { useData } from "@/hooks/use-data"
import { useLanguage } from "@/hooks/use-language"
import dynamic from "next/dynamic"

// Import MapComponent only on client side
const MapComponent = dynamic(() => import("./map-component"), { ssr: false })

export function CrimeMap() {
  const { reports } = useData()
  const { t } = useLanguage()
  const [isClient, setIsClient] = useState(typeof window !== "undefined")

  return (
    <div className="container py-6 md:py-10">
      <h1 className="mb-4 text-3xl font-bold tracking-tight">Crime Heat Map</h1>
      <p className="mb-6 text-muted-foreground max-w-3xl">
        View reported crimes across different locations. This map shows anonymized crime data to help identify high-risk
        areas.
      </p>
      <Card className="w-full">
        <CardContent className="p-0">
          <div className="h-[calc(100vh-220px)] w-full">
            {isClient ? (
              <MapComponent reports={reports} />
            ) : (
              <div className="h-full w-full bg-gray-100 animate-pulse flex items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
