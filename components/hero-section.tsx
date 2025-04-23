"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/hooks/use-language"
import { useData } from "@/hooks/use-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"
import Link from "next/link"
import dynamic from "next/dynamic"

// Import HeroMap only on client side
const HeroMap = dynamic(() => import("./hero-map"), { ssr: false })

export function HeroSection() {
  const { t } = useLanguage()
  const { reports } = useData()
  const [recentReports, setRecentReports] = useState([])
  const [isClient, setIsClient] = useState(typeof window !== "undefined")

  useEffect(() => {
    // Get the 5 most recent reports for the map
    const sorted = [...reports].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    setRecentReports(sorted.slice(0, 5))
  }, [reports])

  return (
    <section className="relative py-12">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col space-y-8">
          {/* Text content */}
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl mb-6">{t("reportCrimeSecurely")}</h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed mb-8 tracking-wide">
              Help us make our community safer. Report incidents anonymously, upload evidence, and track your report
              status.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/report">
                <Button className="bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white">
                  {t("reportNow")}
                </Button>
              </Link>
              <Link href="/map">
                <Button variant="outline">{t("viewMap")}</Button>
              </Link>
            </div>
            <div className="mt-4 flex items-center justify-center gap-2 text-sm">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <span className="text-gray-500 dark:text-gray-400">
                {t("emergencyCall")} <strong>112</strong> {t("or")} <strong>911</strong>
              </span>
            </div>
          </div>

          {/* Map - full width */}
          <Card className="w-full overflow-hidden">
            <CardContent className="p-0">
              <div className="h-[400px] w-full">
                {isClient ? (
                  <HeroMap reports={recentReports} />
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
    </section>
  )
}
