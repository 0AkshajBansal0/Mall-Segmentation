import type { SegmentationResult, ModelSettings } from "./types"

// API base URL - change this to your Flask API URL
const API_BASE_URL = "http://localhost:5000"

// Function to fetch segmentation results
export async function fetchSegmentationResults(): Promise<SegmentationResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/segmentation`)

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to fetch segmentation results")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching segmentation results:", error)
    throw new Error("Failed to fetch segmentation results. Is the API server running?")
  }
}

// Function to upload customer data
export async function uploadCustomerData(file: File): Promise<any> {
  try {
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch(`${API_BASE_URL}/api/upload`, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to upload customer data")
    }

    return await response.json()
  } catch (error) {
    console.error("Error uploading customer data:", error)
    throw new Error("Failed to upload customer data. Is the API server running?")
  }
}

// Function to run the model with settings
export async function runModel(settings: ModelSettings): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/run-model`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(settings),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to run model")
    }

    return await response.json()
  } catch (error) {
    console.error("Error running model:", error)
    throw new Error("Failed to run model. Is the API server running?")
  }
}

// Function to find optimal K
export async function findOptimalK(): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/optimal-k`)

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to find optimal K")
    }

    return await response.json()
  } catch (error) {
    console.error("Error finding optimal K:", error)
    throw new Error("Failed to find optimal K. Is the API server running?")
  }
}
