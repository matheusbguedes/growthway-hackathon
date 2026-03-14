"use client";

import {
    Avatar,
    AvatarFallback,
    AvatarImage
} from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { LogOutIcon } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const routes = [
    {
        label: "Dashboard",
        href: "/dashboard",
    }
]

export function Header() {
    const { data: session } = useSession();
    const pathname = usePathname();
    return (
        <header className="flex items-center justify-between px-8 h-16">
            <Link href="#" className="flex items-center no-underline">
                <Image src="/logo.png" alt="Logo" width={176} height={176} className="w-24 object-contain" />
            </Link>
            <nav className="flex items-center gap-8">
                {routes.map((route) => {
                    const isActive = pathname === route.href;
                    return (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn("text-sm font-medium text-foreground", isActive && "text-primary")}>
                            {route.label}
                        </Link>
                    )
                })}
            </nav>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <div className="flex items-center gap-2.5 cursor-pointer">
                        <div className="flex flex-col text-right">
                            <span className="text-sm font-medium text-foreground leading-tight">{session?.user?.name}</span>
                            <span className="text-xs text-muted-foreground leading-tight">{session?.user?.email}</span>
                        </div>
                        <Avatar className="size-10">
                            <AvatarImage
                                src={session?.user?.image ?? ""}
                                alt={session?.user?.name ?? ""}
                                className="grayscale"
                            />
                            <AvatarFallback>{session?.user?.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-40" align="end">
                    <DropdownMenuGroup>
                        <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                        <DropdownMenuItem>
                            Perfil
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive" onClick={() => signOut()}>
                        <LogOutIcon />
                        Sair
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    );
}