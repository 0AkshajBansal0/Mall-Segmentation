"use client"

import { useEffect, useRef } from "react"
import type { ClusterData } from "@/lib/types"

interface ClusterChartProps {
  data: ClusterData[]
}

export default function ClusterChart({ data }: ClusterChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || !data.length) return

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

    // Find data ranges for scaling
    const incomeValues = data.map((d) => d.annualIncome)
    const spendingValues = data.map((d) => d.spendingScore)

    const minIncome = Math.min(...incomeValues)
    const maxIncome = Math.max(...incomeValues)
    const minSpending = Math.min(...spendingValues)
    const maxSpending = Math.max(...spendingValues)

    // Scale factors
    const incomeScale = (width - 80) / (maxIncome - minIncome || 1)
    const spendingScale = (height - 80) / (maxSpending - minSpending || 1)

    // Draw background grid
    ctx.beginPath()
    ctx.strokeStyle = "#e5e7eb"
    ctx.lineWidth = 0.5

    // Vertical grid lines
    for (let i = 0; i <= 10; i++) {
      const x = 40 + (width - 80) * (i / 10)
      ctx.moveTo(x, 40)
      ctx.lineTo(x, height - 40)
    }

    // Horizontal grid lines
    for (let i = 0; i <= 10; i++) {
      const y = height - 40 - (height - 80) * (i / 10)
      ctx.moveTo(40, y)
      ctx.lineTo(width - 40, y)
    }
    ctx.stroke()

    // Draw axes
    ctx.beginPath()
    ctx.strokeStyle = "#9ca3af"
    ctx.lineWidth = 1.5

    // X-axis
    ctx.moveTo(40, height - 40)
    ctx.lineTo(width - 40, height - 40)

    // Y-axis
    ctx.moveTo(40, 40)
    ctx.lineTo(40, height - 40)
    ctx.stroke()

    // Axis labels
    ctx.fillStyle = "#4b5563"
    ctx.font = "12px Inter, sans-serif"
    ctx.textAlign = "center"
    ctx.fillText("Annual Income (k$)", width / 2, height - 10)

    ctx.save()
    ctx.translate(15, height / 2)
    ctx.rotate(-Math.PI / 2)
    ctx.textAlign = "center"
    ctx.fillText("Spending Score (1-100)", 0, 0)
    ctx.restore()

    // X-axis ticks and labels
    for (let i = 0; i <= 5; i++) {
      const value = minIncome + (maxIncome - minIncome) * (i / 5)
      const x = 40 + (width - 80) * (i / 5)

      ctx.beginPath()
      ctx.moveTo(x, height - 40)
      ctx.lineTo(x, height - 35)
      ctx.strokeStyle = "#9ca3af"
      ctx.stroke()

      ctx.fillStyle = "#4b5563"
      ctx.textAlign = "center"
      ctx.fillText(value.toFixed(0), x, height - 25)
    }

    // Y-axis ticks and labels
    for (let i = 0; i <= 5; i++) {
      const value = minSpending + (maxSpending - minSpending) * (i / 5)
      const y = height - 40 - (height - 80) * (i / 5)

      ctx.beginPath()
      ctx.moveTo(40, y)
      ctx.lineTo(35, y)
      ctx.strokeStyle = "#9ca3af"
      ctx.stroke()

      ctx.fillStyle = "#4b5563"
      ctx.textAlign = "right"
      ctx.fillText(value.toFixed(0), 30, y + 4)
    }

    // Draw data points
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

    // Draw regular points first
    const regularPoints = data.filter((d) => !d.isCentroid)
    regularPoints.forEach((point) => {
      const x = 40 + (point.annualIncome - minIncome) * incomeScale
      const y = height - 40 - (point.spendingScore - minSpending) * spendingScale

      ctx.beginPath()
      ctx.arc(x, y, 5, 0, Math.PI * 2)
      ctx.fillStyle = clusterColors[point.cluster % clusterColors.length]
      ctx.fill()
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 1
      ctx.stroke()
    })

    // Draw centroids last (larger)
    const centroids = data.filter((d) => d.isCentroid)
    centroids.forEach((point) => {
      const x = 40 + (point.annualIncome - minIncome) * incomeScale
      const y = height - 40 - (point.spendingScore - minSpending) * spendingScale

      // Draw star shape for centroids
      const spikes = 5
      const outerRadius = 10
      const innerRadius = 5

      ctx.beginPath()
      for (let i = 0; i < spikes * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius
        const angle = (Math.PI * i) / spikes - Math.PI / 2
        const pointX = x + radius * Math.cos(angle)
        const pointY = y + radius * Math.sin(angle)

        if (i === 0) {
          ctx.moveTo(pointX, pointY)
        } else {
          ctx.lineTo(pointX, pointY)
        }
      }
      ctx.closePath()

      ctx.fillStyle = clusterColors[point.cluster % clusterColors.length]
      ctx.fill()
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 2
      ctx.stroke()

      // Label centroids
      ctx.fillStyle = "#1f2937"
      ctx.font = "bold 12px Inter, sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(`Cluster ${point.cluster + 1}`, x, y - 15)
    })

    // Add legend
    const legendX = width - 150
    const legendY = 50
    const legendItemHeight = 25

    centroids.forEach((point, index) => {
      const y = legendY + index * legendItemHeight

      // Draw legend symbol
      ctx.beginPath()
      ctx.arc(legendX, y, 5, 0, Math.PI * 2)
      ctx.fillStyle = clusterColors[point.cluster % clusterColors.length]
      ctx.fill()
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 1
      ctx.stroke()

      // Draw legend text
      ctx.fillStyle = "#1f2937"
      ctx.font = "12px Inter, sans-serif"
      ctx.textAlign = "left"
      ctx.fillText(`Cluster ${point.cluster + 1}`, legendX + 15, y + 4)
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
