export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-32 bg-muted animate-pulse rounded" />
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 bg-muted animate-pulse rounded-lg" />
          <div className="flex-1 space-y-3">
            <div className="h-8 w-48 bg-muted animate-pulse rounded" />
            <div className="h-6 w-32 bg-muted animate-pulse rounded" />
            <div className="h-4 w-full bg-muted animate-pulse rounded" />
            <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
          </div>
        </div>
      </div>
      <div className="h-96 bg-muted animate-pulse rounded-lg" />
    </div>
  )
}
