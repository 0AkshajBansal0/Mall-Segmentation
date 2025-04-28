export interface CustomerData {
  customerId: number
  gender?: string
  age?: number
  annualIncome: number
  spendingScore: number
  cluster: number
}

export interface ClusterData {
  annualIncome: number
  spendingScore: number
  age?: number
  cluster: number
  isCentroid: boolean
}

export interface ClusterMetric {
  size: number
  avgIncome: number
  avgSpending: number
  avgAge?: number
  density: number
  description: string
  silhouette?: number
  variance?: number
  genderDistribution?: Record<string, number>
}

export interface SegmentationResult {
  customers: CustomerData[]
  clusters: ClusterData[]
  metrics: ClusterMetric[]
  modelInfo: {
    algorithm: string
    k: number
    iterations: number
    features: string[]
    silhouetteScore?: number
  }
}

export interface ModelSettings {
  clusters: number
  maxIterations: number
  algorithm: string
  randomState: number
  normalize: boolean
  features: string[]
}
