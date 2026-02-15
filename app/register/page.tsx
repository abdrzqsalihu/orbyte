"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2, Zap, ArrowRight } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createClient } from "@/lib/supabase/client";

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

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOAuthLoading, setIsOAuthLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const supabase = createClient();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    setIsSubmitted(true);
  };

  const handleGoogleSignUp = async () => {
    setError(null);
    setIsOAuthLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Sidebar Section */}
      <div className="relative hidden flex-col bg-muted p-10 lg:flex dark:border-r">
        <div className="flex items-center text-lg font-medium">
          <Zap className="mr-2 h-6 w-6 text-primary" />
          Orbyte
        </div>
        <div className="mt-auto">
          <blockquote className="space-y-2">
            <p className="text-2xl font-light">
              The central orbit for your entire workflow. A high-velocity task
              management platform designed to help you organize your day, hit
              your milestones, and execute every project with absolute
              precision.
            </p>
          </blockquote>
        </div>
      </div>

      {/* Main Form Section */}
      <div className="flex flex-col items-center justify-center p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[380px]">
          {!isSubmitted ? (
            <>
              <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-3xl font-semibold tracking-tight">
                  Get Started
                </h1>
                <p className="text-sm text-muted-foreground">
                  Create your Orbyte workspace in seconds.
                </p>
              </div>

              {/* OAuth Buttons */}
              <div className="grid gap-4">
                <Button
                  variant="outline"
                  onClick={handleGoogleSignUp}
                  disabled={isLoading || isOAuthLoading}
                  className="h-11"
                >
                  {isOAuthLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <GoogleIcon />
                  )}
                  Sign up with Google
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or use your email
                    </span>
                  </div>
                </div>
              </div>

              {/* Manual Form */}
              <form onSubmit={handleSignUp} className="grid gap-4">
                {error && (
                  <Alert variant="destructive" className="py-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    placeholder="name@orbyte.com"
                    type="email"
                    required
                    disabled={isLoading || isOAuthLoading}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 border-muted-foreground/20"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    disabled={isLoading || isOAuthLoading}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 border-muted-foreground/20"
                  />
                </div>

                <Button
                  disabled={isLoading || isOAuthLoading}
                  className="h-11 font-medium"
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>

              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium text-primary hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </>
          ) : (
            /* Success State */
            <div className="flex flex-col items-center space-y-6 text-center animate-in fade-in zoom-in duration-300">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <Zap className="h-10 w-10 text-primary" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Check your email</h2>
                <p className="text-muted-foreground">
                  We&apos;ve sent a verification link to{" "}
                  <span className="font-semibold text-foreground">{email}</span>
                  .
                </p>
              </div>
              <Link
                href="/login"
                className="flex items-center text-sm font-medium text-primary hover:underline"
              >
                Back to sign in <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          )}

          {/* Legal */}
          <p className="text-[11px] text-center text-muted-foreground leading-tight px-6">
            By signing up, you agree to our{" "}
            <Link href="/terms" className="underline hover:text-primary">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline hover:text-primary">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
