import { allPlaces, Place } from "./enugu-data"
import { BudgetTierValue, budgetTiers } from "./budget-tiers"
import {
  AccommodationOption,
  EstBudgetBreakdown,
  ItineraryActivity,
  ItineraryDay,
  PlanningStep,
  TripDossier,
  TripItinerary,
} from "./itinerary-types"

// Known coordinates for places in Nigeria & Enugu to power genuine route maps
export const PLACE_COORDINATES: Record<string, { lat: number; lng: number; area?: string }> = {
  "awhum-waterfall": { lat: 6.5512, lng: 7.3789, area: "Udi" },
  "ngwo-pine-forest": { lat: 6.442, lng: 7.448, area: "Ngwo" },
  "nike-lake": { lat: 6.518, lng: 7.568, area: "Abakpa Nike" },
  "landmark-resorts-enugu": { lat: 6.518, lng: 7.568, area: "Abakpa Nike" },
  "ezeagu-tourist-complex": { lat: 6.38, lng: 7.23, area: "Ezeagu" },
  "milliken-hill": { lat: 6.447, lng: 7.462, area: "Ngwo" },
  "national-museum-of-unity": { lat: 6.441, lng: 7.514, area: "Enugu city" },
  "unity-park": { lat: 6.438, lng: 7.531, area: "Enugu city" },
  "michael-okpara-square": { lat: 6.429, lng: 7.538, area: "Independence Layout" },
  "the-residency-enugu": { lat: 6.434, lng: 7.537, area: "Independence Layout" },
  "landmark-nike-lake-resort": { lat: 6.518, lng: 7.568, area: "Abakpa Nike" },
  "eden-crest-hotel-and-resort": { lat: 6.455, lng: 7.505, area: "GRA" },
  "maxbe-continental-hotel": { lat: 6.432, lng: 7.535, area: "Independence Layout" },
  "golden-royale-hotel": { lat: 6.431, lng: 7.532, area: "Independence Layout" },
  "muse-boutique-hotel": { lat: 6.448, lng: 7.528, area: "GRA / Upper Chime" },
  "lagenda-hotels": { lat: 6.44, lng: 7.502, area: "Ogui" },
  "zubani-hotel-and-suites": { lat: 6.471, lng: 7.512, area: "Trans-Ekulu" },
  "golden-movida-hotel": { lat: 6.473, lng: 7.514, area: "Trans-Ekulu" },
  "the-manor": { lat: 6.456, lng: 7.506, area: "GRA" },
  "dolphin-restaurant": { lat: 6.454, lng: 7.504, area: "GRA" },
  "ntachi-osa": { lat: 6.4455, lng: 7.526, area: "New Haven" },
  "7th-planet-international": { lat: 6.472, lng: 7.511, area: "Trans-Ekulu" },
  "obudu-mountain-resort": { lat: 6.3667, lng: 9.3833, area: "Cross River" },
  "yankari-game-reserve": { lat: 9.75, lng: 10.5, area: "Bauchi" },
  "erin-ijesha-waterfall": { lat: 7.58, lng: 4.9, area: "Osun" },
  "kajuru-castle": { lat: 10.3167, lng: 7.7833, area: "Kaduna" },
  "lekki-conservation-centre": { lat: 6.441, lng: 3.535, area: "Lagos" },
  // Priority partner hotels
  "omedel-hotel-and-suites": { lat: 6.431, lng: 7.534, area: "Independence Layout" },
  "wells-royale-hotel": { lat: 6.435, lng: 7.533, area: "Independence Layout" },
  "hotel-presidential-enugu": { lat: 6.451, lng: 7.519, area: "Independence Layout" },
  "oranto-international-airport-hotel": { lat: 6.598, lng: 7.562, area: "Airport Road" },
  "bridgewaters-hotel-enugu": { lat: 6.449, lng: 7.523, area: "New Haven" },
  "grace-manor-hotels-and-suites": { lat: 6.433, lng: 7.529, area: "Liberty Estate" },
  "nondon-international-hotel": { lat: 6.448, lng: 7.526, area: "New Haven" },
  "budget-inn-by-maryjane": { lat: 6.445, lng: 7.524, area: "New Haven" },
  "gold-rhino-hotel-and-suites": { lat: 6.4435, lng: 7.5072, area: "Nkpokiti" },
  // Nightlife venues
  "toscana-villa-enugu": { lat: 6.432, lng: 7.531, area: "Independence Layout" },
  "volt-arena-enugu": { lat: 6.453, lng: 7.517, area: "GRA" },
  "grand-east-man-enugu": { lat: 6.430, lng: 7.532, area: "Independence Layout" },
  "de-kash-enugu": { lat: 6.441, lng: 7.541, area: "New Haven" },
  "cubana-enugu": { lat: 6.433, lng: 7.530, area: "Independence Layout" },
}

export const DEFAULT_PLANNING_STEPS: PlanningStep[] = [
  { id: "1", label: "Understanding your travel preferences", status: "completed" },
  { id: "2", label: "Finding suitable places to stay", status: "completed" },
  { id: "3", label: "Comparing accommodation options", status: "completed" },
  { id: "4", label: "Finding attractions that match your interests", status: "completed" },
  { id: "5", label: "Checking opening hours and availability", status: "active" },
  { id: "6", label: "Optimizing travel distances", status: "pending" },
  { id: "7", label: "Balancing your daily schedule", status: "pending" },
  { id: "8", label: "Calculating your estimated trip cost", status: "pending" },
  { id: "9", label: "Building your final route", status: "pending" },
]

export function formatCurrency(amount: number): string {
  return `₦${amount.toLocaleString()}`
}

export function formatCurrencyCompact(amount: number): string {
  if (amount >= 1_000_000) {
    const val = amount / 1_000_000
    return `₦${val.toFixed(2).replace(/\.?0+$/, "")}m`
  }
  if (amount >= 1_000) {
    return `₦${Math.round(amount / 1_000)}k`
  }
  return `₦${amount.toLocaleString()}`
}

function calculateBreakdown(
  selectedHotel: AccommodationOption,
  daysCount: number,
  travelersCount: number,
  activities: ItineraryActivity[],
  budgetTier: BudgetTierValue
): EstBudgetBreakdown {
  const hotelTotal = selectedHotel.pricePerNight * Math.max(1, daysCount)
  const activitiesTotal = activities.reduce((sum, act) => sum + act.estimatedCost, 0) * travelersCount
  
  // Daily estimates based on tier
  const tierConfig = budgetTiers[budgetTier] || budgetTiers["mid-range"]
  const foodDailyPerPerson = budgetTier === "lean" ? 7_500 : budgetTier === "premium" ? 30_000 : 15_000
  const transportDailyPerPerson = budgetTier === "lean" ? 5_000 : budgetTier === "premium" ? 25_000 : 10_000
  
  const foodTotal = foodDailyPerPerson * travelersCount * daysCount
  const transportTotal = transportDailyPerPerson * travelersCount * daysCount
  
  const totalAmount = hotelTotal + activitiesTotal + foodTotal + transportTotal
  const totalMin = Math.round(totalAmount * 0.95)
  const totalMax = Math.round(totalAmount * 1.15)
  
  const baseline = tierConfig
    ? {
        minTotal: tierConfig.minPerPersonPerDay * travelersCount * daysCount,
        maxTotal: tierConfig.maxPerPersonPerDay
          ? tierConfig.maxPerPersonPerDay * travelersCount * daysCount
          : null,
      }
    : null

  return {
    currency: "NGN",
    categories: [
      {
        key: "accommodation",
        label: "Accommodation",
        amount: hotelTotal,
        formattedAmount: formatCurrency(hotelTotal),
        iconName: "Bed01Icon",
      },
      {
        key: "food",
        label: "Food & Drink",
        amount: foodTotal,
        formattedAmount: formatCurrency(foodTotal),
        iconName: "SpoonAndForkIcon",
      },
      {
        key: "transport",
        label: "Transport",
        amount: transportTotal,
        formattedAmount: formatCurrency(transportTotal),
        iconName: "Car01Icon",
      },
      {
        key: "activities",
        label: "Activities",
        amount: activitiesTotal,
        formattedAmount: formatCurrency(activitiesTotal),
        iconName: "Ticket01Icon",
      },
    ],
    estimatedTotalMin: totalMin,
    estimatedTotalMax: totalMax,
    formattedTotal: `~ ${formatCurrency(totalMin)}`,
    formattedRange: `${formatCurrency(totalMin)} – ${formatCurrency(totalMax)}`,
    targetBaselineMin: baseline?.minTotal,
    targetBaselineMax: baseline?.maxTotal,
  }
}

const HOTEL_POOL: AccommodationOption[] = [
  // ── Priority partner hotels ────────────────────────────────────────────
  {
    id: "acc-omedel",
    slug: "omedel-hotel-and-suites",
    name: "Omedel Hotel & Suites",
    area: "Independence Layout",
    address: "4/6 Link Road, Independence Layout, Enugu",
    rating: 4.9,
    reviewCount: 88,
    pricePerNight: 120_000,
    formattedPrice: "₦120,000/night",
    imageUrl: "https://www.omedelluxury.com/storage/rooms/zLCXEjTkw8c2GZwjqzi5PBtKpX3SvOmIZbiu9t1z.jpg",
    badge: "BEST MATCH",
    isSelected: false,
    amenities: ["Pool", "Breakfast", "Spa", "Free Wi-Fi", "Free airport pickup"],
    description: "Enugu's best 5-star deluxe hotel, 3 min from Government House, with pool and free airport transfer.",
    recommendationReason: "Highest-rated luxury stay in Enugu — complimentary airport pickup included.",
  },
  {
    id: "acc-wells",
    slug: "wells-royale-hotel",
    name: "Wells Royale Hotel",
    area: "Independence Layout",
    address: "Independence Layout, Enugu",
    rating: 4.7,
    reviewCount: 74,
    pricePerNight: 95_000,
    formattedPrice: "₦95,000/night",
    imageUrl: "https://wellsroyalehotels.com/files/room-4.jpg",
    badge: "ALTERNATIVE",
    isSelected: false,
    amenities: ["Spa", "Gym", "Restaurant", "Event halls", "Free Wi-Fi"],
    description: "Refined Independence Layout hotel — spa, fitness, event halls, 24-hr guest support.",
    recommendationReason: "Warm service, spa and fitness centre, excellent for leisure + business.",
  },
  {
    id: "acc-presidential",
    slug: "hotel-presidential-enugu",
    name: "Hotel Presidential (by Amber)",
    area: "Independence Layout",
    address: "Independence Layout, Enugu",
    rating: 4.6,
    reviewCount: 116,
    pricePerNight: 90_000,
    formattedPrice: "₦90,000/night",
    imageUrl: "https://images.pexels.com/photos/2017802/pexels-photo-2017802.jpeg?auto=compress&cs=tinysrgb&w=800",
    badge: "ALTERNATIVE",
    isSelected: false,
    amenities: ["Pool", "Business centre", "Event halls", "Breakfast", "Bar"],
    description: "Iconic Enugu address managed by Amber Hotels — pool, ballrooms, full service.",
    recommendationReason: "Established prestige hotel, ideal for business + leisure blends.",
  },
  {
    id: "acc-bridgewaters",
    slug: "bridgewaters-hotel-enugu",
    name: "Bridgewaters Hotel",
    area: "New Haven",
    address: "New Haven, Enugu",
    rating: 4.3,
    reviewCount: 59,
    pricePerNight: 75_000,
    formattedPrice: "₦75,000/night",
    imageUrl: "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800",
    badge: "VALUE",
    isSelected: false,
    amenities: ["Pool", "Restaurant", "Bar", "Free Wi-Fi", "Parking"],
    description: "Comfortable mid-range stay in New Haven with pool and free parking.",
    recommendationReason: "Best value for money — great amenities at a mid-range price.",
  },
  {
    id: "acc-oranto",
    slug: "oranto-international-airport-hotel",
    name: "Oranto Airport Hotel",
    area: "Airport Road",
    address: "Airport Road, Enugu",
    rating: 4.2,
    reviewCount: 41,
    pricePerNight: 55_000,
    formattedPrice: "₦55,000/night",
    imageUrl: "https://images.pexels.com/photos/271619/pexels-photo-271619.jpeg?auto=compress&cs=tinysrgb&w=800",
    badge: "VALUE",
    isSelected: false,
    amenities: ["24-hr reception", "Restaurant", "Airport shuttle", "Free Wi-Fi"],
    description: "5 minutes from Akanu Ibiam Airport — ideal first or last night.",
    recommendationReason: "Closest hotel to the airport, perfect for early arrivals.",
  },
  {
    id: "acc-grace",
    slug: "grace-manor-hotels-and-suites",
    name: "Grace Manor Hotels & Suites",
    area: "Liberty Estate",
    address: "2A Nnanna Atuonwu Drive, Liberty Estate, Enugu",
    rating: 4.1,
    reviewCount: 33,
    pricePerNight: 35_000,
    formattedPrice: "₦35,000/night",
    imageUrl: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800",
    badge: "VALUE",
    isSelected: false,
    amenities: ["Pool", "Free Wi-Fi", "Parking", "Quiet estate location"],
    description: "20-room budget hotel with an outdoor pool in a quiet estate.",
    recommendationReason: "Best lean-budget pick — pool and estate setting at low price.",
  },
  // ── Supporting options ─────────────────────────────────────────────────
  {
    id: "acc-muse",
    slug: "muse-boutique-hotel",
    name: "MUSE Boutique Hotel",
    area: "Upper Chime Avenue, GRA",
    address: "189 Upper Chime Avenue, Enugu",
    rating: 4.9,
    reviewCount: 64,
    pricePerNight: 145_000,
    formattedPrice: "₦145,000/night",
    imageUrl: "https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg?auto=compress&cs=tinysrgb&w=800",
    badge: "PREMIUM",
    isSelected: false,
    amenities: ["Spa", "Boutique design", "Cocktail lounge", "Airport shuttle", "Breakfast"],
    description: "Enugu's newest 5-star boutique hotel, 7 min from the airport.",
  },
  {
    id: "acc-nike",
    slug: "landmark-nike-lake-resort",
    name: "Nike Lake Resort",
    area: "Abakpa Nike",
    address: "Nike Lake, Abakpa Nike, Enugu",
    rating: 4.5,
    reviewCount: 98,
    pricePerNight: 60_000,
    formattedPrice: "₦60,000/night",
    imageUrl: "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=800",
    badge: "ALTERNATIVE",
    isSelected: false,
    amenities: ["Lakefront views", "Boating", "Tennis court", "Gardens"],
    description: "Expansive lakeside resort with tranquil grounds and waterfront dining.",
  },
  {
    id: "acc-movida",
    slug: "golden-movida-hotel",
    name: "Golden Movida Hotel",
    area: "Trans-Ekulu",
    address: "Phase 6, Trans-Ekulu, Enugu",
    rating: 4.2,
    reviewCount: 52,
    pricePerNight: 28_000,
    formattedPrice: "₦28,000/night",
    imageUrl: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800",
    badge: "VALUE",
    isSelected: false,
    amenities: ["AC rooms", "Free Wi-Fi", "24-hr power", "Parking"],
    description: "Practical budget stay in Trans-Ekulu with essential amenities.",
  },
]

/**
 * Pick 3 hotel options for a given budget tier.
 * Priority hotels (omedel, wells royale, presidential, bridgewaters, oranto, grace manor)
 * appear first. The best-fit room tier per hotel is selected to match the budget.
 */
export function generateAccommodations(
  destination: string,
  budgetTier: BudgetTierValue
): AccommodationOption[] {
  // Price bands (NGN/night) per tier
  const bands: Record<BudgetTierValue, { min: number; max: number }> = {
    lean: { min: 0, max: 55_000 },
    "mid-range": { min: 55_001, max: 130_000 },
    premium: { min: 130_001, max: Infinity },
  }
  const band = bands[budgetTier]

  // Filter pool to hotels whose base price fits within ±40% of the band
  const suited = HOTEL_POOL.filter(
    (h) => h.pricePerNight >= band.min * 0.6 && h.pricePerNight <= band.max * 1.4
  )

  // Fallback: sort by proximity to band midpoint
  const sorted =
    suited.length >= 3
      ? suited
      : [...HOTEL_POOL].sort((a, b) => {
          const mid = (band.min + (band.max === Infinity ? band.min * 2 : band.max)) / 2
          return Math.abs(a.pricePerNight - mid) - Math.abs(b.pricePerNight - mid)
        })

  const picked = sorted.slice(0, 3)
  return picked.map((h, i) => ({
    ...h,
    id: `acc-${i + 1}`,
    badge: i === 0 ? "BEST MATCH" : i === 1 ? "ALTERNATIVE" : "VALUE",
    isSelected: i === 0,
  }))
}

export function generateDynamicTripItinerary(params: {
  destination?: string
  days?: string | number
  travelers?: string | number
  budget?: string
  pace?: string
  interests?: string[] | string
}): TripItinerary {
  const destination = params.destination?.trim() || "Enugu"
  const daysCount = Math.max(1, Math.min(14, Number(params.days) || 3))
  const travelersCount = Math.max(1, Number(params.travelers) || 2)
  const budgetTier = (params.budget as BudgetTierValue) || "mid-range"
  const pace = (params.pace as string) || "relaxed"

  const interestsList = Array.isArray(params.interests)
    ? params.interests
    : typeof params.interests === "string" && params.interests.trim()
    ? params.interests.split(",").map((s) => s.trim()).filter(Boolean)
    : ["Nature", "Food", "Culture"]

  const accommodations = generateAccommodations(destination, budgetTier)
  const selectedHotel = accommodations.find((a) => a.isSelected) || accommodations[0]

  // Determine activity density based on pace
  // Relaxed: 2 activities/day
  // Balanced: 3 activities/day
  // Fast: 4 activities/day
  const activitiesPerDay = pace === "fast" ? 4 : pace === "balanced" ? 3 : 2

  // Curated activity templates with high-res photography matching design
  const dayTemplates = [
    {
      dayNumber: 1,
      title: "Arrival & Nature",
      summary: "Settle into your accommodation, taste local fusion brunch, and explore the serene pine canopy.",
      activities: [
        {
          id: "act-1-1",
          title: "Breakfast at Cafe",
          description: "A local modern cafe offering traditional fusion dishes and fresh artisanal coffee.",
          startTime: "9:00 AM",
          durationMinutes: 60,
          durationLabel: "1 hr",
          estimatedCost: 8_000,
          formattedCost: "₦8,000",
          category: "food" as const,
          tags: ["Food", "Cafe"],
          imageUrl: "https://images.pexels.com/photos/103124/pexels-photo-103124.jpeg?auto=compress&cs=tinysrgb&w=800",
          location: {
            name: "The Manor / Chime Cafe",
            area: "GRA",
            latitude: 6.456,
            longitude: 7.506,
          },
          travelFromPreviousMinutes: 0,
        },
        {
          id: "act-1-2",
          title: "Ngwo Pine Forest",
          description: "A unique limestone cave hidden behind a waterfall, surrounded by a dense forest of pine trees. The hike is moderate but rewarding.",
          startTime: "10:30 AM",
          endTime: "1:00 PM",
          durationMinutes: 150,
          durationLabel: "2.5 hrs",
          estimatedCost: 5_000,
          formattedCost: "₦5,000",
          category: "nature" as const,
          tags: ["Nature", "Hiking"],
          imageUrl: "https://images.pexels.com/photos/142497/pexels-photo-142497.jpeg?auto=compress&cs=tinysrgb&w=800",
          location: {
            name: "Ngwo Pine Forest & Caves",
            area: "Ngwo",
            latitude: 6.442,
            longitude: 7.448,
          },
          travelFromPreviousMinutes: 20,
          travelMode: "drive" as const,
        },
        {
          id: "act-1-3",
          title: "Ntachi-Osa Traditional Lunch",
          description: "Taste authentic native soups like Ora and Ofe Onugbu paired with hot pounded yam.",
          startTime: "2:00 PM",
          durationMinutes: 75,
          durationLabel: "1.25 hrs",
          estimatedCost: 6_500,
          formattedCost: "₦6,500",
          category: "food" as const,
          tags: ["Food", "Culture"],
          imageUrl: "https://images.pexels.com/photos/6740517/pexels-photo-6740517.jpeg?auto=compress&cs=tinysrgb&w=800",
          location: {
            name: "Ntachi-Osa Restaurant",
            area: "New Haven",
            latitude: 6.4455,
            longitude: 7.526,
          },
          travelFromPreviousMinutes: 15,
          travelMode: "drive" as const,
        },
        {
          id: "act-1-4",
          title: "Milliken Hill Sunset Drive",
          description: "Scenic winding road overlooking the Enugu cityscape with historic 1909 colliery vistas.",
          startTime: "5:30 PM",
          durationMinutes: 90,
          durationLabel: "1.5 hrs",
          estimatedCost: 0,
          formattedCost: "Free",
          category: "attraction" as const,
          tags: ["Sightseeing", "Sunset"],
          imageUrl: "https://images.pexels.com/photos/38099166/pexels-photo-38099166.jpeg?auto=compress&cs=tinysrgb&w=800",
          location: {
            name: "Milliken Hill Lookout",
            area: "Ngwo / Enugu",
            latitude: 6.447,
            longitude: 7.462,
          },
          travelFromPreviousMinutes: 18,
          travelMode: "drive" as const,
        },
      ],
    },
    {
      dayNumber: 2,
      title: "Waterfalls & Heritage",
      summary: "Journey into the Udi valley for monastery caves, crystalline waters, and historical museum stops.",
      activities: [
        {
          id: "act-2-1",
          title: "Awhum Waterfall & Cave Monastery",
          description: "Majestic 30-meter waterfall enveloped in serene monastery caves with therapeutic natural spring pools.",
          startTime: "9:30 AM",
          endTime: "1:30 PM",
          durationMinutes: 240,
          durationLabel: "4 hrs",
          estimatedCost: 8_000,
          formattedCost: "₦8,000",
          category: "adventure" as const,
          tags: ["Nature", "Waterfall", "Hiking"],
          imageUrl: "https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=800",
          location: {
            name: "Awhum Monastery & Falls",
            area: "Udi LGA",
            latitude: 6.5512,
            longitude: 7.3789,
          },
          travelFromPreviousMinutes: 40,
          travelMode: "drive" as const,
        },
        {
          id: "act-2-2",
          title: "National Museum of Unity",
          description: "Enlightening galleries exploring Coal City origins, masquerade traditions, and Eastern Nigerian craftwork.",
          startTime: "3:00 PM",
          durationMinutes: 90,
          durationLabel: "1.5 hrs",
          estimatedCost: 2_500,
          formattedCost: "₦2,500",
          category: "culture" as const,
          tags: ["Culture", "History"],
          imageUrl: "https://images.pexels.com/photos/20967/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800",
          location: {
            name: "National Museum of Unity",
            area: "Enugu City",
            latitude: 6.441,
            longitude: 7.514,
          },
          travelFromPreviousMinutes: 30,
          travelMode: "drive" as const,
        },
        {
          id: "act-2-3",
          title: "Dolphin Fine Dining",
          description: "Relaxed evening dinner tasting classic continental recipes and peppered delicacies in GRA.",
          startTime: "6:30 PM",
          durationMinutes: 120,
          durationLabel: "2 hrs",
          estimatedCost: 15_000,
          formattedCost: "₦15,000",
          category: "food" as const,
          tags: ["Food", "Dinner"],
          imageUrl: "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=800",
          location: {
            name: "Dolphin Restaurant",
            area: "GRA",
            latitude: 6.454,
            longitude: 7.504,
          },
          travelFromPreviousMinutes: 15,
          travelMode: "drive" as const,
        },
      ],
    },
    {
      dayNumber: 3,
      title: "Lakeside Leisure & Crafts",
      summary: "Unwind along Nike Lake, take an easy morning boat cruise, and browse local artisan markets.",
      activities: [
        {
          id: "act-3-1",
          title: "Nike Lake Morning Boat Ride",
          description: "Gentle cruise across the mist-kissed natural lake followed by lakeside terrace breakfast.",
          startTime: "9:00 AM",
          durationMinutes: 120,
          durationLabel: "2 hrs",
          estimatedCost: 6_000,
          formattedCost: "₦6,000",
          category: "relaxation" as const,
          tags: ["Relaxation", "Boating"],
          imageUrl: "https://images.pexels.com/photos/1430677/pexels-photo-1430677.jpeg?auto=compress&cs=tinysrgb&w=800",
          location: {
            name: "Nike Lake Waterfront",
            area: "Abakpa Nike",
            latitude: 6.518,
            longitude: 7.568,
          },
          travelFromPreviousMinutes: 20,
          travelMode: "drive" as const,
        },
        {
          id: "act-3-2",
          title: "Michael Okpara Square & Polo Mall",
          description: "Stroll through the iconic civic square and pick up authentic Igbo crafts, local snacks, and souvenirs.",
          startTime: "12:30 PM",
          durationMinutes: 120,
          durationLabel: "2 hrs",
          estimatedCost: 10_000,
          formattedCost: "₦10,000",
          category: "attraction" as const,
          tags: ["Shopping", "Culture"],
          imageUrl: "https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=800",
          location: {
            name: "Michael Okpara Square",
            area: "Independence Layout",
            latitude: 6.429,
            longitude: 7.538,
          },
          travelFromPreviousMinutes: 18,
          travelMode: "drive" as const,
        },
        {
          id: "act-3-3",
          title: "Farewell Dinner at The Manor",
          description: "Celebrate the trip conclusion with signature gourmet dishes and cocktails on Chime Lane.",
          startTime: "7:00 PM",
          durationMinutes: 120,
          durationLabel: "2 hrs",
          estimatedCost: 18_000,
          formattedCost: "₦18,000",
          category: "food" as const,
          tags: ["Food", "Fine Dining"],
          imageUrl: "https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&w=800",
          location: {
            name: "The Manor",
            area: "GRA",
            latitude: 6.456,
            longitude: 7.506,
          },
          travelFromPreviousMinutes: 12,
          travelMode: "drive" as const,
        },
      ],
    },
  ]

  // Construct dynamic days for arbitrary daysCount (1 to 14)
  const days: ItineraryDay[] = []
  const allActivitiesList: ItineraryActivity[] = []

  const baseDate = new Date()
  baseDate.setDate(baseDate.getDate() + 14) // default 2 weeks out

  for (let i = 1; i <= daysCount; i++) {
    const templateIndex = (i - 1) % dayTemplates.length
    const template = dayTemplates[templateIndex]
    const dayDate = new Date(baseDate)
    dayDate.setDate(baseDate.getDate() + (i - 1))
    
    const dateFormatted = dayDate.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    })

    // Slice activities per day based on pace preference
    const dayActivities = template.activities.slice(0, activitiesPerDay).map((act, index) => ({
      ...act,
      id: `day-${i}-act-${index + 1}`,
    }))

    days.push({
      id: `day-${i}`,
      dayNumber: i,
      dateLabel: dateFormatted,
      title: i <= 3 ? template.title : `Day ${i}: Exploration & Local Gems`,
      summary: template.summary,
      activities: dayActivities,
    })

    allActivitiesList.push(...dayActivities)
  }

  const budgetBreakdown = calculateBreakdown(
    selectedHotel,
    daysCount,
    travelersCount,
    allActivitiesList,
    budgetTier
  )

  const startDateFormatted = baseDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  })
  const endDateObj = new Date(baseDate)
  endDateObj.setDate(baseDate.getDate() + daysCount - 1)
  const endDateFormatted = endDateObj.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  })

  const dossier: TripDossier = {
    id: `trip-${Date.now()}`,
    title: `Your ${destination} Escape`,
    destination,
    destinationCountry: "Nigeria",
    startDate: startDateFormatted,
    endDate: endDateFormatted,
    dateRangeLabel: `${startDateFormatted} — ${endDateFormatted}`,
    daysCount,
    travelersCount,
    travelersLabel: `${travelersCount} Traveler${travelersCount === 1 ? "" : "s"}`,
    budgetTier,
    budgetTierLabel: budgetTiers[budgetTier]?.label || "Mid-range",
    pace: pace.charAt(0).toUpperCase() + pace.slice(1),
    interests: interestsList,
    heroImageUrl:
      "https://images.pexels.com/photos/38099166/pexels-photo-38099166.jpeg?auto=compress&cs=tinysrgb&w=1800",
  }

  return {
    dossier,
    days,
    accommodations,
    selectedAccommodationId: selectedHotel.id,
    budgetBreakdown,
    totalTravelTimeMinutesSaved: 45,
    status: "draft",
  }
}

export function updateAccommodationInItinerary(
  trip: TripItinerary,
  accommodationId: string
): TripItinerary {
  const updatedAccommodations = trip.accommodations.map((acc) => ({
    ...acc,
    isSelected: acc.id === accommodationId,
  }))
  const selectedHotel =
    updatedAccommodations.find((a) => a.isSelected) || updatedAccommodations[0]

  const allActivities = trip.days.flatMap((d) => d.activities)
  const updatedBudget = calculateBreakdown(
    selectedHotel,
    trip.dossier.daysCount,
    trip.dossier.travelersCount,
    allActivities,
    trip.dossier.budgetTier
  )

  return {
    ...trip,
    accommodations: updatedAccommodations,
    selectedAccommodationId: accommodationId,
    budgetBreakdown: updatedBudget,
  }
}

export function removeActivityFromItinerary(
  trip: TripItinerary,
  activityId: string
): TripItinerary {
  const updatedDays = trip.days.map((day) => ({
    ...day,
    activities: day.activities.filter((act) => act.id !== activityId),
  }))

  const allActivities = updatedDays.flatMap((d) => d.activities)
  const selectedHotel =
    trip.accommodations.find((a) => a.id === trip.selectedAccommodationId) ||
    trip.accommodations[0]

  const updatedBudget = calculateBreakdown(
    selectedHotel,
    trip.dossier.daysCount,
    trip.dossier.travelersCount,
    allActivities,
    trip.dossier.budgetTier
  )

  return {
    ...trip,
    days: updatedDays,
    budgetBreakdown: updatedBudget,
  }
}
