
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BarChartBig, LineChart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/components/logo";

export default function HomePage() {
  const features = [
    {
      icon: <LineChart className="h-10 w-10 text-primary mb-4" />,
      title: "Detailed Equity Analysis",
      description: "Valuation, financial health, performance forecasts, and dividend history.",
      href: "/equity-analysis"
    },
    {
      icon: <BarChartBig className="h-10 w-10 text-primary mb-4" />,
      title: "Market Overview",
      description: "Sector, industry, and economic indicator analysis with intuitive charts.",
      href: "/market-overview" // Added href here
    },
  ];

  return (
    <div className="flex flex-col min-h-screen text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
          <Logo />
          <nav className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Sign Up <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-32 bg-background">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
              Unlock Financial Insights with <span className="text-primary">GrowthSyntax</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">
              Dive deep into equity analysis and market trends. Make informed investment decisions with our comprehensive suite of tools.
            </p>
            <div className="space-x-4">
              <Button size="lg" asChild className="shadow-lg hover:shadow-primary/50 transition-shadow">
                <Link href="/signup">Get Started Free</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="shadow-lg">
                <Link href="/market-overview">Explore Market Data</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24 bg-custom-feature-bg">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">Powerful Features at Your Fingertips</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature) => (
                feature.href ? (
                  <Link key={feature.title} href={feature.href} className="block h-full">
                    <Card className="bg-card/80 shadow-xl hover:shadow-2xl transition-shadow duration-300 h-full flex flex-col">
                      <CardHeader>
                        {feature.icon}
                        <CardTitle className="text-2xl">{feature.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <CardDescription>{feature.description}</CardDescription>
                      </CardContent>
                    </Card>
                  </Link>
                ) : (
                  <Card key={feature.title} className="bg-card/80 shadow-xl hover:shadow-2xl transition-shadow duration-300 h-full flex flex-col">
                    <CardHeader>
                      {feature.icon}
                      <CardTitle className="text-2xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <CardDescription>{feature.description}</CardDescription>
                    </CardContent>
                  </Card>
                )
              ))}
            </div>
          </div>
        </section>
        
        {/* Call to Action Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">Ready to Elevate Your Investment Strategy?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join GrowthSyntax today and gain the clarity you need to navigate the markets.
            </p>
            <Button size="lg" asChild className="shadow-lg hover:shadow-primary/50 transition-shadow">
              <Link href="/signup">Sign Up Now <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="py-8 border-t border-border/40 bg-background">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} GrowthSyntax. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
