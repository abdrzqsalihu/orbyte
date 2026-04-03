import Globe from '@/components/globe'
import GlobeDemo from '@/components/globe'
import { Button } from '@/components/ui/button'
import { ArrowRight, Terminal } from 'lucide-react'
import Link from 'next/link'

const Hero = () => {
    return (
        <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden border-b">
            <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]"></div>
            <div className="absolute inset-0 z-0 bg-background [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,transparent_20%,black_100%)]"></div>

            <div className="container relative z-10 px-4 md:px-8 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-8 md:gap-16">
                {/* Left Content */}
                <div className="flex-1 flex flex-col items-center text-center lg:items-start lg:text-left">
                    <div className="inline-flex items-center border border-border bg-muted/30 px-3 py-1 text-xs font-medium text-foreground mb-8 rounded-full">
                        <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
                        Built for focused teams and individuals
                    </div>

                    <h1 className="text-3xl md:text-6xl lg:text-7xl font-semibold tracking-tighter mb-6 text-foreground leading-[1.05]">
                        The central orbyte to  <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                            plan, track, and deliver.
                        </span>
                    </h1>

                    <p className="text-sm md:text-base text-muted-foreground mb-10 max-w-xl leading-relaxed tracking-tight">
                        A modern task management platform engineered for clarity. Organize your workflow, plan clearly, and execute projects with absolute precision.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-16">
                        <Button size="lg" className="h-12 px-8 text-sm font-medium shadow-none rounded-md" asChild>
                            <Link href="/dashboard" className='text-xs md:text-sm'>
                                Get Started - Free
                                <ArrowRight className="ml-2 h-4 w-4" strokeWidth={1.5} />
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" className="h-12 px-8 text-sm font-medium shadow-none rounded-md border-border hover:bg-muted/50" asChild>
                            <Link href="#platform" className='text-xs md:text-sm'>
                                <Terminal className="mr-2 h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                                Explore the Platform
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Right Visual (Globe) */}
                <div className="flex-1 w-full flex justify-center items-center lg:justify-end">
                    <div className="relative w-full max-w-lg aspect-square border border-border bg-muted/10 rounded-full flex items-center justify-center p-8">
                        <Globe />
                        {/* Structural rings */}
                        <div className="absolute inset-0 rounded-full border border-border/50 scale-[1.15]"></div>
                        <div className="absolute inset-0 rounded-full border border-border/20 scale-[1.3]"></div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero
