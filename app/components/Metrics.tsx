const Metrics = () => {
    return (
        <section className="border-b bg-muted/10 py-12">
            <div className="container max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 divide-x-0 md:divide-x divide-border text-center">
                    <div className="flex flex-col items-center  md:items-start px-4">
                        <div className="text-xl md:text-3xl font-semibold tracking-tighter text-foreground mb-1">50ms</div>
                        <div className="text-[10px] md:text-xs font-mono text-muted-foreground uppercase tracking-widest">Real-time Sync</div>
                    </div>
                    <div className="flex flex-col items-center md:items-start px-4">
                        <div className="text-xl md:text-3xl font-semibold tracking-tighter text-foreground mb-1">2M+</div>
                        <div className="text-[10px] md:text-xs font-mono text-muted-foreground uppercase tracking-widest">Tasks Executed</div>
                    </div>
                    <div className="flex flex-col items-center md:items-start px-4">
                        <div className="text-xl md:text-3xl font-semibold tracking-tighter text-foreground mb-1">99.99%</div>
                        <div className="text-[10px] md:text-xs font-mono text-muted-foreground uppercase tracking-widest">Uptime SLA</div>
                    </div>
                    <div className="flex flex-col items-center md:items-start px-4">
                        <div className="text-xl md:text-3xl font-semibold tracking-tighter text-foreground mb-1">Zero</div>
                        <div className="text-[10px] md:text-xs font-mono text-muted-foreground uppercase tracking-widest">Learning Curve</div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Metrics
