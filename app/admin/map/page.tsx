"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminCrimeMap } from "@/components/admin/admin-crime-map"

export default function AdminMapPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Crime Map</h1>
        <p className="text-muted-foreground">Interactive map showing all reported crimes</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Crime Heat Map</CardTitle>
          <CardDescription>Click on markers to view detailed information about each report</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[600px] w-full rounded-lg border">
            <AdminCrimeMap />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
