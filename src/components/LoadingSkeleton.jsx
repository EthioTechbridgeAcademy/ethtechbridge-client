export function CourseCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-4 animate-pulse">
      <div className="aspect-video w-full bg-slate-200 rounded-xl" />
      <div className="space-y-2">
        <div className="h-4 w-1/3 bg-slate-200 rounded" />
        <div className="h-6 w-3/4 bg-slate-200 rounded" />
        <div className="h-4 w-full bg-slate-200 rounded" />
        <div className="h-4 w-2/3 bg-slate-200 rounded" />
      </div>
      <div className="pt-2 flex justify-between">
        <div className="h-8 w-1/3 bg-slate-200 rounded-lg" />
        <div className="h-8 w-1/3 bg-slate-200 rounded-lg" />
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-pulse">
      <div className="h-10 w-1/3 bg-slate-200 rounded" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 bg-slate-200 rounded-2xl" />
        ))}
      </div>
      <div className="h-64 bg-slate-200 rounded-2xl" />
    </div>
  );
}

