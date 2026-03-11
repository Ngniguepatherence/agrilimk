import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import logoImg from "@/assets/logo.png";

const Login = () => {
  const { t } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, password)) {
      if (email.includes("admin")) navigate("/admin");
      else if (email.includes("owner")) navigate("/owner");
      else navigate("/farmer");
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
                <p className="text-muted-foreground">farmer@agrilink.com • owner@agrilink.com • admin@agrilink.com</p>
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
