import { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { equipmentList, equipmentTypeIcons, EquipmentType } from "@/data/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Search } from "lucide-react";

const Marketplace = () => {
  const { t, language } = useLanguage();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const typeLabels: Record<EquipmentType, string> = {
    tractor: t.equipment.tractor,
    plough: t.equipment.plough,
    seeder: t.equipment.seeder,
    harvester: t.equipment.harvester,
    irrigationPump: t.equipment.irrigationPump,
    sprayer: t.equipment.sprayer,
  };

  const filtered = equipmentList.filter((eq) => {
    const matchSearch = eq.name.toLowerCase().includes(search.toLowerCase()) || eq.location.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || eq.type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">{t.equipment.title}</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t.equipment.search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder={t.equipment.filterType} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.equipment.filterAll}</SelectItem>
            {(Object.keys(typeLabels) as EquipmentType[]).map((type) => (
              <SelectItem key={type} value={type}>
                {equipmentTypeIcons[type]} {typeLabels[type]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Equipment Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((eq) => (
          <Card key={eq.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <div className="aspect-[4/3] relative overflow-hidden bg-muted">
              <img src={eq.image} alt={eq.name} className="w-full h-full object-cover" loading="lazy" />
              <Badge
                className={`absolute top-2 right-2 ${eq.available ? "bg-primary" : "bg-destructive"}`}
              >
                {eq.available ? t.equipment.available : t.equipment.unavailable}
              </Badge>
              <div className="absolute top-2 left-2 text-2xl">{equipmentTypeIcons[eq.type]}</div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-bold text-lg mb-1">{eq.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">{eq.ownerName}</p>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                <MapPin className="h-3.5 w-3.5" />
                {eq.location}
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-primary text-lg">{eq.pricePerHectare.toLocaleString()} {eq.currency}</span>
                  <span className="text-sm text-muted-foreground">{t.equipment.perHectare}</span>
                </div>
                <Link to={`/equipment/${eq.id}`}>
                  <Button size="sm" disabled={!eq.available}>
                    {t.equipment.details}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg">{t.common.noResults}</p>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
