"use client";

import Link from "next/link";
import { FiUser, FiMail, FiLock, FiArrowRight } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export default function SignupPage() {
  return (
    <AuthShell>
      <h1 className="font-display text-2xl font-bold text-ink">Create your account</h1>
      <p className="mt-1.5 text-sm text-ink-soft">Start tracking your home&apos;s electricity in minutes.</p>

      <form className="mt-8 space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-1.5">
          <Label htmlFor="name">Full name</Label>
          <div className="relative">
            <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" size={16} />
            <Input id="name" placeholder="Jonathan Mehta" className="pl-10" />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Email address</Label>
          <div className="relative">
            <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" size={16} />
            <Input id="email" type="email" placeholder="you@example.com" className="pl-10" />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" size={16} />
            <Input id="password" type="password" placeholder="Create a password" className="pl-10" />
          </div>
        </div>

        <div className="flex items-start gap-2.5 pt-1">
          <Checkbox id="terms" defaultChecked className="mt-0.5" />
          <Label htmlFor="terms" className="font-normal leading-snug text-ink-soft">
            I agree to the <Link href="#" className="text-blue hover:underline">Terms of Service</Link> and{" "}
            <Link href="#" className="text-blue hover:underline">Privacy Policy</Link>.
          </Label>
        </div>

        <Button type="submit" variant="primary" className="w-full" size="lg" asChild>
          <Link href="/dashboard">
            Create account <FiArrowRight />
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
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-blue hover:underline">Log in</Link>
      </p>
    </AuthShell>
  );
}
