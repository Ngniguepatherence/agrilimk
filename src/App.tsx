import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { Layout } from "@/components/Layout";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Marketplace from "./pages/Marketplace";
import EquipmentDetail from "./pages/EquipmentDetail";
import { lazy, Suspense } from "react";
const MapView = lazy(() => import("./pages/MapView"));
import FarmerDashboard from "./pages/FarmerDashboard";
import OwnerDashboard from "./pages/OwnerDashboard";
import AdminPanel from "./pages/AdminPanel";
import ProductsMarketplace from "./pages/ProductsMarketplace";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/equipment/:id" element={<EquipmentDetail />} />
                <Route path="/map" element={<Suspense fallback={<div className="flex items-center justify-center h-screen">Loading map...</div>}><MapView /></Suspense>} />
                <Route path="/farmer" element={<FarmerDashboard />} />
                <Route path="/owner" element={<OwnerDashboard />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/products" element={<ProductsMarketplace />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
