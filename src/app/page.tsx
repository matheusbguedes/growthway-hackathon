"use client";

import { Button } from "@/components/ui/button";
import { LogOutIcon } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";

export default function Home() {
  const { data: session } = useSession();
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-4 border border-zinc-200 rounded-lg p-4">
        {session?.user?.image && (
          <Image src={session?.user?.image} alt="Avatar" width={100} height={100} className="rounded-full" />
        )}
        <h1 className="text-2xl font-bold">{session?.user?.name}</h1>
        <Button variant="destructive" className="w-full cursor-pointer" onClick={() => signOut()}>
          Sair <LogOutIcon className="size-4" />
        </Button>
      </div>
    </div>
  );
}
