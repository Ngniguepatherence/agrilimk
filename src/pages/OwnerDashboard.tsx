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
import { Calendar, DollarSign, Package, TrendingUp, Check, X, Plus } from "lucide-react";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  pending: "bg-warning text-foreground",
  accepted: "bg-primary",
  rejected: "bg-destructive",
  completed: "bg-muted text-muted-foreground",
};

const OwnerDashboard = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [bookings, setBookings] = useState(mockBookings);
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
    tractor: t.equipment.tractor,
    plough: t.equipment.plough,
    seeder: t.equipment.seeder,
    harvester: t.equipment.harvester,
    irrigationPump: t.equipment.irrigationPump,
    sprayer: t.equipment.sprayer,
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      <h1 className="text-2xl font-bold mb-1">{t.owner.title}</h1>
      <p className="text-muted-foreground mb-6">{t.owner.welcome}, {user?.name || "Owner"} 👋</p>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: t.owner.totalBookings, value: ownerBookings.length, icon: Calendar, color: "text-primary" },
          { label: t.owner.upcoming, value: upcoming.length, icon: TrendingUp, color: "text-info" },
          { label: t.owner.totalRevenue, value: `${(totalRevenue / 1000).toFixed(0)}K`, icon: DollarSign, color: "text-secondary" },
          { label: t.owner.equipmentCount, value: ownerEquipment.length, icon: Package, color: "text-primary" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <stat.icon className={`h-5 w-5 ${stat.color} mb-2`} />
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="bookings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="bookings">{t.owner.bookingRequests} ({pendingBookings.length})</TabsTrigger>
          <TabsTrigger value="equipment">{t.owner.myEquipment}</TabsTrigger>
          <TabsTrigger value="earnings">{t.owner.earnings}</TabsTrigger>
        </TabsList>

        {/* Booking Requests */}
        <TabsContent value="bookings" className="space-y-3">
          {pendingBookings.length === 0 ? (
            <Card><CardContent className="p-6 text-center text-muted-foreground">No pending requests</CardContent></Card>
          ) : (
            pendingBookings.map((b) => (
              <Card key={b.id}>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <p className="font-bold">{b.equipmentName}</p>
                      <p className="text-sm text-muted-foreground">{b.farmerName} • {b.date} • {b.hectares} ha</p>
                      <p className="text-sm text-muted-foreground">{b.farmLocation}</p>
                      {b.instructions && <p className="text-xs text-muted-foreground mt-1">"{b.instructions}"</p>}
                      <p className="font-bold text-primary mt-1">{b.totalPrice.toLocaleString()} FCFA</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleBookingAction(b.id, "accepted")}>
                        <Check className="h-4 w-4 mr-1" />{t.owner.accept}
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleBookingAction(b.id, "rejected")}>
                        <X className="h-4 w-4 mr-1" />{t.owner.reject}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
          {/* Accepted/Completed */}
          {ownerBookings.filter((b) => b.status !== "pending").map((b) => (
            <Card key={b.id} className="opacity-75">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{b.equipmentName} — {b.farmerName}</p>
                  <p className="text-xs text-muted-foreground">{b.date} • {b.totalPrice.toLocaleString()} FCFA</p>
                </div>
                <Badge className={statusColors[b.status]}>{t.booking[b.status as keyof typeof t.booking]}</Badge>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Equipment */}
        <TabsContent value="equipment" className="space-y-3">
          <div className="flex justify-end">
            <Dialog>
              <DialogTrigger asChild>
                <Button><Plus className="h-4 w-4 mr-1" />{t.owner.addEquipment}</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>{t.owner.addEquipment}</DialogTitle></DialogHeader>
                <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); toast.success("Equipment added (demo)"); }}>
                  <div className="space-y-1"><Label>{t.owner.equipmentName}</Label><Input required /></div>
                  <div className="space-y-1">
                    <Label>{t.owner.equipmentType}</Label>
                    <Select>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {(Object.keys(typeLabels) as EquipmentType[]).map((type) => (
                          <SelectItem key={type} value={type}>{equipmentTypeIcons[type]} {typeLabels[type]}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1"><Label>{t.owner.pricePerHectare}</Label><Input type="number" /></div>
                    <div className="space-y-1"><Label>{t.owner.pricePerHour}</Label><Input type="number" /></div>
                  </div>
                  <div className="space-y-1"><Label>{t.equipment.location}</Label><Input required /></div>
                  <Button type="submit" className="w-full">{t.common.save}</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          {ownerEquipment.map((eq) => (
            <Card key={eq.id}>
              <CardContent className="p-4 flex items-center gap-4">
                <img src={eq.image} alt={eq.name} className="h-16 w-16 rounded-lg object-cover" loading="lazy" />
                <div className="flex-1">
                  <p className="font-bold">{equipmentTypeIcons[eq.type]} {eq.name}</p>
                  <p className="text-sm text-muted-foreground">{eq.location} • {eq.pricePerHectare.toLocaleString()} FCFA/ha</p>
                </div>
                <Badge className={eq.available ? "bg-primary" : "bg-destructive"}>
                  {eq.available ? t.equipment.available : t.equipment.unavailable}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Earnings */}
        <TabsContent value="earnings">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-sm text-muted-foreground mb-2">{t.owner.totalRevenue}</p>
              <p className="text-4xl font-bold text-primary">{totalRevenue.toLocaleString()} FCFA</p>
              <p className="text-sm text-muted-foreground mt-4">{ownerBookings.filter((b) => b.status === "completed").length} completed bookings</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OwnerDashboard;
