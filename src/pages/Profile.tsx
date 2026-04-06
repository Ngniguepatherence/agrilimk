import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  User, Mail, Phone, MapPin, ShieldCheck, Edit, Camera, CreditCard,
  Crown, Zap, Check, ArrowRight, AlertCircle, Star, Calendar, Settings, ShoppingBasket
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const subscriptionPlans = [
  {
    id: "free",
    nameEn: "Free",
    nameFr: "Gratuit",
    priceMonthly: 0,
    priceYearly: 0,
    currency: "FCFA",
    color: "from-muted to-muted",
    icon: User,
    featuresEn: ["Browse equipment", "3 bookings/month", "Basic profile", "5% commission on rentals"],
    featuresFr: ["Parcourir les équipements", "3 réservations/mois", "Profil basique", "5% commission sur locations"],
    commissionRate: 5,
  },
  {
    id: "starter",
    nameEn: "Starter",
    nameFr: "Starter",
    priceMonthly: 5000,
    priceYearly: 50000,
    currency: "FCFA",
    color: "from-primary/80 to-primary",
    icon: Zap,
    featuresEn: ["Unlimited bookings", "Priority support", "Verified badge", "3% commission on rentals", "Product marketplace access"],
    featuresFr: ["Réservations illimitées", "Support prioritaire", "Badge vérifié", "3% commission sur locations", "Accès marché de produits"],
    commissionRate: 3,
    popular: true,
  },
  {
    id: "pro",
    nameEn: "Pro",
    nameFr: "Pro",
    priceMonthly: 15000,
    priceYearly: 150000,
    currency: "FCFA",
    color: "from-secondary/80 to-secondary",
    icon: Crown,
    featuresEn: ["Everything in Starter", "0% commission", "Analytics dashboard", "Equipment insurance", "Dedicated account manager"],
    featuresFr: ["Tout dans Starter", "0% commission", "Tableau de bord analytique", "Assurance équipement", "Gestionnaire de compte dédié"],
    commissionRate: 0,
  },
];

const Profile = () => {
  const { t, language } = useLanguage();
  const { user, updateProfile, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [editOpen, setEditOpen] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const [currentPlan] = useState("free");

  const [editForm, setEditForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    location: user?.location || "",
  });

  if (!isAuthenticated || !user) {
    navigate("/login");
    return null;
  }

  const handleSaveProfile = () => {
    updateProfile(editForm);
    setEditOpen(false);
    toast.success(language === "fr" ? "Profil mis à jour !" : "Profile updated!");
  };

  const handleSubscribe = (planId: string) => {
    if (planId === currentPlan) return;
    toast.success(
      language === "fr"
        ? `Abonnement ${planId} activé ! (démo)`
        : `${planId} plan activated! (demo)`
    );
  };

  const profileLabel = language === "fr" ? "Mon Profil" : "My Profile";
  const subscriptionLabel = language === "fr" ? "Abonnement" : "Subscription";
  const revenueLabel = language === "fr" ? "Revenus & Commissions" : "Revenue & Commissions";
  const editProfileLabel = language === "fr" ? "Modifier le profil" : "Edit Profile";
  const monthlyLabel = language === "fr" ? "Mensuel" : "Monthly";
  const yearlyLabel = language === "fr" ? "Annuel" : "Yearly";
  const currentPlanLabel = language === "fr" ? "Plan actuel" : "Current Plan";
  const upgradeLabel = language === "fr" ? "Choisir" : "Choose";
  const commissionLabel = language === "fr" ? "Modèle de Commissions" : "Commission Model";
  const perMonthLabel = language === "fr" ? "/mois" : "/mo";
  const perYearLabel = language === "fr" ? "/an" : "/yr";
  const saveLabel = language === "fr" ? "Économisez 17%" : "Save 17%";

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl pb-24 md:pb-8">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-bold mb-1">{profileLabel}</h1>
        <p className="text-muted-foreground mb-8">
          {language === "fr" ? "Gérez votre compte et votre abonnement" : "Manage your account and subscription"}
        </p>
      </motion.div>

      <Tabs defaultValue="profile" className="space-y-5">
        <TabsList className="rounded-xl bg-muted/50 p-1 h-auto w-full flex">
          <TabsTrigger value="profile" className="rounded-lg data-[state=active]:shadow-sm flex-1 text-xs sm:text-sm">{profileLabel}</TabsTrigger>
          <TabsTrigger value="subscription" className="rounded-lg data-[state=active]:shadow-sm flex-1 text-xs sm:text-sm">{subscriptionLabel}</TabsTrigger>
          <TabsTrigger value="revenue" className="rounded-lg data-[state=active]:shadow-sm flex-1 text-xs sm:text-sm">{revenueLabel}</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-5">
          <Card className="rounded-2xl border-border/50 shadow-card overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-primary/20 via-primary/10 to-secondary/20" />
            <CardContent className="p-6 -mt-12">
              <div className="flex flex-col sm:flex-row items-start gap-5">
                <div className="relative">
                  <Avatar className="h-20 w-20 border-4 border-card shadow-elevated">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <button className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-sm">
                    <Camera className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="flex-1 min-w-0 mt-2 sm:mt-6">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl font-bold">{user.name}</h2>
                    {user.idVerified ? (
                      <Badge variant="outline" className="rounded-full bg-primary/10 text-primary border-primary/20 gap-1 text-xs">
                        <ShieldCheck className="h-3 w-3" /> {t.auth.verified}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="rounded-full bg-warning/10 text-warning border-warning/20 gap-1 text-xs">
                        <AlertCircle className="h-3 w-3" /> {t.auth.unverified}
                      </Badge>
                    )}
                    <Badge variant="outline" className="rounded-full capitalize text-xs">
                      {user.role === "collectivity" ? (language === "fr" ? "Collectivité" : "Collectivity") : user.role}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-2"><Mail className="h-4 w-4" />{user.email}</span>
                    <span className="flex items-center gap-2"><Phone className="h-4 w-4" />{user.phone || "—"}</span>
                    <span className="flex items-center gap-2"><MapPin className="h-4 w-4" />{user.location || "—"}</span>
                    <span className="flex items-center gap-2"><Calendar className="h-4 w-4" />{user.joinedDate || "—"}</span>
                  </div>
                </div>

                <Dialog open={editOpen} onOpenChange={setEditOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="rounded-xl gap-1.5 mt-2 sm:mt-6 shrink-0">
                      <Edit className="h-4 w-4" /> {editProfileLabel}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="rounded-2xl">
                    <DialogHeader><DialogTitle>{editProfileLabel}</DialogTitle></DialogHeader>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <Label>{t.auth.name}</Label>
                        <Input className="rounded-xl" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                      </div>
                      <div className="space-y-1">
                        <Label>{t.auth.email}</Label>
                        <Input className="rounded-xl" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
                      </div>
                      <div className="space-y-1">
                        <Label>{t.auth.phone}</Label>
                        <Input className="rounded-xl" value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} />
                      </div>
                      <div className="space-y-1">
                        <Label>{t.equipment.location}</Label>
                        <Input className="rounded-xl" value={editForm.location} onChange={(e) => setEditForm({ ...editForm, location: e.target.value })} />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleSaveProfile} className="rounded-xl w-full">{t.common.save}</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {!user.idVerified && (
                <div className="mt-5 p-4 rounded-xl bg-warning/10 border border-warning/20 flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">{t.farmer.verifyAccount}</p>
                    <p className="text-xs text-muted-foreground mt-1">{t.farmer.verifyDescription}</p>
                    <Button size="sm" className="rounded-xl mt-2 gap-1"><ShieldCheck className="h-3.5 w-3.5" /> {t.farmer.verifyNow}</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Subscription Tab */}
        <TabsContent value="subscription" className="space-y-5">
          <div className="flex justify-center mb-2">
            <div className="inline-flex items-center bg-muted/50 rounded-xl p-1 gap-1">
              <button
                onClick={() => setBillingPeriod("monthly")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${billingPeriod === "monthly" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"}`}
              >
                {monthlyLabel}
              </button>
              <button
                onClick={() => setBillingPeriod("yearly")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${billingPeriod === "yearly" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"}`}
              >
                {yearlyLabel}
                <Badge className="rounded-full text-[10px] px-1.5 py-0 bg-secondary text-secondary-foreground">{saveLabel}</Badge>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {subscriptionPlans.map((plan, i) => {
              const isCurrentPlan = plan.id === currentPlan;
              const price = billingPeriod === "monthly" ? plan.priceMonthly : plan.priceYearly;
              const features = language === "fr" ? plan.featuresFr : plan.featuresEn;
              const PlanIcon = plan.icon;

              return (
                <motion.div key={plan.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <Card className={`rounded-2xl border-border/50 shadow-card overflow-hidden relative ${plan.popular ? "ring-2 ring-primary" : ""}`}>
                    {plan.popular && (
                      <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-bl-xl">
                        {language === "fr" ? "POPULAIRE" : "POPULAR"}
                      </div>
                    )}
                    <CardContent className="p-6">
                      <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4`}>
                        <PlanIcon className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <h3 className="text-lg font-bold">{language === "fr" ? plan.nameFr : plan.nameEn}</h3>
                      <div className="mt-2 mb-4">
                        <span className="text-3xl font-bold">{price === 0 ? (language === "fr" ? "Gratuit" : "Free") : price.toLocaleString()}</span>
                        {price > 0 && <span className="text-muted-foreground text-sm ml-1">{plan.currency}{billingPeriod === "monthly" ? perMonthLabel : perYearLabel}</span>}
                      </div>
                      <div className="text-xs text-muted-foreground mb-4">
                        {language === "fr" ? "Commission" : "Commission"}: <span className="font-bold text-foreground">{plan.commissionRate}%</span>
                      </div>
                      <ul className="space-y-2 mb-6">
                        {features.map((feature, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm">
                            <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button
                        className={`w-full rounded-xl ${isCurrentPlan ? "opacity-60" : ""}`}
                        variant={plan.popular ? "default" : "outline"}
                        disabled={isCurrentPlan}
                        onClick={() => handleSubscribe(plan.id)}
                      >
                        {isCurrentPlan ? currentPlanLabel : upgradeLabel}
                        {!isCurrentPlan && <ArrowRight className="h-4 w-4 ml-1" />}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </TabsContent>

        {/* Revenue & Commission Tab */}
        <TabsContent value="revenue" className="space-y-5">
          {/* Commission collection summary */}
          <Card className="rounded-2xl border-border/50 shadow-card">
            <CardHeader><CardTitle className="text-lg">{language === "fr" ? "Collecte des Commissions" : "Commission Collection"}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { labelEn: "Total Earnings", labelFr: "Revenus Totaux", value: "125,000", icon: CreditCard, color: "text-primary" },
                  { labelEn: "Platform Fee", labelFr: "Frais Plateforme", value: "6,250", icon: Star, color: "text-destructive" },
                  { labelEn: "Net Payout", labelFr: "Paiement Net", value: "118,750", icon: Zap, color: "text-primary" },
                  { labelEn: "Pending", labelFr: "En Attente", value: "15,000", icon: Calendar, color: "text-warning" },
                ].map((stat, i) => (
                  <div key={i} className="p-3 rounded-xl bg-muted/30 border border-border/30">
                    <stat.icon className={`h-5 w-5 ${stat.color} mb-1.5`} />
                    <p className="text-lg font-bold">{stat.value} <span className="text-xs font-normal text-muted-foreground">FCFA</span></p>
                    <p className="text-[11px] text-muted-foreground">{language === "fr" ? stat.labelFr : stat.labelEn}</p>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{language === "fr" ? "Retrait disponible" : "Available for withdrawal"}</p>
                  <p className="text-xs text-muted-foreground">{language === "fr" ? "Via Mobile Money ou virement" : "Via Mobile Money or bank transfer"}</p>
                </div>
                <Button size="sm" className="rounded-xl" onClick={() => toast.success(language === "fr" ? "Demande de retrait envoyée ! (démo)" : "Withdrawal request sent! (demo)")}>
                  {language === "fr" ? "Retirer" : "Withdraw"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent transactions */}
          <Card className="rounded-2xl border-border/50 shadow-card">
            <CardHeader><CardTitle className="text-lg">{language === "fr" ? "Transactions Récentes" : "Recent Transactions"}</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {[
                { type: "rental", nameEn: "Tractor rental – Amadou D.", nameFr: "Location tracteur – Amadou D.", amount: 25000, commission: 1250, date: "2026-04-02", status: "completed" },
                { type: "product", nameEn: "Tomatoes sale – 50kg", nameFr: "Vente tomates – 50kg", amount: 15000, commission: 450, date: "2026-04-01", status: "completed" },
                { type: "rental", nameEn: "Seeder rental – Fatou S.", nameFr: "Location semoir – Fatou S.", amount: 18000, commission: 900, date: "2026-03-30", status: "completed" },
                { type: "product", nameEn: "Rice sale – 100kg", nameFr: "Vente riz – 100kg", amount: 35000, commission: 1050, date: "2026-03-28", status: "pending" },
              ].map((tx, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-border/20">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${tx.type === "rental" ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"}`}>
                      {tx.type === "rental" ? <Settings className="h-4 w-4" /> : <ShoppingBasket className="h-4 w-4" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{language === "fr" ? tx.nameFr : tx.nameEn}</p>
                      <p className="text-[11px] text-muted-foreground">{tx.date}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <p className="text-sm font-bold">{tx.amount.toLocaleString()} F</p>
                    <p className="text-[10px] text-destructive">-{tx.commission.toLocaleString()} F {language === "fr" ? "comm." : "fee"}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Commission model */}
          <Card className="rounded-2xl border-border/50 shadow-card">
            <CardHeader><CardTitle className="text-lg">{commissionLabel}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {language === "fr"
                  ? "AgriLink prélève automatiquement les commissions sur chaque transaction avant le versement."
                  : "AgriLink automatically deducts commissions from each transaction before payout."}
              </p>
              <div className="space-y-2">
                {[
                  { labelEn: "Equipment Rental", labelFr: "Location Équipement", rate: "3-5%" },
                  { labelEn: "Product Sales", labelFr: "Vente Produits", rate: "2-4%" },
                  { labelEn: "Processing Fee", labelFr: "Frais Traitement", rate: "1.5%" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/30">
                    <p className="text-sm font-medium">{language === "fr" ? item.labelFr : item.labelEn}</p>
                    <Badge variant="outline" className="rounded-full text-xs font-bold">{item.rate}</Badge>
                  </div>
                ))}
              </div>
              <div className="p-3 rounded-xl bg-primary/5 border border-primary/10">
                <p className="text-xs text-muted-foreground">
                  💡 {language === "fr"
                    ? "Passez au plan Pro pour 0% de commission."
                    : "Upgrade to Pro for 0% commission."}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
