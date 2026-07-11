export default function PortfolioLoading() {
  return (
    <div className="min-h-screen bg-[#050816]">
      {/* Hero */}
      <div className="pt-32 pb-16 px-6 text-center">
        <div className="h-4 w-20 mx-auto rounded-full bg-white/5 animate-pulse mb-4" />
        <div className="h-16 w-3/4 max-w-2xl mx-auto rounded-xl bg-white/5 animate-pulse mb-4" />
        <div className="h-6 w-96 mx-auto rounded bg-white/5 animate-pulse" />
      </div>

      {/* Portfolio grid skeleton */}
      <div className="py-12 px-6 max-w-7xl mx-auto">
        {/* Filter tabs */}
        <div className="flex justify-center gap-3 mb-12">
          {["All", "Web App", "Mobile", "AI/ML", "API", "E-Commerce"].map((tab) => (
            <div key={tab} className="h-8 w-20 rounded-full bg-white/5 animate-pulse" />
          ))}
        </div>

        {/* Project cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-3xl border border-white/5 bg-white/[0.02] overflow-hidden animate-pulse"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {/* Gradient header placeholder */}
              <div className="h-32 bg-gradient-to-r from-white/5 to-white/[0.02]" />

              <div className="p-6 space-y-3">
                <div className="flex justify-between">
                  <div className="space-y-1.5">
                    <div className="h-5 w-32 rounded bg-white/5" />
                    <div className="h-3 w-16 rounded bg-white/5" />
                  </div>
                  <div className="flex gap-2">
                    <div className="h-7 w-7 rounded-lg bg-white/5" />
                    <div className="h-7 w-7 rounded-lg bg-white/5" />
                  </div>
                </div>
                <div className="h-4 w-full rounded bg-white/5" />
                <div className="h-4 w-5/6 rounded bg-white/5" />

                {/* Tech badges */}
                <div className="flex gap-1.5 flex-wrap pt-1">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div key={j} className="h-6 w-16 rounded-md bg-white/5" />
                  ))}
                </div>

                {/* Meta */}
                <div className="flex gap-4 pt-1">
                  <div className="h-3 w-16 rounded bg-white/5" />
                  <div className="h-3 w-16 rounded bg-white/5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
