import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Home, ShoppingCart, MapPin, LayoutDashboard, Shield, LogOut, Globe } from "lucide-react";
import logoImg from "@/assets/logo.png";

export function Header() {
  const { t, language, setLanguage } = useLanguage();
  const { user, logout, isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: "/", label: t.nav.home, icon: Home },
    { path: "/marketplace", label: t.nav.marketplace, icon: ShoppingCart },
    { path: "/map", label: t.nav.map, icon: MapPin },
  ];

  if (isAuthenticated && user) {
    if (user.role === "farmer" || user.role === "owner") {
      navItems.push({ path: `/${user.role}`, label: t.nav.dashboard, icon: LayoutDashboard });
    }
    if (user.role === "admin") {
      navItems.push({ path: "/admin", label: t.nav.admin, icon: Shield });
    }
  }

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 glass">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <img src={logoImg} alt="AgriLink" className="h-9 w-9" />
          <span className="font-bold text-xl tracking-tight">
            <span className="text-primary">Agri</span>
            <span className="text-secondary">Link</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                isActive(item.path)
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLanguage(language === "en" ? "fr" : "en")}
            className="gap-1.5 text-muted-foreground hover:text-foreground rounded-full"
          >
            <Globe className="h-4 w-4" />
            {t.nav.language}
          </Button>
          {isAuthenticated ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { logout(); navigate("/"); }}
              className="gap-1.5 text-muted-foreground hover:text-foreground rounded-full"
            >
              <LogOut className="h-4 w-4" />
              {t.nav.logout}
            </Button>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm" className="rounded-full">{t.nav.login}</Button>
              </Link>
              <Link to="/signup">
                <Button size="sm" className="rounded-full px-5 shadow-sm">{t.nav.signup}</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="flex md:hidden items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLanguage(language === "en" ? "fr" : "en")}
            className="rounded-full text-muted-foreground"
          >
            <Globe className="h-4 w-4" />
          </Button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 pt-12">
              <nav className="flex flex-col gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${
                        isActive(item.path)
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  );
                })}
                <div className="h-px bg-border my-3" />
                {isAuthenticated ? (
                  <Button
                    variant="ghost"
                    onClick={() => { logout(); navigate("/"); setOpen(false); }}
                    className="justify-start gap-3 px-4 py-3 h-auto rounded-xl text-muted-foreground"
                  >
                    <LogOut className="h-5 w-5" />
                    {t.nav.logout}
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <Link to="/login" onClick={() => setOpen(false)}>
                      <Button variant="outline" className="w-full rounded-xl">{t.nav.login}</Button>
                    </Link>
                    <Link to="/signup" onClick={() => setOpen(false)}>
                      <Button className="w-full rounded-xl">{t.nav.signup}</Button>
                    </Link>
                  </div>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export function BottomNav() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const items = [
    { path: "/marketplace", label: t.nav.marketplace, icon: ShoppingCart },
    { path: "/map", label: t.nav.map, icon: MapPin },
    { path: `/${user.role === "admin" ? "admin" : user.role}`, label: t.nav.dashboard, icon: LayoutDashboard },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass md:hidden safe-area-bottom">
      <div className="flex justify-around py-2 px-2">
        {items.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl text-xs font-medium transition-all ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon className={`h-5 w-5 ${active ? "scale-110" : ""} transition-transform`} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className={`flex-1 ${isAuthenticated ? "pb-20 md:pb-0" : ""}`}>{children}</main>
      {isAuthenticated && <BottomNav />}
    </div>
  );
}
