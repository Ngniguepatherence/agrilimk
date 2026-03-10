import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Wrench } from "lucide-react";

const Signup = () => {
  const { t } = useLanguage();
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("farmer");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (signup(name, email, phone, password, role)) {
      navigate(role === "owner" ? "/owner" : "/farmer");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="text-4xl mb-2">🌾</div>
          <CardTitle className="text-2xl">{t.auth.signupTitle}</CardTitle>
          <CardDescription>{t.auth.signupSub}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selection */}
            <div className="space-y-2">
              <Label>{t.auth.role}</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("farmer")}
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors ${
                    role === "farmer" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  }`}
                >
                  <Users className="h-8 w-8 text-primary" />
                  <span className="text-sm font-medium">{t.auth.farmer}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole("owner")}
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors ${
                    role === "owner" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  }`}
                >
                  <Wrench className="h-8 w-8 text-secondary" />
                  <span className="text-sm font-medium">{t.auth.owner}</span>
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">{t.auth.name}</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Amadou Diallo" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t.auth.email}</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">{t.auth.phone}</Label>
              <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+221 77 123 4567" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t.auth.password}</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full" size="lg">{t.auth.signup}</Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            {t.auth.hasAccount} <Link to="/login" className="text-primary font-medium hover:underline">{t.auth.login}</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
