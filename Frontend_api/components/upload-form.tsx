"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Upload, FileText, Check } from "lucide-react"
import { uploadCustomerData } from "@/lib/api"
import { Progress } from "@/components/ui/progress"

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fileInfo, setFileInfo] = useState<{ rows: number; columns: string[] } | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null
    setFile(selectedFile)
    setError(null)
    setSuccess(false)
    setFileInfo(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      setError("Please select a file to upload")
      return
    }

    try {
      setUploading(true)
      setError(null)
      setUploadProgress(0)

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 10
        })
      }, 300)

      const result = await uploadCustomerData(file)

      clearInterval(progressInterval)
      setUploadProgress(100)

      setSuccess(true)

      if (result.rows && result.columns) {
        setFileInfo({
          rows: result.rows,
          columns: result.columns,
        })
      }

      // Reset the file input after a delay to show the 100% progress
      setTimeout(() => {
        const fileInput = document.getElementById("customer-data") as HTMLInputElement
        if (fileInput) fileInput.value = ""
      }, 1500)
    } catch (err: any) {
      setError(err.message || "Failed to upload file. Please ensure it's a valid CSV file.")
      console.error(err)
      setUploadProgress(0)
    } finally {
      setUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="customer-data">Upload Customer Data (CSV)</Label>
        <div className="flex items-center gap-2">
          <Input id="customer-data" type="file" accept=".csv" onChange={handleFileChange} className="flex-1" />
          <Button type="submit" disabled={uploading || !file}>
            {uploading ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </>
            )}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Upload a CSV file with customer data. The file should include columns for customer ID, gender, age, annual
          income, and spending score.
        </p>
      </div>

      {uploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Uploading...</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}

      {file && !success && (
        <div className="flex items-center p-4 border rounded-md bg-muted/50">
          <FileText className="h-6 w-6 mr-2 text-muted-foreground" />
          <div>
            <p className="font-medium">{file.name}</p>
            <p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
          </div>
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 text-green-800 border-green-200">
          <Check className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>
            <p>File uploaded successfully. You can now run the model to see the segmentation results.</p>
            {fileInfo && (
              <div className="mt-2 text-sm">
                <p>Detected {fileInfo.rows} customers with the following attributes:</p>
                <p className="font-mono mt-1">{fileInfo.columns.join(", ")}</p>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

      <div className="border p-4 rounded-md bg-amber-50 text-amber-800 border-amber-200">
        <h3 className="font-medium mb-2">Sample Data Format</h3>
        <pre className="text-xs overflow-x-auto p-2 bg-white/50 rounded border border-amber-200">
          {`CustomerID,Gender,Age,Annual Income (k$),Spending Score (1-100)
1,Male,19,15,39
2,Male,21,15,81
3,Female,20,16,6
4,Female,23,16,77
5,Female,31,17,40`}
        </pre>
      </div>
    </form>
  )
}
