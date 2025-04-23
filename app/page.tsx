import { HeroSection } from "../components/hero-section"
import { RecentReports } from "../components/recent-reports"
import { SafetyTips } from "../components/safety-tips"
import { QuickActions } from "../components/quick-actions"

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <div className="container py-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RecentReports />
          </div>
          <div className="space-y-6">
            <QuickActions />
            <SafetyTips />
          </div>
        </div>
      </div>
    </div>
  )
}
