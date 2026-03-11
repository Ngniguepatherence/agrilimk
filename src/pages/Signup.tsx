import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Wrench } from "lucide-react";
import { motion } from "framer-motion";
import logoImg from "@/assets/logo.png";

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
            <CardTitle className="text-2xl font-bold">{t.auth.signupTitle}</CardTitle>
            <CardDescription className="text-base">{t.auth.signupSub}</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role Selection */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">{t.auth.role}</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole("farmer")}
                    className={`flex flex-col items-center gap-2 p-5 rounded-xl border-2 transition-all duration-200 ${
                      role === "farmer"
                        ? "border-primary bg-accent shadow-sm"
                        : "border-border hover:border-primary/40 hover:bg-muted/50"
                    }`}
                  >
                    <Users className={`h-8 w-8 ${role === "farmer" ? "text-primary" : "text-muted-foreground"}`} />
                    <span className="text-sm font-semibold">{t.auth.farmer}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("owner")}
                    className={`flex flex-col items-center gap-2 p-5 rounded-xl border-2 transition-all duration-200 ${
                      role === "owner"
                        ? "border-secondary bg-secondary/5 shadow-sm"
                        : "border-border hover:border-secondary/40 hover:bg-muted/50"
                    }`}
                  >
                    <Wrench className={`h-8 w-8 ${role === "owner" ? "text-secondary" : "text-muted-foreground"}`} />
                    <span className="text-sm font-semibold">{t.auth.owner}</span>
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">{t.auth.name}</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Amadou Diallo" required className="h-12 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">{t.auth.email}</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-12 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">{t.auth.phone}</Label>
                <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+221 77 123 4567" required className="h-12 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">{t.auth.password}</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="h-12 rounded-xl" />
              </div>
              <Button type="submit" className="w-full h-12 rounded-xl text-base shadow-sm" size="lg">{t.auth.signup}</Button>
            </form>
            <p className="mt-5 text-center text-sm text-muted-foreground">
              {t.auth.hasAccount}{" "}
              <Link to="/login" className="text-primary font-semibold hover:underline">{t.auth.login}</Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Signup;
