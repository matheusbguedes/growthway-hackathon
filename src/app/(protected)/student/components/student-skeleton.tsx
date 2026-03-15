export function StudentSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-7 w-24 rounded-md bg-zinc-200" />
        <div className="h-8 w-8 rounded-md bg-zinc-200" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-zinc-200" />
                <div className="space-y-2">
                  <div className="h-4 w-32 rounded bg-zinc-200" />
                  <div className="h-5 w-14 rounded-full bg-zinc-100" />
                </div>
              </div>
              <div className="size-8 rounded-md bg-zinc-100" />
            </div>

            <div className="space-y-2">
              <div className="h-4 w-48 rounded bg-zinc-100" />
              <div className="h-4 w-32 rounded bg-zinc-100" />
            </div>

            <div className="flex items-center justify-between border-t border-zinc-100 pt-3">
              <div className="h-3 w-16 rounded bg-zinc-100" />
              <div className="h-5 w-16 rounded-full bg-zinc-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}