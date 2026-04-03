"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Terminal, Check, ListTodo, Calendar, LayoutDashboard } from "lucide-react";
import { motion } from "framer-motion";

const Cta = () => {
    return (
        <section className="py-24 md:py-32 bg-background">
            <div className="container px-4 md:px-8 max-w-7xl mx-auto">
                {/* Framed Structural Container */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="relative border border-border bg-background flex flex-col lg:flex-row overflow-hidden"
                >
                    <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                    <div className="relative z-10 flex-1 p-10 md:p-16 lg:p-20 border-b lg:border-b-0 lg:border-r border-border bg-background">

                        <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 border border-border bg-muted/20 text-xs font-mono font-medium text-muted-foreground uppercase tracking-widest">
                            <span className="h-2 w-2 bg-primary rounded-full animate-pulse"></span>
                            Workspace Ready
                        </div>

                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tighter mb-6 text-foreground leading-[1.1]">
                            Bring clarity to
                            every project.
                        </h2>

                        <p className="text-muted-foreground text-sm md:text-base tracking-tight max-w-lg mb-10 leading-relaxed">
                            Stop scattering your work across chaotic channels. Centralize your deadlines, organize your sprints, and give your team a single source of truth.
                        </p>

                        {/* Micro-recap of product value */}
                        <div className="space-y-4">
                            {[
                                { icon: LayoutDashboard, text: "Unlimited Kanban boards" },
                                { icon: Calendar, text: "Global calendar sync" },
                                { icon: ListTodo, text: "Advanced task dependencies" },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 text-sm font-medium text-foreground">
                                    <div className="flex items-center justify-center h-6 w-6 border border-border bg-muted/30">
                                        <item.icon className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.5} />
                                    </div>
                                    {item.text}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Actions */}
                    <div className="relative z-10 w-full lg:w-[420px] bg-muted/10 p-10 md:p-16 flex flex-col justify-center items-start lg:items-center text-left lg:text-center">

                        <h3 className="text-xl font-medium tracking-tight mb-2 w-full">
                            Start building today
                        </h3>
                        <p className="text-sm text-muted-foreground mb-8 w-full">
                            Free for individuals. No credit card required to start organizing.
                        </p>

                        <div className="w-full space-y-4 flex flex-col items-center">
                            <Button
                                size="lg"
                                className="w-full h-12 text-sm font-medium bg-foreground text-background hover:bg-foreground/90 shadow-none rounded-sm hover:scale-[1.02] transition-all duration-200 ease-out group"
                                asChild
                            >
                                <Link href="/dashboard">
                                    Create Workspace
                                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </Button>

                            <Button
                                size="lg"
                                variant="outline"
                                className="w-full h-12 text-sm font-medium border-border bg-background hover:bg-muted hover:text-foreground shadow-none rounded-sm hover:scale-[1.02] transition-all duration-200 ease-out"
                                asChild
                            >
                                <Link href="#features">
                                    <Terminal className="mr-2 h-4 w-4 text-muted-foreground" />
                                    Explore Features
                                </Link>
                            </Button>
                        </div>

                        {/* Security / Trust micro-copy */}
                        <div className="mt-8 flex items-center justify-center lg:justify-center gap-2 text-xs font-medium text-muted-foreground w-full">
                            <Check className="h-3.5 w-3.5" />
                            <span>Enterprise-grade security</span>
                        </div>

                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Cta;