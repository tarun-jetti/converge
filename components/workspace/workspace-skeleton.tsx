import { Skeleton } from '@/components/ui/skeleton';
import { Layers } from 'lucide-react';

export function WorkspaceSkeleton() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
      {/* Top Navbar Skeleton */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/85 dark:bg-slate-950/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
              <Layers className="size-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white leading-none">
                Converge
              </span>
              <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium tracking-wide uppercase mt-0.5">
                Workspace
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-24 rounded-lg" />
            <Skeleton className="size-8 rounded-full" />
          </div>
        </div>
      </header>

      {/* Body Skeleton */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="space-y-3">
          <Skeleton className="h-4 w-40 rounded" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-200/80 dark:border-slate-800/80">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-48 rounded" />
            <Skeleton className="h-8 w-32 rounded-lg" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
