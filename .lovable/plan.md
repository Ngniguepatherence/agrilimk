
# AgriLink – Connecting Farmers to Agricultural Equipment

A mobile-first, bilingual (EN/FR) frontend prototype with mock data, interactive maps, and clean UI designed for low digital literacy users in Africa.

---

## 1. Landing Page (`/`)
- Hero section: "AgriLink – Connecting Farmers to Agricultural Equipment" with CTA buttons
- Sections: Problem → Solution → How It Works (3 steps with icons) → Benefits for Farmers → Benefits for Municipalities → Call to Action
- Language switcher (EN/FR) in the header
- Mobile-first, lightweight design with large tap targets and clear icons
- Navigation: Sign Up, Login, Browse Equipment

## 2. Authentication Pages (Mock)
- **Sign Up** (`/signup`): Role selection (Farmer / Equipment Owner), name, email, phone, password
- **Login** (`/login`): Email + password form
- Mock auth using React context (no real backend) — stores user role and info in state

## 3. Equipment Marketplace (`/marketplace`)
- Grid of equipment cards showing: image, name, owner, price (per hectare/hour), location, availability badge, "Request Booking" button
- Filters: equipment type (Tractor, Plough, Seeder, Harvester, Irrigation Pump, Sprayer), location, price range, availability
- Search bar
- Mock data with ~10 sample equipment listings

## 4. Equipment Detail Page (`/equipment/:id`)
- Photo gallery, description, location, price
- Availability calendar (visual)
- Owner info card with contact option
- Booking form: date, hectares, farm location, special instructions

## 5. Map View (`/map`)
- Leaflet interactive map with equipment markers
- Mock farmer location detection
- Filter by equipment type
- Click marker → equipment summary popup with link to detail page

## 6. Booking System
- Booking request flow from equipment detail page
- Booking confirmation with simulated payment options (Mobile Money / Cash)
- Booking status tracking: Pending → Accepted/Rejected → Completed

## 7. Farmer Dashboard (`/farmer`)
- Welcome message with farmer name
- Active bookings list with status
- Booking history
- Quick link to marketplace and map

## 8. Equipment Owner Dashboard (`/owner`)
- Stats cards: total bookings, upcoming reservations, total revenue, equipment count
- Equipment list with add/edit/delete
- Add Equipment form: name, type, description, photos, price, location, availability
- Incoming booking requests with Accept/Reject/Schedule actions
- Booking history and earnings summary

## 9. Admin Panel (`/admin`)
- User management (list, view, mock approve/block)
- Equipment listings management (approve/reject)
- Platform statistics: total users, bookings, equipment, revenue
- Activity monitoring table

## 10. Bilingual Support (EN/FR)
- Language context with translations for all UI text
- Language switcher toggle in the header/nav
- All labels, buttons, and content available in both languages

## Design & UX Principles
- **Mobile-first**: All layouts optimized for small screens, large buttons, simple navigation
- **Low bandwidth**: No heavy animations, optimized images, skeleton loaders
- **Low digital literacy**: Icon-heavy UI, clear visual hierarchy, minimal text, step-by-step flows
- **Color scheme**: Green/earth tones reflecting agriculture
- **Bottom navigation** on mobile for Farmer and Owner dashboards

## Technical Approach
- React Router for all pages
- React Context for mock auth and language
- Leaflet.js (via react-leaflet) for maps
- Mock data files for equipment, users, and bookings
- Shadcn UI components + Tailwind CSS
- Responsive design with Tailwind breakpoints
