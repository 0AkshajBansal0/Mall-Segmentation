import { Suspense } from "react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Dashboard from "@/components/dashboard"
import UploadForm from "@/components/upload-form"
import ModelSettings from "@/components/model-settings"
import LoadingDashboard from "@/components/loading-dashboard"
import { Download, BarChart3, FileSpreadsheet, Lightbulb } from "lucide-react"
import ClusterOptimization from "@/components/cluster-optimization"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-slate-950/80 sticky top-0 z-10">
        <div className="container flex h-16 items-center px-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Mall Customer Segmentation</h1>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <Link href="/documentation">
              <Button variant="outline">Documentation</Button>
            </Link>
            <Link href="/insights">
              <Button variant="outline">
                <Lightbulb className="mr-2 h-4 w-4" />
                Insights
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">K-means Clustering Dashboard</h2>
          <div className="flex items-center space-x-2">
            <Link href="/api/export-csv">
              <Button variant="outline" size="sm">
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            </Link>
            <Link href="/api/export-plot">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export Plot
              </Button>
            </Link>
            <Link href="/api/run-model">
              <Button>
                <span>Run Model</span>
              </Button>
            </Link>
          </div>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-4">
          <TabsList className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="upload">Upload Data</TabsTrigger>
            <TabsTrigger value="settings">Model Settings</TabsTrigger>
            <TabsTrigger value="optimization">Cluster Optimization</TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard" className="space-y-4">
            <Suspense fallback={<LoadingDashboard />}>
              <Dashboard />
            </Suspense>
          </TabsContent>
          <TabsContent value="upload" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Upload Customer Data</CardTitle>
                <CardDescription>Upload new customer data to run segmentation analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <UploadForm />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Model Settings</CardTitle>
                <CardDescription>Configure K-means clustering parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ModelSettings />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="optimization" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Cluster Optimization</CardTitle>
                <CardDescription>Find the optimal number of clusters for your data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Suspense
                  fallback={
                    <div className="h-[400px] flex items-center justify-center">
                      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                    </div>
                  }
                >
                  <ClusterOptimization />
                </Suspense>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
