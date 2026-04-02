import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const Cta = () => {
    return (
        <section className="py-24 bg-primary text-white">
            <div className="container px-4 md:px-8 max-w-4xl mx-auto text-center">
                <h2 className="text-4xl md:text-5xl font-semibold tracking-tighter mb-6">
                    Ready to take control?
                </h2>
                <p className="text-white/70 mb-8 text-lg tracking-tight max-w-xl mx-auto">
                    Join the thousands of professionals organizing their tasks, tracking projects, and delivering work faster with Orbyte.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Button
                        size="lg"
                        className="h-11 px-10 text-sm font-medium bg-background text-foreground hover:bg-background/90 shadow-none rounded-md"
                        asChild
                    >
                        <Link href="/dashboard">Get Started</Link>
                    </Button>

                </div>
            </div>
        </section>
    )
}

export default Cta
