"use client"

import type { ClusterMetric } from "@/lib/types"
import { Progress } from "@/components/ui/progress"

interface ClusterMetricsProps {
  metrics: ClusterMetric[]
}

export default function ClusterMetrics({ metrics }: ClusterMetricsProps) {
  const colors = [
    "bg-rose-100 text-rose-800 border-rose-200",
    "bg-blue-100 text-blue-800 border-blue-200",
    "bg-amber-100 text-amber-800 border-amber-200",
    "bg-emerald-100 text-emerald-800 border-emerald-200",
    "bg-violet-100 text-violet-800 border-violet-200",
    "bg-pink-100 text-pink-800 border-pink-200",
    "bg-cyan-100 text-cyan-800 border-cyan-200",
    "bg-lime-100 text-lime-800 border-lime-200",
    "bg-indigo-100 text-indigo-800 border-indigo-200",
    "bg-teal-100 text-teal-800 border-teal-200",
  ]

  const progressColors = [
    "bg-rose-500",
    "bg-blue-500",
    "bg-amber-500",
    "bg-emerald-500",
    "bg-violet-500",
    "bg-pink-500",
    "bg-cyan-500",
    "bg-lime-500",
    "bg-indigo-500",
    "bg-teal-500",
  ]

  return (
    <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
      {metrics.map((metric, index) => (
        <div
          key={index}
          className={`p-4 rounded-lg border ${colors[index % colors.length]} transition-all hover:shadow-md`}
        >
          <h3 className="font-bold mb-2 flex items-center justify-between">
            <span>Cluster {index + 1}</span>
            <span className="text-xs font-normal px-2 py-1 rounded-full bg-white/50">{metric.size} customers</span>
          </h3>

          <div className="space-y-3 text-sm">
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-medium">Income:</span>
                <span>${metric.avgIncome.toFixed(1)}k</span>
              </div>
              <Progress
                value={metric.avgIncome}
                max={150}
                className="h-2"
                indicatorClassName={progressColors[index % progressColors.length]}
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="font-medium">Spending:</span>
                <span>{metric.avgSpending.toFixed(1)}/100</span>
              </div>
              <Progress
                value={metric.avgSpending}
                max={100}
                className="h-2"
                indicatorClassName={progressColors[index % progressColors.length]}
              />
            </div>

            {metric.avgAge && (
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium">Age:</span>
                  <span>{metric.avgAge.toFixed(1)} years</span>
                </div>
                <Progress
                  value={metric.avgAge}
                  max={80}
                  className="h-2"
                  indicatorClassName={progressColors[index % progressColors.length]}
                />
              </div>
            )}

            <div>
              <div className="flex justify-between mb-1">
                <span className="font-medium">Density:</span>
                <span>{(metric.density * 100).toFixed(1)}%</span>
              </div>
              <Progress
                value={metric.density * 100}
                max={100}
                className="h-2"
                indicatorClassName={progressColors[index % progressColors.length]}
              />
            </div>
          </div>

          <div className="mt-3 text-xs">
            <p>{metric.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
