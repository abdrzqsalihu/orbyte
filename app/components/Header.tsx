'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
    Zap,
    X,
    LayoutDashboard,
    Layers,
    LogIn,
    ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Header() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    useEffect(() => {
        if (sidebarOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [sidebarOpen]);

    const closeSidebar = () => setSidebarOpen(false);

    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.2 } },
    };

    const drawerVariants = {
        hidden: { x: '100%' },
        visible: {
            x: 0,
            transition: { type: 'tween', ease: [0.16, 1, 0.3, 1], duration: 0.4 }
        },
        exit: {
            x: '100%',
            transition: { type: 'tween', ease: [0.7, 0, 0.84, 0], duration: 0.3 }
        }
    };

    const navListVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05, delayChildren: 0.1 }
        }
    };

    const navItemVariants = {
        hidden: { opacity: 0, x: 10 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { type: 'tween', ease: 'easeOut', duration: 0.2 }
        }
    };

    return (
        <header className="sticky top-0 z-40 w-full border-b border-border bg-background">
            <div className="flex h-16 items-center justify-between px-4 md:px-8 max-w-7xl mx-auto">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 font-semibold text-lg tracking-tight">
                    <Zap className="h-5 w-5 text-primary" strokeWidth={1.25} />
                    <span>Orbyte</span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
                    <Link href="#features" className="hover:text-foreground transition-colors duration-200">
                        Features
                    </Link>
                    <Link href="#platform" className="hover:text-foreground transition-colors duration-200">
                        Platform
                    </Link>
                    <div className="flex items-center gap-4 ml-4 border-l pl-8 border-border">
                        <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="hover:bg-muted text-sm font-medium shadow-none rounded-sm"
                        >
                            <Link href="/login">Log in</Link>
                        </Button>
                        <Button size="sm" asChild className="rounded-sm shadow-none font-medium">
                            <Link href="/dashboard">Get Started</Link>
                        </Button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div
                    onClick={() => setSidebarOpen(true)}
                    className="md:hidden p-1.5 -mr-2 text-foreground hover:bg-muted/50 rounded-sm transition-colors"
                    aria-label="Open menu"
                >

                    <button className="menu-button menu__icon">
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {sidebarOpen && (
                    <>
                        {/* Dimmer Backdrop */}
                        <motion.div
                            variants={backdropVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            onClick={closeSidebar}
                            className="fixed inset-0 z-50 bg-foreground/10 md:hidden"
                        />

                        {/* Drawer Panel */}
                        <motion.div
                            variants={drawerVariants as any}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="fixed inset-y-0 right-0 z-[60] w-[85%] sm:w-[380px] border-l border-border bg-background flex flex-col md:hidden shadow-2xl shadow-background"
                        >
                            <div className="flex h-16 items-center justify-between px-4 border-b border-border/50 bg-background">
                                <Link href="/" className="flex items-center gap-2 font-semibold text-sm tracking-tight" onClick={closeSidebar}>
                                    <Zap className="h-[18px] w-[18px] text-primary" strokeWidth={1.5} />
                                    <span>Orbyte</span>
                                </Link>
                                <button
                                    onClick={closeSidebar}
                                    className="p-1.5 -mr-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-sm transition-colors"
                                    aria-label="Close menu"
                                >
                                    <X className="h-5 w-5" strokeWidth={1.25} />
                                </button>
                            </div>

                            {/* Main Navigation Links */}
                            <motion.nav
                                variants={navListVariants}
                                initial="hidden"
                                animate="visible"
                                className="flex-1 px-4 py-6 flex flex-col gap-1 overflow-y-auto"
                            >
                                <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-2 px-4">
                                    Navigation
                                </div>

                                <motion.div variants={navItemVariants as any}>
                                    <Link
                                        href="#features"
                                        onClick={closeSidebar}
                                        className="flex items-center gap-3 px-4 py-3.5 text-[13px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40 rounded-sm transition-colors"
                                    >
                                        <LayoutDashboard className="h-[17px] w-[17px] opacity-70" strokeWidth={1.5} />
                                        Features
                                    </Link>
                                </motion.div>

                                <motion.div variants={navItemVariants as any}>
                                    <Link
                                        href="#platform"
                                        onClick={closeSidebar}
                                        className="flex items-center gap-3 px-4 py-3.5 text-[13px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40 rounded-sm transition-colors"
                                    >
                                        <Layers className="h-[17px] w-[17px] opacity-70" strokeWidth={1.5} />
                                        Platform
                                    </Link>
                                </motion.div>
                            </motion.nav>

                            <div className="p-4 border-t border-border bg-muted/5 space-y-3">
                                <Button
                                    variant="outline"
                                    className="w-full justify-start shadow-none h-12 rounded-sm border-border bg-background text-foreground hover:bg-muted/50 mb-2"
                                    asChild
                                >
                                    <Link href="/login" onClick={closeSidebar} className='text-xs'>
                                        <LogIn className="h-[16px] w-[16px] mr-3 opacity-70" strokeWidth={1.25} />
                                        Log in to Workspace
                                    </Link>
                                </Button>
                                <Button
                                    className="w-full justify-between shadow-none h-12 rounded-sm bg-foreground text-background hover:bg-foreground/90 hover:scale-[1.01] transition-all"
                                    asChild
                                >
                                    <Link href="/dashboard" onClick={closeSidebar} className='text-xs'>
                                        Get Started - Free
                                        <ArrowRight className="h-[16px] w-[16px]" />
                                    </Link>
                                </Button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </header>
    );
}