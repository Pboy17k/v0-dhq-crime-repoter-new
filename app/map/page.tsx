import { CrimeMap } from "@/components/crime-map"

export default function MapPage() {
  return (
    <div className="container py-6 md:py-10">
      <h1 className="mb-6 text-3xl font-bold tracking-tight">Crime Heat Map</h1>
      <p className="mb-8 text-muted-foreground">
        View reported crimes across different locations. This map shows anonymized crime data to help identify high-risk
        areas.
      </p>
      <div className="h-[600px] w-full rounded-lg border">
        <CrimeMap />
      </div>
    </div>
  )
}
