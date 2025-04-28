"use client"

import { useEffect, useRef } from "react"
import type { SegmentationResult } from "@/lib/types"

interface CustomerDistributionProps {
  data: SegmentationResult
}

export default function CustomerDistribution({ data }: CustomerDistributionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || !data) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions based on container
    const resizeCanvas = () => {
      const container = canvas.parentElement
      if (container) {
        canvas.width = container.clientWidth
        canvas.height = container.clientHeight
      }
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set canvas dimensions
    const width = canvas.width
    const height = canvas.height

    // Calculate cluster sizes
    const clusterSizes = data.metrics.map((metric) => metric.size)
    const totalCustomers = clusterSizes.reduce((sum, size) => sum + size, 0)

    // Colors for each cluster
    const clusterColors = [
      "#f43f5e", // Rose
      "#3b82f6", // Blue
      "#f59e0b", // Amber
      "#10b981", // Emerald
      "#8b5cf6", // Violet
      "#ec4899", // Pink
      "#06b6d4", // Cyan
      "#84cc16", // Lime
      "#6366f1", // Indigo
      "#14b8a6", // Teal
    ]

    // Draw pie chart
    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(width, height) * 0.4

    let startAngle = 0
    clusterSizes.forEach((size, index) => {
      const sliceAngle = (size / totalCustomers) * 2 * Math.PI

      // Draw slice
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle)
      ctx.closePath()

      ctx.fillStyle = clusterColors[index % clusterColors.length]
      ctx.fill()

      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 2
      ctx.stroke()

      // Add label
      const labelAngle = startAngle + sliceAngle / 2
      const labelRadius = radius * 0.7
      const labelX = centerX + Math.cos(labelAngle) * labelRadius
      const labelY = centerY + Math.sin(labelAngle) * labelRadius

      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 12px Inter, sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      // Only show label if slice is big enough
      if (sliceAngle > 0.2) {
        ctx.fillText(`${Math.round((size / totalCustomers) * 100)}%`, labelX, labelY)
      }

      startAngle += sliceAngle
    })

    // Add legend
    const legendX = width - 120
    const legendY = 20
    const legendItemHeight = 25

    clusterSizes.forEach((size, index) => {
      const y = legendY + index * legendItemHeight

      // Draw legend symbol
      ctx.beginPath()
      ctx.rect(legendX, y, 15, 15)
      ctx.fillStyle = clusterColors[index % clusterColors.length]
      ctx.fill()
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 1
      ctx.stroke()

      // Draw legend text
      ctx.fillStyle = "#1f2937"
      ctx.font = "12px Inter, sans-serif"
      ctx.textAlign = "left"
      ctx.textBaseline = "middle"
      ctx.fillText(`Cluster ${index + 1}: ${size}`, legendX + 25, y + 7.5)
    })

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [data])

  return (
    <div className="w-full h-full flex items-center justify-center">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  )
}
