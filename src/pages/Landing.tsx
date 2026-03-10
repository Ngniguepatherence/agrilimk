import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Search, Calendar, Sprout, TractorIcon, Users, Building2, ArrowRight, CheckCircle2 } from "lucide-react";

const Landing = () => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-primary px-4 py-20 md:py-32 text-primary-foreground">
        <div className="container mx-auto text-center relative z-10">
          <div className="text-5xl mb-6">🌾</div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
            AgriLink
          </h1>
          <p className="text-xl md:text-2xl mb-2 font-medium opacity-90">
            {t.landing.hero}
          </p>
          <p className="text-base md:text-lg mb-8 max-w-2xl mx-auto opacity-80">
            {t.landing.heroSub}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/signup">
              <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 text-base px-8 py-6 w-full sm:w-auto">
                {t.landing.cta}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/marketplace">
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 text-base px-8 py-6 w-full sm:w-auto">
                {t.landing.ctaBrowse}
              </Button>
            </Link>
          </div>
        </div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDF6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
      </section>

      {/* Problem */}
      <section className="px-4 py-16 md:py-20 bg-muted/50">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">{t.landing.problemTitle}</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">{t.landing.problemText}</p>
        </div>
      </section>

      {/* Solution */}
      <section className="px-4 py-16 md:py-20">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">{t.landing.solutionTitle}</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">{t.landing.solutionText}</p>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 py-16 md:py-20 bg-muted/50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">{t.landing.howTitle}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Search, title: t.landing.step1Title, text: t.landing.step1Text, num: "1" },
              { icon: Calendar, title: t.landing.step2Title, text: t.landing.step2Text, num: "2" },
              { icon: Sprout, title: t.landing.step3Title, text: t.landing.step3Text, num: "3" },
            ].map((step) => (
              <div key={step.num} className="flex flex-col items-center text-center p-6 rounded-xl bg-card border animate-fade-in">
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <step.icon className="h-7 w-7 text-primary" />
                </div>
                <div className="text-sm font-bold text-primary mb-1">Step {step.num}</div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="px-4 py-16 md:py-20">
        <div className="container mx-auto max-w-5xl grid md:grid-cols-2 gap-12">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">{t.landing.farmerBenefitsTitle}</h2>
            </div>
            <ul className="space-y-3">
              {[t.landing.farmerBenefit1, t.landing.farmerBenefit2, t.landing.farmerBenefit3, t.landing.farmerBenefit4].map((b, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <span className="text-muted-foreground">{b}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-full bg-secondary/20 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-secondary" />
              </div>
              <h2 className="text-2xl font-bold">{t.landing.municipalityBenefitsTitle}</h2>
            </div>
            <ul className="space-y-3">
              {[t.landing.municipalityBenefit1, t.landing.municipalityBenefit2, t.landing.municipalityBenefit3, t.landing.municipalityBenefit4].map((b, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-secondary mt-0.5 shrink-0" />
                  <span className="text-muted-foreground">{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 py-16 md:py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">{t.landing.ctaTitle}</h2>
          <p className="text-lg mb-8 opacity-80">{t.landing.ctaText}</p>
          <Link to="/signup">
            <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 text-base px-8 py-6">
              {t.landing.ctaJoin}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-8 border-t bg-card">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© 2026 AgriLink. Connecting Farmers to Agricultural Equipment.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
