'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Zap, Menu, X } from 'lucide-react';

export function Header() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background">
            <div className="flex h-16 items-center justify-between px-4 md:px-8 max-w-7xl mx-auto">
                {/* Hamburger */}
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="md:hidden p-2"
                    aria-label="Toggle sidebar"
                >
                    {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 font-semibold text-lg tracking-tight">
                    <Zap className="h-5 w-5 text-primary" strokeWidth={1.25} />
                    <span>Orbyte</span>
                </Link>

                {/* Desktop right nav */}
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
                    <Link href="#features" className="hover:text-foreground transition-colors duration-200">
                        Features
                    </Link>
                    <Link href="#platform" className="hover:text-foreground transition-colors duration-200">
                        Platform
                    </Link>
                    <div className="flex items-center gap-4 ml-4 border-l pl-8">
                        <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="hover:bg-muted text-sm font-medium shadow-none"
                        >
                            <Link href="/login">Log in</Link>
                        </Button>
                        <Button size="sm" asChild className="rounded-md shadow-none font-medium">
                            <Link href="/dashboard">Get Started</Link>
                        </Button>
                    </div>
                </div>

                {/* Mobile right buttons */}
                <div className="md:hidden flex items-center gap-2">
                    <Button variant="ghost" size="sm" asChild className="shadow-none text-xs">
                        <Link href="/login">Log in</Link>
                    </Button>
                    <Button size="sm" asChild className="rounded-md shadow-none text-xs">
                        <Link href="/register">Get Started</Link>
                    </Button>
                </div>
            </div>

            {/* Mobile sidebar */}
            {sidebarOpen && (
                <div className="md:hidden border-t bg-muted/30 px-4 py-4 space-y-2">
                    <Link href="#features" className="block px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-background rounded-md">
                        Features
                    </Link>
                    <Link href="#system" className="block px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-background rounded-md">
                        Platform
                    </Link>
                </div>
            )}
        </header>
    );
}