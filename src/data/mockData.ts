export type EquipmentType = "tractor" | "plough" | "seeder" | "harvester" | "irrigationPump" | "sprayer";

export interface Equipment {
  id: string;
  name: string;
  type: EquipmentType;
  description: string;
  descriptionFr: string;
  ownerName: string;
  ownerType: "municipality" | "cooperative" | "individual";
  pricePerHectare: number;
  pricePerHour: number;
  currency: string;
  location: string;
  lat: number;
  lng: number;
  available: boolean;
  image: string;
}

export interface Booking {
  id: string;
  equipmentId: string;
  equipmentName: string;
  farmerId: string;
  farmerName: string;
  date: string;
  hectares: number;
  farmLocation: string;
  instructions: string;
  status: "pending" | "accepted" | "rejected" | "completed";
  paymentMethod: "mobile_money" | "cash";
  totalPrice: number;
}

export const equipmentList: Equipment[] = [
  {
    id: "eq1",
    name: "John Deere 5075E Tractor",
    type: "tractor",
    description: "75HP utility tractor ideal for ploughing and transport. Well maintained, available for daily hire.",
    descriptionFr: "Tracteur utilitaire 75CV idéal pour le labour et le transport. Bien entretenu, disponible à la location journalière.",
    ownerName: "Commune de Thiès",
    ownerType: "municipality",
    pricePerHectare: 15000,
    pricePerHour: 8000,
    currency: "FCFA",
    location: "Thiès, Senegal",
    lat: 14.7886,
    lng: -16.926,
    available: true,
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&h=400&fit=crop",
  },
  {
    id: "eq2",
    name: "Massey Ferguson 385",
    type: "tractor",
    description: "Powerful 85HP tractor suitable for large farms. Comes with experienced operator.",
    descriptionFr: "Tracteur puissant 85CV adapté aux grandes exploitations. Livré avec un opérateur expérimenté.",
    ownerName: "Coopérative Agricole de Kaolack",
    ownerType: "cooperative",
    pricePerHectare: 18000,
    pricePerHour: 10000,
    currency: "FCFA",
    location: "Kaolack, Senegal",
    lat: 14.1652,
    lng: -16.0758,
    available: true,
    image: "https://images.unsplash.com/photo-1530267981375-f0de937f5f13?w=600&h=400&fit=crop",
  },
  {
    id: "eq3",
    name: "3-Disc Plough",
    type: "plough",
    description: "Heavy-duty 3-disc plough for deep soil turning. Compatible with most tractors.",
    descriptionFr: "Charrue à 3 disques pour labour profond. Compatible avec la plupart des tracteurs.",
    ownerName: "Ibrahim Ndiaye",
    ownerType: "individual",
    pricePerHectare: 8000,
    pricePerHour: 5000,
    currency: "FCFA",
    location: "Diourbel, Senegal",
    lat: 14.6553,
    lng: -16.2314,
    available: true,
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&h=400&fit=crop",
  },
  {
    id: "eq4",
    name: "Precision Seeder 4-Row",
    type: "seeder",
    description: "4-row precision seeder for maize, groundnuts, and millet. Saves seed and time.",
    descriptionFr: "Semoir de précision 4 rangs pour maïs, arachides et mil. Économise les semences et le temps.",
    ownerName: "Commune de Fatick",
    ownerType: "municipality",
    pricePerHectare: 6000,
    pricePerHour: 4000,
    currency: "FCFA",
    location: "Fatick, Senegal",
    lat: 14.3389,
    lng: -16.4044,
    available: false,
    image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=400&fit=crop",
  },
  {
    id: "eq5",
    name: "Mini Combine Harvester",
    type: "harvester",
    description: "Compact combine harvester for rice and wheat. Perfect for small to medium farms.",
    descriptionFr: "Mini moissonneuse-batteuse pour riz et blé. Parfaite pour les petites et moyennes exploitations.",
    ownerName: "Coopérative du Fleuve",
    ownerType: "cooperative",
    pricePerHectare: 25000,
    pricePerHour: 15000,
    currency: "FCFA",
    location: "Saint-Louis, Senegal",
    lat: 16.0326,
    lng: -16.489,
    available: true,
    image: "https://images.unsplash.com/photo-1591086313430-a1de153dad71?w=600&h=400&fit=crop",
  },
  {
    id: "eq6",
    name: "Solar Irrigation Pump",
    type: "irrigationPump",
    description: "Solar-powered water pump. No fuel costs. Irrigates up to 5 hectares per day.",
    descriptionFr: "Pompe à eau solaire. Pas de coûts de carburant. Irrigue jusqu'à 5 hectares par jour.",
    ownerName: "Mamadou Sow",
    ownerType: "individual",
    pricePerHectare: 5000,
    pricePerHour: 3000,
    currency: "FCFA",
    location: "Tambacounda, Senegal",
    lat: 13.7709,
    lng: -13.6673,
    available: true,
    image: "https://images.unsplash.com/photo-1586771107445-b3e85e57a5e6?w=600&h=400&fit=crop",
  },
  {
    id: "eq7",
    name: "Boom Sprayer 500L",
    type: "sprayer",
    description: "500-liter boom sprayer for pesticide and fertilizer application. 12m coverage width.",
    descriptionFr: "Pulvérisateur à rampe 500 litres pour pesticides et engrais. Largeur de couverture 12m.",
    ownerName: "Commune de Ziguinchor",
    ownerType: "municipality",
    pricePerHectare: 4000,
    pricePerHour: 3000,
    currency: "FCFA",
    location: "Ziguinchor, Senegal",
    lat: 12.5681,
    lng: -16.264,
    available: true,
    image: "https://images.unsplash.com/photo-1592982537447-6f2a6a0c8b8b?w=600&h=400&fit=crop",
  },
  {
    id: "eq8",
    name: "Kubota L3901 Tractor",
    type: "tractor",
    description: "Compact 37HP tractor perfect for small farms and vegetable gardens.",
    descriptionFr: "Tracteur compact 37CV parfait pour les petites fermes et les jardins maraîchers.",
    ownerName: "Ousmane Ba",
    ownerType: "individual",
    pricePerHectare: 12000,
    pricePerHour: 7000,
    currency: "FCFA",
    location: "Kolda, Senegal",
    lat: 12.8835,
    lng: -14.9501,
    available: true,
    image: "https://images.unsplash.com/photo-1605338198618-fa1dbf24db4a?w=600&h=400&fit=crop",
  },
  {
    id: "eq9",
    name: "Chisel Plough 5-Tine",
    type: "plough",
    description: "5-tine chisel plough for subsoil breaking. Improves water retention.",
    descriptionFr: "Charrue à 5 dents pour briser le sous-sol. Améliore la rétention d'eau.",
    ownerName: "Coopérative de Louga",
    ownerType: "cooperative",
    pricePerHectare: 7000,
    pricePerHour: 4500,
    currency: "FCFA",
    location: "Louga, Senegal",
    lat: 15.6144,
    lng: -16.228,
    available: true,
    image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&h=400&fit=crop",
  },
  {
    id: "eq10",
    name: "Motorized Sprayer Backpack",
    type: "sprayer",
    description: "20L motorized backpack sprayer. Ideal for small plots and orchards.",
    descriptionFr: "Pulvérisateur à dos motorisé 20L. Idéal pour les petites parcelles et les vergers.",
    ownerName: "Fatou Diop",
    ownerType: "individual",
    pricePerHectare: 2000,
    pricePerHour: 1500,
    currency: "FCFA",
    location: "Mbour, Senegal",
    lat: 14.4158,
    lng: -16.9641,
    available: true,
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop",
  },
];

export const mockBookings: Booking[] = [
  {
    id: "b1",
    equipmentId: "eq1",
    equipmentName: "John Deere 5075E Tractor",
    farmerId: "f1",
    farmerName: "Amadou Diallo",
    date: "2026-03-15",
    hectares: 5,
    farmLocation: "Thiès Nord",
    instructions: "Access via Route Nationale 2",
    status: "accepted",
    paymentMethod: "mobile_money",
    totalPrice: 75000,
  },
  {
    id: "b2",
    equipmentId: "eq3",
    equipmentName: "3-Disc Plough",
    farmerId: "f1",
    farmerName: "Amadou Diallo",
    date: "2026-03-20",
    hectares: 3,
    farmLocation: "Diourbel Est",
    instructions: "",
    status: "pending",
    paymentMethod: "cash",
    totalPrice: 24000,
  },
  {
    id: "b3",
    equipmentId: "eq2",
    equipmentName: "Massey Ferguson 385",
    farmerId: "demo",
    farmerName: "Moussa Fall",
    date: "2026-03-18",
    hectares: 10,
    farmLocation: "Kaolack Sud",
    instructions: "Bring extra fuel",
    status: "pending",
    paymentMethod: "mobile_money",
    totalPrice: 180000,
  },
  {
    id: "b4",
    equipmentId: "eq5",
    equipmentName: "Mini Combine Harvester",
    farmerId: "demo2",
    farmerName: "Awa Seck",
    date: "2026-02-28",
    hectares: 8,
    farmLocation: "Saint-Louis Nord",
    instructions: "",
    status: "completed",
    paymentMethod: "mobile_money",
    totalPrice: 200000,
  },
];

export const equipmentTypeIcons: Record<EquipmentType, string> = {
  tractor: "🚜",
  plough: "🔧",
  seeder: "🌱",
  harvester: "🌾",
  irrigationPump: "💧",
  sprayer: "💨",
};
