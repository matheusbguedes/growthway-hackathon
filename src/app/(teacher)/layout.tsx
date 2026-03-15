import { Sidebar } from "@/components/sidebar";

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="ml-56 flex-1 overflow-auto p-6 md:p-8">
        {children}
      </main>
    </div>
  );
}
