import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { equipmentList, equipmentTypeIcons, EquipmentType } from "@/data/mockData";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "@/components/ui/button";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const farmerIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  className: "hue-rotate-[200deg]",
});

function SetView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => { map.setView(center, 8); }, [center]);
  return null;
}

const MapView = () => {
  const { t } = useLanguage();
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [userLoc] = useState<[number, number]>([14.6928, -17.4467]);

  const typeLabels: Record<EquipmentType, string> = {
    tractor: t.equipment.tractor, plough: t.equipment.plough, seeder: t.equipment.seeder,
    harvester: t.equipment.harvester, irrigationPump: t.equipment.irrigationPump, sprayer: t.equipment.sprayer,
  };

  const filtered = equipmentList.filter((eq) => typeFilter === "all" || eq.type === typeFilter);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="px-4 py-3 border-b glass flex items-center gap-3">
        <h1 className="font-bold text-lg hidden sm:block">{t.map.title}</h1>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-52 rounded-xl bg-card shadow-sm">
            <SelectValue placeholder={t.map.filterByType} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.equipment.filterAll}</SelectItem>
            {(Object.keys(typeLabels) as EquipmentType[]).map((type) => (
              <SelectItem key={type} value={type}>{equipmentTypeIcons[type]} {typeLabels[type]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Badge variant="outline" className="rounded-full text-xs">{filtered.length} {t.equipment.available.toLowerCase()}</Badge>
      </div>

      <div className="flex-1">
        <MapContainer center={userLoc} zoom={8} className="h-full w-full" style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <SetView center={userLoc} />
          <Marker position={userLoc} icon={farmerIcon}>
            <Popup><strong>{t.map.yourLocation}</strong></Popup>
          </Marker>
          {filtered.map((eq) => (
            <Marker key={eq.id} position={[eq.lat, eq.lng]}>
              <Popup>
                <div className="min-w-[200px]">
                  <p className="font-bold text-sm">{equipmentTypeIcons[eq.type]} {eq.name}</p>
                  <p className="text-xs text-muted-foreground">{eq.ownerName}</p>
                  <p className="text-xs">{eq.location}</p>
                  <p className="font-bold text-sm mt-1">{eq.pricePerHectare.toLocaleString()} {eq.currency}/ha</p>
                  <Link to={`/equipment/${eq.id}`}>
                    <Button size="sm" className="mt-2 w-full text-xs h-7 rounded-lg">{t.equipment.details}</Button>
                  </Link>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapView;
