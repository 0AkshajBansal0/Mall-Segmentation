"use client"

import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, RefreshCw } from "lucide-react"
import { findOptimalK, runModel } from "@/lib/api"
import { useRouter } from "next/navigation"

export default function ClusterOptimization() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<any>(null)
  const [running, setRunning] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const result = await findOptimalK()
        setData(result)
        setError(null)
      } catch (err: any) {
        setError(err.message || "Failed to find optimal K. Please try again.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

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

    // Draw background grid
    ctx.beginPath()
    ctx.strokeStyle = "#e5e7eb"
    ctx.lineWidth = 0.5

    // Vertical grid lines
    for (let i = 0; i <= 10; i++) {
      const x = 60 + (width - 120) * (i / 10)
      ctx.moveTo(x, 40)
      ctx.lineTo(x, height - 60)
    }

    // Horizontal grid lines
    for (let i = 0; i <= 10; i++) {
      const y = height - 60 - (height - 100) * (i / 10)
      ctx.moveTo(60, y)
      ctx.lineTo(width - 60, y)
    }
    ctx.stroke()

    // Draw axes
    ctx.beginPath()
    ctx.strokeStyle = "#9ca3af"
    ctx.lineWidth = 1.5

    // X-axis
    ctx.moveTo(60, height - 60)
    ctx.lineTo(width - 60, height - 60)

    // Y-axis
    ctx.moveTo(60, 40)
    ctx.lineTo(60, height - 60)
    ctx.stroke()

    // Axis labels
    ctx.fillStyle = "#4b5563"
    ctx.font = "12px Inter, sans-serif"
    ctx.textAlign = "center"
    ctx.fillText("Number of Clusters (K)", width / 2, height - 20)

    ctx.save()
    ctx.translate(20, height / 2)
    ctx.rotate(-Math.PI / 2)
    ctx.textAlign = "center"
    ctx.fillText("Metric Value", 0, 0)
    ctx.restore()

    // Draw data
    const k_values = data.k_values
    const inertia_values = data.inertia_values
    const silhouette_values = data.silhouette_values

    // Normalize inertia values to fit in the chart
    const maxInertia = Math.max(...inertia_values)
    const normalizedInertia = inertia_values.map((v) => v / maxInertia)

    // Draw inertia line (elbow method)
    ctx.beginPath()
    ctx.strokeStyle = "#3b82f6" // Blue
    ctx.lineWidth = 2

    for (let i = 0; i < k_values.length; i++) {
      const x = 60 + (width - 120) * ((k_values[i] - k_values[0]) / (k_values[k_values.length - 1] - k_values[0]))
      const y = height - 60 - (height - 100) * normalizedInertia[i]

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }

      // Draw point
      ctx.fillStyle = "#3b82f6"
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.stroke()

    // Draw silhouette line
    ctx.beginPath()
    ctx.strokeStyle = "#f43f5e" // Rose
    ctx.lineWidth = 2

    for (let i = 0; i < k_values.length; i++) {
      const x = 60 + (width - 120) * ((k_values[i] - k_values[0]) / (k_values[k_values.length - 1] - k_values[0]))
      const y = height - 60 - (height - 100) * silhouette_values[i]

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }

      // Draw point
      ctx.fillStyle = "#f43f5e"
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.stroke()

    // Mark optimal K points
    const optimalKElbow = data.optimal_k_elbow
    const optimalKSilhouette = data.optimal_k_silhouette

    // Elbow method optimal K
    const elbowIndex = k_values.indexOf(optimalKElbow)
    if (elbowIndex !== -1) {
      const x = 60 + (width - 120) * ((optimalKElbow - k_values[0]) / (k_values[k_values.length - 1] - k_values[0]))
      const y = height - 60 - (height - 100) * normalizedInertia[elbowIndex]

      ctx.beginPath()
      ctx.arc(x, y, 8, 0, Math.PI * 2)
      ctx.fillStyle = "rgba(59, 130, 246, 0.2)" // Light blue
      ctx.fill()
      ctx.strokeStyle = "#3b82f6"
      ctx.lineWidth = 2
      ctx.stroke()

      ctx.fillStyle = "#3b82f6"
      ctx.font = "bold 12px Inter, sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(`Elbow: K=${optimalKElbow}`, x, y - 15)
    }

    // Silhouette method optimal K
    const silhouetteIndex = k_values.indexOf(optimalKSilhouette)
    if (silhouetteIndex !== -1) {
      const x =
        60 + (width - 120) * ((optimalKSilhouette - k_values[0]) / (k_values[k_values.length - 1] - k_values[0]))
      const y = height - 60 - (height - 100) * silhouette_values[silhouetteIndex]

      ctx.beginPath()
      ctx.arc(x, y, 8, 0, Math.PI * 2)
      ctx.fillStyle = "rgba(244, 63, 94, 0.2)" // Light rose
      ctx.fill()
      ctx.strokeStyle = "#f43f5e"
      ctx.lineWidth = 2
      ctx.stroke()

      ctx.fillStyle = "#f43f5e"
      ctx.font = "bold 12px Inter, sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(`Silhouette: K=${optimalKSilhouette}`, x, y - 15)
    }

    // Add legend
    const legendX = width - 200
    const legendY = 60

    // Inertia legend
    ctx.beginPath()
    ctx.strokeStyle = "#3b82f6"
    ctx.lineWidth = 2
    ctx.moveTo(legendX, legendY)
    ctx.lineTo(legendX + 30, legendY)
    ctx.stroke()

    ctx.fillStyle = "#3b82f6"
    ctx.beginPath()
    ctx.arc(legendX + 15, legendY, 4, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = "#4b5563"
    ctx.font = "12px Inter, sans-serif"
    ctx.textAlign = "left"
    ctx.fillText("Inertia (Elbow Method)", legendX + 40, legendY + 4)

    // Silhouette legend
    ctx.beginPath()
    ctx.strokeStyle = "#f43f5e"
    ctx.lineWidth = 2
    ctx.moveTo(legendX, legendY + 25)
    ctx.lineTo(legendX + 30, legendY + 25)
    ctx.stroke()

    ctx.fillStyle = "#f43f5e"
    ctx.beginPath()
    ctx.arc(legendX + 15, legendY + 25, 4, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = "#4b5563"
    ctx.font = "12px Inter, sans-serif"
    ctx.textAlign = "left"
    ctx.fillText("Silhouette Score", legendX + 40, legendY + 25 + 4)

    // X-axis labels
    for (let i = 0; i < k_values.length; i++) {
      const x = 60 + (width - 120) * ((k_values[i] - k_values[0]) / (k_values[k_values.length - 1] - k_values[0]))

      ctx.fillStyle = "#4b5563"
      ctx.font = "12px Inter, sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(k_values[i].toString(), x, height - 40)
    }

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [data])

  const handleRunWithOptimalK = async () => {
    if (!data || !data.recommended_k) return

    try {
      setRunning(true)
      setError(null)

      await runModel({
        clusters: data.recommended_k,
        maxIterations: 300,
        algorithm: "auto",
        randomState: 42,
        normalize: true,
        features: ["annual_income", "spending_score", "age"],
      })

      // Redirect to dashboard to see results
      router.push("/")
      router.refresh()
    } catch (err: any) {
      setError(err.message || "Failed to run model. Please try again.")
      console.error(err)
    } finally {
      setRunning(false)
    }
  }

  if (loading) {
    return (
      <div className="h-[400px] flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          <p>{error}</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={() => window.location.reload()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  if (!data) {
    return (
      <div className="text-center">
        <p>No data available.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="h-[300px]">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-lg border bg-blue-50 text-blue-800 border-blue-200">
          <h3 className="font-bold mb-2">Elbow Method</h3>
          <p className="text-sm">
            The elbow method looks for the point where adding more clusters doesn't significantly reduce the inertia
            (within-cluster sum of squares).
          </p>
          <p className="mt-2 font-medium">Optimal K: {data.optimal_k_elbow}</p>
        </div>

        <div className="p-4 rounded-lg border bg-rose-50 text-rose-800 border-rose-200">
          <h3 className="font-bold mb-2">Silhouette Method</h3>
          <p className="text-sm">
            The silhouette method measures how similar an object is to its own cluster compared to other clusters.
            Higher values are better.
          </p>
          <p className="mt-2 font-medium">Optimal K: {data.optimal_k_silhouette}</p>
        </div>
      </div>

      <div className="p-4 rounded-lg border bg-emerald-50 text-emerald-800 border-emerald-200">
        <h3 className="font-bold mb-2">Recommended Number of Clusters</h3>
        <p className="text-sm">Based on both methods, the recommended number of clusters for your data is:</p>
        <p className="mt-2 text-xl font-bold text-center">K = {data.recommended_k}</p>

        <Button
          className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700"
          onClick={handleRunWithOptimalK}
          disabled={running}
        >
          {running ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Running Model...
            </>
          ) : (
            <>Run Model with Optimal K</>
          )}
        </Button>
      </div>
    </div>
  )
}
