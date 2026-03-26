import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import logoImg from "@/assets/logo.png";

const Login = () => {
  const { t } = useLanguage();
  const { login, loginWithSocial } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, password)) {
      if (email.includes("admin")) navigate("/admin");
      else if (email.includes("owner")) navigate("/owner");
      else if (email.includes("collectivity")) navigate("/owner");
      else navigate("/farmer");
    }
  };

  const handleSocial = (provider: "google" | "facebook") => {
    if (loginWithSocial(provider)) {
      navigate("/farmer");
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-elevated border-border/50 rounded-2xl">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-3">
              <img src={logoImg} alt="AgriLink" className="h-14 w-14" />
            </div>
            <CardTitle className="text-2xl font-bold">{t.auth.loginTitle}</CardTitle>
            <CardDescription className="text-base">{t.auth.loginSub}</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {/* Social Login Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <Button
                type="button"
                variant="outline"
                className="h-12 rounded-xl gap-2 font-medium hover:bg-muted/80"
                onClick={() => handleSocial("google")}
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-12 rounded-xl gap-2 font-medium hover:bg-muted/80"
                onClick={() => handleSocial("facebook")}
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </Button>
            </div>

            <div className="relative mb-5">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs text-muted-foreground">
                {t.auth.orEmail}
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">{t.auth.email}</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="farmer@agrilink.com" required className="h-12 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">{t.auth.password}</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required className="h-12 rounded-xl" />
              </div>
              <Button type="submit" className="w-full h-12 rounded-xl text-base shadow-sm" size="lg">{t.auth.login}</Button>
            </form>
            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p>{t.auth.noAccount}{" "}
                <Link to="/signup" className="text-primary font-semibold hover:underline">{t.auth.signup}</Link>
              </p>
              <div className="mt-5 p-4 rounded-xl bg-muted/50 border border-border/50 text-xs">
                <p className="font-semibold mb-1.5 text-foreground">Demo accounts:</p>
                <p className="text-muted-foreground">farmer@agrilink.com • owner@agrilink.com</p>
                <p className="text-muted-foreground">admin@agrilink.com • collectivity@agrilink.com</p>
                <p className="mt-1 text-muted-foreground/70">Any password works</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
