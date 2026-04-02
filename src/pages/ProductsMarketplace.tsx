import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Search, Phone, ShoppingBasket, Plus, Star, MessageCircle, Leaf, Apple, Wheat } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export type ProductCategory = "vegetables" | "fruits" | "cereals" | "legumes" | "roots" | "other";

export interface Product {
  id: string;
  name: string;
  nameFr: string;
  category: ProductCategory;
  price: number;
  unit: string;
  currency: string;
  quantity: number;
  description: string;
  descriptionFr: string;
  sellerName: string;
  sellerPhone: string;
  sellerAvatar: string;
  sellerVerified: boolean;
  location: string;
  image: string;
  images: string[];
  organic: boolean;
  rating: number;
  postedDate: string;
}

const categoryIcons: Record<ProductCategory, React.ReactNode> = {
  vegetables: <Leaf className="h-4 w-4" />,
  fruits: <Apple className="h-4 w-4" />,
  cereals: <Wheat className="h-4 w-4" />,
  legumes: "🫘",
  roots: "🥔",
  other: <ShoppingBasket className="h-4 w-4" />,
};

const mockProducts: Product[] = [
  {
    id: "p1", name: "Fresh Tomatoes", nameFr: "Tomates fraîches", category: "vegetables",
    price: 500, unit: "kg", currency: "FCFA", quantity: 200,
    description: "Fresh ripe tomatoes, harvested this morning. Perfect for cooking and salads.",
    descriptionFr: "Tomates mûres fraîches, récoltées ce matin. Parfaites pour la cuisine et les salades.",
    sellerName: "Amadou Diallo", sellerPhone: "+221 77 123 4567",
    sellerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    sellerVerified: true, location: "Thiès, Senegal",
    image: "https://images.unsplash.com/photo-1546470427-0d4db154ceb8?w=600&h=400&fit=crop",
    organic: true, rating: 4.8, postedDate: "2026-03-28",
  },
  {
    id: "p2", name: "Groundnuts (Peanuts)", nameFr: "Arachides", category: "legumes",
    price: 800, unit: "kg", currency: "FCFA", quantity: 500,
    description: "Premium quality groundnuts from Kaolack region. Ideal for oil extraction or roasting.",
    descriptionFr: "Arachides de qualité premium de la région de Kaolack. Idéales pour l'huile ou le grillage.",
    sellerName: "Moussa Fall", sellerPhone: "+221 77 555 6789",
    sellerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    sellerVerified: true, location: "Kaolack, Senegal",
    image: "https://images.unsplash.com/photo-1567892320421-1c657571ea4a?w=600&h=400&fit=crop",
    organic: false, rating: 4.5, postedDate: "2026-03-25",
  },
  {
    id: "p3", name: "Millet", nameFr: "Mil", category: "cereals",
    price: 350, unit: "kg", currency: "FCFA", quantity: 1000,
    description: "High quality millet, dried and cleaned. Staple grain for cooking.",
    descriptionFr: "Mil de haute qualité, séché et nettoyé. Céréale de base pour la cuisine.",
    sellerName: "Awa Seck", sellerPhone: "+221 77 888 9012",
    sellerAvatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&h=150&fit=crop&crop=face",
    sellerVerified: false, location: "Saint-Louis, Senegal",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=400&fit=crop",
    organic: true, rating: 4.2, postedDate: "2026-03-30",
  },
  {
    id: "p4", name: "Sweet Potatoes", nameFr: "Patates douces", category: "roots",
    price: 300, unit: "kg", currency: "FCFA", quantity: 350,
    description: "Orange-fleshed sweet potatoes. Rich in vitamin A, freshly harvested.",
    descriptionFr: "Patates douces à chair orange. Riches en vitamine A, fraîchement récoltées.",
    sellerName: "Ibrahima Ba", sellerPhone: "+221 77 444 3210",
    sellerAvatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
    sellerVerified: true, location: "Fatick, Senegal",
    image: "https://images.unsplash.com/photo-1596097635092-6cf1ce388b23?w=600&h=400&fit=crop",
    organic: false, rating: 4.6, postedDate: "2026-03-29",
  },
  {
    id: "p5", name: "Mangoes", nameFr: "Mangues", category: "fruits",
    price: 600, unit: "kg", currency: "FCFA", quantity: 800,
    description: "Sweet Kent mangoes from Casamance. Juicy and perfect for export quality.",
    descriptionFr: "Mangues Kent sucrées de Casamance. Juteuses et de qualité export.",
    sellerName: "Fatou Diop", sellerPhone: "+221 77 222 1111",
    sellerAvatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&h=150&fit=crop&crop=face",
    sellerVerified: true, location: "Ziguinchor, Senegal",
    image: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=600&h=400&fit=crop",
    organic: true, rating: 4.9, postedDate: "2026-04-01",
  },
  {
    id: "p6", name: "Rice (Paddy)", nameFr: "Riz (Paddy)", category: "cereals",
    price: 450, unit: "kg", currency: "FCFA", quantity: 2000,
    description: "Locally grown paddy rice from the Senegal River valley. Excellent quality.",
    descriptionFr: "Riz paddy cultivé localement dans la vallée du fleuve Sénégal. Excellente qualité.",
    sellerName: "Ousmane Ndiaye", sellerPhone: "+221 77 999 0000",
    sellerAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
    sellerVerified: true, location: "Saint-Louis, Senegal",
    image: "https://images.unsplash.com/photo-1536304993881-460e4e4643f0?w=600&h=400&fit=crop",
    organic: false, rating: 4.4, postedDate: "2026-03-27",
  },
  {
    id: "p7", name: "Onions", nameFr: "Oignons", category: "vegetables",
    price: 400, unit: "kg", currency: "FCFA", quantity: 600,
    description: "Large red onions from the Niayes region. Long shelf life, great for markets.",
    descriptionFr: "Gros oignons rouges de la région des Niayes. Longue conservation, idéaux pour les marchés.",
    sellerName: "Amadou Diallo", sellerPhone: "+221 77 123 4567",
    sellerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    sellerVerified: true, location: "Thiès, Senegal",
    image: "https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?w=600&h=400&fit=crop",
    organic: false, rating: 4.3, postedDate: "2026-03-26",
  },
  {
    id: "p8", name: "Cassava", nameFr: "Manioc", category: "roots",
    price: 250, unit: "kg", currency: "FCFA", quantity: 450,
    description: "Fresh cassava roots. Can be processed into attieké, gari, or flour.",
    descriptionFr: "Racines de manioc fraîches. Transformables en attiéké, gari ou farine.",
    sellerName: "Moussa Fall", sellerPhone: "+221 77 555 6789",
    sellerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    sellerVerified: true, location: "Kolda, Senegal",
    image: "https://images.unsplash.com/photo-1598512752271-33f913a5af13?w=600&h=400&fit=crop",
    organic: true, rating: 4.1, postedDate: "2026-03-31",
  },
];

const ProductsMarketplace = () => {
  const { t, language } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [contactProduct, setContactProduct] = useState<Product | null>(null);
  const [message, setMessage] = useState("");

  const tr = (t as any).products || {};

  const categoryLabels: Record<ProductCategory, string> = {
    vegetables: tr.vegetables || "Vegetables",
    fruits: tr.fruits || "Fruits",
    cereals: tr.cereals || "Cereals",
    legumes: tr.legumes || "Legumes",
    roots: tr.roots || "Roots & Tubers",
    other: tr.other || "Other",
  };

  const filtered = mockProducts.filter((p) => {
    const name = language === "fr" ? p.nameFr : p.name;
    const matchSearch = name.toLowerCase().includes(search.toLowerCase()) || p.location.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === "all" || p.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const handleContact = () => {
    if (!contactProduct) return;
    toast.success(tr.messageSent || "Message sent to seller!");
    setMessage("");
    setContactProduct(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex items-center gap-3 mb-2">
          <ShoppingBasket className="h-8 w-8 text-primary" />
          <h1 className="text-3xl md:text-4xl font-bold">{tr.title || "Products Marketplace"}</h1>
        </div>
        <p className="text-muted-foreground mb-8">{tr.subtitle || "Buy fresh agricultural products directly from local farmers"}</p>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={tr.searchPlaceholder || "Search products..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-11 h-12 rounded-xl bg-card shadow-card border-border/50"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-52 h-12 rounded-xl bg-card shadow-card border-border/50">
            <SelectValue placeholder={tr.filterCategory || "Category"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{tr.allCategories || "All Categories"}</SelectItem>
            {(Object.keys(categoryLabels) as ProductCategory[]).map((cat) => (
              <SelectItem key={cat} value={cat}>
                <span className="flex items-center gap-2">
                  {typeof categoryIcons[cat] === "string" ? categoryIcons[cat] : categoryIcons[cat]}
                  {categoryLabels[cat]}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Products Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.map((product, i) => {
          const name = language === "fr" ? product.nameFr : product.name;
          const desc = language === "fr" ? product.descriptionFr : product.description;
          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.4 }}
            >
              <Card className="overflow-hidden group hover:shadow-elevated transition-all duration-300 border-border/50 bg-card rounded-2xl h-full flex flex-col">
                <div className="aspect-[4/3] relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 to-transparent" />
                  {product.organic && (
                    <Badge className="absolute top-3 left-3 bg-primary/90 text-primary-foreground backdrop-blur-sm rounded-full px-3">
                      🌿 {tr.organic || "Organic"}
                    </Badge>
                  )}
                  <div className="absolute top-3 right-3 bg-card/80 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 text-secondary fill-secondary" />
                    <span className="text-xs font-semibold">{product.rating}</span>
                  </div>
                </div>
                <CardContent className="p-4 flex-1 flex flex-col">
                  <h3 className="font-bold text-base mb-1 group-hover:text-primary transition-colors">{name}</h3>
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{desc}</p>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                    <MapPin className="h-3 w-3" />
                    {product.location}
                  </div>
                  <div className="mt-auto">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="font-bold text-primary text-lg">{product.price.toLocaleString()}</span>
                        <span className="text-xs text-muted-foreground ml-1">{product.currency}/{product.unit}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{product.quantity} {product.unit} {tr.available || "available"}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <img src={product.sellerAvatar} alt={product.sellerName} className="h-6 w-6 rounded-full object-cover" />
                      <span className="text-xs font-medium">{product.sellerName}</span>
                      {product.sellerVerified && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-primary/30 text-primary">✓</Badge>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <a href={`tel:${product.sellerPhone}`} className="flex-1">
                        <Button size="sm" variant="outline" className="w-full rounded-xl gap-1.5 text-xs">
                          <Phone className="h-3 w-3" />
                          {tr.call || "Call"}
                        </Button>
                      </a>
                      <Dialog open={contactProduct?.id === product.id} onOpenChange={(o) => !o && setContactProduct(null)}>
                        <DialogTrigger asChild>
                          <Button size="sm" className="flex-1 rounded-xl gap-1.5 text-xs" onClick={() => setContactProduct(product)}>
                            <MessageCircle className="h-3 w-3" />
                            {tr.contact || "Contact"}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="rounded-2xl">
                          <DialogHeader>
                            <DialogTitle>{tr.contactSeller || "Contact Seller"}</DialogTitle>
                          </DialogHeader>
                          <div className="flex items-center gap-3 mb-4">
                            <img src={product.sellerAvatar} alt={product.sellerName} className="h-12 w-12 rounded-full object-cover" />
                            <div>
                              <p className="font-semibold">{product.sellerName}</p>
                              <p className="text-sm text-muted-foreground">{product.location}</p>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {tr.aboutProduct || "About"}: <strong>{name}</strong> — {product.price.toLocaleString()} {product.currency}/{product.unit}
                          </p>
                          <Textarea
                            placeholder={tr.messagePlaceholder || "Write your message..."}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={3}
                            className="rounded-xl"
                          />
                          <div className="flex gap-2 mt-3">
                            <a href={`tel:${product.sellerPhone}`} className="flex-1">
                              <Button variant="outline" className="w-full rounded-xl gap-2">
                                <Phone className="h-4 w-4" />
                                {product.sellerPhone}
                              </Button>
                            </a>
                            <Button onClick={handleContact} disabled={!message.trim()} className="flex-1 rounded-xl">
                              {tr.sendMessage || "Send"}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
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

export default ProductsMarketplace;
