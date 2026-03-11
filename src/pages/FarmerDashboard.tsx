import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { mockBookings } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, MapPin, Calendar, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const statusColors: Record<string, string> = {
  pending: "bg-warning/10 text-warning border-warning/20",
  accepted: "bg-primary/10 text-primary border-primary/20",
  rejected: "bg-destructive/10 text-destructive border-destructive/20",
  completed: "bg-muted text-muted-foreground border-border",
};

const FarmerDashboard = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const bookings = mockBookings.filter((b) => b.farmerId === user?.id || b.farmerId === "f1");
  const active = bookings.filter((b) => b.status === "pending" || b.status === "accepted");
  const history = bookings.filter((b) => b.status === "completed" || b.status === "rejected");

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold mb-1">{t.farmer.title}</h1>
        <p className="text-muted-foreground mb-8">{t.farmer.welcome}, {user?.name || "Farmer"} 👋</p>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {[
          { to: "/marketplace", icon: ShoppingCart, label: t.farmer.findEquipment, color: "text-primary" },
          { to: "/map", icon: MapPin, label: t.farmer.viewMap, color: "text-secondary" },
        ].map((item, i) => (
          <motion.div
            key={item.to}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link to={item.to}>
              <Card className="hover:shadow-elevated transition-all duration-300 cursor-pointer h-full rounded-2xl border-border/50 group">
                <CardContent className="p-6 flex flex-col items-center gap-3 text-center">
                  <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center group-hover:scale-105 transition-transform">
                    <item.icon className={`h-7 w-7 ${item.color}`} />
                  </div>
                  <span className="text-sm font-semibold">{item.label}</span>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Active Bookings */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="mb-6 rounded-2xl shadow-card border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">{t.farmer.activeBookings} ({active.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {active.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">{t.booking.noBookings}</p>
            ) : (
              active.map((b) => (
                <div key={b.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border border-border/50">
                  <div>
                    <p className="font-semibold text-sm">{b.equipmentName}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <Calendar className="h-3 w-3" />
                      {b.date} <span>•</span> {b.hectares} ha
                    </div>
                  </div>
                  <Badge variant="outline" className={`rounded-full ${statusColors[b.status]}`}>
                    {t.booking[b.status as keyof typeof t.booking]}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* History */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="rounded-2xl shadow-card border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">{t.farmer.bookingHistory}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {history.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">{t.booking.noBookings}</p>
            ) : (
              history.map((b) => (
                <div key={b.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/30">
                  <div>
                    <p className="font-semibold text-sm">{b.equipmentName}</p>
                    <p className="text-xs text-muted-foreground">{b.date} • {b.totalPrice.toLocaleString()} FCFA</p>
                  </div>
                  <Badge variant="outline" className={`rounded-full ${statusColors[b.status]}`}>
                    {t.booking[b.status as keyof typeof t.booking]}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default FarmerDashboard;
