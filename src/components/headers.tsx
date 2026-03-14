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
import { LogOutIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export function Header() {
    const { data: session } = useSession();
    return (
        <header className="flex items-center justify-between px-8 h-16 bg-white border-b border-gray-100">
            <Link href="#" className="flex items-center gap-2.5 no-underline">
                GROWTHWAY
            </Link>
            <nav className="flex items-center gap-8">
                <Link href="#" className="text-sm font-medium text-gray-900">Dashboard</Link>
                <Link href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Projetos</Link>
                <Link href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Relatórios</Link>
                <Link href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Configurações</Link>
            </nav>

            <DropdownMenu>
                <DropdownMenuTrigger>
                    <div className="flex items-center gap-2.5 cursor-pointer">
                        <div className="flex flex-col text-right">
                            <span className="text-sm font-medium text-gray-900 leading-tight">{session?.user?.name}</span>
                            <span className="text-xs text-gray-400 leading-tight">{session?.user?.email}</span>
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
                    <DropdownMenuItem variant="destructive">
                        <LogOutIcon />
                        Sair
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    );
}