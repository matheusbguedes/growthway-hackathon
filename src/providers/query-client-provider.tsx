"use client";

import { queryClient } from "@/lib/query-client";
import { QueryClientProvider as Provider } from "@tanstack/react-query";

export function QueryClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Provider client={queryClient}>{children}</Provider>;
}
