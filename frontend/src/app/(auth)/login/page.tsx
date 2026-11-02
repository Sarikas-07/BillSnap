"use client";

import Link from "next/link";
import { FiMail, FiLock, FiArrowRight } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  return (
    <AuthShell>
      <h1 className="font-display text-2xl font-bold text-ink">Welcome back</h1>
      <p className="mt-1.5 text-sm text-ink-soft">Log in to see today&apos;s energy snapshot.</p>

      <form
        className="mt-8 space-y-4"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="space-y-1.5">
          <Label htmlFor="email">Email address</Label>
          <div className="relative">
            <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" size={16} />
            <Input id="email" type="email" placeholder="you@example.com" className="pl-10" defaultValue="jonathan.mehta@example.com" />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link href="#" className="text-xs font-medium text-blue hover:underline">Forgot password?</Link>
          </div>
          <div className="relative">
            <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" size={16} />
            <Input id="password" type="password" placeholder="••••••••" className="pl-10" defaultValue="password123" />
          </div>
        </div>

        <Button type="submit" variant="primary" className="w-full" size="lg" asChild>
          <Link href="/dashboard">
            Log in <FiArrowRight />
          </Link>
        </Button>

        <div className="flex items-center gap-3 py-1">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-ink-faint">or continue with</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <Button type="button" variant="outline" className="w-full" size="lg">
          <FcGoogle size={18} /> Continue with Google
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-ink-soft">
        New to BillSnap?{" "}
        <Link href="/signup" className="font-medium text-blue hover:underline">Create an account</Link>
      </p>
    </AuthShell>
  );
}
