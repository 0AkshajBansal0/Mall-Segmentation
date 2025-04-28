"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { runModel } from "@/lib/api"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Save, Play, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ModelSettings() {
  const router = useRouter()
  const [settings, setSettings] = useState({
    clusters: 5,
    maxIterations: 300,
    algorithm: "auto",
    randomState: 42,
    normalize: true,
    features: ["annual_income", "spending_score", "age"],
  })

  const [saving, setSaving] = useState(false)
  const [running, setRunning] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSave = async () => {
    try {
      setSaving(true)
      setError(null)

      // In a real app, we would save the settings to a backend
      // For now, we'll just simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError("Failed to update model settings. Please try again.")
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handleRunModel = async () => {
    try {
      setRunning(true)
      setError(null)

      await runModel(settings)

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

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="clusters">Number of Clusters (K)</Label>
          <div className="flex items-center gap-4">
            <Slider
              id="clusters"
              min={2}
              max={10}
              step={1}
              value={[settings.clusters]}
              onValueChange={(value) => setSettings({ ...settings, clusters: value[0] })}
              className="flex-1"
            />
            <span className="w-8 text-center">{settings.clusters}</span>
          </div>
          <p className="text-sm text-muted-foreground">The number of clusters to form and centroids to generate</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="max-iterations">Max Iterations</Label>
          <Input
            id="max-iterations"
            type="number"
            min={100}
            max={1000}
            value={settings.maxIterations}
            onChange={(e) => setSettings({ ...settings, maxIterations: Number.parseInt(e.target.value) })}
          />
          <p className="text-sm text-muted-foreground">Maximum number of iterations for the k-means algorithm</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="algorithm">Algorithm</Label>
          <Select value={settings.algorithm} onValueChange={(value) => setSettings({ ...settings, algorithm: value })}>
            <SelectTrigger id="algorithm">
              <SelectValue placeholder="Select algorithm" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">Auto</SelectItem>
              <SelectItem value="full">Full</SelectItem>
              <SelectItem value="elkan">Elkan</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">The algorithm to use for clustering</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="random-state">Random State</Label>
          <Input
            id="random-state"
            type="number"
            min={0}
            value={settings.randomState}
            onChange={(e) => setSettings({ ...settings, randomState: Number.parseInt(e.target.value) })}
          />
          <p className="text-sm text-muted-foreground">Seed for random number generation (for reproducibility)</p>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="normalize"
            checked={settings.normalize}
            onCheckedChange={(checked) => setSettings({ ...settings, normalize: checked })}
          />
          <Label htmlFor="normalize">Normalize Data</Label>
        </div>
        <p className="text-sm text-muted-foreground">
          Standardize features by removing the mean and scaling to unit variance
        </p>

        <div className="space-y-2">
          <Label>Features to Use</Label>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="feature-age"
                checked={settings.features.includes("age")}
                onCheckedChange={(checked) => {
                  const newFeatures = checked
                    ? [...settings.features, "age"]
                    : settings.features.filter((f) => f !== "age")
                  setSettings({ ...settings, features: newFeatures })
                }}
              />
              <Label htmlFor="feature-age">Age</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="feature-income"
                checked={settings.features.includes("annual_income")}
                onCheckedChange={(checked) => {
                  const newFeatures = checked
                    ? [...settings.features, "annual_income"]
                    : settings.features.filter((f) => f !== "annual_income")
                  setSettings({ ...settings, features: newFeatures })
                }}
              />
              <Label htmlFor="feature-income">Annual Income</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="feature-spending"
                checked={settings.features.includes("spending_score")}
                onCheckedChange={(checked) => {
                  const newFeatures = checked
                    ? [...settings.features, "spending_score"]
                    : settings.features.filter((f) => f !== "spending_score")
                  setSettings({ ...settings, features: newFeatures })
                }}
              />
              <Label htmlFor="feature-spending">Spending Score</Label>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Select which features to use for clustering</p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 text-green-800 border-green-200">
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>Model settings updated successfully.</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={handleSave} disabled={saving} className="flex-1">
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Settings
            </>
          )}
        </Button>

        <Button onClick={handleRunModel} disabled={running} className="flex-1" variant="default">
          {running ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Running...
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Run Model
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
