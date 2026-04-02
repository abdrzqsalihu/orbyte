import { Github, Twitter, Zap } from "lucide-react";
import Link from "next/link";
const Footer = () => {
    const getLink = (link: string) => {
        switch (link) {
            case "Help Center":
                return "https://wa.me/2348085458632";
            case "Contact":
                return "mailto:abdrzq.salihu@gmail.com";
            case "Privacy Policy":
                return "/privacy";
            case "Terms of Service":
                return "/terms";
            default:
                return "#";
        }
    };
    return (
        <footer className="py-16 bg-background border-t">
            <div className="container px-4 md:px-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
                    <div className="col-span-2">
                        <div className="flex items-center gap-2 font-semibold text-lg tracking-tight mb-6">
                            <Zap className="h-5 w-5 text-primary" />
                            <span>Orbyte</span>
                        </div>
                        <p className="text-muted-foreground text-sm max-w-xs font-medium tracking-tight">
                            Premium task management. Designed for clarity, built for execution.
                        </p>
                    </div>
                    {[
                        {
                            title: "Product",
                            links: ["Kanban", "Calendar", "Tasks"],
                        },
                        {
                            title: "Resources",
                            links: ["Help Center", "Contact"],
                        },
                        {
                            title: "Legal",
                            links: ["Privacy Policy", "Terms of Service",],
                        },
                    ].map((col, idx) => (
                        <div key={idx}>
                            <h3 className="font-semibold text-sm tracking-tight mb-4 text-foreground">
                                {col.title}
                            </h3>
                            <ul className="space-y-3 text-sm text-muted-foreground">
                                {col.links.map((link) => (
                                    <li key={link}>
                                        <Link href={getLink(link)}
                                            target={
                                                link === "Help Center" || link === "Contact"
                                                    ? "_blank"
                                                    : "_self"

                                            } className="hover:text-foreground transition-colors duration-200">
                                            {link}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-medium text-muted-foreground">
                    <p>© {new Date().getFullYear()} Orbyte Inc.</p>
                    <div className="flex gap-6">
                        <Link href="https://x.com/abdrzqsalihu" target="_blank" className="hover:text-foreground transition-colors">
                            <Twitter className="h-4 w-4" />
                        </Link>
                        <Link href="https://github.com/abdrzqsalihu/orbyte" target="_blank" className="hover:text-foreground transition-colors">
                            <Github className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
