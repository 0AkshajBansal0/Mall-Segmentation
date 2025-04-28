export default function LoadingDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-[90px] rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="flex flex-col space-y-1.5 p-6">
              <div className="h-5 w-1/2 animate-pulse rounded-md bg-muted"></div>
              <div className="h-7 w-1/3 animate-pulse rounded-md bg-muted"></div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-2 lg:col-span-5 h-[450px] rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6">
            <div className="h-6 w-1/3 animate-pulse rounded-md bg-muted"></div>
            <div className="h-4 w-1/2 animate-pulse rounded-md bg-muted"></div>
          </div>
          <div className="p-6">
            <div className="h-[350px] animate-pulse rounded-md bg-muted"></div>
          </div>
        </div>

        <div className="col-span-2 h-[450px] rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6">
            <div className="h-6 w-1/2 animate-pulse rounded-md bg-muted"></div>
            <div className="h-4 w-2/3 animate-pulse rounded-md bg-muted"></div>
          </div>
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded-md bg-muted"></div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2].map((i) => (
          <div key={i} className="h-[350px] rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="flex flex-col space-y-1.5 p-6">
              <div className="h-6 w-1/3 animate-pulse rounded-md bg-muted"></div>
              <div className="h-4 w-1/2 animate-pulse rounded-md bg-muted"></div>
            </div>
            <div className="p-6">
              <div className="h-[250px] animate-pulse rounded-md bg-muted"></div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <div className="h-6 w-1/4 animate-pulse rounded-md bg-muted"></div>
          <div className="h-4 w-1/3 animate-pulse rounded-md bg-muted"></div>
        </div>
        <div className="p-6">
          <div className="h-[300px] animate-pulse rounded-md bg-muted"></div>
        </div>
      </div>
    </div>
  )
}
