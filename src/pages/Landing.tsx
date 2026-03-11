import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Search, Calendar, Sprout, Users, Building2, ArrowRight, CheckCircle2, Star, TrendingUp, Shield } from "lucide-react";
import heroImg from "@/assets/hero-farm.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0, 0, 0.2, 1] as const },
  }),
};

const Landing = () => {
  const { t } = useLanguage();

  const stats = [
    { value: "500+", label: "Farmers Connected" },
    { value: "120+", label: "Equipment Listed" },
    { value: "15", label: "Regions Covered" },
    { value: "98%", label: "Satisfaction Rate" },
  ];

  return (
    <div className="flex flex-col overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center">
        <div className="absolute inset-0">
          <img src={heroImg} alt="African farmland" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/60 to-foreground/30" />
        </div>
        <div className="container relative z-10 py-20 md:py-32">
          <motion.div
            initial="hidden"
            animate="visible"
            className="max-w-2xl"
          >
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30 text-primary-foreground text-sm font-medium mb-6">
              <Sprout className="h-4 w-4" />
              AgriLink Platform
            </motion.div>
            <motion.h1 variants={fadeUp} custom={1} className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-[1.1] mb-5 tracking-tight">
              {t.landing.hero}
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-lg leading-relaxed">
              {t.landing.heroSub}
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row gap-3">
              <Link to="/signup">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-base px-8 h-13 rounded-xl shadow-elevated w-full sm:w-auto">
                  {t.landing.cta}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/marketplace">
                <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 text-base px-8 h-13 rounded-xl w-full sm:w-auto backdrop-blur-sm">
                  {t.landing.ctaBrowse}
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="relative z-10 -mt-12 px-4">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 bg-card rounded-2xl shadow-elevated p-6 md:p-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <p className="text-2xl md:text-3xl font-bold text-gradient">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem & Solution */}
      <section className="px-4 py-20 md:py-28">
        <div className="container max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-destructive/10 text-destructive text-sm font-medium mb-4">
                <TrendingUp className="h-3.5 w-3.5" />
                {t.landing.problemTitle}
              </div>
              <h2 className="text-2xl md:text-4xl font-bold mb-4 leading-tight">{t.landing.problemTitle}</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">{t.landing.problemText}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <Shield className="h-3.5 w-3.5" />
                {t.landing.solutionTitle}
              </div>
              <h2 className="text-2xl md:text-4xl font-bold mb-4 leading-tight">{t.landing.solutionTitle}</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">{t.landing.solutionText}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 py-20 md:py-28 bg-muted/50">
        <div className="container max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.landing.howTitle}</h2>
            <p className="text-muted-foreground text-lg max-w-lg mx-auto">Simple, fast, and accessible for everyone</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {[
              { icon: Search, title: t.landing.step1Title, text: t.landing.step1Text, num: "01" },
              { icon: Calendar, title: t.landing.step2Title, text: t.landing.step2Text, num: "02" },
              { icon: Sprout, title: t.landing.step3Title, text: t.landing.step3Text, num: "03" },
            ].map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative group"
              >
                <div className="bg-card rounded-2xl p-8 shadow-card hover:shadow-elevated transition-all duration-300 h-full border border-border/50 hover:border-primary/20">
                  <div className="text-xs font-bold text-primary/40 mb-4 tracking-widest">{step.num}</div>
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/10 to-accent flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                    <step.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="px-4 py-20 md:py-28">
        <div className="container max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary/10 to-accent flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">{t.landing.farmerBenefitsTitle}</h2>
              </div>
              <ul className="space-y-4">
                {[t.landing.farmerBenefit1, t.landing.farmerBenefit2, t.landing.farmerBenefit3, t.landing.farmerBenefit4].map((b, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-3 p-3 rounded-xl bg-accent/50 border border-primary/10"
                  >
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-foreground/80">{b}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-2xl bg-secondary/10 flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-secondary" />
                </div>
                <h2 className="text-2xl font-bold">{t.landing.municipalityBenefitsTitle}</h2>
              </div>
              <ul className="space-y-4">
                {[t.landing.municipalityBenefit1, t.landing.municipalityBenefit2, t.landing.municipalityBenefit3, t.landing.municipalityBenefit4].map((b, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-3 p-3 rounded-xl bg-secondary/5 border border-secondary/10"
                  >
                    <CheckCircle2 className="h-5 w-5 text-secondary mt-0.5 shrink-0" />
                    <span className="text-foreground/80">{b}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="px-4 py-16 md:py-20 bg-muted/50">
        <div className="container max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-card rounded-2xl shadow-card p-8 md:p-12 border border-border/50"
          >
            <div className="flex justify-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-secondary text-secondary" />
              ))}
            </div>
            <blockquote className="text-lg md:text-xl font-medium italic text-foreground/80 mb-6 leading-relaxed">
              "AgriLink has transformed how I farm. I can now access a tractor in just two days instead of waiting weeks. My harvest has doubled."
            </blockquote>
            <div>
              <p className="font-bold">Amadou Diallo</p>
              <p className="text-sm text-muted-foreground">Farmer, Thiès Region</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDF6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="container max-w-2xl text-center relative z-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-5 text-primary-foreground">{t.landing.ctaTitle}</h2>
          <p className="text-lg mb-8 text-primary-foreground/80 leading-relaxed">{t.landing.ctaText}</p>
          <Link to="/signup">
            <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground text-base px-10 h-13 rounded-xl shadow-elevated">
              {t.landing.ctaJoin}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-10 border-t bg-card">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg">
                <span className="text-primary">Agri</span>
                <span className="text-secondary">Link</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 AgriLink. Connecting Farmers to Agricultural Equipment.
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
