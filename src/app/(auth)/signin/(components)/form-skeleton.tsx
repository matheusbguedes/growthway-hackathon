import { Skeleton } from "@/components/ui/skeleton";

export default function FormSkeleton() {
  return (
    <div className="w-full max-w-md flex flex-col gap-6">
      <Skeleton className="md:hidden size-20 rounded-lg mx-auto" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-10 w-32 hidden md:block" />
        <Skeleton className="h-4 w-64 hidden md:block" />
      </div>
      <div className="grid gap-4 px-4 md:px-0">
        <div className="space-y-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-10 w-full mt-3 rounded-3xl" />
      </div>
    </div>
  );
}