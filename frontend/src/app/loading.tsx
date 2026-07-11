export default function Loading() {
  return (
    <div className="min-h-screen bg-[#050816] flex flex-col">
      {/* Hero skeleton */}
      <div className="relative pt-36 pb-12 px-8 max-w-[1550px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Text col */}
          <div className="lg:col-span-7 space-y-6">
            <div className="h-5 w-40 rounded-full bg-white/5 animate-pulse" />
            <div className="space-y-3">
              <div className="h-14 w-3/4 rounded-xl bg-white/5 animate-pulse" />
              <div className="h-14 w-1/2 rounded-xl bg-white/5 animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full max-w-md rounded bg-white/5 animate-pulse" />
              <div className="h-4 w-3/4 max-w-sm rounded bg-white/5 animate-pulse" />
            </div>
            <div className="flex gap-4">
              <div className="h-12 w-40 rounded-full bg-white/5 animate-pulse" />
              <div className="h-12 w-40 rounded-full bg-white/5 animate-pulse" />
            </div>
          </div>

          {/* 3D col skeleton */}
          <div className="lg:col-span-5 h-[350px] lg:h-[600px] rounded-2xl bg-gradient-to-br from-violet-900/20 to-cyan-900/20 animate-pulse" />
        </div>
      </div>

      {/* Stats skeleton */}
      <div className="py-24 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-8 rounded-2xl border border-white/5 bg-white/[0.02] animate-pulse">
              <div className="h-12 w-24 mx-auto rounded bg-white/5 mb-3" />
              <div className="h-4 w-20 mx-auto rounded bg-white/5" />
            </div>
          ))}
        </div>
      </div>

      {/* Cards skeleton */}
      <div className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="h-8 w-48 mx-auto rounded bg-white/5 animate-pulse mb-4" />
          <div className="h-4 w-80 mx-auto rounded bg-white/5 animate-pulse mb-12" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-3xl border border-white/5 bg-white/[0.02] overflow-hidden animate-pulse">
                <div className="h-32 bg-white/5" />
                <div className="p-6 space-y-3">
                  <div className="h-5 w-3/4 rounded bg-white/5" />
                  <div className="h-4 w-full rounded bg-white/5" />
                  <div className="h-4 w-2/3 rounded bg-white/5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
