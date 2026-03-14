"use client";

import { Button } from "@/components/ui/button";
import { GithubIcon } from "lucide-react";
import { signIn } from "next-auth/react";

export default function SignIn() {
  const handleSignIn = async () => {
    await signIn("github", { callbackUrl: "/" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Button variant="outline" className="cursor-pointer" onClick={handleSignIn}>
        Entrar com GitHub <GithubIcon className="size-4" />
      </Button>
    </div>
  );
}