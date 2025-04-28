import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, FileText, Database, BarChart, Server } from "lucide-react"

export default function Documentation() {
  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-slate-950/80 sticky top-0 z-10">
        <div className="container flex h-16 items-center px-4">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="ml-4 text-2xl font-bold">Documentation</h1>
        </div>
      </header>

      <div className="container flex-1 space-y-6 p-8 pt-6">
        <h2 className="text-3xl font-bold tracking-tight">Mall Customer Segmentation</h2>
        <p className="text-lg text-muted-foreground">
          Complete guide to the Mall Customer Segmentation application
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <FileText className="h-8 w-8 text-primary" />
              <div>
                <CardTitle>Data Format</CardTitle>
                <CardDescription>Required data structure</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Your customer data should be in CSV format with the following columns:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>CustomerID (integer): Unique identifier for each customer</li>
                <li>Gender (string): Customer gender (Male/Female)</li>
                <li>Age (integer): Customer age in years</li>
                <li>Annual Income (k$): Annual income in thousands of dollars</li>
                <li>Spending Score (1-100): Score between 1-100 based on customer behavior</li>
              </ul>
              <div className="mt-4 rounded-md bg-muted p-4">
                <h4 className="font-medium mb-2">Sample Data</h4>
                <pre className="text-xs overflow-x-auto">
                  {`CustomerID,Gender,Age,Annual Income (k$),Spending Score (1-100)
1,Male,19,15,39
2,Male,21,15,81
3,Female,20,16,6
4,Female,23,16,77
5,Female,31,17,40`}
                </pre>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Server className="h-8 w-8 text-primary" />
              <div>
                <CardTitle>API Setup</CardTitle>
                <CardDescription>Setting up the backend API</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4">To run the backend Flask API:</p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Navigate to the <code>model</code> directory</li>
                <li>Install dependencies: <code>pip install -r requirements.txt</code></li>
                <li>Run the API server: <code>python api.py</code></li>
                <li>The API will be available at <code>http://localhost:5000</code></li>
              </ol>
              <div className="mt-4 rounded-md bg-muted p-4">
                <h4 className="font-medium mb-2">API Endpoints</h4>
                <ul className="text-xs space-y-1">
                  <li><code>POST /api/upload</code> - Upload customer data</li>
                  <li><code>POST /api/run-model</code> - Run the clustering model</li>
                  <li><code>GET /api/segmentation</code> - Get segmentation results</li>
                  <li><code>GET /api/export-csv</code> - Export results as CSV</li>
                  <li><code>GET /api/export-plot</code> - Export visualization</li>
                  <li><code>GET /api/optimal-k</code> - Find optimal number of clusters</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Database className="h-8 w-8 text-primary" />
              <div>
                <CardTitle>K-means Clustering</CardTitle>
                <CardDescription>Understanding the algorithm</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4">This application uses K-means clustering to segment mall customers based on their characteristics:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Algorithm:</strong> K-means clustering groups data points into K clusters by minimizing the variance within each cluster</li>
                <li><strong>Features:</strong> By default, we use Annual Income and Spending Score as the main features</li>
                <li><strong>Normalization:</strong> Features are standardized to have mean=0 and variance=1</li>
                <li><strong>Optimal K:</strong> The application can determine the optimal number of clusters using the Elbow Method and Silhouette Score</li>
              </ul>
              <div className="mt-4 rounded-md bg-muted p-4">
                <h4 className="font-medium mb-2">Evaluation Metrics</h4>
                <ul className="text-xs space-y-1">
                  <li><strong>Inertia:</strong> Sum of squared distances to centroids (lower is better)</li>
                  <li><strong>Silhouette Score:</strong> Measure of how similar objects are to their own cluster compared to other clusters (higher is better)</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <BarChart className="h-8 w-8 text-primary" />
              <div>
                <CardTitle>Visualization Features</CardTitle>
                <CardDescription>Understanding the dashboard</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4">The dashboard provides several visualizations to understand customer segments:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>2D Cluster Chart:</strong> Visualizes customers based on Annual Income and Spending Score</li>
                <li><strong>3D Cluster Chart:</strong> Adds Age as a third dimension when available</li>
                <li><strong>Cluster Metrics:</strong> Shows key statistics for each cluster</li>
                <li><strong>Customer Distribution:</strong> Displays the proportion of customers in each segment</li>
                <li><strong>Customer Table:</strong> Provides detailed data for each customer with filtering and sorting</li>
              </ul>
              <div className="mt-4 rounded-md bg-muted p-4">
                <h4 className="font-medium mb-2">Interactivity</h4>
                <ul className="text-xs space-y-1">
                  <li>Rotate the 3D visualization by clicking and dragging</li>
                  <li>Filter customers by cluster or search terms</li>
                  <li>Sort the customer table by any column</li>
                  <li>Export data as CSV or visualization as PNG</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Model Integration</CardTitle>
            <CardDescription>How to connect your own model to this frontend</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>
                If you want to use your own K-means clustering model instead of the provided one, you have several options:
              </p>
              
              <div className="rounded-md border p-4">
                <h3 className="font-semibold mb-2">Option 1: Modify the Flask API</h3>
                <p className="text-sm mb-2">
                  You can modify the provided Flask API to use your own model implementation:
                </p>
                <ol className="list-decimal pl-6 text-sm space-y-1">
                  <li>Replace the <code>MallCustomerSegmentation</code> class in <code>mall_segmentation.py</code> with your own implementation</li>
                  <li>Ensure your model returns data in the same format expected by the frontend</li>
                  <li>Keep the API endpoints the same to maintain compatibility</li>
                </ol>
              </div>
              
              <div className="rounded-md border p-4">
                <h3 className="font-semibold mb-2">Option 2: Create a New API</h3>
                <p className="text-sm mb-2">
                  You can create your own API that implements the same endpoints:
                </p>
                <ol className="list-decimal pl-6 text-sm space-y-1">
                  <li>Create an API with the same endpoints (<code>/api/upload</code>, <code>/api/run-model</code\
