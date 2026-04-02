import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Zap } from "lucide-react";

export default function Terms() {
    return (
        <div className="min-h-screen bg-background p-6 md:p-12 lg:p-24">
            <div className="mx-auto max-w-3xl space-y-8">
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Link>
                    <div className="flex items-center text-lg font-medium">
                        <Zap className="mr-2 h-5 w-5 text-primary" />
                        Orbyte
                    </div>
                </div>

                <div className="space-y-4">
                    <h1 className="text-4xl font-bold tracking-tight">Terms of Service</h1>
                    <p className="text-muted-foreground">Last updated: March 25, 2026</p>
                </div>

                <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-sm md:text-base leading-relaxed text-muted-foreground">
                    <section className="space-y-3">
                        <h2 className="text-xl font-semibold text-foreground">1. Acceptance of Terms</h2>
                        <p>
                            By accessing or using Orbyte, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-semibold text-foreground">2. Use License</h2>
                        <p>
                            Permission is granted to temporarily download one copy of the materials (information or software) on Orbyte's website for personal, non-commercial transitory viewing only.
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Modify or copy the materials;</li>
                            <li>Use the materials for any commercial purpose, or for any public display;</li>
                            <li>Attempt to decompile or reverse engineer any software contained on Orbyte's website;</li>
                            <li>Remove any copyright or other proprietary notations from the materials.</li>
                        </ul>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-semibold text-foreground">3. Disclaimer</h2>
                        <p>
                            The materials on Orbyte's website are provided on an 'as is' basis. Orbyte makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-semibold text-foreground">4. Limitations</h2>
                        <p>
                            In no event shall Orbyte or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Orbyte's website.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-semibold text-foreground">5. Governing Law</h2>
                        <p>
                            These terms and conditions are governed by and construed in accordance with the laws and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
                        </p>
                    </section>
                </div>

                <div className="pt-8 border-t hidden">
                    <Button asChild variant="outline">
                        <Link href="/register">Accept and Return</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}