"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import type { ClusterData } from "@/lib/types"

interface ClusterChart3DProps {
  data: ClusterData[]
}

export default function ClusterChart3D({ data }: ClusterChart3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [rotation, setRotation] = useState({ x: 0.5, y: 0.5 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (!canvasRef.current || !data.length) return
    if (!data[0].age) return // Ensure we have age data

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
    const ageValues = data.map((d) => d.age as number)

    const minIncome = Math.min(...incomeValues)
    const maxIncome = Math.max(...incomeValues)
    const minSpending = Math.min(...spendingValues)
    const maxSpending = Math.max(...spendingValues)
    const minAge = Math.min(...ageValues)
    const maxAge = Math.max(...ageValues)

    // 3D projection parameters
    const centerX = width / 2
    const centerY = height / 2
    const scale = Math.min(width, height) * 0.3

    // Rotation angles
    const angleX = rotation.x * Math.PI * 2
    const angleY = rotation.y * Math.PI * 2

    // Function to project 3D point to 2D
    const project = (x: number, y: number, z: number) => {
      // Normalize coordinates to [-1, 1]
      const normalizedX = ((x - minIncome) / (maxIncome - minIncome)) * 2 - 1
      const normalizedY = ((y - minSpending) / (maxSpending - minSpending)) * 2 - 1
      const normalizedZ = ((z - minAge) / (maxAge - minAge)) * 2 - 1

      // Apply rotation
      const rotX = normalizedX
      const rotY = normalizedY * Math.cos(angleX) - normalizedZ * Math.sin(angleX)
      const rotZ = normalizedY * Math.sin(angleX) + normalizedZ * Math.cos(angleX)

      const finalX = rotX * Math.cos(angleY) + rotZ * Math.sin(angleY)
      const finalZ = -rotX * Math.sin(angleY) + rotZ * Math.cos(angleY)

      // Project to 2D
      const projectedX = centerX + finalX * scale
      const projectedY = centerY + rotY * scale

      // Size based on depth
      const size = (5 * (1 + finalZ)) / 2 + 2

      return { x: projectedX, y: projectedY, size, depth: finalZ }
    }

    // Draw axes
    const drawAxes = () => {
      const axisLength = 1.2 // Slightly longer than data range

      // X-axis (Income)
      const x1 = project(-axisLength, 0, 0)
      const x2 = project(axisLength, 0, 0)

      ctx.beginPath()
      ctx.moveTo(x1.x, x1.y)
      ctx.lineTo(x2.x, x2.y)
      ctx.strokeStyle = "#9ca3af"
      ctx.lineWidth = 1.5
      ctx.stroke()

      ctx.fillStyle = "#4b5563"
      ctx.font = "12px Inter, sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("Income", x2.x + 15, x2.y)

      // Y-axis (Spending)
      const y1 = project(0, -axisLength, 0)
      const y2 = project(0, axisLength, 0)

      ctx.beginPath()
      ctx.moveTo(y1.x, y1.y)
      ctx.lineTo(y2.x, y2.y)
      ctx.strokeStyle = "#9ca3af"
      ctx.lineWidth = 1.5
      ctx.stroke()

      ctx.fillText("Spending", y2.x, y2.y - 15)

      // Z-axis (Age)
      const z1 = project(0, 0, -axisLength)
      const z2 = project(0, 0, axisLength)

      ctx.beginPath()
      ctx.moveTo(z1.x, z1.y)
      ctx.lineTo(z2.x, z2.y)
      ctx.strokeStyle = "#9ca3af"
      ctx.lineWidth = 1.5
      ctx.stroke()

      ctx.fillText("Age", z2.x + 15, z2.y)
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

    // Sort points by depth for proper rendering
    const pointsWithProjection = data.map((point) => {
      const projection = project(point.annualIncome, point.spendingScore, point.age as number)
      return { ...point, projection }
    })

    pointsWithProjection.sort((a, b) => a.projection.depth - b.projection.depth)

    // Draw axes
    drawAxes()

    // Draw regular points
    const regularPoints = pointsWithProjection.filter((d) => !d.isCentroid)
    regularPoints.forEach((point) => {
      const { x, y, size } = point.projection

      ctx.beginPath()
      ctx.arc(x, y, size, 0, Math.PI * 2)
      ctx.fillStyle = clusterColors[point.cluster % clusterColors.length]
      ctx.fill()
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 1
      ctx.stroke()
    })

    // Draw centroids
    const centroids = pointsWithProjection.filter((d) => d.isCentroid)
    centroids.forEach((point) => {
      const { x, y, size } = point.projection

      // Draw star shape for centroids
      const spikes = 5
      const outerRadius = size * 1.5
      const innerRadius = size * 0.8

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

    // Add instructions for rotation
    ctx.fillStyle = "#6b7280"
    ctx.font = "11px Inter, sans-serif"
    ctx.textAlign = "center"
    ctx.fillText("Click and drag to rotate the view", width / 2, height - 15)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [data, rotation])

  // Handle mouse events for rotation
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return
    setIsDragging(true)
    setDragStart({ x: e.clientX, y: e.clientY })
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !canvasRef.current) return

    const dx = e.clientX - dragStart.x
    const dy = e.clientY - dragStart.y

    setRotation((prev) => ({
      x: (prev.x + dy / 200) % 1,
      y: (prev.y + dx / 200) % 1,
    }))

    setDragStart({ x: e.clientX, y: e.clientY })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-move"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
    </div>
  )
}
