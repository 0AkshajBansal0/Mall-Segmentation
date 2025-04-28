"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ClusterChart from "@/components/cluster-chart"
import CustomerTable from "@/components/customer-table"
import ClusterMetrics from "@/components/cluster-metrics"
import ClusterChart3D from "@/components/cluster-chart-3d"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { fetchSegmentationResults } from "@/lib/api"
import type { SegmentationResult } from "@/lib/types"
import { AlertCircle, BarChart3, BarChart4, Users } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import CustomerDistribution from "@/components/customer-distribution"

export default function Dashboard() {
  const [data, setData] = useState<SegmentationResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const results = await fetchSegmentationResults()
        setData(results)
        setError(null)
      } catch (err) {
        setError("Failed to load segmentation data. Please ensure your model is connected properly.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <div className="flex h-[600px] items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading segmentation data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error Loading Data</AlertTitle>
        <AlertDescription>
          <p>{error}</p>
          <p className="mt-4">Please check your model connection in the API route and ensure your server is running.</p>
        </AlertDescription>
      </Alert>
    )
  }

  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Data Available</CardTitle>
        </CardHeader>
        <CardContent>
          <p>No segmentation data is available. Please upload customer data and run the model.</p>
        </CardContent>
      </Card>
    )
  }

  // Check if we have age data for 3D visualization
  const has3DData = data.clusters.length > 0 && "age" in data.clusters[0]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.customers.length}</div>
            <p className="text-xs text-muted-foreground">Across {data.metrics.length} distinct segments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Spending Score</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(data.customers.reduce((sum, c) => sum + c.spendingScore, 0) / data.customers.length).toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">Out of 100 possible points</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Annual Income</CardTitle>
            <BarChart4 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(data.customers.reduce((sum, c) => sum + c.annualIncome, 0) / data.customers.length).toFixed(1)}k
            </div>
            <p className="text-xs text-muted-foreground">Average annual income in thousands</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Model Quality</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.modelInfo.silhouetteScore ? (data.modelInfo.silhouetteScore * 100).toFixed(1) + "%" : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">Silhouette score (higher is better)</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-2 lg:col-span-5">
          <CardHeader>
            <CardTitle>Customer Segments Visualization</CardTitle>
            <CardDescription>
              Visual representation of customer clusters based on spending score and annual income
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={has3DData ? "3d" : "2d"}>
              <TabsList className="mb-4">
                <TabsTrigger value="2d">2D View</TabsTrigger>
                {has3DData && <TabsTrigger value="3d">3D View</TabsTrigger>}
              </TabsList>
              <TabsContent value="2d" className="h-[400px]">
                <ClusterChart data={data.clusters} />
              </TabsContent>
              {has3DData && (
                <TabsContent value="3d" className="h-[400px]">
                  <ClusterChart3D data={data.clusters} />
                </TabsContent>
              )}
            </Tabs>
          </CardContent>
        </Card>

        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Cluster Metrics</CardTitle>
            <CardDescription>Key metrics for each customer segment</CardDescription>
          </CardHeader>
          <CardContent>
            <ClusterMetrics metrics={data.metrics} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-2 md:col-span-1">
          <CardHeader>
            <CardTitle>Customer Distribution</CardTitle>
            <CardDescription>Distribution of customers across segments</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <CustomerDistribution data={data} />
          </CardContent>
        </Card>

        <Card className="col-span-2 md:col-span-1">
          <CardHeader>
            <CardTitle>Segment Characteristics</CardTitle>
            <CardDescription>Key characteristics of each segment</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] overflow-auto">
            <div className="space-y-4">
              {data.metrics.map((metric, index) => (
                <div key={index} className="space-y-2">
                  <h3 className="font-semibold">Segment {index + 1}</h3>
                  <p className="text-sm">{metric.description}</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center justify-between rounded-md bg-muted p-2">
                      <span className="text-muted-foreground">Size:</span>
                      <span className="font-medium">{metric.size} customers</span>
                    </div>
                    <div className="flex items-center justify-between rounded-md bg-muted p-2">
                      <span className="text-muted-foreground">Density:</span>
                      <span className="font-medium">{(metric.density * 100).toFixed(1)}%</span>
                    </div>
                    {metric.avgAge && (
                      <div className="flex items-center justify-between rounded-md bg-muted p-2">
                        <span className="text-muted-foreground">Avg. Age:</span>
                        <span className="font-medium">{metric.avgAge.toFixed(1)} years</span>
                      </div>
                    )}
                    {metric.genderDistribution && (
                      <div className="flex items-center justify-between rounded-md bg-muted p-2">
                        <span className="text-muted-foreground">Gender:</span>
                        <span className="font-medium">
                          {Object.entries(metric.genderDistribution)
                            .map(([gender, pct]) => `${gender} ${(pct * 100).toFixed(0)}%`)
                            .join(", ")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Customer Data</CardTitle>
          <CardDescription>Detailed customer information with assigned clusters</CardDescription>
        </CardHeader>
        <CardContent>
          <CustomerTable customers={data.customers} />
        </CardContent>
      </Card>
    </div>
  )
}
