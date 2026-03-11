import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { equipmentList, equipmentTypeIcons } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, MapPin, User, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const EquipmentDetail = () => {
  const { id } = useParams();
  const { t, language } = useLanguage();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const eq = equipmentList.find((e) => e.id === id);

  const [date, setDate] = useState<Date | undefined>();
  const [hectares, setHectares] = useState("");
  const [farmLocation, setFarmLocation] = useState("");
  const [instructions, setInstructions] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("mobile_money");
  const [booked, setBooked] = useState(false);

  if (!eq) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-lg text-muted-foreground">Equipment not found</p>
        <Link to="/marketplace"><Button className="mt-4 rounded-xl">{t.common.back}</Button></Link>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) { navigate("/login"); return; }
    setBooked(true);
    toast.success(t.booking.success);
  };

  const totalPrice = hectares ? parseInt(hectares) * eq.pricePerHectare : 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Link to="/marketplace" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
        <ArrowLeft className="h-4 w-4" />
        {t.common.back}
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left: Image & Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-5"
        >
          <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-card">
            <img src={eq.image} alt={eq.name} className="w-full h-full object-cover" />
          </div>

          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <span className="text-3xl">{equipmentTypeIcons[eq.type]}</span>
              <h1 className="text-2xl md:text-3xl font-bold">{eq.name}</h1>
            </div>
            <Badge className={`rounded-full px-3 ${eq.available ? "bg-primary/10 text-primary border-primary/20" : "bg-destructive/10 text-destructive border-destructive/20"}`} variant="outline">
              {eq.available ? t.equipment.available : t.equipment.unavailable}
            </Badge>
          </div>

          <p className="text-muted-foreground leading-relaxed">{language === "fr" ? eq.descriptionFr : eq.description}</p>

          <div className="space-y-2.5">
            <div className="flex items-center gap-2.5 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{eq.location}</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>{eq.ownerName}</span>
              <Badge variant="outline" className="text-xs capitalize rounded-full">{eq.ownerType}</Badge>
            </div>
          </div>

          <div className="flex gap-4 p-5 rounded-2xl bg-muted/50 border border-border/50">
            <div>
              <p className="text-sm text-muted-foreground mb-1">{t.equipment.price}</p>
              <p className="text-2xl font-bold text-primary">{eq.pricePerHectare.toLocaleString()} <span className="text-sm font-normal text-muted-foreground">{eq.currency}{t.equipment.perHectare}</span></p>
            </div>
            <div className="border-l border-border/50 pl-4">
              <p className="text-sm text-muted-foreground mb-1">&nbsp;</p>
              <p className="text-2xl font-bold text-primary">{eq.pricePerHour.toLocaleString()} <span className="text-sm font-normal text-muted-foreground">{eq.currency}{t.equipment.perHour}</span></p>
            </div>
          </div>
        </motion.div>

        {/* Right: Booking Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {booked ? (
            <Card className="border-primary/20 bg-accent/30 rounded-2xl shadow-card">
              <CardContent className="p-10 text-center">
                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
                  <CheckCircle2 className="h-10 w-10 text-primary" />
                </div>
                <h2 className="text-xl font-bold mb-2">{t.booking.success}</h2>
                <p className="text-muted-foreground mb-6">
                  {t.booking.status}: <Badge className="rounded-full">{t.booking.pending}</Badge>
                </p>
                <Link to="/farmer">
                  <Button className="rounded-xl">{t.farmer.title}</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <Card className="rounded-2xl shadow-card border-border/50">
              <CardHeader>
                <CardTitle className="text-xl">{t.equipment.bookingForm}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">{t.equipment.availability}</Label>
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="rounded-xl border"
                      disabled={(d) => d < new Date()}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hectares" className="text-sm font-medium">{t.equipment.hectares}</Label>
                    <Input id="hectares" type="number" min="1" value={hectares} onChange={(e) => setHectares(e.target.value)} required className="h-12 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="farmLoc" className="text-sm font-medium">{t.equipment.farmLocation}</Label>
                    <Input id="farmLoc" value={farmLocation} onChange={(e) => setFarmLocation(e.target.value)} required className="h-12 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instructions" className="text-sm font-medium">{t.equipment.instructions}</Label>
                    <Textarea id="instructions" value={instructions} onChange={(e) => setInstructions(e.target.value)} rows={3} className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">{t.booking.paymentMethod}</Label>
                    <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                      <SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mobile_money">{t.booking.mobileMoney}</SelectItem>
                        <SelectItem value="cash">{t.booking.cash}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {totalPrice > 0 && (
                    <div className="p-4 rounded-xl bg-accent/50 border border-primary/10 text-center">
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="text-3xl font-bold text-primary">{totalPrice.toLocaleString()} {eq.currency}</p>
                    </div>
                  )}
                  <Button type="submit" className="w-full h-12 rounded-xl text-base shadow-sm" size="lg" disabled={!eq.available || !date || !hectares}>
                    {t.equipment.submit}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default EquipmentDetail;
