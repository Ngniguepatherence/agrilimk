import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X, Home, ShoppingCart, MapPin, LayoutDashboard, Shield, LogOut } from "lucide-react";

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
    <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-14 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="text-2xl">🌾</span>
          <span className="text-primary">Agri</span>
          <span className="text-secondary">Link</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive(item.path) ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setLanguage(language === "en" ? "fr" : "en")}>
            {t.nav.language}
          </Button>
          {isAuthenticated ? (
            <Button variant="outline" size="sm" onClick={() => { logout(); navigate("/"); }}>
              <LogOut className="h-4 w-4 mr-1" />
              {t.nav.logout}
            </Button>
          ) : (
            <>
              <Link to="/login"><Button variant="ghost" size="sm">{t.nav.login}</Button></Link>
              <Link to="/signup"><Button size="sm">{t.nav.signup}</Button></Link>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="flex md:hidden items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setLanguage(language === "en" ? "fr" : "en")}>
            {t.nav.language}
          </Button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon"><Menu className="h-5 w-5" /></Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <nav className="flex flex-col gap-2 mt-8">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                        isActive(item.path) ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  );
                })}
                <hr className="my-2" />
                {isAuthenticated ? (
                  <Button variant="outline" onClick={() => { logout(); navigate("/"); setOpen(false); }}>
                    <LogOut className="h-4 w-4 mr-2" />
                    {t.nav.logout}
                  </Button>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start">{t.nav.login}</Button>
                    </Link>
                    <Link to="/signup" onClick={() => setOpen(false)}>
                      <Button className="w-full">{t.nav.signup}</Button>
                    </Link>
                  </>
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
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card md:hidden">
      <div className="flex justify-around py-2">
        {items.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 px-3 py-1 text-xs font-medium transition-colors ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
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
      <main className={`flex-1 ${isAuthenticated ? "pb-16 md:pb-0" : ""}`}>{children}</main>
      {isAuthenticated && <BottomNav />}
    </div>
  );
}
