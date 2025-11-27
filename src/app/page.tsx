import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Zap, Users, BarChart3 } from "lucide-react";

export default function Home() {
  const currentYear = new Date().getFullYear();
  
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
<<<<<<< HEAD
          <div className="flex items-center">
            <img src="/Tese-Logo.svg" alt="Tese" className="h-10" />
=======
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
              CP
            </div>
            <span className="font-bold text-lg">CreatorPay</span>
>>>>>>> 5437d3ba0ab258dcc647014b231c909f7294bd7d
          </div>
          <div className="flex gap-3">
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/signup">
              <Button variant="primary">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-8">
        <h1 className="text-5xl sm:text-6xl font-bold leading-tight text-foreground">
          Monetize Your Influence
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Accept payments from your community with ease. Get paid for your
          content, coaching, and collaborations. Just like Buy Me a Coffee, but
          for everyone.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/signup">
            <Button size="lg" className="gap-2">
              Start Free <ArrowRight size={20} />
            </Button>
          </Link>
          <Button variant="outline" size="lg">
            View Demo
          </Button>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-12">
        <h2 className="text-3xl font-bold text-center text-foreground">
<<<<<<< HEAD
          Why Creators Love Tese
=======
          Why Creators Love CreatorPay
>>>>>>> 5437d3ba0ab258dcc647014b231c909f7294bd7d
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Zap,
              title: "Lightning Fast Setup",
              description:
                "Create your creator account in minutes. No complicated forms.",
            },
            {
              icon: Users,
              title: "Easy Payment Links",
              description:
                "Generate shareable links and let your supporters send you money directly.",
            },
            {
              icon: BarChart3,
              title: "Track Everything",
              description:
                "Real-time dashboard showing earnings, transactions, and payouts.",
            },
          ].map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={i}
                className="bg-card rounded-lg border border-border p-8 space-y-4"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-6">
        <h2 className="text-3xl font-bold text-foreground">Ready to get paid?</h2>
        <p className="text-lg text-muted-foreground">
          Join hundreds of creators monetizing their influence
        </p>
        <div className="flex justify-center">
          <Link href="/signup">
            <Button size="lg">Create Account</Button>
          </Link>
        </div>
      </section>

      <footer className="border-t border-border bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-sm text-muted-foreground">
<<<<<<< HEAD
          <p>&copy; {currentYear} Tese. All rights reserved.</p>
=======
          <p>&copy; {currentYear} CreatorPay. All rights reserved.</p>
>>>>>>> 5437d3ba0ab258dcc647014b231c909f7294bd7d
        </div>
      </footer>
    </div>
  );
}
