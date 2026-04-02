import { Calendar, FileSpreadsheet } from 'lucide-react'
import React from 'react'

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
                    <div className="md:col-span-2 md:row-span-2 border border-border bg-background p-8 flex flex-col justify-between hover:border-foreground/20 transition-all duration-300 ease-out hover:scale-[1.01] group overflow-hidden">
                        <div>
                            <h3 className="text-xl font-medium tracking-tight mb-2">Stay on top with Overview Dashboard</h3>
                            <p className="text-sm text-muted-foreground">Monitor progress, identify blockers, and review pending tasks to keep yourself aligned.</p>
                        </div>
                        <div className="mt-8 border border-border rounded-md bg-muted/30 flex-1 relative overflow-hidden flex flex-col justify-end p-4">
                            <div className="space-y-3 w-full">
                                <div className="h-8 w-full border border-border bg-background rounded flex items-center px-3 gap-3">
                                    <div className="h-3 w-3 rounded-full bg-primary"></div>
                                    <div className="h-2 w-24 bg-muted-foreground/30 rounded"></div>
                                </div>
                                <div className="h-8 w-3/4 border border-border bg-background rounded flex items-center px-3 gap-3 opacity-70">
                                    <div className="h-3 w-3 rounded-full border border-muted-foreground/50"></div>
                                    <div className="h-2 w-32 bg-muted-foreground/20 rounded"></div>
                                </div>
                                <div className="h-8 w-5/6 border border-border bg-background rounded flex items-center px-3 gap-3 opacity-40">
                                    <div className="h-3 w-3 rounded-full border border-muted-foreground/50"></div>
                                    <div className="h-2 w-20 bg-muted-foreground/20 rounded"></div>
                                </div>
                            </div>
                        </div>
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
    )
}

export default Platform
