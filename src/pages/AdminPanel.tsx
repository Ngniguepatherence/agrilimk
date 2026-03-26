import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { equipmentList, mockBookings, equipmentTypeIcons, EquipmentType } from "@/data/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Package, Calendar, DollarSign, Check, Ban, Plus } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const mockAdminUsers = [
  { id: "f1", name: "Amadou Diallo", email: "farmer@agrilink.com", role: "farmer", status: "active" },
  { id: "o1", name: "Commune de Thiès", email: "owner@agrilink.com", role: "owner", status: "active" },
  { id: "c1", name: "Mairie de Fatick", email: "collectivity@agrilink.com", role: "collectivity", status: "active" },
  { id: "f2", name: "Moussa Fall", email: "moussa@example.com", role: "farmer", status: "active" },
  { id: "f3", name: "Awa Seck", email: "awa@example.com", role: "farmer", status: "active" },
  { id: "o2", name: "Ibrahim Ndiaye", email: "ibrahim@example.com", role: "owner", status: "pending" },
];

const AdminPanel = () => {
  const { t } = useLanguage();
  const [users, setUsers] = useState(mockAdminUsers);
  const totalRevenue = mockBookings.reduce((sum, b) => sum + b.totalPrice, 0);

  const toggleUser = (id: string) => {
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, status: u.status === "active" ? "blocked" : "active" } : u));
    toast.success("User status updated");
  };

  const typeLabels: Record<EquipmentType, string> = {
    tractor: t.equipment.tractor, plough: t.equipment.plough, seeder: t.equipment.seeder,
    harvester: t.equipment.harvester, irrigationPump: t.equipment.irrigationPump, sprayer: t.equipment.sprayer,
  };

  const statCards = [
    { label: t.admin.totalUsers, value: users.length, icon: Users },
    { label: t.admin.totalEquipment, value: equipmentList.length, icon: Package },
    { label: t.admin.totalBookings, value: mockBookings.length, icon: Calendar },
    { label: t.admin.totalRevenue, value: `${(totalRevenue / 1000).toFixed(0)}K`, icon: DollarSign },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-bold mb-8">{t.admin.title}</h1>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card className="rounded-2xl border-border/50 shadow-card">
              <CardContent className="p-5">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/10 to-accent flex items-center justify-center mb-3">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Tabs defaultValue="users" className="space-y-5">
        <TabsList className="rounded-xl bg-muted/50 p-1 h-auto">
          <TabsTrigger value="users" className="rounded-lg data-[state=active]:shadow-sm">{t.admin.users}</TabsTrigger>
          <TabsTrigger value="equipment" className="rounded-lg data-[state=active]:shadow-sm">{t.admin.equipment}</TabsTrigger>
          <TabsTrigger value="addEquipment" className="rounded-lg data-[state=active]:shadow-sm">{t.admin.addEquipment}</TabsTrigger>
          <TabsTrigger value="activity" className="rounded-lg data-[state=active]:shadow-sm">{t.admin.activity}</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card className="rounded-2xl border-border/50 shadow-card overflow-hidden">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Role</TableHead><TableHead>{t.admin.status}</TableHead><TableHead>{t.admin.manage}</TableHead></TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">{u.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{u.email}</TableCell>
                      <TableCell><Badge variant="outline" className="capitalize rounded-full">{u.role}</Badge></TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`rounded-full ${
                          u.status === "active" ? "bg-primary/10 text-primary border-primary/20"
                            : u.status === "blocked" ? "bg-destructive/10 text-destructive border-destructive/20"
                            : "bg-warning/10 text-warning border-warning/20"
                        }`}>{u.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant={u.status === "active" ? "outline" : "default"} className="rounded-xl gap-1 text-xs" onClick={() => toggleUser(u.id)}>
                          {u.status === "active" ? <><Ban className="h-3 w-3" />{t.admin.block}</> : <><Check className="h-3 w-3" />{t.admin.approve}</>}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="equipment">
          <Card className="rounded-2xl border-border/50 shadow-card overflow-hidden">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow><TableHead>Equipment</TableHead><TableHead>Owner</TableHead><TableHead>Price/ha</TableHead><TableHead>{t.admin.status}</TableHead><TableHead>{t.admin.manage}</TableHead></TableRow>
                </TableHeader>
                <TableBody>
                  {equipmentList.map((eq) => (
                    <TableRow key={eq.id}>
                      <TableCell className="font-medium">{eq.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{eq.ownerName}</TableCell>
                      <TableCell>{eq.pricePerHectare.toLocaleString()} FCFA</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`rounded-full ${eq.available ? "bg-primary/10 text-primary border-primary/20" : "bg-destructive/10 text-destructive border-destructive/20"}`}>
                          {eq.available ? t.equipment.available : t.equipment.unavailable}
                        </Badge>
                      </TableCell>
                      <TableCell><Button size="sm" variant="outline" className="rounded-xl text-xs">{t.admin.approve}</Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Admin Add Equipment Tab */}
        <TabsContent value="addEquipment">
          <Card className="rounded-2xl border-border/50 shadow-card">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-4">{t.admin.addEquipmentTitle}</h3>
              <p className="text-sm text-muted-foreground mb-6">{t.admin.addEquipmentDesc}</p>
              <form className="space-y-4 max-w-lg" onSubmit={(e) => { e.preventDefault(); toast.success(t.admin.equipmentAdded); }}>
                <div className="space-y-1.5">
                  <Label>{t.owner.equipmentName}</Label>
                  <Input required className="rounded-xl h-11" placeholder="John Deere 5075E" />
                </div>
                <div className="space-y-1.5">
                  <Label>{t.owner.equipmentType}</Label>
                  <Select>
                    <SelectTrigger className="rounded-xl h-11"><SelectValue /></SelectTrigger>
                    <SelectContent>{(Object.keys(typeLabels) as EquipmentType[]).map((type) => (
                      <SelectItem key={type} value={type}>{equipmentTypeIcons[type]} {typeLabels[type]}</SelectItem>
                    ))}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>{t.equipment.description}</Label>
                  <Input className="rounded-xl h-11" placeholder="Description..." />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5"><Label>{t.owner.pricePerHectare}</Label><Input type="number" className="rounded-xl h-11" placeholder="15000" /></div>
                  <div className="space-y-1.5"><Label>{t.owner.pricePerHour}</Label><Input type="number" className="rounded-xl h-11" placeholder="8000" /></div>
                </div>
                <div className="space-y-1.5">
                  <Label>{t.equipment.location}</Label>
                  <Input required className="rounded-xl h-11" placeholder="Thiès, Senegal" />
                </div>
                <div className="space-y-1.5">
                  <Label>{t.admin.assignOwner}</Label>
                  <Select>
                    <SelectTrigger className="rounded-xl h-11"><SelectValue placeholder={t.admin.platformManaged} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="platform">{t.admin.platformManaged}</SelectItem>
                      <SelectItem value="commune-thies">Commune de Thiès</SelectItem>
                      <SelectItem value="coop-kaolack">Coopérative Agricole de Kaolack</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="rounded-xl gap-1">
                  <Plus className="h-4 w-4" /> {t.admin.publishEquipment}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card className="rounded-2xl border-border/50 shadow-card overflow-hidden">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow><TableHead>Date</TableHead><TableHead>User</TableHead><TableHead>Action</TableHead><TableHead>Details</TableHead></TableRow>
                </TableHeader>
                <TableBody>
                  {mockBookings.map((b) => (
                    <TableRow key={b.id}>
                      <TableCell className="text-sm">{b.date}</TableCell>
                      <TableCell className="font-medium">{b.farmerName}</TableCell>
                      <TableCell><Badge variant="outline" className="rounded-full">Booking</Badge></TableCell>
                      <TableCell className="text-sm text-muted-foreground">{b.equipmentName} — {b.hectares} ha</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;
