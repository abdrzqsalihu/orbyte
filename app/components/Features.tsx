import { Calendar, CheckSquare, Columns, Download, LayoutDashboard, Palette, PieChart } from 'lucide-react'

const Features = () => {
    return (
        <section id="features" className="py-24 md:py-32 border-b">
            <div className="container px-4 md:px-8 max-w-7xl mx-auto">
                <div className="mb-16 max-w-2xl">
                    <h2 className="text-2xl md:text-4xl font-semibold tracking-tighter mb-4">
                        Structured for execution.
                    </h2>
                    <p className="text-muted-foreground text-sm md:text-base tracking-tight">
                        Everything you need to move work forward. A unified architecture that connects your tasks, timelines, and reporting seamlessly.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 border-x border-t border-border">

                    {/* Feature 1 */}
                    <div className="p-8 border-b md:border-r border-border hover:bg-muted/30 transition-colors duration-300 ease-out group">
                        <Columns className="w-4 h-4 md:h-5 md:w-5 mb-4 md:mb-5 text-foreground group-hover:text-primary transition-colors" strokeWidth={1.25} />
                        <h3 className="text-base font-medium mb-2 tracking-tight">Kanban Board</h3>
                        <p className="text-[13px] md:text-sm text-muted-foreground leading-relaxed">
                            Visualize your workflow. Drag and drop tasks across stages to keep projects moving with zero friction.
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="p-8 border-b md:border-r border-border bg-muted/10 hover:bg-muted/30 transition-colors duration-300 ease-out group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <PieChart strokeWidth={1.15} className="h-20 w-20 md:h-32 md:w-32" />
                        </div>
                        <LayoutDashboard className="w-4 h-4 md:h-5 md:w-5 mb-4 md:mb-5 text-foreground group-hover:text-primary transition-colors" strokeWidth={1.25} />
                        <h3 className="text-base font-medium mb-2 tracking-tight">Overview Dashboard</h3>
                        <p className="text-[13px] md:text-sm text-muted-foreground leading-relaxed">
                            Your mission control. Get instant insights into project health, recent activity, and team summaries.
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="p-8 border-b border-border hover:bg-muted/30 transition-colors duration-300 ease-out group">
                        <CheckSquare strokeWidth={1.25} className="w-4 h-4 md:h-5 md:w-5 mb-4 md:mb-5 text-foreground group-hover:text-primary transition-colors" />
                        <h3 className="text-base font-medium mb-2 tracking-tight">Tasks Management</h3>
                        <p className="text-[13px] md:text-sm text-muted-foreground leading-relaxed">
                            Create, assign, and prioritize work. Break down complex initiatives into clear, actionable sub-tasks.
                        </p>
                    </div>

                    {/* Feature 4 */}
                    <div className="p-8 border-b md:border-r border-border hover:bg-muted/30 transition-colors duration-300 ease-out group">
                        <Calendar strokeWidth={1.25} className="w-4 h-4 md:h-5 md:w-5 mb-4 md:mb-5 text-foreground group-hover:text-primary transition-colors" />
                        <h3 className="text-base  font-medium mb-2 tracking-tight">Calendar View</h3>
                        <p className="text-[13px] md:text-sm text-muted-foreground leading-relaxed">
                            Track strict deadlines and upcoming schedules. Overlay personal and team milestones in one unified view.
                        </p>
                    </div>

                    {/* Feature 5 */}
                    <div className="p-8 border-b md:border-r border-border hover:bg-muted/30 transition-colors duration-300 ease-out group">
                        <Download strokeWidth={1.25} className="w-4 h-4 md:h-5 md:w-5 mb-4 md:mb-5 text-foreground group-hover:text-primary transition-colors" />
                        <h3 className="text-base font-medium mb-2 tracking-tight">Export Functionality</h3>
                        <p className="text-[13px] md:text-sm text-muted-foreground leading-relaxed">
                            Total data portability. Instantly export your workspace data into clean Excel spreadsheets or JSON formats.
                        </p>
                    </div>

                    {/* Feature 6 */}
                    <div className="p-8 border-b border-border hover:bg-muted/30 transition-colors duration-300 ease-out group">
                        <Palette strokeWidth={1.25} className="w-4 h-4 md:h-5 md:w-5 mb-4 md:mb-5 text-foreground group-hover:text-primary transition-colors" />
                        <h3 className="text-base font-medium mb-2 tracking-tight">Appearance Customization</h3>
                        <p className="text-[13px] md:text-sm text-muted-foreground leading-relaxed">
                            Adapt the platform to your needs. Toggle light/dark themes and configure layout preferences.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Features
