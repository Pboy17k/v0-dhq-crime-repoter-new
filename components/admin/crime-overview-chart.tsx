"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"

export function CrimeOverviewChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    if (!canvasRef.current) return

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const canvas = canvasRef.current
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Generate random data for the chart
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const data = months.map(() => Math.floor(Math.random() * 50) + 10)

    // Colors based on theme and DHQ colors
    const isDark = theme === "dark"
    const textColor = isDark ? "#e5e7eb" : "#374151"
    const gridColor = isDark ? "#374151" : "#e5e7eb"
    const barColors = [
      "#2D5234", // Army green
      "#003366", // Navy blue
      "#5D8AA8", // Air Force sky blue
    ]

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw chart
    const padding = 40
    const chartWidth = canvas.width - padding * 2
    const chartHeight = canvas.height - padding * 2
    const barWidth = (chartWidth / months.length) * 0.6
    const barSpacing = (chartWidth / months.length) * 0.4
    const maxValue = Math.max(...data) * 1.2

    // Draw title
    ctx.fillStyle = textColor
    ctx.font = "bold 16px sans-serif"
    ctx.textAlign = "center"
    ctx.fillText("Monthly Crime Reports", canvas.width / 2, 20)

    // Draw grid lines and labels
    ctx.strokeStyle = gridColor
    ctx.lineWidth = 0.5
    ctx.textAlign = "right"
    ctx.font = "12px sans-serif"

    for (let i = 0; i <= 5; i++) {
      const y = padding + chartHeight - (i / 5) * chartHeight
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(padding + chartWidth, y)
      ctx.stroke()

      // Draw y-axis labels
      ctx.fillStyle = textColor
      ctx.fillText(Math.round(maxValue * (i / 5)).toString(), padding - 10, y + 4)
    }

    // Draw x-axis
    ctx.beginPath()
    ctx.moveTo(padding, padding + chartHeight)
    ctx.lineTo(padding + chartWidth, padding + chartHeight)
    ctx.stroke()

    // Draw bars with gradient
    data.forEach((value, index) => {
      const x = padding + (chartWidth / months.length) * index + barSpacing / 2
      const barHeight = (value / maxValue) * chartHeight
      const y = padding + chartHeight - barHeight

      // Create gradient for bar
      const gradient = ctx.createLinearGradient(x, y, x, padding + chartHeight)
      gradient.addColorStop(0, barColors[index % barColors.length])
      gradient.addColorStop(1, isDark ? "rgba(45, 82, 52, 0.5)" : "rgba(93, 138, 168, 0.5)")

      // Draw bar with rounded top
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.moveTo(x, padding + chartHeight)
      ctx.lineTo(x, y + 5)
      ctx.arc(x + barWidth / 2, y + 5, barWidth / 2, Math.PI, 0, true)
      ctx.lineTo(x + barWidth, padding + chartHeight)
      ctx.closePath()
      ctx.fill()

      // Add shadow
      ctx.shadowColor = "rgba(0, 0, 0, 0.1)"
      ctx.shadowBlur = 5
      ctx.shadowOffsetX = 2
      ctx.shadowOffsetY = 2

      // Draw x-axis labels
      ctx.fillStyle = textColor
      ctx.font = "12px sans-serif"
      ctx.textAlign = "center"
      ctx.shadowColor = "transparent"
      ctx.fillText(months[index], x + barWidth / 2, canvas.height - 10)

      // Draw value on top of bar
      if (barHeight > 30) {
        ctx.fillStyle = "#ffffff"
        ctx.font = "bold 12px sans-serif"
        ctx.textAlign = "center"
        ctx.fillText(value.toString(), x + barWidth / 2, y + 15)
      }
    })

    // Add hover effect
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top

      // Redraw chart
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw title again
      ctx.fillStyle = textColor
      ctx.font = "bold 16px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("Monthly Crime Reports", canvas.width / 2, 20)

      // Draw grid lines again
      ctx.strokeStyle = gridColor
      ctx.lineWidth = 0.5

      for (let i = 0; i <= 5; i++) {
        const y = padding + chartHeight - (i / 5) * chartHeight
        ctx.beginPath()
        ctx.moveTo(padding, y)
        ctx.lineTo(padding + chartWidth, y)
        ctx.stroke()

        ctx.fillStyle = textColor
        ctx.font = "12px sans-serif"
        ctx.textAlign = "right"
        ctx.fillText(Math.round(maxValue * (i / 5)).toString(), padding - 10, y + 4)
      }

      // Draw x-axis
      ctx.beginPath()
      ctx.moveTo(padding, padding + chartHeight)
      ctx.lineTo(padding + chartWidth, padding + chartHeight)
      ctx.stroke()

      // Draw bars with hover effect
      data.forEach((value, index) => {
        const x = padding + (chartWidth / months.length) * index + barSpacing / 2
        const barHeight = (value / maxValue) * chartHeight
        const y = padding + chartHeight - barHeight

        // Check if mouse is over this bar
        const isHovered = mouseX >= x && mouseX <= x + barWidth && mouseY >= y && mouseY <= y + barHeight

        // Create gradient for bar
        const gradient = ctx.createLinearGradient(x, y, x, padding + chartHeight)

        if (isHovered) {
          // Brighter gradient for hovered bar
          gradient.addColorStop(0, barColors[index % barColors.length])
          gradient.addColorStop(1, isDark ? "rgba(45, 82, 52, 0.8)" : "rgba(93, 138, 168, 0.8)")
        } else {
          gradient.addColorStop(0, barColors[index % barColors.length])
          gradient.addColorStop(1, isDark ? "rgba(45, 82, 52, 0.5)" : "rgba(93, 138, 168, 0.5)")
        }

        // Draw bar with rounded top
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.moveTo(x, padding + chartHeight)
        ctx.lineTo(x, y + 5)
        ctx.arc(x + barWidth / 2, y + 5, barWidth / 2, Math.PI, 0, true)
        ctx.lineTo(x + barWidth, padding + chartHeight)
        ctx.closePath()
        ctx.fill()

        // Add shadow
        ctx.shadowColor = "rgba(0, 0, 0, 0.1)"
        ctx.shadowBlur = 5
        ctx.shadowOffsetX = 2
        ctx.shadowOffsetY = 2

        // Draw x-axis labels
        ctx.fillStyle = textColor
        ctx.font = "12px sans-serif"
        ctx.textAlign = "center"
        ctx.shadowColor = "transparent"
        ctx.fillText(months[index], x + barWidth / 2, canvas.height - 10)

        // Draw value on top of bar
        if (barHeight > 30) {
          ctx.fillStyle = "#ffffff"
          ctx.font = "bold 12px sans-serif"
          ctx.textAlign = "center"
          ctx.fillText(value.toString(), x + barWidth / 2, y + 15)
        }

        // Show tooltip if hovered
        if (isHovered) {
          const tooltipWidth = 120
          const tooltipHeight = 40
          const tooltipX = Math.min(x, canvas.width - tooltipWidth)
          const tooltipY = y - tooltipHeight - 10

          // Draw tooltip background
          ctx.fillStyle = isDark ? "#1f2937" : "#f9fafb"
          ctx.shadowColor = "rgba(0, 0, 0, 0.2)"
          ctx.shadowBlur = 10
          ctx.shadowOffsetX = 0
          ctx.shadowOffsetY = 4
          ctx.fillRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight)
          ctx.shadowColor = "transparent"

          ctx.strokeStyle = barColors[index % barColors.length]
          ctx.lineWidth = 2
          ctx.strokeRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight)

          // Draw tooltip text
          ctx.fillStyle = isDark ? "#e5e7eb" : "#374151"
          ctx.font = "bold 12px sans-serif"
          ctx.textAlign = "center"
          ctx.fillText(`${months[index]}: ${value}`, tooltipX + tooltipWidth / 2, tooltipY + tooltipHeight / 2 + 4)
        }
      })
    }

    canvas.addEventListener("mousemove", handleMouseMove)

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove)
    }
  }, [theme])

  return <canvas ref={canvasRef} className="h-full w-full" />
}
