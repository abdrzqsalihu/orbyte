import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Zap } from "lucide-react";

export default function PrivacyPolicy() {
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
                    <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
                    <p className="text-muted-foreground">Last updated: March 25, 2026</p>
                </div>

                <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-sm md:text-base leading-relaxed text-muted-foreground">
                    <section className="space-y-3">
                        <h2 className="text-xl font-semibold text-foreground">1. Information We Collect</h2>
                        <p>
                            We collect information you provide directly to us, such as when you create or modify your account, request customer support, or otherwise communicate with us. This information may include: name, email address, password, and any other information you choose to provide.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-semibold text-foreground">2. How We Use Your Information</h2>
                        <p>
                            We use the information we collect to:
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Provide, maintain, and improve our services;</li>
                            <li>Process transactions and send related information;</li>
                            <li>Send you technical notices, updates, and security alerts;</li>
                            <li>Respond to your comments and questions;</li>
                            <li>Monitor and analyze trends, usage, and activities.</li>
                        </ul>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-semibold text-foreground">3. Data Security</h2>
                        <p>
                            We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction. However, no internet or email transmission is ever fully secure or error free.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-semibold text-foreground">4. Cookies</h2>
                        <p>
                            Most web browsers are set to accept cookies by default. If you prefer, you can usually choose to set your browser to remove or reject browser cookies. Please note that if you choose to remove or reject cookies, this could affect the availability and functionality of our services.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-semibold text-foreground">5. Changes to this Policy</h2>
                        <p>
                            We may change this Privacy Policy from time to time. If we make changes, we will notify you by revising the date at the top of the policy and, in some cases, we may provide you with additional notice.
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