import { CrimeReportForm } from "@/components/crime-report-form"

export default function ReportPage() {
  return (
    <div className="container py-6 md:py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-3xl font-bold tracking-tight">Report a Crime</h1>
        <p className="mb-8 text-muted-foreground">
          Your information will be kept confidential. You can choose to remain anonymous or provide contact details if
          you wish to receive updates.
        </p>
        <CrimeReportForm />
      </div>
    </div>
  )
}
