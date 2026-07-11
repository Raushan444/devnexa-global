export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-[#050816]">
      {/* Hero */}
      <div className="pt-32 pb-16 px-6 text-center">
        <div className="h-4 w-24 mx-auto rounded-full bg-white/5 animate-pulse mb-4" />
        <div className="h-16 w-2/3 max-w-xl mx-auto rounded-xl bg-white/5 animate-pulse mb-4" />
        <div className="h-6 w-96 mx-auto rounded bg-white/5 animate-pulse" />
      </div>

      {/* Blog grid skeleton */}
      <div className="py-12 px-6 max-w-6xl mx-auto">
        {/* Filter tabs */}
        <div className="flex justify-center gap-3 mb-12">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-8 w-20 rounded-full bg-white/5 animate-pulse" />
          ))}
        </div>

        {/* Featured post */}
        <div className="rounded-3xl border border-white/5 bg-white/[0.02] overflow-hidden mb-8 animate-pulse">
          <div className="h-72 bg-white/5" />
          <div className="p-8 space-y-3">
            <div className="h-6 w-2/3 rounded bg-white/5" />
            <div className="h-4 w-full rounded bg-white/5" />
            <div className="h-4 w-3/4 rounded bg-white/5" />
            <div className="h-4 w-32 rounded bg-white/5 mt-4" />
          </div>
        </div>

        {/* Card grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-3xl border border-white/5 bg-white/[0.02] overflow-hidden animate-pulse">
              <div className="h-40 bg-white/5" />
              <div className="p-5 space-y-3">
                <div className="h-3 w-16 rounded bg-white/5" />
                <div className="h-5 w-3/4 rounded bg-white/5" />
                <div className="h-4 w-full rounded bg-white/5" />
                <div className="h-4 w-5/6 rounded bg-white/5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
