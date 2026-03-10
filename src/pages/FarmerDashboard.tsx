import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { mockBookings } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, MapPin, Calendar, ArrowRight } from "lucide-react";

const statusColors: Record<string, string> = {
  pending: "bg-warning text-foreground",
  accepted: "bg-primary",
  rejected: "bg-destructive",
  completed: "bg-muted text-muted-foreground",
};

const FarmerDashboard = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const bookings = mockBookings.filter((b) => b.farmerId === user?.id || b.farmerId === "f1");
  const active = bookings.filter((b) => b.status === "pending" || b.status === "accepted");
  const history = bookings.filter((b) => b.status === "completed" || b.status === "rejected");

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      <h1 className="text-2xl font-bold mb-1">{t.farmer.title}</h1>
      <p className="text-muted-foreground mb-6">{t.farmer.welcome}, {user?.name || "Farmer"} 👋</p>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Link to="/marketplace">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardContent className="p-4 flex flex-col items-center gap-2 text-center">
              <ShoppingCart className="h-8 w-8 text-primary" />
              <span className="text-sm font-medium">{t.farmer.findEquipment}</span>
            </CardContent>
          </Card>
        </Link>
        <Link to="/map">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardContent className="p-4 flex flex-col items-center gap-2 text-center">
              <MapPin className="h-8 w-8 text-secondary" />
              <span className="text-sm font-medium">{t.farmer.viewMap}</span>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Active Bookings */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">{t.farmer.activeBookings} ({active.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {active.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t.booking.noBookings}</p>
          ) : (
            active.map((b) => (
              <div key={b.id} className="flex items-center justify-between p-3 rounded-lg bg-muted">
                <div>
                  <p className="font-medium text-sm">{b.equipmentName}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <Calendar className="h-3 w-3" />
                    {b.date}
                    <span>•</span>
                    {b.hectares} ha
                  </div>
                </div>
                <Badge className={statusColors[b.status]}>{t.booking[b.status as keyof typeof t.booking]}</Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Booking History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t.farmer.bookingHistory}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {history.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t.booking.noBookings}</p>
          ) : (
            history.map((b) => (
              <div key={b.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium text-sm">{b.equipmentName}</p>
                  <p className="text-xs text-muted-foreground">{b.date} • {b.totalPrice.toLocaleString()} FCFA</p>
                </div>
                <Badge className={statusColors[b.status]}>{t.booking[b.status as keyof typeof t.booking]}</Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FarmerDashboard;
