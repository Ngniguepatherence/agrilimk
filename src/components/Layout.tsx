import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Home, ShoppingCart, ShoppingBasket, MapPin, LayoutDashboard, Shield, LogOut, Globe, User } from "lucide-react";
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
    { path: "/products", label: (t as any).nav?.products || "Products", icon: ShoppingBasket },
    { path: "/map", label: t.nav.map, icon: MapPin },
  ];

  if (isAuthenticated && user) {
    if (user.role === "farmer") {
      navItems.push({ path: "/farmer", label: t.nav.dashboard, icon: LayoutDashboard });
    } else if (user.role === "owner" || user.role === "collectivity") {
      navItems.push({ path: "/owner", label: t.nav.dashboard, icon: LayoutDashboard });
    }
    if (user.role === "admin") {
      navItems.push({ path: "/admin", label: t.nav.admin, icon: Shield });
    }
  }

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 glass hidden md:block">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <img src={logoImg} alt="AgriLink" className="h-9 w-9" />
          <span className="font-bold text-xl tracking-tight">
            <span className="text-primary">Agri</span>
            <span className="text-secondary">Link</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1">
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

        <div className="flex items-center gap-2">
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
            <div className="flex items-center gap-1">
              <Link to="/profile">
                <Button variant="ghost" size="sm" className="gap-1.5 rounded-full text-muted-foreground hover:text-foreground">
                  <User className="h-4 w-4" />
                  {user?.name?.split(" ")[0]}
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { logout(); navigate("/"); }}
                className="gap-1.5 text-muted-foreground hover:text-foreground rounded-full"
              >
                <LogOut className="h-4 w-4" />
                {t.nav.logout}
              </Button>
            </div>
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
      </div>
    </header>
  );
}

export function MobileTopBar() {
  const { language, setLanguage } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  // Hide on landing if not authenticated
  const isLanding = location.pathname === "/";

  return (
    <header className="sticky top-0 z-50 glass md:hidden">
      <div className="flex h-14 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <img src={logoImg} alt="AgriLink" className="h-8 w-8" />
          <span className="font-bold text-lg tracking-tight">
            <span className="text-primary">Agri</span>
            <span className="text-secondary">Link</span>
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLanguage(language === "en" ? "fr" : "en")}
            className="rounded-full text-muted-foreground h-9 w-9"
          >
            <Globe className="h-4 w-4" />
          </Button>
          {isAuthenticated && (
            <Link to="/profile">
              <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
                <User className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export function BottomNav() {
  const { t } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  const items = isAuthenticated && user
    ? [
        { path: "/", label: t.nav.home, icon: Home },
        { path: "/marketplace", label: t.nav.marketplace, icon: ShoppingCart },
        { path: "/products", label: (t as any).nav?.products || "Products", icon: ShoppingBasket },
        { path: "/map", label: t.nav.map, icon: MapPin },
        {
          path: `/${user.role === "admin" ? "admin" : user.role === "collectivity" ? "owner" : user.role}`,
          label: t.nav.dashboard,
          icon: LayoutDashboard,
        },
      ]
    : [
        { path: "/", label: t.nav.home, icon: Home },
        { path: "/marketplace", label: t.nav.marketplace, icon: ShoppingCart },
        { path: "/products", label: (t as any).nav?.products || "Products", icon: ShoppingBasket },
        { path: "/map", label: t.nav.map, icon: MapPin },
        { path: "/login", label: t.nav.login, icon: User },
      ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass md:hidden safe-area-bottom">
      <div className="flex justify-around py-1.5 px-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl text-[10px] font-medium transition-all ${
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
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <MobileTopBar />
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
      <BottomNav />
    </div>
  );
}
