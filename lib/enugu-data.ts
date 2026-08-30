function wikimedia(file: string, width = 1600) {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${file}?width=${width}`
}

export type PlaceCategory =
  | "attraction"
  | "hotel"
  | "restaurant"
  | "resort"
  | "nightlife"

export type RoomTier = {
  name: string
  pricePerNight: number
  formattedPrice: string
  maxOccupancy?: number
  amenities: string[]
  description?: string
}

export type Place = {
  slug: string
  name: string
  category: PlaceCategory
  area: string
  kind: string
  time?: string
  priceLevel?: string
  address?: string
  image: string
  /** Extra photos beyond `image`, shown in the details-page carousel. */
  images?: string[]
  note: string
  description: string
  website?: string
  /** Room tiers shown on hotel detail pages. */
  rooms?: RoomTier[]
  /** Priority order for agent hotel recommendations (lower = higher priority). */
  recommendPriority?: number
}

export const enuguAttractions: Place[] = [
  {
    slug: "awhum-waterfall",
    name: "Awhum Waterfall",
    category: "attraction",
    area: "Udi",
    kind: "Waterfall + cave monastery",
    time: "Half day",
    priceLevel: "₦500–₦2,000 entry",
    image: "/images/awhum_waterfall_1.jpeg",
    images: ["/images/awhum_waterfall_2.jpeg", "/images/awhum_waterfall_3.jpg"],
    note: "Cool valley walk, limestone scenery, prayer cave, strong photo stop.",
    description:
      "A 30-metre waterfall at Amu-Ugwu village in Udi Local Government Area, next to the Our Lady of Mount Calvary Monastery. The walk down the valley passes a limestone cave used for prayer before opening onto the falls. Wear grip footwear, the path is slippery after rain, and a local guide makes the cave section much easier to navigate.",
  },
  {
    slug: "ngwo-pine-forest",
    name: "Ngwo Pine Forest",
    category: "attraction",
    area: "Ngwo",
    kind: "Forest trail + cave",
    time: "3-4 hours",
    priceLevel: "~₦500–₦1,000 entry (informal)",
    image: "/images/ngwo_pine_forest_1.jpg",
    images: [
      "/images/ngwo_pine_forest_2.jpg",
      "/images/ngwo_pine_forest_3.webp",
      "/images/ngwo_pine_forest_4.webp",
    ],
    note: "Pine canopy, short hike, cave stream, best with a local guide.",
    description:
      "A planted pine forest on the outskirts of Enugu city with a limestone cave and stream running through it. The canopy keeps the trail shaded, and the walk is short enough for a half-day out. Go early for cooler air and better light, and use a local guide for the cave section.",
  },
  {
    slug: "landmark-resorts-enugu",
    name: "Landmark Resorts Enugu",
    category: "attraction",
    area: "Abakpa Nike",
    kind: "Lakefront resort & activities",
    time: "Half day – full day",
    priceLevel: "Free entry · activities from ₦2,000",
    image: "/images/landmark-resort-1.webp",
    images: [
      "/images/landmark-resort-2.jpg",
      "/images/landmark-resort-3.jpg",
      "/images/landmark-resort-4.jpg",
      "/images/landmark-resort-5.jpg",
      "/images/landmark-upsidedown-house.png",
      "/images/landmark-resort-6.png",
      "/images/landmark-resort-7.jpg",
      "/images/landmark-resort-8.png",
      "/images/landmark-resort-9.jpg",
    ],
    note: "Lakefront resort with pool, upside-down house, boat rides and suites — 10 min from the city.",
    description:
      "Formerly known as Nike Lake Resort, Landmark Resorts Enugu sits on a 150-hectare lakefront estate in Abakpa Nike, about 10 minutes from the city centre. The grounds include a pool, watersports, the famous upside-down house photo spot, and a renovated suite wing with lake views. A strong anchor for a relaxed half-day or full-day stop on any Enugu itinerary.",
  },
  {
    slug: "ezeagu-tourist-complex",
    name: "Ezeagu Tourist Complex",
    category: "attraction",
    area: "Ezeagu",
    kind: "Cave + waterfall + tunnel",
    time: "Full day",
    priceLevel: "₦500–₦1,000 entry",
    image: wikimedia("GURARA_WATERFALLS.jpg"),
    note: "Most adventurous Enugu day trip: caves, rock paths, forest water.",
    description:
      "Enugu's most adventurous day trip, in Obinofia Ndiuno in Udi LGA: a waterfall, a natural spring and lake, and a cave system with tunnels and chambers roughly 3km from the falls. Leave early, budget the full day, and bring a local guide for the cave and tunnel sections.",
  },
  {
    slug: "milliken-hill",
    name: "Milliken Hill",
    category: "attraction",
    area: "Ngwo",
    kind: "Panoramic hill road",
    time: "1-2 hours",
    priceLevel: "Free",
    image: "/images/miliken_hill_1.jpg",
    note: "Coal-mine-era hill road with a sweeping dusk view of Enugu city.",
    description:
      "A winding road built in 1909 through Enugu-Ngwo, named for the engineer who built it after coal was found in the hill. It sits about 100m above sea level and gives a panoramic view of Enugu metropolis, best at dawn or dusk. Old coal-mine tunnels remain beneath the hill.",
  },
  {
    slug: "national-museum-of-unity",
    name: "National Museum of Unity",
    category: "attraction",
    area: "Enugu city",
    kind: "History + culture museum",
    time: "1-2 hours",
    priceLevel: "₦1,000 entry",
    image: "/images/national_musuem_enugu.jpg",
    note: "Coal City history and Igbo cultural galleries, easy indoor stop.",
    description:
      "Three galleries in the city centre: a Unity Gallery on shared belief systems across Nigerian ethnic groups, an Igbo Gallery on architectural, religious, and social life, and an 'Enugu the Coal City' gallery tracing the city's growth from coal discovery. An easy, air-conditioned stop to pair with a city-day itinerary.",
  },
  {
    slug: "unity-park",
    name: "Unity Park",
    category: "attraction",
    area: "Enugu city",
    kind: "Urban park",
    time: "Short stop",
    priceLevel: "~₦1,000–₦2,000 entry",
    image: "/images/unitypark_1.jpg",
    images: ["/images/unitypark_2.jpg"],
    note: "Central green space with a landmark lion statue, good rest break.",
    description:
      "A central Enugu city park known for its large lion statue landmark, used for community gatherings and casual walks. Good for a short rest break between museum and city-square stops rather than a destination on its own.",
  },
  {
    slug: "michael-okpara-square",
    name: "Michael Okpara Square",
    category: "attraction",
    area: "Independence Layout",
    kind: "City square + events ground",
    time: "Short stop",
    priceLevel: "Free",
    image: "/images/micheal_okpara_square_1.png",
    note: "Civic square used for parades and fitness walks, easy city-day add-on.",
    description:
      "A civic square named for Michael Okpara, Premier of the former Eastern Nigeria region, used for national events, sports, and political rallies, and popular with locals as a morning fitness-walk spot. A quick add-on to a city-day route.",
  },
]

export const enuguHotels: Place[] = [
  {
    slug: "wells-royale-hotel",
    name: "Wells Royale Hotel",
    category: "hotel",
    area: "Independence Layout",
    kind: "Premium hotel",
    priceLevel: "From ₦60,000/night",
    address: "No. 21 Alex Ekwueme Street, Independence Layout, Enugu",
    website: "https://wellsroyalehotels.com/",
    image: "https://wellsroyalehotels.com/files/room-4.jpg",
    images: [
      "https://wellsroyalehotels.com/files/room-2.jpg",
      "https://wellsroyalehotels.com/files/dining-1.jpg",
    ],
    note: "Polished Independence Layout hotel — spa, fitness centre, event halls, 24-hr guest support.",
    description:
      "Wells Royale Hotel is a premium property in Independence Layout, one of Enugu's most sought-after hospitality destinations. Guests enjoy well-furnished rooms, a rooftop bar with city views, a swimming pool, an all-day restaurant serving Nigerian and continental cuisine, a gym, and elegant event and conference facilities. Within walking distance of Government House and major Independence Layout dining and business addresses.",
    recommendPriority: 2,
    rooms: [
      {
        name: "Standard Room",
        pricePerNight: 60_000,
        formattedPrice: "₦60,000/night",
        maxOccupancy: 2,
        amenities: ["AC", "Queen bed", "Smart TV", "Free Wi-Fi", "Breakfast"],
        description: "Clean, well-equipped standard room with city or garden view.",
      },
      {
        name: "Deluxe Room",
        pricePerNight: 95_000,
        formattedPrice: "₦95,000/night",
        maxOccupancy: 2,
        amenities: ["AC", "King bed", "Bathtub", "Minibar", "Rooftop bar access"],
        description: "Upgraded deluxe room with superior furnishings and minibar.",
      },
      {
        name: "Royale Suite",
        pricePerNight: 150_000,
        formattedPrice: "₦150,000/night",
        maxOccupancy: 3,
        amenities: ["AC", "Living room", "Kitchenette", "Bathtub", "Butler access", "Complimentary airport pickup"],
        description: "Flagship suite with separate lounge and complimentary airport pickup.",
      },
    ],
  },
  {
    slug: "oranto-international-airport-hotel",
    name: "Oranto International Airport Hotel",
    category: "hotel",
    area: "Airport Road, Abakpa",
    kind: "Airport hotel",
    priceLevel: "From ₦55,000/night",
    address: "Airport Road, Enugu",
    image: "/images/oranto_airport_hotel_1.webp",
    images: ["/images/oranto_airport_hotel_2.webp", "/images/oranto_airport_hotel_3.webp"],
    note: "5 minutes from Akanu Ibiam Airport, 24-hr reception, shuttle on request.",
    description:
      "Oranto International Airport Hotel sits on Airport Road within a short drive of Akanu Ibiam International Airport, making it the practical first-night or last-night choice for any Enugu trip. Rooms are well-maintained with all standard business amenities. A restaurant serves continental and local dishes around the clock, and the front desk can arrange airport shuttles and onward city transfers.",
    recommendPriority: 5,
    rooms: [
      {
        name: "Standard Room",
        pricePerNight: 55_000,
        formattedPrice: "₦55,000/night",
        maxOccupancy: 2,
        amenities: ["AC", "Queen bed", "Smart TV", "Free Wi-Fi", "24-hr reception"],
        description: "Clean, airport-convenient room perfect for early arrivals or late departures.",
      },
      {
        name: "Deluxe Room",
        pricePerNight: 85_000,
        formattedPrice: "₦85,000/night",
        maxOccupancy: 2,
        amenities: ["AC", "King bed", "Bathtub", "Minibar", "Airport shuttle"],
        description: "Upgraded deluxe room with complimentary airport shuttle.",
      },
      {
        name: "Suite",
        pricePerNight: 130_000,
        formattedPrice: "₦130,000/night",
        maxOccupancy: 4,
        amenities: ["AC", "Living room", "King bed", "Kitchenette", "Airport transfer", "Breakfast"],
        description: "Spacious suite with a sitting area, ideal for families or extended stays.",
      },
    ],
  },
  {
    slug: "muse-boutique-hotel",
    name: "MUSE Boutique Hotel",
    category: "hotel",
    area: "GRA / Upper Chime Avenue",
    kind: "5-star premium hotel",
    priceLevel: "From ₦95,000/night",
    address: "189 Upper Chime Avenue, Enugu",
    image: "/images/muse_boutique_1.webp",
    images: ["/images/muse_boutique_2.webp", "/images/muse_boutique_3.webp"],
    note: "Newest premium hotel in Enugu, 7 minutes from the airport, spa + infinity-style pool.",
    description:
      "Enugu's newest 5-star boutique hotel, on Upper Chime Avenue, a 7-minute drive from Akanu Ibiam International Airport. 35 tastefully furnished rooms and suites with AC, flat-screen TVs, and safes. Full-service spa, fitness room, outdoor pool, free Wi-Fi, complimentary breakfast, tour desk, 24-hour front desk, and the O Lounge & Bar for indoor-outdoor dining with city views. The pick when the traveller wants the newest, most premium stay close to the airport.",
    rooms: [
      {
        name: "Deluxe Room",
        pricePerNight: 95_000,
        formattedPrice: "₦95,000/night",
        maxOccupancy: 2,
        amenities: ["AC", "Flat-screen TV", "Safe", "Free Wi-Fi", "Breakfast included"],
        description: "Comfortable deluxe room with city views and boutique furnishings.",
      },
      {
        name: "Junior Suite",
        pricePerNight: 145_000,
        formattedPrice: "₦145,000/night",
        maxOccupancy: 2,
        amenities: ["AC", "Sitting area", "Flat-screen TV", "Minibar", "Spa access"],
        description: "Spacious suite with separate sitting area and rooftop lounge access.",
      },
      {
        name: "Penthouse Suite",
        pricePerNight: 220_000,
        formattedPrice: "₦220,000/night",
        maxOccupancy: 3,
        amenities: ["AC", "Private terrace", "Butler service", "Spa", "Airport shuttle"],
        description: "Top-floor penthouse with panoramic Enugu views and dedicated butler.",
      },
    ],
  },
  {
    slug: "omedel-hotel-and-suites",
    name: "Omedel Hotel & Suites",
    category: "hotel",
    area: "Independence Layout",
    kind: "5-star luxury hotel",
    priceLevel: "From ₦100,000/night",
    address: "4/6 Link Road off Pascal & Jerk Bus-stop, Independence Layout, Enugu",
    website: "https://www.omedelluxury.com/",
    image: "https://www.omedelluxury.com/storage/rooms/zLCXEjTkw8c2GZwjqzi5PBtKpX3SvOmIZbiu9t1z.jpg",
    images: [
      "https://www.omedelluxury.com/storage/rooms/gqIe16iRxurgwZNiJw6CGX87NXlSAcebxKqUPFCO.jpg",
      "https://www.omedelluxury.com/storage/rooms/DCSt6ychZ5eJD6zofHmJBNWxAI7J8Mix0uqyYQPq.jpg",
    ],
    note: "Enugu's best 5-star deluxe hotel, 3 min from Government House, pool + free airport pickup.",
    description:
      "Omedel Hotel & Suites bills itself as the best five-star deluxe hotel in Enugu, positioned three minutes from the State Government House in the heart of Independence Layout. The hotel offers classic rooms, deluxe balcony rooms, executive suites, a premium suite, and VIP executive suites — all with modern sophisticated furnishings. Amenities include a swimming pool with lounge area, fitness centre, restaurant, bar, event facilities, 24-hour room service, complimentary breakfast, complimentary airport pickup and drop-off, secure parking, and high-speed fibre internet.",
    recommendPriority: 1,
    rooms: [
      {
        name: "Classic Room",
        pricePerNight: 100_000,
        formattedPrice: "₦100,000/night",
        maxOccupancy: 2,
        amenities: ["AC", "King bed", "Smart TV", "Free Wi-Fi", "Breakfast", "Pool access"],
        description: "Elegant classic room with modern fittings and complimentary breakfast.",
      },
      {
        name: "Deluxe Balcony",
        pricePerNight: 120_000,
        formattedPrice: "₦120,000/night",
        maxOccupancy: 2,
        amenities: ["AC", "King bed", "Private balcony", "Bathtub", "Minibar", "Pool access"],
        description: "Spacious room with a private balcony overlooking the pool area.",
      },
      {
        name: "Executive Suite",
        pricePerNight: 150_000,
        formattedPrice: "₦150,000/night",
        maxOccupancy: 3,
        amenities: ["AC", "Sitting area", "King bed", "Bathtub + shower", "Minibar", "Airport pickup"],
        description: "Suite with separate sitting area and complimentary airport transfer.",
      },
      {
        name: "Premium Suite",
        pricePerNight: 200_000,
        formattedPrice: "₦200,000/night",
        maxOccupancy: 4,
        amenities: ["AC", "Living + dining room", "King bed", "Jacuzzi", "Butler", "Airport transfer"],
        description: "Full premium suite with jacuzzi, living and dining area, and dedicated butler.",
      },
      {
        name: "VIP Executive Suite",
        pricePerNight: 250_000,
        formattedPrice: "₦250,000/night",
        maxOccupancy: 4,
        amenities: ["AC", "Multiple rooms", "Private terrace", "Jacuzzi", "Full butler service", "Airport transfer"],
        description: "The hotel's most prestigious offering — presidential-grade VIP experience.",
      },
    ],
  },
  {
    slug: "gold-rhino-hotel-and-suites",
    name: "Gold Rhino Hotel & Suites",
    category: "hotel",
    area: "Nkpokiti",
    kind: "Boutique luxury hotel",
    priceLevel: "From ₦42,000/night",
    address: "No. 3 Pocket Drive, Nkpokiti Road, Enugu",
    image: "https://ak-d.tripcdn.com/images/0222t12000pi1fl528D33_R_960_660_R5_D.jpg",
    images: [
      "https://ak-d.tripcdn.com/images/0226612000o68dbf47FB6_R_960_660_R5_D.jpg",
      "https://ak-d.tripcdn.com/images/0221t12000mavairx8AC2_R_339_206_R5_D.jpg",
    ],
    note: "35-room boutique hotel at Nkpokiti, pool, event hall, complimentary breakfast.",
    description:
      "Gold Rhino Hotel & Suites is a distinctive boutique hotel on Pocket Drive off Nkpokiti Road, opposite C to C Plaza and 2 minutes from Nnamdi Azikiwe Stadium. The 35 tastefully appointed rooms — from Standard to Presidential Suite — combine modern sophistication with warm Nigerian hospitality. On-site amenities include a swimming pool, bar and lounge, restaurant, event hall (Golden Hall, 200-capacity), complimentary breakfast, airport pickup, high-speed Wi-Fi, and 24-hour power. Contact: +234 814 880 8800.",
    rooms: [
      {
        name: "Standard Room",
        pricePerNight: 42_000,
        formattedPrice: "₦42,000/night",
        maxOccupancy: 2,
        amenities: ["AC", "Flat-screen TV", "Free Wi-Fi", "Complimentary breakfast"],
        description: "Tastefully furnished standard room with modern fittings.",
      },
      {
        name: "Deluxe Room",
        pricePerNight: 53_750,
        formattedPrice: "₦53,750/night",
        maxOccupancy: 2,
        amenities: ["AC", "King bed", "Flat-screen TV", "Minibar", "Pool access"],
        description: "Upgraded deluxe room with king bed and minibar.",
      },
      {
        name: "Executive Room",
        pricePerNight: 64_500,
        formattedPrice: "₦64,500/night",
        maxOccupancy: 2,
        amenities: ["AC", "Work desk", "King bed", "Bathtub", "Free Wi-Fi"],
        description: "Executive room ideal for business travellers, with a dedicated work desk.",
      },
      {
        name: "Royal Executive",
        pricePerNight: 96_750,
        formattedPrice: "₦96,750/night",
        maxOccupancy: 3,
        amenities: ["AC", "King bed", "Sitting area", "Bathtub", "Breakfast", "Airport pickup"],
        description: "Premium royal executive with sitting area and complimentary airport pickup.",
      },
      {
        name: "Presidential Suite",
        pricePerNight: 129_000,
        formattedPrice: "₦129,000/night",
        maxOccupancy: 4,
        amenities: ["AC", "Living room", "Dining area", "Jacuzzi", "Butler service", "Airport transfer"],
        description: "Top-floor suite with full living and dining areas and jacuzzi.",
      },
    ],
  },
  {
    slug: "golden-royale-hotel",
    name: "Golden Royale Hotel",
    category: "hotel",
    area: "Independence Layout",
    kind: "4-star hotel",
    priceLevel: "From $59/night",
    address: "10 Bissala Road, Independence Layout, Enugu",
    image: "/images/GoldenRoyale_1.webp",
    images: ["/images/GoldenRoyale_2.webp", "/images/GoldenRoyale_3.webp"],
    note: "Indoor + outdoor pool, sauna, gym and garden on Bissala Road.",
    description:
      "A 4-star hotel on Bissala Road in Independence Layout, with an indoor swimming pool, sauna, garden, and an outdoor pool. Rooms come with air-conditioning, balconies, kitchenette, and free Wi-Fi. Restaurant, bar, shared lounge, fitness room, cooked-to-order breakfast, laundry, and 24-hour front desk on site. A comfort-tier pick right in Independence Layout.",
  },
  {
    slug: "bridgewaters-hotel-enugu",
    name: "Bridgewaters Hotel",
    category: "hotel",
    area: "New Haven / GRA",
    kind: "Mid-range hotel",
    priceLevel: "From ₦45,000/night",
    address: "New Haven, Enugu",
    image: "/images/bridgewaters_hotel_1.webp",
    images: ["/images/bridgewaters_hotel_2.webp", "/images/bridgewaters_hotel_3.webp"],
    note: "Comfortable mid-range stay in New Haven with a pool, restaurant, and free parking.",
    description:
      "Bridgewaters Hotel is a well-regarded mid-range property in the New Haven district, a comfortable and well-connected neighbourhood close to restaurants, supermarkets, and the main Enugu ring road. The hotel offers en-suite rooms with AC, a swimming pool, an on-site restaurant, a bar, and free secure parking. A reliable choice for mid-budget travellers who want comfort without paying premium prices.",
    recommendPriority: 4,
    rooms: [
      {
        name: "Standard Room",
        pricePerNight: 45_000,
        formattedPrice: "₦45,000/night",
        maxOccupancy: 2,
        amenities: ["AC", "Double bed", "Smart TV", "Free Wi-Fi", "Parking"],
        description: "Neat, well-maintained standard room with all core amenities.",
      },
      {
        name: "Deluxe Room",
        pricePerNight: 75_000,
        formattedPrice: "₦75,000/night",
        maxOccupancy: 2,
        amenities: ["AC", "King bed", "Bathtub", "Minibar", "Pool access"],
        description: "Deluxe room with king bed and bathroom with separate bathtub.",
      },
      {
        name: "Suite",
        pricePerNight: 110_000,
        formattedPrice: "₦110,000/night",
        maxOccupancy: 4,
        amenities: ["AC", "Living room", "King bed", "Kitchenette", "Breakfast", "Early check-in"],
        description: "Comfortable suite with separate living area, ideal for couples or small families.",
      },
    ],
  },
  {
    slug: "hotel-presidential-enugu",
    name: "Hotel Presidential (by Amber)",
    category: "hotel",
    area: "Independence Layout",
    kind: "4-star hotel",
    priceLevel: "From ₦90,000/night",
    address: "Independence Layout, Enugu",
    image: "https://hotelpresidentialbyamber.com/images/banner/hero.jpg",
    images: [
      "https://hotelpresidentialbyamber.com/images/banner/banner1.jpg",
      "https://hotelpresidentialbyamber.com/images/banner/banner2.jpg",
    ],
    note: "Iconic Enugu address, managed by Amber Hotels, pool, business centre, event halls.",
    description:
      "Hotel Presidential is one of Enugu's best-known hotel addresses, now managed by Amber Hotels. Located in Independence Layout, it offers a full-service experience with a large swimming pool, a business centre, restaurants, bars, and spacious event halls suitable for weddings and conferences. A solid 4-star pick that balances prestige with practical amenities for both business and leisure travellers.",
    recommendPriority: 3,
    rooms: [
      {
        name: "Standard Room",
        pricePerNight: 90_000,
        formattedPrice: "₦90,000/night",
        maxOccupancy: 2,
        amenities: ["AC", "Queen/King bed", "Smart TV", "Free Wi-Fi", "Breakfast"],
        description: "Comfortable standard room with classic hotel furnishings.",
      },
      {
        name: "Executive Room",
        pricePerNight: 130_000,
        formattedPrice: "₦130,000/night",
        maxOccupancy: 2,
        amenities: ["AC", "King bed", "Work desk", "Minibar", "Pool access", "Express check-in"],
        description: "Executive floor room with premium finishes and dedicated concierge.",
      },
      {
        name: "Presidential Suite",
        pricePerNight: 250_000,
        formattedPrice: "₦250,000/night",
        maxOccupancy: 4,
        amenities: ["AC", "Living + dining rooms", "Kitchenette", "Jacuzzi", "Butler", "Airport transfer"],
        description: "The hotel's top suite — full residential feel with a private jacuzzi.",
      },
    ],
  },
  {
    slug: "lagenda-hotels",
    name: "Lagenda Hotels",
    category: "hotel",
    area: "Ogui",
    kind: "Premium hotel",
    priceLevel: "From ₦207,650/night",
    address: "4 Ekweani Close, beside Loma Linda Estate, Ogui, Enugu",
    image: "/images/lagendahotel_1.webp",
    images: [
      "/images/lagenda_hotel_2.webp",
      "/images/lagenda_hotel_3.webp",
    ],
    note: "Enugu's premium end, beside Loma Linda Estate in Ogui.",
    description:
      "A premium hotel on Ekweani Close in Ogui, beside Loma Linda Estate. The pick for a premium-budget trip that wants the highest comfort tier available in Enugu.",
  },
  {
    slug: "golden-movida-hotel",
    name: "Golden Movida Hotel",
    category: "hotel",
    area: "Trans-Ekulu",
    kind: "Budget hotel",
    priceLevel: "From $25/night",
    address: "52/6 Peace Ozor Street, Phase 6, Trans-Ekulu, Enugu",
    image: "/images/golden_movida_1.webp",
    images: ["/images/golden_movida_2.webp", "/images/golden_movida_3.webp"],
    note: "Straightforward budget stay in Trans-Ekulu, beside a police post.",
    description:
      "A budget hotel in the Trans-Ekulu district, beside a police post on Peace Ozor Street. Suits a lean-budget itinerary that needs simple, secure rooms without resort extras.",
  },
  {
    slug: "zubani-hotel-and-suites",
    name: "Zubani Hotel & Suites",
    category: "hotel",
    area: "Trans-Ekulu",
    kind: "Budget hotel",
    priceLevel: "From $32/night",
    address: "New GRA, Trans-Ekulu, Enugu",
    image: "/images/zubani_1.webp",
    images: ["/images/zubani_2.webp", "/images/zubani_3.webp"],
    note: "Budget rooms 20 minutes from the airport, near Polo Park Mall.",
    description:
      "A budget-friendly hotel in New GRA, Trans-Ekulu, roughly a 21-minute drive from Akanu Ibiam International Airport and a 10-minute drive from Polo Park Mall and Enugu Golf Course. A practical base for a lean-budget trip that still wants a central location.",
  },
  {
    slug: "maxbe-continental-hotel",
    name: "Maxbe Continental Hotel",
    category: "hotel",
    area: "Independence Layout",
    kind: "4-star hotel",
    priceLevel: "From ₦62,000/night",
    address: "#1 Nza Street, Independence Layout, Enugu",
    image: "/images/maxbe_continental_hotel.jpg",
    images: [
      "/images/maxbe_continental_hotel_2.jpg",
      "/images/maxbe_continental_hotel_3.jpg",
    ],
    note: "4-star hotel beside Government House, with free Wi-Fi and a pool.",
    description:
      "A 4-star hotel on Nza Street in Independence Layout, right beside Government House. Free Wi-Fi and a pool make it a solid mid-to-premium pick for a comfort-focused Enugu stay close to the city centre.",
  },
  {
    slug: "hotel-new-york",
    name: "Hotel New York",
    category: "hotel",
    area: "Independence Layout",
    kind: "Premium hotel",
    priceLevel: "From ₦70,000/night",
    address: "Independence Layout, Enugu",
    image: "/images/new_york_hotel_1.webp",
    images: [
      "/images/new_york_hotel_2.webp",
      "/images/new_york_hotel_3.jpg",
      "/images/new_york_hotel_4.jpg",
    ],
    note: "City-style premium hotel in Independence Layout with modern rooms and event space.",
    description:
      "Hotel New York brings a modern, city-inspired stay to Independence Layout, with well-furnished rooms, an on-site restaurant and bar, and event and conference facilities. A strong premium pick for travellers who want contemporary comfort close to Enugu's main business and dining strip.",
    rooms: [
      {
        name: "Standard Room",
        pricePerNight: 70_000,
        formattedPrice: "₦70,000/night",
        maxOccupancy: 2,
        amenities: ["AC", "Queen bed", "Smart TV", "Free Wi-Fi", "Breakfast"],
        description: "Modern standard room with clean city-style furnishings.",
      },
      {
        name: "Deluxe Room",
        pricePerNight: 105_000,
        formattedPrice: "₦105,000/night",
        maxOccupancy: 2,
        amenities: ["AC", "King bed", "Bathtub", "Minibar", "Work desk"],
        description: "Upgraded deluxe room with premium finishes and a dedicated work desk.",
      },
      {
        name: "Executive Suite",
        pricePerNight: 160_000,
        formattedPrice: "₦160,000/night",
        maxOccupancy: 3,
        amenities: ["AC", "Living room", "King bed", "Minibar", "Airport transfer"],
        description: "Spacious suite with separate living area and complimentary airport transfer.",
      },
    ],
  },
]

export const enuguResorts: Place[] = [
  {
    slug: "landmark-nike-lake-resort",
    name: "Landmark Resorts Enugu",
    category: "resort",
    area: "Abakpa Nike",
    kind: "Lakefront resort & suites",
    priceLevel: "From ₦65,000/night",
    address: "Nike Lake, Abakpa Nike, Enugu",
    image: "/images/landmark-resort-1.webp",
    images: [
      "/images/landmark-resort-2.jpg",
      "/images/landmark-resort-3.jpg",
      "/images/landmark-resort-4.jpg",
      "/images/landmark-resort-5.jpg",
      "/images/landmark-upsidedown-house.png",
      "/images/landmark-resort-6.png",
      "/images/landmark-resort-7.jpg",
      "/images/landmark-resort-8.png",
      "/images/landmark-resort-9.jpg",
    ],
    note: "200+ room lakefront resort, 10 minutes from the city centre.",
    description:
      "Formerly Nike Lake Resort, Landmark Resorts Enugu sits on a 150-hectare lakefront estate in Abakpa Nike, roughly 15 minutes from the airport and 10 minutes from the city centre. Features renovated suites with lake views, a pool, watersports, the famous upside-down house, and lakeside dining. The natural anchor for a relaxed lakefront stay in Enugu.",
  },
]

export const enuguRestaurants: Place[] = [
  {
    slug: "roots-restaurant-and-cafe",
    name: "Roots Restaurant & Café",
    category: "restaurant",
    area: "Independence Layout",
    kind: "Café by day, upscale restaurant by night",
    priceLevel: "₦3,000–₦15,000 per meal",
    address: "Presidential Road / Plot 23C Independence Layout, by Okpara Square, Ogui, Enugu",
    image: "/images/roots_1.webp",
    images: [
      "/images/roots_2.webp",
      "/images/roots_3.webp",
      "/images/roots_4.webp",
      "/images/roots_5.webp",
      "/images/roots_6.webp",
    ],
    note: "Cozy café by day, upscale dining by night — Africana, pastries, Chinese and continental.",
    description:
      "Roots Restaurant & Café bridges a relaxed daytime coffee house and an upscale evening restaurant on Presidential Road in Independence Layout, by Okpara Square. The menu spans authentic Nigerian 'Africana' dishes, fresh pastries, Chinese cuisine, and continental plates, served across indoor and outdoor seating, a café and coffee bar, private dining rooms, and a cocktail and wine bar. Free parking and event hosting are on site — a solid pick for both a daytime coffee stop and a proper sit-down dinner.",
  },
  {
    slug: "the-manor",
    name: "The Manor",
    category: "restaurant",
    area: "GRA",
    kind: "Fine dining, international + African",
    priceLevel: "₦5,000–₦20,000 per meal",
    address: "24 Chime Lane, GRA, Enugu",
    image: "/images/themanor_1.jpg",
    images: ["/images/themanor_2.jpg", "/images/themanor_3.jpg"],
    note: "Fancy GRA dining room with spicy linguine and seafood platters.",
    description:
      "A fine-dining restaurant on Chime Lane in GRA, serving international and African dishes including spicy linguine with chicken and seafood platters. Meals run roughly ₦5,000 to ₦20,000. The pick for a sit-down evening rather than a quick food stop.",
  },
  {
    slug: "ntachi-osa",
    name: "Ntachi-Osa",
    category: "restaurant",
    area: "New Haven",
    kind: "Native Nigerian dishes",
    priceLevel: "₦500–₦10,000 per plate",
    address: "97 Chime Avenue, New Haven, Enugu",
    image: "/images/ntachi.webp",
    note: "Native soups and swallows, started as a mobile vendor in 2010.",
    description:
      "Started as a mobile food vendor in 2010, now a multi-branch native-food restaurant with a location at 97 Chime Avenue, New Haven. Menu covers egusi, draw, bitterleaf, and ora soups, ukwa and achicha swallows, jollof and fried rice, and local snacks. Prices span roughly ₦500 to ₦10,000 depending on the dish, covering both a quick affordable meal and a fuller spread.",
  },
]

export const enuguNightlife: Place[] = [
  {
    slug: "bush-house-arena",
    name: "Bush House Arena",
    category: "nightlife",
    area: "Independence Layout",
    kind: "Grill restaurant & bar",
    priceLevel: "₦2,000–₦10,000 per person",
    address: "42 Nza Street, Independence Layout, Enugu",
    image: "/images/bushman_1.jpg",
    note: "Vibrant grill spot with an extensive drinks menu and lively atmosphere.",
    description:
      "Bush House Arena is a vibrant grill restaurant and bar on Nza Street in Independence Layout, known for its lively atmosphere and extensive drinks menu alongside grilled meat and suya-style dishes. A solid pick for a relaxed evening of good food and drinks before moving on to a proper nightclub.",
  },
  {
    slug: "toscana-villa-enugu",
    name: "Toscana Villa",
    category: "nightlife",
    area: "Independence Layout",
    kind: "Upscale lounge & events venue",
    priceLevel: "₦5,000–₦20,000 per person",
    address: "Independence Layout, Enugu",
    image: "/images/Villa_Toscana_Hotel_Enugu_1.jpg",
    images: [
      "/images/Villa_Toscana_Hotel_Enugu_2.jpg",
      "/images/Villa_Toscana_Hotel_Enugu_3.jpg",
      "/images/Villa_Toscana_Hotel_Enugu_4.jpg",
    ],
    note: "Enugu's top upscale lounge — cocktails, live music, and event nights.",
    description:
      "Toscana Villa is one of Enugu's premier upscale entertainment venues in Independence Layout, offering cocktails, a curated wine list, live music performances, and themed event nights. A go-to spot for an elevated evening out in the city.",
  },
  {
    slug: "volt-arena-enugu",
    name: "Volt Arena",
    category: "nightlife",
    area: "GRA",
    kind: "Gaming & entertainment centre",
    priceLevel: "₦2,000–₦8,000 per session",
    address: "GRA, Enugu",
    image: "/images/volt_arena_1.webp",
    images: ["/images/volt_arena_2.webp", "/images/volt_arena_3.webp"],
    note: "Multi-level gaming and entertainment arena — VR, arcade, bowling, bar.",
    description:
      "Volt Arena is a modern multi-level entertainment complex in GRA featuring VR gaming stations, arcade games, bowling alleys, and a full bar. A popular spot for groups looking for an active evening of fun before or after dinner.",
  },
  {
    slug: "grand-east-man-enugu",
    name: "Grand East Man",
    category: "nightlife",
    area: "Independence Layout",
    kind: "Nightclub & lounge",
    priceLevel: "₦3,000–₦15,000",
    address: "Independence Layout, Enugu",
    image: "/images/grand_eastman_1.webp",
    images: [
      "/images/grand_eastman_2.webp",
      "/images/grand_eastman_3.webp",
      "/images/grand_eastman_4.webp",
      "/images/grand_eastman_5.webp",
    ],
    note: "Vibrant nightclub with DJ sets, Afrobeats, and bottle service.",
    description:
      "Grand East Man is a high-energy nightclub in Independence Layout running nightly DJ sets, Afrobeats and Afrofusion mixes, and VIP bottle-service tables. One of Enugu's liveliest spots from Thursday through Sunday.",
  },
  {
    slug: "de-kash-enugu",
    name: "De Kash",
    category: "nightlife",
    area: "New Haven",
    kind: "Outdoor bar & hangout spot",
    priceLevel: "₦1,500–₦8,000",
    address: "New Haven, Enugu",
    image: "https://images.pexels.com/photos/1268514/pexels-photo-1268514.jpeg?auto=compress&cs=tinysrgb&w=800",
    note: "Laid-back outdoor bar popular for cold drinks, nyama-choma, and live music.",
    description:
      "De Kash is a popular outdoor bar and hangout in New Haven, known for chilled drinks, suya and nyama-choma grills, and regular live band or DJ nights. A relaxed, unpretentious vibe that draws a diverse crowd looking to unwind.",
  },
  {
    slug: "cubana-enugu",
    name: "Cubana",
    category: "nightlife",
    area: "Independence Layout",
    kind: "Premium nightclub & lounge",
    priceLevel: "₦5,000–₦30,000",
    address: "Independence Layout, Enugu",
    image: "/images/gustavobycubana_1.webp",
    note: "Flagship premium nightclub chain — bottle service, celebrity appearances, big DJ nights.",
    description:
      "Cubana is part of Nigeria's well-known premium nightclub and hospitality brand, with the Enugu location in Independence Layout. Expect elaborate bottle presentations, big DJ nights, celebrity appearances, and a high-energy atmosphere that runs until the early hours.",
  },
]

export const allEnuguPlaces: Place[] = [
  ...enuguAttractions,
  ...enuguHotels,
  ...enuguResorts,
  ...enuguRestaurants,
  ...enuguNightlife,
]

export const allPlaces: Place[] = [...allEnuguPlaces]

export function findPlaceBySlug(slug: string): Place | undefined {
  return allPlaces.find((place) => place.slug === slug)
}
