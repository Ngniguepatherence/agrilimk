import { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { mockBookings, equipmentList, equipmentTypeIcons } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ShoppingCart, MapPin, Calendar, ArrowRight, TrendingUp, Clock,
  CheckCircle2, XCircle, DollarSign, Leaf, Sun, CloudRain, Wind,
  Star, ShieldCheck, Phone, Mail, Edit, Bell, Wheat
} from "lucide-react";
import { motion } from "framer-motion";

const statusColors: Record<string, string> = {
  pending: "bg-warning/10 text-warning border-warning/20",
  accepted: "bg-primary/10 text-primary border-primary/20",
  rejected: "bg-destructive/10 text-destructive border-destructive/20",
  completed: "bg-muted text-muted-foreground border-border",
};

const statusIcons: Record<string, React.ElementType> = {
  pending: Clock,
  accepted: CheckCircle2,
  rejected: XCircle,
  completed: CheckCircle2,
};

const FarmerDashboard = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const bookings = mockBookings.filter((b) => b.farmerId === user?.id || b.farmerId === "f1");
  const active = bookings.filter((b) => b.status === "pending" || b.status === "accepted");
  const history = bookings.filter((b) => b.status === "completed" || b.status === "rejected");
  const totalSpent = bookings.filter((b) => b.status === "completed" || b.status === "accepted").reduce((s, b) => s + b.totalPrice, 0);
  const totalHectares = bookings.reduce((s, b) => s + b.hectares, 0);

  // Mock weather
  const weather = { temp: 32, condition: "Ensoleillé", humidity: 45, wind: 12 };

  // Recommended equipment
  const recommended = equipmentList.filter((eq) => eq.available).slice(0, 3);

  const statCards = [
    { label: t.farmer.totalBookings, value: bookings.length, icon: Calendar, color: "text-primary" },
    { label: t.farmer.totalSpent, value: `${(totalSpent / 1000).toFixed(0)}K`, icon: DollarSign, color: "text-secondary" },
    { label: t.farmer.hectaresCultivated, value: totalHectares, icon: Wheat, color: "text-primary" },
    { label: t.farmer.activeNow, value: active.length, icon: TrendingUp, color: "text-info" },
  ];

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      {/* Profile Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <Card className="rounded-2xl border-border/50 shadow-card overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-primary/20 via-primary/10 to-secondary/10" />
          <CardContent className="relative px-5 pb-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-10">
              <Avatar className="h-20 w-20 border-4 border-card shadow-lg">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="text-xl bg-primary text-primary-foreground">{user?.name?.charAt(0) || "F"}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl font-bold">{user?.name || "Farmer"}</h1>
                  {user?.idVerified && (
                    <Badge variant="outline" className="rounded-full bg-primary/10 text-primary border-primary/20 gap-1">
                      <ShieldCheck className="h-3 w-3" /> {t.auth.verified}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1 flex-wrap">
                  {user?.location && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{user.location}</span>}
                  {user?.phone && <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{user.phone}</span>}
                </div>
              </div>
              <Button variant="outline" size="sm" className="rounded-xl gap-1.5 shrink-0">
                <Edit className="h-4 w-4" /> {t.farmer.editProfile}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {statCards.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <Card className="rounded-2xl border-border/50 shadow-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className={`h-9 w-9 rounded-xl bg-muted flex items-center justify-center`}>
                    <stat.icon className={`h-4.5 w-4.5 ${stat.color}`} />
                  </div>
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Main Content - Left 2 cols */}
        <div className="md:col-span-2 space-y-6">
          {/* Quick Actions */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="grid grid-cols-2 gap-3">
              {[
                { to: "/marketplace", icon: ShoppingCart, label: t.farmer.findEquipment, color: "text-primary", bg: "bg-primary/5" },
                { to: "/map", icon: MapPin, label: t.farmer.viewMap, color: "text-secondary", bg: "bg-secondary/5" },
              ].map((item) => (
                <Link key={item.to} to={item.to}>
                  <Card className="hover:shadow-elevated transition-all duration-300 cursor-pointer rounded-2xl border-border/50 group h-full">
                    <CardContent className="p-5 flex items-center gap-3">
                      <div className={`h-12 w-12 rounded-xl ${item.bg} flex items-center justify-center group-hover:scale-105 transition-transform shrink-0`}>
                        <item.icon className={`h-6 w-6 ${item.color}`} />
                      </div>
                      <div>
                        <span className="text-sm font-semibold block">{item.label}</span>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform mt-0.5" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Bookings Tabs */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Tabs defaultValue="active" className="space-y-4">
              <div className="flex items-center justify-between">
                <TabsList className="rounded-xl bg-muted/50 p-1 h-auto">
                  <TabsTrigger value="active" className="rounded-lg data-[state=active]:shadow-sm text-xs sm:text-sm">
                    {t.farmer.activeBookings} ({active.length})
                  </TabsTrigger>
                  <TabsTrigger value="history" className="rounded-lg data-[state=active]:shadow-sm text-xs sm:text-sm">
                    {t.farmer.bookingHistory} ({history.length})
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="active" className="space-y-3 mt-0">
                {active.length === 0 ? (
                  <Card className="rounded-2xl border-border/50">
                    <CardContent className="p-8 text-center">
                      <Calendar className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground">{t.booking.noBookings}</p>
                      <Link to="/marketplace">
                        <Button className="mt-4 rounded-xl" size="sm">{t.farmer.findEquipment}</Button>
                      </Link>
                    </CardContent>
                  </Card>
                ) : (
                  active.map((b) => {
                    const StatusIcon = statusIcons[b.status];
                    const eq = equipmentList.find((e) => e.id === b.equipmentId);
                    return (
                      <Card key={b.id} className="rounded-2xl border-border/50 shadow-card hover:shadow-elevated transition-all">
                        <CardContent className="p-4">
                          <div className="flex gap-3">
                            {eq && (
                              <img src={eq.image} alt={b.equipmentName} className="h-20 w-20 rounded-xl object-cover shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <p className="font-bold text-sm">{equipmentTypeIcons[eq?.type || "tractor"]} {b.equipmentName}</p>
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                    <Calendar className="h-3 w-3" />{b.date}
                                    <span>•</span>{b.hectares} ha
                                    <span>•</span><MapPin className="h-3 w-3" />{b.farmLocation}
                                  </div>
                                </div>
                                <Badge variant="outline" className={`rounded-full shrink-0 gap-1 ${statusColors[b.status]}`}>
                                  <StatusIcon className="h-3 w-3" />
                                  {t.booking[b.status as keyof typeof t.booking]}
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between mt-3">
                                <p className="text-sm font-bold text-primary">{b.totalPrice.toLocaleString()} FCFA</p>
                                <Badge variant="outline" className="rounded-full text-xs">
                                  {b.paymentMethod === "mobile_money" ? t.booking.mobileMoney : t.booking.cash}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </TabsContent>

              <TabsContent value="history" className="space-y-3 mt-0">
                {history.length === 0 ? (
                  <Card className="rounded-2xl border-border/50">
                    <CardContent className="p-8 text-center text-muted-foreground text-sm">{t.booking.noBookings}</CardContent>
                  </Card>
                ) : (
                  history.map((b) => {
                    const StatusIcon = statusIcons[b.status];
                    return (
                      <Card key={b.id} className="rounded-2xl border-border/30">
                        <CardContent className="p-4 flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-sm">{b.equipmentName}</p>
                            <p className="text-xs text-muted-foreground">{b.date} • {b.totalPrice.toLocaleString()} FCFA</p>
                          </div>
                          <Badge variant="outline" className={`rounded-full gap-1 ${statusColors[b.status]}`}>
                            <StatusIcon className="h-3 w-3" />
                            {t.booking[b.status as keyof typeof t.booking]}
                          </Badge>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>

        {/* Sidebar - Right col */}
        <div className="space-y-6">
          {/* Weather Card */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <Card className="rounded-2xl border-border/50 shadow-card overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-secondary to-primary" />
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Sun className="h-4 w-4 text-secondary" /> {t.farmer.weather}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl font-bold">{weather.temp}°C</span>
                  <span className="text-sm text-muted-foreground">{weather.condition}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <CloudRain className="h-3.5 w-3.5" /> {t.farmer.humidity}: {weather.humidity}%
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Wind className="h-3.5 w-3.5" /> {t.farmer.wind}: {weather.wind} km/h
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recommended Equipment */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
            <Card className="rounded-2xl border-border/50 shadow-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Star className="h-4 w-4 text-secondary" /> {t.farmer.recommended}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recommended.map((eq) => (
                  <Link key={eq.id} to={`/equipment/${eq.id}`}>
                    <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer">
                      <img src={eq.image} alt={eq.name} className="h-12 w-12 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold truncate">{equipmentTypeIcons[eq.type]} {eq.name}</p>
                        <p className="text-xs text-muted-foreground">{eq.pricePerHectare.toLocaleString()} FCFA/ha</p>
                      </div>
                    </div>
                  </Link>
                ))}
                <Link to="/marketplace">
                  <Button variant="outline" size="sm" className="w-full rounded-xl mt-1 text-xs gap-1">
                    {t.farmer.seeAll} <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          {/* Verification Status */}
          {!user?.idVerified && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card className="rounded-2xl border-warning/30 bg-warning/5 shadow-card">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="h-5 w-5 text-warning shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold">{t.farmer.verifyAccount}</p>
                      <p className="text-xs text-muted-foreground mt-1">{t.farmer.verifyDescription}</p>
                      <Button size="sm" className="mt-3 rounded-xl text-xs h-8">{t.farmer.verifyNow}</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Notifications */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
            <Card className="rounded-2xl border-border/50 shadow-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Bell className="h-4 w-4 text-primary" /> {t.farmer.notifications}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="p-2.5 rounded-xl bg-primary/5 border border-primary/10">
                  <p className="text-xs font-medium">{t.farmer.notif1}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">2h ago</p>
                </div>
                <div className="p-2.5 rounded-xl bg-muted/50 border border-border/30">
                  <p className="text-xs font-medium">{t.farmer.notif2}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">1 day ago</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
