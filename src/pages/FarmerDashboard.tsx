import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { mockBookings, equipmentList, equipmentTypeIcons } from "@/data/mockData";
import { Product, ProductCategory } from "@/pages/ProductsMarketplace";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import {
  ShoppingCart, MapPin, Calendar, ArrowRight, TrendingUp, Clock,
  CheckCircle2, XCircle, DollarSign, Leaf, Sun, CloudRain, Wind,
  Star, ShieldCheck, Phone, Mail, Edit, Bell, Wheat, Plus,
  ImagePlus, Trash2, Package, ChevronLeft, ChevronRight, X,
  ShoppingBasket
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  pending: "bg-warning/10 text-warning border-warning/20",
  accepted: "bg-primary/10 text-primary border-primary/20",
  rejected: "bg-destructive/10 text-destructive border-destructive/20",
  completed: "bg-muted text-muted-foreground border-border",
};

const statusIcons: Record<string, React.ElementType> = {
  pending: Clock,
  accepted: CheckCircle2,
  rejected: XCircle,
  completed: CheckCircle2,
};

const categoryOptions: { value: ProductCategory; labelEn: string; labelFr: string }[] = [
  { value: "vegetables", labelEn: "Vegetables", labelFr: "Légumes" },
  { value: "fruits", labelEn: "Fruits", labelFr: "Fruits" },
  { value: "cereals", labelEn: "Cereals", labelFr: "Céréales" },
  { value: "legumes", labelEn: "Legumes", labelFr: "Légumineuses" },
  { value: "roots", labelEn: "Roots & Tubers", labelFr: "Racines & Tubercules" },
  { value: "other", labelEn: "Other", labelFr: "Autre" },
];

// Sample farmer products
const initialFarmerProducts: Product[] = [
  {
    id: "fp1", name: "Fresh Tomatoes", nameFr: "Tomates fraîches", category: "vegetables",
    price: 500, unit: "kg", currency: "FCFA", quantity: 200,
    description: "Fresh ripe tomatoes from my farm.", descriptionFr: "Tomates mûres fraîches de ma ferme.",
    sellerName: "Amadou Diallo", sellerPhone: "+221 77 123 4567",
    sellerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    sellerVerified: true, location: "Thiès, Senegal",
    image: "https://images.unsplash.com/photo-1546470427-0d4db154ceb8?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1546470427-0d4db154ceb8?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1561136594-7f68413baa99?w=600&h=400&fit=crop",
    ],
    organic: true, rating: 4.8, postedDate: "2026-03-28",
  },
  {
    id: "fp2", name: "Onions", nameFr: "Oignons", category: "vegetables",
    price: 400, unit: "kg", currency: "FCFA", quantity: 600,
    description: "Large red onions. Long shelf life.", descriptionFr: "Gros oignons rouges. Longue conservation.",
    sellerName: "Amadou Diallo", sellerPhone: "+221 77 123 4567",
    sellerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    sellerVerified: true, location: "Thiès, Senegal",
    image: "https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=600&h=400&fit=crop",
    ],
    organic: false, rating: 4.3, postedDate: "2026-03-26",
  },
];

// Image carousel component for product cards
function ProductImageCarousel({ images, alt }: { images: string[]; alt: string }) {
  if (images.length <= 1) {
    return (
      <img src={images[0]} alt={alt} className="w-full h-full object-cover" loading="lazy" />
    );
  }
  return (
    <Carousel className="w-full h-full" opts={{ loop: true }}>
      <CarouselContent className="-ml-0 h-full">
        {images.map((img, i) => (
          <CarouselItem key={i} className="pl-0">
            <img src={img} alt={`${alt} ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-2 h-7 w-7 bg-card/80 backdrop-blur-sm border-0 shadow-md" />
      <CarouselNext className="right-2 h-7 w-7 bg-card/80 backdrop-blur-sm border-0 shadow-md" />
    </Carousel>
  );
}

const FarmerDashboard = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const bookings = mockBookings.filter((b) => b.farmerId === user?.id || b.farmerId === "f1");
  const active = bookings.filter((b) => b.status === "pending" || b.status === "accepted");
  const history = bookings.filter((b) => b.status === "completed" || b.status === "rejected");
  const totalSpent = bookings.filter((b) => b.status === "completed" || b.status === "accepted").reduce((s, b) => s + b.totalPrice, 0);
  const totalHectares = bookings.reduce((s, b) => s + b.hectares, 0);

  // Product management state
  const [farmerProducts, setFarmerProducts] = useState<Product[]>(initialFarmerProducts);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: "", nameFr: "", category: "vegetables" as ProductCategory,
    price: "", unit: "kg", quantity: "", description: "", descriptionFr: "",
    organic: false,
  });
  const [productImages, setProductImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock weather
  const weather = { temp: 32, condition: "Ensoleillé", humidity: 45, wind: 12 };
  const recommended = equipmentList.filter((eq) => eq.available).slice(0, 3);

  const statCards = [
    { label: t.farmer.totalBookings, value: bookings.length, icon: Calendar, color: "text-primary" },
    { label: t.farmer.totalSpent, value: `${(totalSpent / 1000).toFixed(0)}K`, icon: DollarSign, color: "text-secondary" },
    { label: t.farmer.hectaresCultivated, value: totalHectares, icon: Wheat, color: "text-primary" },
    { label: t.farmer.activeNow, value: active.length, icon: TrendingUp, color: "text-info" },
  ];

  const resetForm = () => {
    setProductForm({ name: "", nameFr: "", category: "vegetables", price: "", unit: "kg", quantity: "", description: "", descriptionFr: "", organic: false });
    setProductImages([]);
    setEditingProduct(null);
  };

  const openAddDialog = () => {
    resetForm();
    setShowAddProduct(true);
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name, nameFr: product.nameFr, category: product.category,
      price: String(product.price), unit: product.unit, quantity: String(product.quantity),
      description: product.description, descriptionFr: product.descriptionFr,
      organic: product.organic,
    });
    setProductImages(product.images);
    setShowAddProduct(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    // Mock: use placeholder URLs for uploaded images
    const mockImageUrls = [
      "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1506484381205-f7945b68db56?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1595855759920-86582396756a?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=600&h=400&fit=crop",
    ];
    const newImages = Array.from(files).slice(0, 5 - productImages.length).map((_, i) =>
      mockImageUrls[(productImages.length + i) % mockImageUrls.length]
    );
    setProductImages(prev => [...prev, ...newImages].slice(0, 5));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (index: number) => {
    setProductImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveProduct = () => {
    if (!productForm.name || !productForm.price || productImages.length === 0) {
      toast.error(language === "fr" ? "Veuillez remplir tous les champs et ajouter au moins une image" : "Please fill all fields and add at least one image");
      return;
    }

    if (editingProduct) {
      setFarmerProducts(prev => prev.map(p => p.id === editingProduct.id ? {
        ...p,
        name: productForm.name, nameFr: productForm.nameFr || productForm.name,
        category: productForm.category, price: Number(productForm.price),
        unit: productForm.unit, quantity: Number(productForm.quantity),
        description: productForm.description, descriptionFr: productForm.descriptionFr || productForm.description,
        organic: productForm.organic, images: productImages, image: productImages[0],
      } : p));
      toast.success(t.farmer.productUpdated);
    } else {
      const newProduct: Product = {
        id: `fp-${Date.now()}`,
        name: productForm.name, nameFr: productForm.nameFr || productForm.name,
        category: productForm.category, price: Number(productForm.price),
        unit: productForm.unit, currency: "FCFA", quantity: Number(productForm.quantity),
        description: productForm.description, descriptionFr: productForm.descriptionFr || productForm.description,
        sellerName: user?.name || "Farmer", sellerPhone: user?.phone || "",
        sellerAvatar: user?.avatar || "", sellerVerified: user?.idVerified || false,
        location: user?.location || "", image: productImages[0], images: productImages,
        organic: productForm.organic, rating: 0, postedDate: new Date().toISOString().split("T")[0],
      };
      setFarmerProducts(prev => [newProduct, ...prev]);
      toast.success(t.farmer.productAdded);
    }
    setShowAddProduct(false);
    resetForm();
  };

  const handleDeleteProduct = (id: string) => {
    setFarmerProducts(prev => prev.filter(p => p.id !== id));
    toast.success(t.farmer.productDeleted);
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      {/* Profile Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <Card className="rounded-2xl border-border/50 shadow-card overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-primary/20 via-primary/10 to-secondary/10" />
          <CardContent className="relative px-5 pb-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-10">
              <Avatar className="h-20 w-20 border-4 border-card shadow-lg">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="text-xl bg-primary text-primary-foreground">{user?.name?.charAt(0) || "F"}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl font-bold">{user?.name || "Farmer"}</h1>
                  {user?.idVerified && (
                    <Badge variant="outline" className="rounded-full bg-primary/10 text-primary border-primary/20 gap-1">
                      <ShieldCheck className="h-3 w-3" /> {t.auth.verified}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1 flex-wrap">
                  {user?.location && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{user.location}</span>}
                  {user?.phone && <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{user.phone}</span>}
                </div>
              </div>
              <Button variant="outline" size="sm" className="rounded-xl gap-1.5 shrink-0">
                <Edit className="h-4 w-4" /> {t.farmer.editProfile}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {statCards.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <Card className="rounded-2xl border-border/50 shadow-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center">
                    <stat.icon className={`h-4.5 w-4.5 ${stat.color}`} />
                  </div>
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Main Content - Left 2 cols */}
        <div className="md:col-span-2 space-y-6">
          {/* Quick Actions */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="grid grid-cols-2 gap-3">
              {[
                { to: "/marketplace", icon: ShoppingCart, label: t.farmer.findEquipment, color: "text-primary", bg: "bg-primary/5" },
                { to: "/map", icon: MapPin, label: t.farmer.viewMap, color: "text-secondary", bg: "bg-secondary/5" },
              ].map((item) => (
                <Link key={item.to} to={item.to}>
                  <Card className="hover:shadow-elevated transition-all duration-300 cursor-pointer rounded-2xl border-border/50 group h-full">
                    <CardContent className="p-5 flex items-center gap-3">
                      <div className={`h-12 w-12 rounded-xl ${item.bg} flex items-center justify-center group-hover:scale-105 transition-transform shrink-0`}>
                        <item.icon className={`h-6 w-6 ${item.color}`} />
                      </div>
                      <div>
                        <span className="text-sm font-semibold block">{item.label}</span>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform mt-0.5" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Main Tabs: Bookings + Products */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Tabs defaultValue="active" className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <TabsList className="rounded-xl bg-muted/50 p-1 h-auto">
                  <TabsTrigger value="active" className="rounded-lg data-[state=active]:shadow-sm text-xs sm:text-sm">
                    {t.farmer.activeBookings} ({active.length})
                  </TabsTrigger>
                  <TabsTrigger value="history" className="rounded-lg data-[state=active]:shadow-sm text-xs sm:text-sm">
                    {t.farmer.bookingHistory} ({history.length})
                  </TabsTrigger>
                  <TabsTrigger value="products" className="rounded-lg data-[state=active]:shadow-sm text-xs sm:text-sm gap-1">
                    <ShoppingBasket className="h-3.5 w-3.5" />
                    {t.farmer.myProducts} ({farmerProducts.length})
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Active Bookings Tab */}
              <TabsContent value="active" className="space-y-3 mt-0">
                {active.length === 0 ? (
                  <Card className="rounded-2xl border-border/50">
                    <CardContent className="p-8 text-center">
                      <Calendar className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground">{t.booking.noBookings}</p>
                      <Link to="/marketplace">
                        <Button className="mt-4 rounded-xl" size="sm">{t.farmer.findEquipment}</Button>
                      </Link>
                    </CardContent>
                  </Card>
                ) : (
                  active.map((b) => {
                    const StatusIcon = statusIcons[b.status];
                    const eq = equipmentList.find((e) => e.id === b.equipmentId);
                    return (
                      <Card key={b.id} className="rounded-2xl border-border/50 shadow-card hover:shadow-elevated transition-all">
                        <CardContent className="p-4">
                          <div className="flex gap-3">
                            {eq && <img src={eq.image} alt={b.equipmentName} className="h-20 w-20 rounded-xl object-cover shrink-0" />}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <p className="font-bold text-sm">{equipmentTypeIcons[eq?.type || "tractor"]} {b.equipmentName}</p>
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                    <Calendar className="h-3 w-3" />{b.date}
                                    <span>•</span>{b.hectares} ha
                                    <span>•</span><MapPin className="h-3 w-3" />{b.farmLocation}
                                  </div>
                                </div>
                                <Badge variant="outline" className={`rounded-full shrink-0 gap-1 ${statusColors[b.status]}`}>
                                  <StatusIcon className="h-3 w-3" />
                                  {t.booking[b.status as keyof typeof t.booking]}
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between mt-3">
                                <p className="text-sm font-bold text-primary">{b.totalPrice.toLocaleString()} FCFA</p>
                                <Badge variant="outline" className="rounded-full text-xs">
                                  {b.paymentMethod === "mobile_money" ? t.booking.mobileMoney : t.booking.cash}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </TabsContent>

              {/* History Tab */}
              <TabsContent value="history" className="space-y-3 mt-0">
                {history.length === 0 ? (
                  <Card className="rounded-2xl border-border/50">
                    <CardContent className="p-8 text-center text-muted-foreground text-sm">{t.booking.noBookings}</CardContent>
                  </Card>
                ) : (
                  history.map((b) => {
                    const StatusIcon = statusIcons[b.status];
                    return (
                      <Card key={b.id} className="rounded-2xl border-border/30">
                        <CardContent className="p-4 flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-sm">{b.equipmentName}</p>
                            <p className="text-xs text-muted-foreground">{b.date} • {b.totalPrice.toLocaleString()} FCFA</p>
                          </div>
                          <Badge variant="outline" className={`rounded-full gap-1 ${statusColors[b.status]}`}>
                            <StatusIcon className="h-3 w-3" />
                            {t.booking[b.status as keyof typeof t.booking]}
                          </Badge>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </TabsContent>

              {/* My Products Tab */}
              <TabsContent value="products" className="space-y-4 mt-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">{t.farmer.manageProducts}</p>
                  <Button size="sm" className="rounded-xl gap-1.5" onClick={openAddDialog}>
                    <Plus className="h-4 w-4" /> {t.farmer.addProduct}
                  </Button>
                </div>

                {farmerProducts.length === 0 ? (
                  <Card className="rounded-2xl border-border/50">
                    <CardContent className="p-10 text-center">
                      <Package className="h-14 w-14 text-muted-foreground/20 mx-auto mb-4" />
                      <p className="font-semibold text-sm mb-1">{t.farmer.noProducts}</p>
                      <p className="text-xs text-muted-foreground mb-4">{t.farmer.addFirstProduct}</p>
                      <Button className="rounded-xl gap-1.5" onClick={openAddDialog}>
                        <Plus className="h-4 w-4" /> {t.farmer.addProduct}
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {farmerProducts.map((product) => {
                      const name = language === "fr" ? product.nameFr : product.name;
                      return (
                        <Card key={product.id} className="rounded-2xl border-border/50 shadow-card overflow-hidden group">
                          {/* Image Carousel */}
                          <div className="aspect-[16/10] relative overflow-hidden">
                            <ProductImageCarousel images={product.images} alt={name} />
                            {product.organic && (
                              <Badge className="absolute top-3 left-3 z-10 bg-primary/90 text-primary-foreground backdrop-blur-sm rounded-full px-3">
                                🌿 {language === "fr" ? "Bio" : "Organic"}
                              </Badge>
                            )}
                            {product.images.length > 1 && (
                              <div className="absolute bottom-2 right-2 z-10 bg-card/80 backdrop-blur-sm rounded-full px-2 py-0.5 text-[10px] font-medium">
                                {product.images.length} photos
                              </div>
                            )}
                          </div>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div>
                                <h3 className="font-bold text-sm">{name}</h3>
                                <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                                  <MapPin className="h-3 w-3" /> {product.location}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-primary text-sm">{product.price.toLocaleString()} FCFA</p>
                                <p className="text-[10px] text-muted-foreground">/{product.unit}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                              <span>{product.quantity} {product.unit} {language === "fr" ? "disponible" : "available"}</span>
                              {product.rating > 0 && (
                                <>
                                  <span>•</span>
                                  <span className="flex items-center gap-0.5"><Star className="h-3 w-3 text-secondary fill-secondary" /> {product.rating}</span>
                                </>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" className="flex-1 rounded-xl text-xs gap-1" onClick={() => openEditDialog(product)}>
                                <Edit className="h-3 w-3" /> {t.farmer.editProduct}
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="outline" size="sm" className="rounded-xl text-xs text-destructive hover:text-destructive gap-1">
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="rounded-2xl">
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>{t.farmer.deleteProduct}</AlertDialogTitle>
                                    <AlertDialogDescription>{t.farmer.confirmDelete}</AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel className="rounded-xl">{t.common.cancel}</AlertDialogCancel>
                                    <AlertDialogAction className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => handleDeleteProduct(product.id)}>
                                      {t.farmer.deleteProduct}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>

        {/* Sidebar - Right col */}
        <div className="space-y-6">
          {/* Weather Card */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <Card className="rounded-2xl border-border/50 shadow-card overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-secondary to-primary" />
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Sun className="h-4 w-4 text-secondary" /> {t.farmer.weather}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl font-bold">{weather.temp}°C</span>
                  <span className="text-sm text-muted-foreground">{weather.condition}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <CloudRain className="h-3.5 w-3.5" /> {t.farmer.humidity}: {weather.humidity}%
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Wind className="h-3.5 w-3.5" /> {t.farmer.wind}: {weather.wind} km/h
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recommended Equipment */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
            <Card className="rounded-2xl border-border/50 shadow-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Star className="h-4 w-4 text-secondary" /> {t.farmer.recommended}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recommended.map((eq) => (
                  <Link key={eq.id} to={`/equipment/${eq.id}`}>
                    <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer">
                      <img src={eq.image} alt={eq.name} className="h-12 w-12 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold truncate">{equipmentTypeIcons[eq.type]} {eq.name}</p>
                        <p className="text-xs text-muted-foreground">{eq.pricePerHectare.toLocaleString()} FCFA/ha</p>
                      </div>
                    </div>
                  </Link>
                ))}
                <Link to="/marketplace">
                  <Button variant="outline" size="sm" className="w-full rounded-xl mt-1 text-xs gap-1">
                    {t.farmer.seeAll} <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          {/* Verification Status */}
          {!user?.idVerified && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card className="rounded-2xl border-warning/30 bg-warning/5 shadow-card">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="h-5 w-5 text-warning shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold">{t.farmer.verifyAccount}</p>
                      <p className="text-xs text-muted-foreground mt-1">{t.farmer.verifyDescription}</p>
                      <Button size="sm" className="mt-3 rounded-xl text-xs h-8">{t.farmer.verifyNow}</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Notifications */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
            <Card className="rounded-2xl border-border/50 shadow-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Bell className="h-4 w-4 text-primary" /> {t.farmer.notifications}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="p-2.5 rounded-xl bg-primary/5 border border-primary/10">
                  <p className="text-xs font-medium">{t.farmer.notif1}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">2h ago</p>
                </div>
                <div className="p-2.5 rounded-xl bg-muted/50 border border-border/30">
                  <p className="text-xs font-medium">{t.farmer.notif2}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">1 day ago</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Add / Edit Product Dialog */}
      <Dialog open={showAddProduct} onOpenChange={(o) => { if (!o) { setShowAddProduct(false); resetForm(); } }}>
        <DialogContent className="rounded-2xl max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              {editingProduct ? t.farmer.editProduct : t.farmer.addProduct}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Images Upload */}
            <div>
              <Label className="text-sm font-medium mb-2 block">{t.farmer.productImages}</Label>
              <p className="text-xs text-muted-foreground mb-3">{t.farmer.uploadImagesHint}</p>
              
              {/* Image Previews */}
              {productImages.length > 0 && (
                <div className="mb-3">
                  <Carousel className="w-full" opts={{ loop: true }}>
                    <CarouselContent>
                      {productImages.map((img, i) => (
                        <CarouselItem key={i}>
                          <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-muted">
                            <img src={img} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
                            <button
                              onClick={() => removeImage(i)}
                              className="absolute top-2 right-2 h-7 w-7 rounded-full bg-destructive/90 text-destructive-foreground flex items-center justify-center hover:bg-destructive transition-colors"
                            >
                              <X className="h-4 w-4" />
                            </button>
                            <div className="absolute bottom-2 left-2 bg-card/80 backdrop-blur-sm rounded-full px-2.5 py-0.5 text-xs font-medium">
                              {i + 1}/{productImages.length}
                            </div>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    {productImages.length > 1 && (
                      <>
                        <CarouselPrevious className="left-2 h-7 w-7" />
                        <CarouselNext className="right-2 h-7 w-7" />
                      </>
                    )}
                  </Carousel>
                </div>
              )}

              {productImages.length < 5 && (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-border/60 rounded-xl p-6 text-center cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all"
                >
                  <ImagePlus className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">{t.farmer.uploadImages}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{productImages.length}/5 {t.farmer.imageUploaded}</p>
                </div>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
            </div>

            {/* Product Details */}
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 sm:col-span-1">
                <Label className="text-xs">{t.farmer.productName} (EN)</Label>
                <Input className="rounded-xl mt-1" value={productForm.name}
                  onChange={(e) => setProductForm(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <Label className="text-xs">{t.farmer.productName} (FR)</Label>
                <Input className="rounded-xl mt-1" value={productForm.nameFr}
                  onChange={(e) => setProductForm(p => ({ ...p, nameFr: e.target.value }))} />
              </div>
            </div>

            <div>
              <Label className="text-xs">{t.farmer.productCategory}</Label>
              <Select value={productForm.category} onValueChange={(v) => setProductForm(p => ({ ...p, category: v as ProductCategory }))}>
                <SelectTrigger className="rounded-xl mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map(c => (
                    <SelectItem key={c.value} value={c.value}>{language === "fr" ? c.labelFr : c.labelEn}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label className="text-xs">{t.farmer.productPrice} (FCFA)</Label>
                <Input type="number" className="rounded-xl mt-1" value={productForm.price}
                  onChange={(e) => setProductForm(p => ({ ...p, price: e.target.value }))} />
              </div>
              <div>
                <Label className="text-xs">{t.farmer.productUnit}</Label>
                <Select value={productForm.unit} onValueChange={(v) => setProductForm(p => ({ ...p, unit: v }))}>
                  <SelectTrigger className="rounded-xl mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">kg</SelectItem>
                    <SelectItem value="tonne">Tonne</SelectItem>
                    <SelectItem value="sack">{language === "fr" ? "Sac" : "Sack"}</SelectItem>
                    <SelectItem value="piece">{language === "fr" ? "Pièce" : "Piece"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">{t.farmer.productQuantity}</Label>
                <Input type="number" className="rounded-xl mt-1" value={productForm.quantity}
                  onChange={(e) => setProductForm(p => ({ ...p, quantity: e.target.value }))} />
              </div>
            </div>

            <div>
              <Label className="text-xs">{t.farmer.productDescription} (EN)</Label>
              <Textarea className="rounded-xl mt-1" rows={2} value={productForm.description}
                onChange={(e) => setProductForm(p => ({ ...p, description: e.target.value }))} />
            </div>
            <div>
              <Label className="text-xs">{t.farmer.productDescription} (FR)</Label>
              <Textarea className="rounded-xl mt-1" rows={2} value={productForm.descriptionFr}
                onChange={(e) => setProductForm(p => ({ ...p, descriptionFr: e.target.value }))} />
            </div>

            <div className="flex items-center gap-3">
              <Switch checked={productForm.organic} onCheckedChange={(v) => setProductForm(p => ({ ...p, organic: v }))} />
              <Label className="text-sm flex items-center gap-1.5">
                <Leaf className="h-4 w-4 text-primary" /> {t.farmer.productOrganic}
              </Label>
            </div>
          </div>

          <DialogFooter className="mt-4 gap-2">
            <Button variant="outline" className="rounded-xl" onClick={() => { setShowAddProduct(false); resetForm(); }}>
              {t.common.cancel}
            </Button>
            <Button className="rounded-xl gap-1.5" onClick={handleSaveProduct}>
              <Plus className="h-4 w-4" />
              {editingProduct ? t.farmer.updateProduct : t.farmer.publishProduct}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FarmerDashboard;
