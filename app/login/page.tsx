"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Zap } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

function GoogleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className="mr-2 h-4 w-4"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOAuthLoading, setIsOAuthLoading] = useState(false);

  const supabase = createClient();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
      // setError(error.message);
      setIsLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    toast.loading("Signing in with Google...");
    setIsOAuthLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    toast.dismiss();
    setIsOAuthLoading(false);
  };

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Branding/Visual */}
      <div className="relative hidden flex-col bg-muted p-10 lg:flex dark:border-r overflow-hidden">
        {/* Abstract Gradient Background */}
        <div
          className="absolute inset-0 z-0 opacity-40 dark:opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 20%, hsl(var(--primary)) 0%, transparent 40%), 
                          radial-gradient(circle at 80% 80%, hsl(var(--primary)) 0%, transparent 40%)`,
          }}
        />

        {/* Content stays on top with z-10 */}
        <div className="relative z-10 flex items-center text-lg font-medium">
          <Zap className="mr-2 h-6 w-6 text-primary" />
          Orbyte
        </div>

        <div className="relative z-10 mt-auto">
          <blockquote className="space-y-4">
            <p className="text-3xl font-medium tracking-tight leading-tight">
              The central orbit for your entire workflow.
            </p>
            <p className="text-lg text-muted-foreground font-light">
              A task management platform designed to help you organize your day,
              hit your milestones, and execute every project with absolute
              precision.
            </p>
          </blockquote>
        </div>
      </div>

      {/* Login Form */}
      <div className="flex flex-col items-center justify-center p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          {/* Header */}
          <div className="flex flex-col space-y-1 md:space-y-2 text-left">
            <h1 className="text-xl md:text-3xl font-semibold tracking-tight">
              Welcome back
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email to sign in to your workspace
            </p>
          </div>

          {/* OAuth Section */}
          <div className="grid gap-4">
            <Button
              variant="outline"
              onClick={handleGoogleSignIn}
              disabled={isLoading || isOAuthLoading}
              className="h-10 md:h-11 text-xs md:text-sm hover:bg-transparent hover:opacity-80"
            >
              {isOAuthLoading ? (
                <Loader2 className="mr-2 h-3.5 w-3.5 md:h-4 md:w-4 animate-spin" />
              ) : (
                <GoogleIcon />
              )}
              Continue with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-[11px] md:text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or use email
                </span>
              </div>
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleSignIn} className="grid gap-4">
            {/* {error && (
              <Alert variant="destructive" className="py-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">{error}</AlertDescription>
              </Alert>
            )} */}

            <div className="grid gap-2">
              <Label htmlFor="email" className="text-xs md:text-sm">
                Email
              </Label>
              <Input
                id="email"
                placeholder="name@orbyte.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={isLoading || isOAuthLoading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="md:h-11 h-10 border-muted-foreground/20 text-sm"
              />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs md:text-sm">
                  Password
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-primary hover:underline underline-offset-4"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                disabled={isLoading || isOAuthLoading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="md:h-11 h-10 border-muted-foreground/20 text-sm"
              />
            </div>

            <Button
              disabled={isLoading || isOAuthLoading}
              className="md:h-11 h-10 font-medium text-[13px] md:text-sm"
            >
              {isLoading && (
                <Loader2 className="mr-2 h-3.5 w-3.5 md:h-4 md:w-4 animate-spin" />
              )}
              Sign In with Email
            </Button>
          </form>

          {/* Footer */}
          <p className="px-8 text-center text-[13px] md:text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="hover:text-brand underline underline-offset-4"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
