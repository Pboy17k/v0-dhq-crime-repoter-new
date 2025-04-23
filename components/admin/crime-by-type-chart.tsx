"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"

export function CrimeByTypeChart() {
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

    // Generate data for the chart
    const crimeTypes = ["Theft", "Assault", "Vandalism", "Fraud", "Burglary", "Robbery"]
    const data = [35, 20, 15, 12, 10, 8]

    // Colors based on theme and DHQ colors
    const isDark = theme === "dark"
    const textColor = isDark ? "#e5e7eb" : "#374151"
    const gridColor = isDark ? "#374151" : "#e5e7eb"

    // Nigerian Defence Headquarters colors
    const barColors = [
      "#2D5234", // Army green
      "#003366", // Navy blue
      "#5D8AA8", // Air Force sky blue
      "#4B6043", // Lighter Army green
      "#0047AB", // Lighter Navy blue
      "#7CB9E8", // Lighter Air Force blue
    ]

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw title
    ctx.fillStyle = textColor
    ctx.font = "bold 16px sans-serif"
    ctx.textAlign = "center"
    ctx.fillText("Crime Reports by Type", canvas.width / 2, 20)

    // Draw chart
    const padding = 60
    const chartWidth = canvas.width - padding * 2
    const chartHeight = canvas.height - padding * 2
    const barHeight = (chartHeight / crimeTypes.length) * 0.6
    const barSpacing = (chartHeight / crimeTypes.length) * 0.4
    const maxValue = Math.max(...data) * 1.2

    // Draw background grid
    ctx.strokeStyle = gridColor
    ctx.lineWidth = 0.5
    ctx.setLineDash([5, 5])

    for (let i = 0; i <= 5; i++) {
      const x = padding + (i / 5) * chartWidth
      ctx.beginPath()
      ctx.moveTo(x, padding)
      ctx.lineTo(x, padding + chartHeight)
      ctx.stroke()

      // Draw x-axis labels
      ctx.fillStyle = textColor
      ctx.font = "12px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(Math.round(maxValue * (i / 5)).toString(), x, canvas.height - 10)
    }

    // Reset line dash
    ctx.setLineDash([])

    // Draw y-axis
    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, padding + chartHeight)
    ctx.strokeStyle = gridColor
    ctx.lineWidth = 1
    ctx.stroke()

    // Draw bars
    data.forEach((value, index) => {
      const y = padding + (chartHeight / crimeTypes.length) * index + barSpacing / 2
      const barWidth = (value / maxValue) * chartWidth

      // Create gradient for bar
      const gradient = ctx.createLinearGradient(padding, 0, padding + barWidth, 0)
      gradient.addColorStop(0, barColors[index % barColors.length])
      gradient.addColorStop(
        1,
        isDark
          ? adjustColor(barColors[index % barColors.length], -20)
          : adjustColor(barColors[index % barColors.length], 20),
      )

      // Draw bar with rounded corners
      ctx.beginPath()
      const radius = barHeight / 2

      // Top-right corner
      ctx.moveTo(padding + barWidth - radius, y)
      ctx.arcTo(padding + barWidth, y, padding + barWidth, y + radius, radius)

      // Bottom-right corner
      ctx.arcTo(padding + barWidth, y + barHeight, padding + barWidth - radius, y + barHeight, radius)

      // Bottom-left corner
      ctx.lineTo(padding + radius, y + barHeight)
      ctx.arcTo(padding, y + barHeight, padding, y + barHeight - radius, radius)

      // Top-left corner
      ctx.arcTo(padding, y, padding + radius, y, radius)
      ctx.closePath()

      // Fill with gradient
      ctx.fillStyle = gradient
      ctx.fill()

      // Add shadow
      ctx.shadowColor = "rgba(0, 0, 0, 0.1)"
      ctx.shadowBlur = 5
      ctx.shadowOffsetX = 2
      ctx.shadowOffsetY = 2
      ctx.fill()
      ctx.shadowColor = "transparent"

      // Draw y-axis labels
      ctx.fillStyle = textColor
      ctx.font = "bold 12px sans-serif"
      ctx.textAlign = "right"
      ctx.fillText(crimeTypes[index], padding - 10, y + barHeight / 2 + 4)

      // Draw value labels
      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 12px sans-serif"
      ctx.textAlign = "left"
      if (barWidth > 40) {
        ctx.fillText(value.toString(), padding + 10, y + barHeight / 2 + 4)
      } else {
        ctx.fillStyle = textColor
        ctx.fillText(value.toString(), padding + barWidth + 5, y + barHeight / 2 + 4)
      }

      // Draw percentage
      const percentage = Math.round((value / data.reduce((a, b) => a + b, 0)) * 100)
      if (barWidth > 80) {
        ctx.fillStyle = "#ffffff"
        ctx.font = "10px sans-serif"
        ctx.fillText(`${percentage}%`, padding + barWidth - 30, y + barHeight / 2 + 4)
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
      ctx.fillText("Crime Reports by Type", canvas.width / 2, 20)

      // Draw grid lines again
      ctx.strokeStyle = gridColor
      ctx.lineWidth = 0.5
      ctx.setLineDash([5, 5])

      for (let i = 0; i <= 5; i++) {
        const x = padding + (i / 5) * chartWidth
        ctx.beginPath()
        ctx.moveTo(x, padding)
        ctx.lineTo(x, padding + chartHeight)
        ctx.stroke()

        ctx.fillStyle = textColor
        ctx.font = "12px sans-serif"
        ctx.textAlign = "center"
        ctx.fillText(Math.round(maxValue * (i / 5)).toString(), x, canvas.height - 10)
      }

      // Reset line dash
      ctx.setLineDash([])

      // Draw y-axis
      ctx.beginPath()
      ctx.moveTo(padding, padding)
      ctx.lineTo(padding, padding + chartHeight)
      ctx.strokeStyle = gridColor
      ctx.lineWidth = 1
      ctx.stroke()

      // Draw bars with hover effect
      data.forEach((value, index) => {
        const y = padding + (chartHeight / crimeTypes.length) * index + barSpacing / 2
        const barWidth = (value / maxValue) * chartWidth

        // Check if mouse is over this bar
        const isHovered = mouseX >= padding && mouseX <= padding + barWidth && mouseY >= y && mouseY <= y + barHeight

        // Create gradient for bar
        const gradient = ctx.createLinearGradient(padding, 0, padding + barWidth, 0)
        gradient.addColorStop(0, barColors[index % barColors.length])
        gradient.addColorStop(
          1,
          isDark
            ? adjustColor(barColors[index % barColors.length], isHovered ? 0 : -20)
            : adjustColor(barColors[index % barColors.length], isHovered ? 40 : 20),
        )

        // Draw bar with rounded corners and hover effect
        ctx.beginPath()
        const radius = barHeight / 2
        const hoverOffset = isHovered ? 5 : 0

        // Top-right corner
        ctx.moveTo(padding + barWidth + hoverOffset - radius, y)
        ctx.arcTo(padding + barWidth + hoverOffset, y, padding + barWidth + hoverOffset, y + radius, radius)

        // Bottom-right corner
        ctx.arcTo(
          padding + barWidth + hoverOffset,
          y + barHeight,
          padding + barWidth + hoverOffset - radius,
          y + barHeight,
          radius,
        )

        // Bottom-left corner
        ctx.lineTo(padding + radius, y + barHeight)
        ctx.arcTo(padding, y + barHeight, padding, y + barHeight - radius, radius)

        // Top-left corner
        ctx.arcTo(padding, y, padding + radius, y, radius)
        ctx.closePath()

        // Fill with gradient
        ctx.fillStyle = gradient
        ctx.fill()

        // Add shadow
        ctx.shadowColor = "rgba(0, 0, 0, 0.1)"
        ctx.shadowBlur = isHovered ? 10 : 5
        ctx.shadowOffsetX = isHovered ? 4 : 2
        ctx.shadowOffsetY = isHovered ? 4 : 2
        ctx.fill()
        ctx.shadowColor = "transparent"

        // Draw y-axis labels
        ctx.fillStyle = isHovered ? barColors[index % barColors.length] : textColor
        ctx.font = isHovered ? "bold 12px sans-serif" : "bold 12px sans-serif"
        ctx.textAlign = "right"
        ctx.fillText(crimeTypes[index], padding - 10, y + barHeight / 2 + 4)

        // Draw value labels
        ctx.fillStyle = "#ffffff"
        ctx.font = isHovered ? "bold 13px sans-serif" : "bold 12px sans-serif"
        ctx.textAlign = "left"
        if (barWidth > 40) {
          ctx.fillText(value.toString(), padding + 10, y + barHeight / 2 + 4)
        } else {
          ctx.fillStyle = isHovered ? barColors[index % barColors.length] : textColor
          ctx.fillText(value.toString(), padding + barWidth + hoverOffset + 5, y + barHeight / 2 + 4)
        }

        // Draw percentage
        const percentage = Math.round((value / data.reduce((a, b) => a + b, 0)) * 100)
        if (barWidth > 80) {
          ctx.fillStyle = "#ffffff"
          ctx.font = isHovered ? "11px sans-serif" : "10px sans-serif"
          ctx.fillText(`${percentage}%`, padding + barWidth + hoverOffset - 30, y + barHeight / 2 + 4)
        }

        // Show tooltip if hovered
        if (isHovered) {
          const tooltipWidth = 180
          const tooltipHeight = 60
          const tooltipX = Math.min(mouseX + 10, canvas.width - tooltipWidth - 10)
          const tooltipY = Math.min(mouseY + 10, canvas.height - tooltipHeight - 10)

          // Draw tooltip background with shadow
          ctx.shadowColor = "rgba(0, 0, 0, 0.2)"
          ctx.shadowBlur = 10
          ctx.shadowOffsetX = 2
          ctx.shadowOffsetY = 2
          ctx.fillStyle = isDark ? "#1f2937" : "#f9fafb"
          ctx.fillRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight)
          ctx.shadowColor = "transparent"

          // Draw tooltip border
          ctx.strokeStyle = barColors[index % barColors.length]
          ctx.lineWidth = 2
          ctx.strokeRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight)

          // Draw tooltip text
          ctx.fillStyle = isDark ? "#e5e7eb" : "#374151"
          ctx.font = "bold 14px sans-serif"
          ctx.textAlign = "center"
          ctx.fillText(crimeTypes[index], tooltipX + tooltipWidth / 2, tooltipY + 20)

          ctx.font = "12px sans-serif"
          ctx.fillText(`${value} reports (${percentage}%)`, tooltipX + tooltipWidth / 2, tooltipY + 40)
        }
      })
    }

    canvas.addEventListener("mousemove", handleMouseMove)

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove)
    }
  }, [theme])

  // Helper function to adjust color brightness
  function adjustColor(color: string, amount: number): string {
    // Remove the # if it exists
    color = color.replace("#", "")

    // Parse the color components
    const r = Number.parseInt(color.substring(0, 2), 16)
    const g = Number.parseInt(color.substring(2, 4), 16)
    const b = Number.parseInt(color.substring(4, 6), 16)

    // Adjust each component
    const newR = Math.max(0, Math.min(255, r + amount))
    const newG = Math.max(0, Math.min(255, g + amount))
    const newB = Math.max(0, Math.min(255, b + amount))

    // Convert back to hex
    return `#${newR.toString(16).padStart(2, "0")}${newG.toString(16).padStart(2, "0")}${newB.toString(16).padStart(2, "0")}`
  }

  return <canvas ref={canvasRef} className="h-full w-full" />
}
