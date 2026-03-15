"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  CalendarDays,
  LogOut,
  Settings,
  User2,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const routes = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Agenda",
    href: "/agenda",
    icon: CalendarDays,
  },
  {
    label: "Alunos",
    href: "/students",
    icon: User2,
  }
];

export function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-sidebar-border bg-white">
      <div className="flex h-16 shrink-0 py-12 px-2 items-center">
        <Link href="/dashboard" className="flex items-center no-underline">
          <Image
            src="/logo.png"
            alt="Logo"
            width={160}
            height={160}
            className="object-contain"
          />
        </Link>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
        {routes.map((route) => {
          const isActive = pathname === route.href;
          const Icon = route.icon;
          return (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors text-lg",
                isActive
                  ? "bg-primary/10 text-sidebar-accent-foreground text-primary"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground text-muted-foreground",
              )}
            >
              <Icon
                className={cn(
                  "size-8 shrink-0",
                  isActive ? "text-primary" : "text-muted-foreground",
                )}
              />
              {route.label}
            </Link>
          );
        })}
      </nav>

      <div className="shrink-0 border-t border-sidebar-border p-3">
        <DropdownMenu>
          <DropdownMenuTrigger className="w-full">
            <div className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-sidebar-accent/50">
              <Avatar className="size-9">
                <AvatarImage
                  src={session?.user?.image ?? ""}
                  alt={session?.user?.name ?? ""}
                  className="grayscale"
                />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {session?.user?.name?.charAt(0) ?? "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 flex-1 flex-col items-start overflow-hidden text-left">
                <span className="truncate text-sm font-medium text-sidebar-foreground">
                  {session?.user?.name ?? "Usuário"}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {session?.user?.email ?? ""}
                </span>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="start" side="right">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
              <DropdownMenuItem>
                <User2 className="size-4" />
                Perfil
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="size-4" />
                Configurações
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={() => signOut()}>
              <LogOut className="size-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}
