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
  CalendarDays,
  LayoutDashboard,
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
    href: "/student",
    icon: User2,
  },
];

export function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  return (
    <aside className="fixed left-0 flex h-screen w-56 flex-col border-r border-border bg-white">
      <div className="flex h-16 shrink-0 items-center px-4">
        <Link href="/" className="w-full flex items-center">
          <Image src="/logo.png" alt="Logo" width={176} height={176} className="w-28 object-contain" />
        </Link>
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-3">
        {routes.map((route) => {
          const isActive = pathname === route.href;
          const Icon = route.icon;
          return (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <Icon className="size-4 shrink-0" />
              {route.label}
            </Link>
          );
        })}
      </nav>
      <div className="shrink-0 border-t border-border p-3">
        <DropdownMenu>
          <DropdownMenuTrigger className="w-full outline-none">
            <div className="flex w-full cursor-pointer items-center gap-2.5 rounded-md px-3 py-2 transition-colors hover:bg-accent">
              <Avatar className="size-8 shrink-0">
                <AvatarImage
                  src={session?.user?.image ?? ""}
                  alt={session?.user?.name ?? ""}
                />
                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                  {session?.user?.name?.charAt(0) ?? "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 flex-1 flex-col items-start">
                <span className="truncate text-sm font-medium text-foreground">
                  {session?.user?.name ?? "Usuário"}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {session?.user?.email ?? ""}
                </span>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-52" align="start" side="right">
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