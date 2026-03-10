import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { equipmentList, mockBookings } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Package, Calendar, DollarSign, Check, Ban } from "lucide-react";
import { toast } from "sonner";

const mockAdminUsers = [
  { id: "f1", name: "Amadou Diallo", email: "farmer@agrilink.com", role: "farmer", status: "active" },
  { id: "o1", name: "Commune de Thiès", email: "owner@agrilink.com", role: "owner", status: "active" },
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

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      <h1 className="text-2xl font-bold mb-6">{t.admin.title}</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: t.admin.totalUsers, value: users.length, icon: Users },
          { label: t.admin.totalEquipment, value: equipmentList.length, icon: Package },
          { label: t.admin.totalBookings, value: mockBookings.length, icon: Calendar },
          { label: t.admin.totalRevenue, value: `${(totalRevenue / 1000).toFixed(0)}K`, icon: DollarSign },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <stat.icon className="h-5 w-5 text-primary mb-2" />
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">{t.admin.users}</TabsTrigger>
          <TabsTrigger value="equipment">{t.admin.equipment}</TabsTrigger>
          <TabsTrigger value="activity">{t.admin.activity}</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>{t.admin.status}</TableHead>
                    <TableHead>{t.admin.manage}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">{u.name}</TableCell>
                      <TableCell className="text-sm">{u.email}</TableCell>
                      <TableCell><Badge variant="outline" className="capitalize">{u.role}</Badge></TableCell>
                      <TableCell>
                        <Badge className={u.status === "active" ? "bg-primary" : u.status === "blocked" ? "bg-destructive" : "bg-warning text-foreground"}>
                          {u.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant={u.status === "active" ? "destructive" : "default"} onClick={() => toggleUser(u.id)}>
                          {u.status === "active" ? <><Ban className="h-3 w-3 mr-1" />{t.admin.block}</> : <><Check className="h-3 w-3 mr-1" />{t.admin.approve}</>}
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
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Equipment</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Price/ha</TableHead>
                    <TableHead>{t.admin.status}</TableHead>
                    <TableHead>{t.admin.manage}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {equipmentList.map((eq) => (
                    <TableRow key={eq.id}>
                      <TableCell className="font-medium">{eq.name}</TableCell>
                      <TableCell className="text-sm">{eq.ownerName}</TableCell>
                      <TableCell>{eq.pricePerHectare.toLocaleString()} FCFA</TableCell>
                      <TableCell>
                        <Badge className={eq.available ? "bg-primary" : "bg-destructive"}>
                          {eq.available ? t.equipment.available : t.equipment.unavailable}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">{t.admin.approve}</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockBookings.map((b) => (
                    <TableRow key={b.id}>
                      <TableCell className="text-sm">{b.date}</TableCell>
                      <TableCell className="font-medium">{b.farmerName}</TableCell>
                      <TableCell>Booking Request</TableCell>
                      <TableCell className="text-sm">{b.equipmentName} — {b.hectares} ha</TableCell>
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
