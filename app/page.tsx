import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Zap,
  ArrowRight,
  LayoutDashboard,
  Calendar,
  CheckSquare,
  Palette,
  Download,
  FileSpreadsheet,
  Terminal,
  Columns,
  PieChart,
  Github,
  Twitter,
} from "lucide-react";

// Placeholder for your custom components
import GlobeDemo from "@/components/globe";
import { Header } from "./components/Header";
import Hero from "./components/Hero";
import Metrics from "./components/Metrics";
import Features from "./components/Features";
import Platform from "./components/Platform";
import Cta from "./components/Cta";
import Footer from "./components/Footer";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/20">
      {/* Navigation */}
      <Header />
      <main className="flex-1">
        {/* Hero Section*/}
        <Hero />
        {/* Performance & Scale Metrics */}
        <Metrics />
        {/* Features Section */}
        <Features />
        {/* Platform Section */}
        <Platform />
        {/*CTA Section */}
        <Cta />
      </main>
      {/* Footer*/}
      <Footer />

    </div>
  );
}