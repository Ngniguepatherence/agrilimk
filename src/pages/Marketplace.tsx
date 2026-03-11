import { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { equipmentList, equipmentTypeIcons, EquipmentType } from "@/data/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Search, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const Marketplace = () => {
  const { t } = useLanguage();
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
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{t.equipment.title}</h1>
        <p className="text-muted-foreground mb-8">Find and book agricultural equipment near you</p>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t.equipment.search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-11 h-12 rounded-xl bg-card shadow-card border-border/50"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-52 h-12 rounded-xl bg-card shadow-card border-border/50">
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
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((eq, i) => (
          <motion.div
            key={eq.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.4 }}
          >
            <Card className="overflow-hidden group hover:shadow-elevated transition-all duration-300 border-border/50 bg-card rounded-2xl">
              <div className="aspect-[4/3] relative overflow-hidden">
                <img
                  src={eq.image}
                  alt={eq.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent" />
                <Badge
                  className={`absolute top-3 right-3 rounded-full px-3 ${
                    eq.available
                      ? "bg-primary/90 text-primary-foreground backdrop-blur-sm"
                      : "bg-destructive/90 text-destructive-foreground backdrop-blur-sm"
                  }`}
                >
                  {eq.available ? t.equipment.available : t.equipment.unavailable}
                </Badge>
                <div className="absolute top-3 left-3 text-2xl bg-card/80 backdrop-blur-sm rounded-full h-10 w-10 flex items-center justify-center">
                  {equipmentTypeIcons[eq.type]}
                </div>
              </div>
              <CardContent className="p-5">
                <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{eq.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{eq.ownerName}</p>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
                  <MapPin className="h-3.5 w-3.5" />
                  {eq.location}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-primary text-xl">{eq.pricePerHectare.toLocaleString()}</span>
                    <span className="text-sm text-muted-foreground ml-1">{eq.currency}{t.equipment.perHectare}</span>
                  </div>
                  <Link to={`/equipment/${eq.id}`}>
                    <Button
                      size="sm"
                      disabled={!eq.available}
                      className="rounded-xl gap-1 shadow-sm"
                    >
                      {t.equipment.details}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <Search className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">{t.common.noResults}</p>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
