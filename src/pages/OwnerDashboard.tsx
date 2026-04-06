import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { equipmentList, mockBookings, equipmentTypeIcons, EquipmentType } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, DollarSign, Package, TrendingUp, Check, X, Plus, MapPin, Phone, Mail, ShieldCheck, Star, Wheat, User, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const statusColors: Record<string, string> = {
  pending: "bg-warning/10 text-warning border-warning/20",
  accepted: "bg-primary/10 text-primary border-primary/20",
  rejected: "bg-destructive/10 text-destructive border-destructive/20",
  completed: "bg-muted text-muted-foreground border-border",
};

const OwnerDashboard = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [bookings, setBookings] = useState(mockBookings);
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);
  const ownerEquipment = equipmentList.filter((eq) => eq.ownerName === "Commune de Thiès" || eq.ownerType === "municipality");
  const ownerBookings = bookings;

  const totalRevenue = ownerBookings.filter((b) => b.status === "completed" || b.status === "accepted").reduce((sum, b) => sum + b.totalPrice, 0);
  const pendingBookings = ownerBookings.filter((b) => b.status === "pending");
  const upcoming = ownerBookings.filter((b) => b.status === "accepted");

  const handleBookingAction = (bookingId: string, action: "accepted" | "rejected") => {
    setBookings((prev) => prev.map((b) => b.id === bookingId ? { ...b, status: action } : b));
    toast.success(action === "accepted" ? "Booking accepted" : "Booking rejected");
  };

  const typeLabels: Record<EquipmentType, string> = {
    tractor: t.equipment.tractor, plough: t.equipment.plough, seeder: t.equipment.seeder,
    harvester: t.equipment.harvester, irrigationPump: t.equipment.irrigationPump, sprayer: t.equipment.sprayer,
  };

  const statCards = [
    { label: t.owner.totalBookings, value: ownerBookings.length, icon: Calendar, gradient: "from-primary/10 to-accent" },
    { label: t.owner.upcoming, value: upcoming.length, icon: TrendingUp, gradient: "from-info/10 to-info/5" },
    { label: t.owner.totalRevenue, value: `${(totalRevenue / 1000).toFixed(0)}K`, icon: DollarSign, gradient: "from-secondary/10 to-secondary/5" },
    { label: t.owner.equipmentCount, value: ownerEquipment.length, icon: Package, gradient: "from-primary/10 to-accent" },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-bold mb-1">{t.owner.title}</h1>
        <p className="text-muted-foreground mb-8">{t.owner.welcome}, {user?.name || "Owner"} 👋</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card className="rounded-2xl border-border/50 shadow-card overflow-hidden">
              <CardContent className="p-5">
                <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-3`}>
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Tabs defaultValue="bookings" className="space-y-5">
        <TabsList className="rounded-xl bg-muted/50 p-1 h-auto">
          <TabsTrigger value="bookings" className="rounded-lg data-[state=active]:shadow-sm">{t.owner.bookingRequests} ({pendingBookings.length})</TabsTrigger>
          <TabsTrigger value="equipment" className="rounded-lg data-[state=active]:shadow-sm">{t.owner.myEquipment}</TabsTrigger>
          <TabsTrigger value="earnings" className="rounded-lg data-[state=active]:shadow-sm">{t.owner.earnings}</TabsTrigger>
        </TabsList>

        <TabsContent value="bookings" className="space-y-3">
          {pendingBookings.length === 0 ? (
            <Card className="rounded-2xl border-border/50"><CardContent className="p-8 text-center text-muted-foreground">No pending requests</CardContent></Card>
          ) : (
            pendingBookings.map((b) => (
              <Card key={b.id} className="rounded-2xl border-border/50 shadow-card">
                <CardContent className="p-5">
                  <div className="flex flex-col gap-4">
                    {/* Requester Profile */}
                    {b.farmerProfile && (
                      <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/30 border border-border/30">
                        <Avatar className="h-14 w-14 border-2 border-card shadow-sm">
                          <AvatarImage src={b.farmerProfile.avatar} alt={b.farmerProfile.name} />
                          <AvatarFallback>{b.farmerProfile.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-bold text-base">{b.farmerProfile.name}</p>
                            {b.farmerProfile.idVerified ? (
                              <Badge variant="outline" className="rounded-full bg-primary/10 text-primary border-primary/20 gap-1 text-xs">
                                <ShieldCheck className="h-3 w-3" /> {t.auth.verified}
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="rounded-full bg-warning/10 text-warning border-warning/20 gap-1 text-xs">
                                {t.auth.unverified}
                              </Badge>
                            )}
                            <Badge variant="outline" className="rounded-full text-xs gap-1">
                              <Star className="h-3 w-3 text-secondary" /> {b.farmerProfile.rating}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{b.farmerProfile.phone}</span>
                            <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{b.farmerProfile.email}</span>
                            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{b.farmerProfile.location}</span>
                            <span className="flex items-center gap-1"><Wheat className="h-3 w-3" />{b.farmerProfile.farmSize}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            {b.farmerProfile.crops.map((crop) => (
                              <Badge key={crop} variant="outline" className="rounded-full text-xs bg-primary/5 border-primary/10">{crop}</Badge>
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1.5">
                            {t.owner.memberSince} {b.farmerProfile.joinedDate} • {b.farmerProfile.totalBookings} {t.owner.previousBookings}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Booking Details */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <p className="font-bold text-base">{b.equipmentName}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          <Calendar className="h-3.5 w-3.5 inline mr-1" />{b.date} • {b.hectares} ha • <MapPin className="h-3.5 w-3.5 inline mr-1" />{b.farmLocation}
                        </p>
                        {b.instructions && <p className="text-xs text-muted-foreground mt-1 italic">"{b.instructions}"</p>}
                        <p className="font-bold text-primary mt-2 text-lg">{b.totalPrice.toLocaleString()} FCFA</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="rounded-xl gap-1" onClick={() => handleBookingAction(b.id, "accepted")}>
                          <Check className="h-4 w-4" />{t.owner.accept}
                        </Button>
                        <Button size="sm" variant="outline" className="rounded-xl gap-1 text-destructive hover:bg-destructive/10" onClick={() => handleBookingAction(b.id, "rejected")}>
                          <X className="h-4 w-4" />{t.owner.reject}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
          {ownerBookings.filter((b) => b.status !== "pending").map((b) => (
            <Card key={b.id} className="rounded-2xl border-border/30 opacity-80">
              <CardContent className="p-4 flex items-center justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  {b.farmerProfile && (
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarImage src={b.farmerProfile.avatar} />
                      <AvatarFallback className="text-xs">{b.farmerName.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{b.equipmentName} — {b.farmerName}</p>
                    <p className="text-xs text-muted-foreground">{b.date} • {b.totalPrice.toLocaleString()} FCFA</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {b.status === "accepted" && b.farmerProfile && (
                    <a
                      href={`https://wa.me/${b.farmerProfile.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                        `Bonjour ${b.farmerProfile.name}, votre réservation pour ${b.equipmentName} le ${b.date} a été acceptée. Discutons des détails !`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button size="sm" className="rounded-xl gap-1 bg-[#25D366] hover:bg-[#20bd5a] text-white h-8 px-3">
                        <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                      </Button>
                    </a>
                  )}
                  <Badge variant="outline" className={`rounded-full ${statusColors[b.status]}`}>{t.booking[b.status as keyof typeof t.booking]}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="equipment" className="space-y-3">
          <div className="flex justify-end">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="rounded-xl gap-1"><Plus className="h-4 w-4" />{t.owner.addEquipment}</Button>
              </DialogTrigger>
              <DialogContent className="rounded-2xl">
                <DialogHeader><DialogTitle>{t.owner.addEquipment}</DialogTitle></DialogHeader>
                <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); toast.success("Equipment added (demo)"); }}>
                  <div className="space-y-1"><Label>{t.owner.equipmentName}</Label><Input required className="rounded-xl" /></div>
                  <div className="space-y-1">
                    <Label>{t.owner.equipmentType}</Label>
                    <Select><SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                      <SelectContent>{(Object.keys(typeLabels) as EquipmentType[]).map((type) => (
                        <SelectItem key={type} value={type}>{equipmentTypeIcons[type]} {typeLabels[type]}</SelectItem>
                      ))}</SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1"><Label>{t.owner.pricePerHectare}</Label><Input type="number" className="rounded-xl" /></div>
                    <div className="space-y-1"><Label>{t.owner.pricePerHour}</Label><Input type="number" className="rounded-xl" /></div>
                  </div>
                  <div className="space-y-1"><Label>{t.equipment.location}</Label><Input required className="rounded-xl" /></div>
                  <Button type="submit" className="w-full rounded-xl">{t.common.save}</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          {ownerEquipment.map((eq) => (
            <Card key={eq.id} className="rounded-2xl border-border/50 shadow-card">
              <CardContent className="p-4 flex items-center gap-4">
                <img src={eq.image} alt={eq.name} className="h-16 w-16 rounded-xl object-cover" loading="lazy" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold truncate">{equipmentTypeIcons[eq.type]} {eq.name}</p>
                  <p className="text-sm text-muted-foreground">{eq.location} • {eq.pricePerHectare.toLocaleString()} FCFA/ha</p>
                </div>
                <Badge variant="outline" className={`rounded-full shrink-0 ${eq.available ? "bg-primary/10 text-primary border-primary/20" : "bg-destructive/10 text-destructive border-destructive/20"}`}>
                  {eq.available ? t.equipment.available : t.equipment.unavailable}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="earnings">
          <Card className="rounded-2xl shadow-card border-border/50">
            <CardContent className="p-10 text-center">
              <p className="text-sm text-muted-foreground mb-3">{t.owner.totalRevenue}</p>
              <p className="text-5xl font-bold text-gradient">{totalRevenue.toLocaleString()} FCFA</p>
              <p className="text-sm text-muted-foreground mt-4">{ownerBookings.filter((b) => b.status === "completed").length} completed bookings</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OwnerDashboard;
