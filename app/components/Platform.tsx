"use client";

import React from "react";
import { motion } from "framer-motion";
import { Calendar, FileSpreadsheet, Check, Activity, BarChart2 } from "lucide-react";
const AnimatedDashboard = () => {
    // Master loop duration for perfectly synced keyframes
    const LOOP_DURATION = 8;
    return (
        <div className="mt-8 border border-border rounded-md bg-muted/5 flex-1 relative overflow-hidden flex flex-col p-4">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-border/50">
                <div className="flex items-center gap-2">
                    <motion.div
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="h-2 w-2 rounded-full bg-primary"
                    />
                    <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider font-semibold">
                        Active Workflow
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <BarChart2 className="h-3 w-3 text-muted-foreground" />
                    <motion.span
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="text-xs font-mono font-semibold"
                    >
                        ON TRACK
                    </motion.span>
                </div>
            </div>
            <div className="space-y-2.5 flex-1">
                <motion.div
                    animate={{
                        borderColor: ["var(--border)", "var(--border)", "transparent", "transparent", "var(--border)"],
                        backgroundColor: ["transparent", "transparent", "rgba(var(--primary), 0.05)", "rgba(var(--primary), 0.05)", "transparent"],
                    }}
                    transition={{ duration: LOOP_DURATION, repeat: Infinity, times: [0, 0.4, 0.5, 0.9, 1] }}
                    className="h-10 w-full border rounded flex items-center px-3 gap-3 relative overflow-hidden"
                >
                    {/* Animated Background Progress */}
                    <motion.div
                        animate={{ width: ["0%", "100%", "100%", "100%", "0%"] }}
                        transition={{ duration: LOOP_DURATION, repeat: Infinity, times: [0, 0.4, 0.5, 0.9, 1], ease: "easeInOut" }}
                        className="absolute left-0 top-0 bottom-0 bg-primary/10 z-0"
                    />

                    {/* Checkbox */}
                    <div className="h-4 w-4 border border-border bg-background rounded-sm flex items-center justify-center relative z-10">
                        <motion.div
                            animate={{ scale: [0, 0, 1, 1, 0] }}
                            transition={{ duration: LOOP_DURATION, repeat: Infinity, times: [0, 0.4, 0.45, 0.9, 1] }}
                        >
                            <Check className="h-3 w-3 text-primary" strokeWidth={3} />
                        </motion.div>
                    </div>

                    <motion.span
                        animate={{ opacity: [1, 1, 0.5, 0.5, 1] }}
                        transition={{ duration: LOOP_DURATION, repeat: Infinity, times: [0, 0.4, 0.5, 0.9, 1] }}
                        className="text-sm font-medium z-10 truncate"
                    >
                        Review Campaign Assets
                    </motion.span>
                </motion.div>

                <div className="h-10 w-full border border-border bg-background rounded flex items-center px-3 gap-3 relative overflow-hidden">
                    <motion.div
                        animate={{ width: ["30%", "85%", "85%", "30%", "30%"] }}
                        transition={{ duration: LOOP_DURATION, repeat: Infinity, times: [0, 0.5, 0.8, 0.9, 1], ease: "easeInOut" }}
                        className="absolute left-0 top-0 bottom-0 bg-muted/50 z-0 border-r border-border"
                    />
                    <div className="h-4 w-4 border border-border rounded-sm flex items-center justify-center relative z-10">
                        {/* Spinning active indicator */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="h-2 w-2 border-t-[1.5px] border-r-[1.5px] border-primary rounded-full"
                        />
                    </div>
                    <span className="text-sm font-medium z-10 truncate">
                        Draft Q3 Strategy Report
                    </span>
                </div>

                <motion.div
                    animate={{
                        opacity: [0, 0, 1, 1, 0],
                        y: [10, 10, 0, 0, 10]
                    }}
                    transition={{ duration: LOOP_DURATION, repeat: Infinity, times: [0, 0.6, 0.7, 0.9, 1], ease: "easeOut" }}
                    className="h-10 w-[85%] border border-border border-dashed bg-background rounded flex items-center px-3 gap-3 relative overflow-hidden opacity-0"
                >
                    <div className="h-4 w-4 border border-border/50 rounded-sm z-10" />
                    <span className="text-sm font-medium text-muted-foreground z-10 truncate">
                        Update Client Pipeline
                    </span>
                </motion.div>

            </div>

            <div className="pt-3 mt-2 border-t border-border/50 flex justify-between items-end">
                <div className="flex gap-1 items-end h-4">
                    {[40, 70, 45, 90, 65].map((height, i) => (
                        <motion.div
                            key={i}
                            animate={{ height: [`${height}%`, `${height + 20}%`, `${height - 10}%`, `${height}%`] }}
                            transition={{ duration: 3, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
                            className="w-1.5 bg-border rounded-t-sm"
                        />
                    ))}
                </div>
                <div className="text-[10px] font-mono text-muted-foreground uppercase flex items-center gap-1">
                    <Activity className="h-3 w-3" />
                    Weekly Activity
                </div>
            </div>
        </div>
    );
};

const Platform = () => {
    return (
        <section id="platform" className="py-24 md:py-32 bg-muted/10 border-b">
            <div className="container px-4 md:px-8 max-w-7xl mx-auto">
                <div className="mb-16">
                    <h2 className="text-3xl md:text-4xl font-semibold tracking-tighter mb-4 text-center md:text-left">
                        Powerful tools, perfectly organized.
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[240px]">
                    <div className="md:col-span-2 md:row-span-2 border border-border bg-background p-8 flex flex-col justify-between hover:border-foreground/20 transition-all duration-300 ease-out group overflow-hidden">
                        <div>
                            <h3 className="text-xl font-medium tracking-tight mb-2">Stay on top with Overview Dashboard</h3>
                            <p className="text-sm text-muted-foreground">
                                Monitor progress, identify blockers, and review pending tasks to keep yourself aligned.
                            </p>
                        </div>
                        <AnimatedDashboard />
                    </div>

                    {/* Stat/Deadline Tile */}
                    <div className="border border-border bg-background p-8 flex flex-col justify-center hover:border-foreground/20 transition-all duration-300 ease-out hover:scale-[1.01]">
                        <Calendar className="h-6 w-6 mb-4 text-foreground" strokeWidth={1.25} />
                        <h3 className="text-lg font-medium tracking-tight mb-1">Track deadlines with Calendar</h3>
                        <p className="text-sm text-muted-foreground">Map out milestones and ensure timely delivery.</p>
                    </div>

                    {/* Data Export Tile */}
                    <div className="border border-border bg-background p-8 flex flex-col hover:border-foreground/20 transition-all duration-300 ease-out hover:scale-[1.01]">
                        <FileSpreadsheet className="h-6 w-6 mb-4 text-muted-foreground mt-7" strokeWidth={1.25} />
                        <h3 className="text-lg font-medium tracking-tight mb-1">Export your data</h3>
                        <p className="text-sm text-muted-foreground">Generate Excel reports and JSON backups with one click.</p>
                    </div>

                    {/* Kanban/Customization */}
                    <div className="md:col-span-2 border border-border bg-primary p-8 flex flex-col justify-between text-primary-foreground hover:scale-[1.01] transition-all duration-300 ease-out">
                        <div>
                            <h3 className="text-xl font-medium tracking-tight mb-2 text-white">Visualize your workflow with Kanban</h3>
                            <p className="text-sm text-white/80">
                                A highly responsive drag-and-drop board. Customize your workspace stages to match exactly how your team operates.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Platform;