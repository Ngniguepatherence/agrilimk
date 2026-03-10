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
import { ArrowLeft, MapPin, User, Phone, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

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
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-lg text-muted-foreground">Equipment not found</p>
        <Link to="/marketplace"><Button className="mt-4">{t.common.back}</Button></Link>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setBooked(true);
    toast.success(t.booking.success);
  };

  const totalPrice = hectares ? parseInt(hectares) * eq.pricePerHectare : 0;

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <Link to="/marketplace" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="h-4 w-4" />
        {t.common.back}
      </Link>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left: Image & Info */}
        <div className="space-y-4">
          <div className="aspect-[4/3] rounded-xl overflow-hidden bg-muted">
            <img src={eq.image} alt={eq.name} className="w-full h-full object-cover" />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{equipmentTypeIcons[eq.type]}</span>
              <h1 className="text-2xl font-bold">{eq.name}</h1>
            </div>
            <Badge className={eq.available ? "bg-primary" : "bg-destructive"}>
              {eq.available ? t.equipment.available : t.equipment.unavailable}
            </Badge>
          </div>

          <p className="text-muted-foreground">{language === "fr" ? eq.descriptionFr : eq.description}</p>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{eq.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>{eq.ownerName}</span>
              <Badge variant="outline" className="text-xs capitalize">{eq.ownerType}</Badge>
            </div>
          </div>

          <div className="flex gap-4 p-4 rounded-lg bg-muted">
            <div>
              <p className="text-sm text-muted-foreground">{t.equipment.price}</p>
              <p className="text-xl font-bold text-primary">{eq.pricePerHectare.toLocaleString()} {eq.currency}<span className="text-sm font-normal text-muted-foreground">{t.equipment.perHectare}</span></p>
            </div>
            <div className="border-l pl-4">
              <p className="text-sm text-muted-foreground">&nbsp;</p>
              <p className="text-xl font-bold text-primary">{eq.pricePerHour.toLocaleString()} {eq.currency}<span className="text-sm font-normal text-muted-foreground">{t.equipment.perHour}</span></p>
            </div>
          </div>
        </div>

        {/* Right: Booking Form */}
        <div>
          {booked ? (
            <Card className="border-primary">
              <CardContent className="p-8 text-center">
                <CheckCircle2 className="h-16 w-16 text-primary mx-auto mb-4" />
                <h2 className="text-xl font-bold mb-2">{t.booking.success}</h2>
                <p className="text-muted-foreground mb-4">
                  {t.booking.status}: <Badge>{t.booking.pending}</Badge>
                </p>
                <Link to="/farmer">
                  <Button>{t.farmer.title}</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>{t.equipment.bookingForm}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label>{t.equipment.availability}</Label>
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="rounded-md border"
                      disabled={(d) => d < new Date()}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hectares">{t.equipment.hectares}</Label>
                    <Input id="hectares" type="number" min="1" value={hectares} onChange={(e) => setHectares(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="farmLoc">{t.equipment.farmLocation}</Label>
                    <Input id="farmLoc" value={farmLocation} onChange={(e) => setFarmLocation(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instructions">{t.equipment.instructions}</Label>
                    <Textarea id="instructions" value={instructions} onChange={(e) => setInstructions(e.target.value)} rows={3} />
                  </div>
                  <div className="space-y-2">
                    <Label>{t.booking.paymentMethod}</Label>
                    <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mobile_money">{t.booking.mobileMoney}</SelectItem>
                        <SelectItem value="cash">{t.booking.cash}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {totalPrice > 0 && (
                    <div className="p-3 rounded-lg bg-muted text-center">
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="text-2xl font-bold text-primary">{totalPrice.toLocaleString()} {eq.currency}</p>
                    </div>
                  )}
                  <Button type="submit" className="w-full" size="lg" disabled={!eq.available || !date || !hectares}>
                    {t.equipment.submit}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default EquipmentDetail;
