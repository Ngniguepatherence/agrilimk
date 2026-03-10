import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Login = () => {
  const { t } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, password)) {
      // Route based on email for demo
      if (email.includes("admin")) navigate("/admin");
      else if (email.includes("owner")) navigate("/owner");
      else navigate("/farmer");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="text-4xl mb-2">🌾</div>
          <CardTitle className="text-2xl">{t.auth.loginTitle}</CardTitle>
          <CardDescription>{t.auth.loginSub}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t.auth.email}</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="farmer@agrilink.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t.auth.password}</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
            </div>
            <Button type="submit" className="w-full" size="lg">{t.auth.login}</Button>
          </form>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            <p className="mb-2">{t.auth.noAccount} <Link to="/signup" className="text-primary font-medium hover:underline">{t.auth.signup}</Link></p>
            <div className="mt-4 p-3 rounded-lg bg-muted text-xs">
              <p className="font-medium mb-1">Demo accounts:</p>
              <p>farmer@agrilink.com • owner@agrilink.com • admin@agrilink.com</p>
              <p className="mt-1 text-muted-foreground">Any password works</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
