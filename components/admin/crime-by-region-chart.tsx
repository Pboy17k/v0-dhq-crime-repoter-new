"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"

export function CrimeByRegionChart() {
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
    const regions = ["Abuja Central", "Garki", "Wuse", "Maitama", "Asokoro", "Gwarinpa", "Kubwa"]
    const data = regions.map(() => Math.floor(Math.random() * 40) + 5)

    // Colors based on theme and DHQ colors
    const isDark = theme === "dark"
    const textColor = isDark ? "#e5e7eb" : "#374151"

    // Nigerian Defence Headquarters colors
    const colors = [
      "#2D5234", // Army green
      "#003366", // Navy blue
      "#5D8AA8", // Air Force sky blue
      "#4B6043", // Lighter Army green
      "#0047AB", // Lighter Navy blue
      "#7CB9E8", // Lighter Air Force blue
      "#6B8E23", // Olive Drab (complementary)
    ]

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw title
    ctx.fillStyle = textColor
    ctx.font = "bold 16px sans-serif"
    ctx.textAlign = "center"
    ctx.fillText("Crime Reports by Region", canvas.width / 2, 20)

    // Draw pie chart
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) - 60

    const total = data.reduce((sum, value) => sum + value, 0)
    let startAngle = 0

    // Draw pie slices with 3D effect
    data.forEach((value, index) => {
      const sliceAngle = (value / total) * 2 * Math.PI
      const endAngle = startAngle + sliceAngle
      const midAngle = startAngle + sliceAngle / 2

      // Create 3D effect with gradient
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius)
      gradient.addColorStop(0, colors[index % colors.length])
      gradient.addColorStop(
        1,
        isDark ? adjustColor(colors[index % colors.length], -20) : adjustColor(colors[index % colors.length], 20),
      )

      // Draw main slice
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, startAngle, endAngle)
      ctx.closePath()
      ctx.fillStyle = gradient
      ctx.fill()

      // Add shadow/highlight for 3D effect
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, startAngle, endAngle)
      ctx.closePath()
      ctx.lineWidth = 2
      ctx.strokeStyle = isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.1)"
      ctx.stroke()

      // Draw slice label if slice is big enough
      if (sliceAngle > 0.2) {
        const labelRadius = radius * 0.7
        const labelX = centerX + Math.cos(midAngle) * labelRadius
        const labelY = centerY + Math.sin(midAngle) * labelRadius

        ctx.fillStyle = "#ffffff"
        ctx.font = "bold 12px sans-serif"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(`${Math.round((value / total) * 100)}%`, labelX, labelY)
      }

      startAngle = endAngle
    })

    // Draw legend
    const legendX = canvas.width - 150
    const legendY = 40
    const legendItemHeight = 25

    regions.forEach((region, index) => {
      const y = legendY + index * legendItemHeight

      // Draw color box
      ctx.fillStyle = colors[index % colors.length]
      ctx.fillRect(legendX, y, 15, 15)

      // Add border
      ctx.strokeStyle = isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.1)"
      ctx.lineWidth = 1
      ctx.strokeRect(legendX, y, 15, 15)

      // Draw region name
      ctx.fillStyle = textColor
      ctx.font = "12px sans-serif"
      ctx.textAlign = "left"
      ctx.fillText(region, legendX + 25, y + 12)

      // Draw value
      ctx.fillStyle = isDark ? "#a1a1aa" : "#6b7280"
      ctx.font = "10px sans-serif"
      ctx.fillText(`${data[index]} reports`, legendX + 25, y + 24)
    })

    // Add hover effect
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top

      // Calculate distance from center
      const dx = mouseX - centerX
      const dy = mouseY - centerY
      const distance = Math.sqrt(dx * dx + dy * dy)

      // Check if mouse is inside the pie chart
      if (distance <= radius) {
        // Calculate angle
        let angle = Math.atan2(dy, dx)
        if (angle < 0) angle += 2 * Math.PI

        // Find which slice the angle corresponds to
        let startAngle = 0
        let hoveredIndex = -1

        for (let i = 0; i < data.length; i++) {
          const sliceAngle = (data[i] / total) * 2 * Math.PI
          if (angle >= startAngle && angle <= startAngle + sliceAngle) {
            hoveredIndex = i
            break
          }
          startAngle += sliceAngle
        }

        if (hoveredIndex !== -1) {
          // Redraw chart
          ctx.clearRect(0, 0, canvas.width, canvas.height)

          // Draw title again
          ctx.fillStyle = textColor
          ctx.font = "bold 16px sans-serif"
          ctx.textAlign = "center"
          ctx.fillText("Crime Reports by Region", canvas.width / 2, 20)

          // Draw pie slices with hover effect
          startAngle = 0
          data.forEach((value, index) => {
            const sliceAngle = (value / total) * 2 * Math.PI
            const endAngle = startAngle + sliceAngle
            const midAngle = startAngle + sliceAngle / 2

            // Create 3D effect with gradient
            const gradient = ctx.createRadialGradient(
              centerX,
              centerY,
              0,
              centerX,
              centerY,
              radius + (index === hoveredIndex ? 10 : 0),
            )
            gradient.addColorStop(0, colors[index % colors.length])
            gradient.addColorStop(
              1,
              isDark ? adjustColor(colors[index % colors.length], -20) : adjustColor(colors[index % colors.length], 20),
            )

            // Draw main slice with "pull out" effect for hovered slice
            const offsetX = index === hoveredIndex ? Math.cos(midAngle) * 10 : 0
            const offsetY = index === hoveredIndex ? Math.sin(midAngle) * 10 : 0

            ctx.beginPath()
            ctx.moveTo(centerX + offsetX, centerY + offsetY)
            ctx.arc(centerX + offsetX, centerY + offsetY, radius, startAngle, endAngle)
            ctx.closePath()
            ctx.fillStyle = gradient
            ctx.fill()

            // Add shadow/highlight for 3D effect
            ctx.beginPath()
            ctx.moveTo(centerX + offsetX, centerY + offsetY)
            ctx.arc(centerX + offsetX, centerY + offsetY, radius, startAngle, endAngle)
            ctx.closePath()
            ctx.lineWidth = 2
            ctx.strokeStyle = isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.1)"
            ctx.stroke()

            // Draw slice label
            const labelRadius = radius * 0.7
            const labelX = centerX + offsetX + Math.cos(midAngle) * labelRadius
            const labelY = centerY + offsetY + Math.sin(midAngle) * labelRadius

            if (sliceAngle > 0.2) {
              ctx.fillStyle = "#ffffff"
              ctx.font = index === hoveredIndex ? "bold 14px sans-serif" : "bold 12px sans-serif"
              ctx.textAlign = "center"
              ctx.textBaseline = "middle"
              ctx.fillText(`${Math.round((value / total) * 100)}%`, labelX, labelY)
            }

            startAngle = endAngle
          })

          // Draw legend
          regions.forEach((region, index) => {
            const y = legendY + index * legendItemHeight

            // Draw color box
            ctx.fillStyle = colors[index % colors.length]
            ctx.fillRect(legendX, y, 15, 15)

            // Add border
            ctx.strokeStyle = isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.1)"
            ctx.lineWidth = 1
            ctx.strokeRect(legendX, y, 15, 15)

            // Draw region name with highlight for hovered slice
            ctx.fillStyle = index === hoveredIndex ? colors[index % colors.length] : textColor
            ctx.font = index === hoveredIndex ? "bold 12px sans-serif" : "12px sans-serif"
            ctx.textAlign = "left"
            ctx.fillText(region, legendX + 25, y + 12)

            // Draw value
            ctx.fillStyle = isDark ? "#a1a1aa" : "#6b7280"
            ctx.font = index === hoveredIndex ? "bold 10px sans-serif" : "10px sans-serif"
            ctx.fillText(`${data[index]} reports`, legendX + 25, y + 24)
          })

          // Show tooltip
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
          ctx.strokeStyle = colors[hoveredIndex % colors.length]
          ctx.lineWidth = 2
          ctx.strokeRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight)

          // Draw tooltip text
          ctx.fillStyle = isDark ? "#e5e7eb" : "#374151"
          ctx.font = "bold 14px sans-serif"
          ctx.textAlign = "center"
          ctx.fillText(regions[hoveredIndex], tooltipX + tooltipWidth / 2, tooltipY + 20)

          ctx.font = "12px sans-serif"
          ctx.fillText(
            `${data[hoveredIndex]} reports (${Math.round((data[hoveredIndex] / total) * 100)}%)`,
            tooltipX + tooltipWidth / 2,
            tooltipY + 40,
          )
        }
      } else {
        // Redraw normal chart if mouse is outside
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Draw title again
        ctx.fillStyle = textColor
        ctx.font = "bold 16px sans-serif"
        ctx.textAlign = "center"
        ctx.fillText("Crime Reports by Region", canvas.width / 2, 20)

        // Draw pie slices
        startAngle = 0
        data.forEach((value, index) => {
          const sliceAngle = (value / total) * 2 * Math.PI
          const endAngle = startAngle + sliceAngle
          const midAngle = startAngle + sliceAngle / 2

          // Create 3D effect with gradient
          const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius)
          gradient.addColorStop(0, colors[index % colors.length])
          gradient.addColorStop(
            1,
            isDark ? adjustColor(colors[index % colors.length], -20) : adjustColor(colors[index % colors.length], 20),
          )

          // Draw main slice
          ctx.beginPath()
          ctx.moveTo(centerX, centerY)
          ctx.arc(centerX, centerY, radius, startAngle, endAngle)
          ctx.closePath()
          ctx.fillStyle = gradient
          ctx.fill()

          // Add shadow/highlight for 3D effect
          ctx.beginPath()
          ctx.moveTo(centerX, centerY)
          ctx.arc(centerX, centerY, radius, startAngle, endAngle)
          ctx.closePath()
          ctx.lineWidth = 2
          ctx.strokeStyle = isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.1)"
          ctx.stroke()

          // Draw slice label
          const labelRadius = radius * 0.7
          const labelX = centerX + Math.cos(midAngle) * labelRadius
          const labelY = centerY + Math.sin(midAngle) * labelRadius

          if (sliceAngle > 0.2) {
            ctx.fillStyle = "#ffffff"
            ctx.font = "bold 12px sans-serif"
            ctx.textAlign = "center"
            ctx.textBaseline = "middle"
            ctx.fillText(`${Math.round((value / total) * 100)}%`, labelX, labelY)
          }

          startAngle = endAngle
        })

        // Draw legend
        regions.forEach((region, index) => {
          const y = legendY + index * legendItemHeight

          // Draw color box
          ctx.fillStyle = colors[index % colors.length]
          ctx.fillRect(legendX, y, 15, 15)

          // Add border
          ctx.strokeStyle = isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.1)"
          ctx.lineWidth = 1
          ctx.strokeRect(legendX, y, 15, 15)

          // Draw region name
          ctx.fillStyle = textColor
          ctx.font = "12px sans-serif"
          ctx.textAlign = "left"
          ctx.fillText(region, legendX + 25, y + 12)

          // Draw value
          ctx.fillStyle = isDark ? "#a1a1aa" : "#6b7280"
          ctx.font = "10px sans-serif"
          ctx.fillText(`${data[index]} reports`, legendX + 25, y + 24)
        })
      }
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
