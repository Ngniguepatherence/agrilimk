import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Users, Wrench, Building2, Upload, ShieldCheck, Camera } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import logoImg from "@/assets/logo.png";

const Signup = () => {
  const { t } = useLanguage();
  const { signup, loginWithSocial } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("farmer");
  const [idType, setIdType] = useState<"cni" | "passport">("cni");
  const [idUploaded, setIdUploaded] = useState(false);
  const [selfieUploaded, setSelfieUploaded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
      return;
    }
    if (signup(name, email, phone, password, role)) {
      toast.success(t.auth.signupSuccess);
      navigate(role === "owner" || role === "collectivity" ? "/owner" : "/farmer");
    }
  };

  const handleSocial = (provider: "google" | "facebook") => {
    if (loginWithSocial(provider)) {
      navigate("/farmer");
    }
  };

  const roles: { value: UserRole; icon: React.ElementType; label: string; desc: string }[] = [
    { value: "farmer", icon: Users, label: t.auth.farmer, desc: t.auth.farmerDesc },
    { value: "owner", icon: Wrench, label: t.auth.owner, desc: t.auth.ownerDesc },
    { value: "collectivity", icon: Building2, label: t.auth.collectivity, desc: t.auth.collectivityDesc },
  ];

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg"
      >
        <Card className="shadow-elevated border-border/50 rounded-2xl">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-3">
              <img src={logoImg} alt="AgriLink" className="h-14 w-14" />
            </div>
            <CardTitle className="text-2xl font-bold">{t.auth.signupTitle}</CardTitle>
            <CardDescription className="text-base">
              {step === 1 ? t.auth.signupSub : t.auth.verifyIdentity}
            </CardDescription>
            {/* Step indicator */}
            <div className="flex items-center justify-center gap-2 mt-4">
              {[1, 2].map((s) => (
                <div key={s} className={`h-2 rounded-full transition-all duration-300 ${s === step ? "w-8 bg-primary" : s < step ? "w-8 bg-primary/40" : "w-8 bg-muted"}`} />
              ))}
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                  {/* Social Signup */}
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    <Button type="button" variant="outline" className="h-12 rounded-xl gap-2 font-medium" onClick={() => handleSocial("google")}>
                      <svg className="h-5 w-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                      Google
                    </Button>
                    <Button type="button" variant="outline" className="h-12 rounded-xl gap-2 font-medium" onClick={() => handleSocial("facebook")}>
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="#1877F2">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      Facebook
                    </Button>
                  </div>

                  <div className="relative mb-5">
                    <Separator />
                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs text-muted-foreground">{t.auth.orEmail}</span>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Role Selection */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">{t.auth.role}</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {roles.map((r) => (
                          <button
                            key={r.value}
                            type="button"
                            onClick={() => setRole(r.value)}
                            className={`flex flex-col items-center gap-1.5 p-4 rounded-xl border-2 transition-all duration-200 ${
                              role === r.value
                                ? "border-primary bg-accent shadow-sm"
                                : "border-border hover:border-primary/40 hover:bg-muted/50"
                            }`}
                          >
                            <r.icon className={`h-6 w-6 ${role === r.value ? "text-primary" : "text-muted-foreground"}`} />
                            <span className="text-xs font-semibold text-center leading-tight">{r.label}</span>
                          </button>
                        ))}
                      </div>
                      {role !== "farmer" && (
                        <p className="text-xs text-muted-foreground mt-1 px-1">
                          {roles.find((r) => r.value === role)?.desc}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium">{role === "collectivity" ? t.auth.orgName : t.auth.name}</Label>
                      <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder={role === "collectivity" ? "Mairie de Thiès" : "Amadou Diallo"} required className="h-12 rounded-xl" />
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
                    <Button type="submit" className="w-full h-12 rounded-xl text-base shadow-sm" size="lg">
                      {t.auth.continue} →
                    </Button>
                  </form>
                </motion.div>
              ) : (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="p-4 rounded-xl bg-info/5 border border-info/20 text-sm text-info">
                      <div className="flex items-start gap-2">
                        <ShieldCheck className="h-5 w-5 mt-0.5 shrink-0" />
                        <p>{t.auth.verifyDescription}</p>
                      </div>
                    </div>

                    {/* ID Type Selection */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">{t.auth.idType}</Label>
                      <Select value={idType} onValueChange={(v) => setIdType(v as "cni" | "passport")}>
                        <SelectTrigger className="h-12 rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cni">{t.auth.cni}</SelectItem>
                          <SelectItem value="passport">{t.auth.passport}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* ID Upload */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">{t.auth.uploadId}</Label>
                      <div
                        onClick={() => { setIdUploaded(true); toast.success(t.auth.idUploaded); }}
                        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                          idUploaded ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/30"
                        }`}
                      >
                        <Upload className={`h-8 w-8 mx-auto mb-2 ${idUploaded ? "text-primary" : "text-muted-foreground"}`} />
                        <p className="text-sm font-medium">{idUploaded ? t.auth.idUploaded : t.auth.clickToUpload}</p>
                        <p className="text-xs text-muted-foreground mt-1">{idType === "cni" ? t.auth.cniHint : t.auth.passportHint}</p>
                      </div>
                    </div>

                    {/* Selfie Upload */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">{t.auth.uploadSelfie}</Label>
                      <div
                        onClick={() => { setSelfieUploaded(true); toast.success(t.auth.selfieUploaded); }}
                        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                          selfieUploaded ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/30"
                        }`}
                      >
                        <Camera className={`h-8 w-8 mx-auto mb-2 ${selfieUploaded ? "text-primary" : "text-muted-foreground"}`} />
                        <p className="text-sm font-medium">{selfieUploaded ? t.auth.selfieUploaded : t.auth.takeSelfie}</p>
                        <p className="text-xs text-muted-foreground mt-1">{t.auth.selfieHint}</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button type="button" variant="outline" className="flex-1 h-12 rounded-xl" onClick={() => setStep(1)}>
                        ← {t.common.back}
                      </Button>
                      <Button type="submit" className="flex-1 h-12 rounded-xl text-base shadow-sm" size="lg">
                        {t.auth.signup}
                      </Button>
                    </div>

                    <button type="button" onClick={handleSubmit} className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {t.auth.skipVerification}
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {step === 1 && (
              <p className="mt-5 text-center text-sm text-muted-foreground">
                {t.auth.hasAccount}{" "}
                <Link to="/login" className="text-primary font-semibold hover:underline">{t.auth.login}</Link>
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Signup;
