function wikimedia(file: string, width = 1600) {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${file}?width=${width}`
}

export type PlaceCategory =
  | "attraction"
  | "hotel"
  | "restaurant"
  | "resort"
  | "nigeria"

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
    image: wikimedia(
      "Awhum_monastery_cave_and_waterfall,_Enugu,_Nigeria.jpg"
    ),
    images: [
      wikimedia("Awhum_monastery_cave_and_waterfall,_Enugu,_Nigeria_2.jpg"),
      wikimedia("Awhum_monastery_cave_and_waterfall,_Enugu,_Nigeria_6.jpg"),
    ],
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
    image: wikimedia("Ngwo_Pine_Forest_Enugu.jpg"),
    images: [
      wikimedia("Ngwo_Pine_Forest_Ngwo_Enugu.jpg"),
      wikimedia("Through_the_pines.jpg"),
    ],
    note: "Pine canopy, short hike, cave stream, best with a local guide.",
    description:
      "A planted pine forest on the outskirts of Enugu city with a limestone cave and stream running through it. The canopy keeps the trail shaded, and the walk is short enough for a half-day out. Go early for cooler air and better light, and use a local guide for the cave section.",
  },
  {
    slug: "nike-lake",
    name: "Nike Lake",
    category: "attraction",
    area: "Abakpa Nike",
    kind: "Lakefront rest day",
    time: "Easy afternoon",
    priceLevel: "Free entry (swimming ~₦2,000, boat ride ~₦1,500)",
    image: wikimedia("Nike_Lake_Enugu_Nike_02.jpg"),
    note: "Slow water views, resort lunch, sunset pacing for low-stress trips.",
    description:
      "A natural lake in the Abakpa Nike district, about ten minutes from Enugu city centre, with the Landmark Nike Lake Resort built along its bank. Good for a low-effort afternoon: lakeside walking, a resort lunch, and sunset views over the water without any hiking involved.",
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
    image: wikimedia("IDANRE_HILLS_AKURE_iooj.jpg"),
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
    image: wikimedia("National_Museum_Of_Unity,Enugu.jpg"),
    images: [wikimedia("Nat_Museum,_Enugu.jpg")],
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
    image: wikimedia("Gigantic_Lion_Statue_in_Enugu_Unity_Park.jpg"),
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
    image: wikimedia("Tafawa_Balewa_Square,_Lagos,_Nigeria.jpg"),
    note: "Civic square used for parades and fitness walks, easy city-day add-on.",
    description:
      "A civic square named for Michael Okpara, Premier of the former Eastern Nigeria region, used for national events, sports, and political rallies, and popular with locals as a morning fitness-walk spot. A quick add-on to a city-day route.",
  },
]

export const enuguHotels: Place[] = [
  {
    slug: "zubani-hotel-and-suites",
    name: "Zubani Hotel & Suites",
    category: "hotel",
    area: "Trans-Ekulu",
    kind: "Budget hotel",
    priceLevel: "From $32/night",
    address: "New GRA, Trans-Ekulu, Enugu",
    image: wikimedia("Oriental_Hotel.jpg"),
    note: "Budget rooms 20 minutes from the airport, near Polo Park Mall.",
    description:
      "A budget-friendly hotel in New GRA, Trans-Ekulu, roughly a 21-minute drive from Akanu Ibiam International Airport and a 10-minute drive from Polo Park Mall and Enugu Golf Course. A practical base for a lean-budget trip that still wants a central location.",
  },
  {
    slug: "golden-movida-hotel",
    name: "Golden Movida Hotel",
    category: "hotel",
    area: "Trans-Ekulu",
    kind: "Budget hotel",
    priceLevel: "From $25/night",
    address: "52/6 Peace Ozor Street, Phase 6, Trans-Ekulu, Enugu",
    image: wikimedia(
      "Interior_of_the_Lagos_Oriental_Hotel_in_Victoria_Island,_Lagos_State._Nigeria_(6).jpg"
    ),
    note: "Straightforward budget stay in Trans-Ekulu, beside a police post.",
    description:
      "A budget hotel in the Trans-Ekulu district, beside a police post on Peace Ozor Street. Suits a lean-budget itinerary that needs simple, secure rooms without resort extras.",
  },
  {
    slug: "maxbe-continental-hotel",
    name: "Maxbe Continental Hotel",
    category: "hotel",
    area: "Independence Layout",
    kind: "4-star hotel",
    priceLevel: "From $101/night",
    address: "#1 Nza Street, Independence Layout, Enugu",
    image: wikimedia("Swimming_Pool_at_Kwara_Hotel.jpg"),
    note: "4-star hotel beside Government House, with free Wi-Fi and a pool.",
    description:
      "A 4-star hotel on Nza Street in Independence Layout, right beside Government House. Free Wi-Fi and a pool make it a solid mid-to-premium pick for a comfort-focused Enugu stay close to the city centre.",
  },
  {
    slug: "lagenda-hotels",
    name: "Lagenda Hotels",
    category: "hotel",
    area: "Ogui",
    kind: "Premium hotel",
    priceLevel: "From $186/night",
    address: "4 Ekweani Close, beside Loma Linda Estate, Ogui, Enugu",
    image: wikimedia("Oriental_Hotel.jpg"),
    note: "Enugu's premium end, beside Loma Linda Estate in Ogui.",
    description:
      "A premium hotel on Ekweani Close in Ogui, beside Loma Linda Estate. The pick for a premium-budget trip that wants the highest comfort tier available in Enugu.",
  },
  {
    slug: "golden-royale-hotel",
    name: "Golden Royale Hotel",
    category: "hotel",
    area: "Independence Layout",
    kind: "4-star hotel",
    priceLevel: "From $59/night",
    address: "10 Bissala Road, Independence Layout, Enugu",
    image: wikimedia("Swimming_Pool_at_Kwara_Hotel.jpg"),
    images: [
      wikimedia(
        "Interior_of_the_Lagos_Oriental_Hotel_in_Victoria_Island,_Lagos_State._Nigeria_(6).jpg"
      ),
    ],
    note: "Indoor + outdoor pool, sauna, gym and garden on Bissala Road.",
    description:
      "A 4-star hotel on Bissala Road in Independence Layout, with an indoor swimming pool, sauna, garden, and an outdoor pool. Rooms come with air-conditioning, balconies, kitchenette, and free Wi-Fi. Restaurant, bar, shared lounge, fitness room, cooked-to-order breakfast, laundry, and 24-hour front desk on site. A comfort-tier pick right in Independence Layout.",
  },
  {
    slug: "grace-manor-hotels-and-suites",
    name: "Grace Manor Hotels & Suites",
    category: "hotel",
    area: "Independence Layout",
    kind: "Budget hotel",
    priceLevel: "From ₦35,000/night",
    address: "2A Nnanna Atuonwu Drive, Liberty Estate, Enugu",
    image: wikimedia("Oriental_Hotel.jpg"),
    note: "20-room budget stay off Liberty Estate, with an outdoor pool.",
    description:
      "A 20-room budget hotel on Nnanna Atuonwu Drive in Liberty Estate, near Independence Layout, with an outdoor pool, free Wi-Fi, and free parking. A lean-budget base that still gets a pool and a residential-estate location.",
    recommendPriority: 6,
    rooms: [
      {
        name: "Standard Room",
        pricePerNight: 35_000,
        formattedPrice: "₦35,000/night",
        maxOccupancy: 2,
        amenities: ["AC", "Double bed", "Free Wi-Fi", "Pool access", "Parking"],
        description: "Simple, clean room in a quiet Liberty Estate residential setting.",
      },
      {
        name: "Deluxe Room",
        pricePerNight: 55_000,
        formattedPrice: "₦55,000/night",
        maxOccupancy: 2,
        amenities: ["AC", "King bed", "Bathtub", "Free Wi-Fi", "Pool access"],
        description: "Upgraded room with a king bed and bathtub.",
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
    image: "https://images.pexels.com/photos/2017802/pexels-photo-2017802.jpeg?auto=compress&cs=tinysrgb&w=800",
    images: [
      "https://images.pexels.com/photos/1838554/pexels-photo-1838554.jpeg?auto=compress&cs=tinysrgb&w=800",
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
    slug: "nondon-international-hotel",
    name: "Nondon International Hotel",
    category: "hotel",
    area: "New Haven",
    kind: "3-star hotel",
    priceLevel: "From $114/night",
    address: "2 Ituku Street, Upper Chime Avenue, New Haven, Enugu",
    image: wikimedia("Swimming_Pool_at_Kwara_Hotel.jpg"),
    note: "13-room 3-star hotel in New Haven, pool, gym and poolside bar.",
    description:
      "A 3-star, 13-room hotel on Ituku Street off Upper Chime Avenue in New Haven, about 6km from Akanu Ibiam International Airport. Rooms span Standard, Executive, Super Executive, and Royal Suite tiers, each with bay windows, a granite work desk, Wi-Fi, air-conditioning, and a stocked mini bar. On-site restaurant serving local and continental food, poolside bar, swimming pool, and gym. Check-in from noon.",
  },
  {
    slug: "budget-inn-by-maryjane",
    name: "Budget Inn",
    category: "hotel",
    area: "New Haven",
    kind: "Budget guest house / shortlet",
    priceLevel: "₦5,000–₦15,000/night",
    address: "New Haven, Enugu",
    image: wikimedia(
      "Interior_of_the_Lagos_Oriental_Hotel_in_Victoria_Island,_Lagos_State._Nigeria_(6).jpg"
    ),
    note: "Cheapest option on the list, simple shortlet rooms in New Haven.",
    description:
      "A budget guest house running shortlet rooms in New Haven from roughly ₦5,000 to ₦15,000 a night, the cheapest tier on this list. No resort extras, just a secure, simple room for travellers watching cost over comfort.",
  },
  {
    slug: "muse-boutique-hotel",
    name: "MUSE Boutique Hotel",
    category: "hotel",
    area: "GRA / Upper Chime Avenue",
    kind: "5-star premium hotel",
    priceLevel: "From ₦95,000/night",
    address: "189 Upper Chime Avenue, Enugu",
    image: wikimedia("Swimming_Pool_at_Kwara_Hotel.jpg"),
    images: [wikimedia("Oriental_Hotel.jpg")],
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
  // ── Priority partner hotels ──────────────────────────────────────────────
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
    slug: "hotel-presidential-enugu",
    name: "Hotel Presidential (by Amber)",
    category: "hotel",
    area: "Independence Layout",
    kind: "4-star hotel",
    priceLevel: "From ₦90,000/night",
    address: "Independence Layout, Enugu",
    image: "https://images.pexels.com/photos/2017802/pexels-photo-2017802.jpeg?auto=compress&cs=tinysrgb&w=800",
    images: [
      "https://images.pexels.com/photos/1743231/pexels-photo-1743231.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800",
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
    slug: "oranto-international-airport-hotel",
    name: "Oranto International Airport Hotel",
    category: "hotel",
    area: "Airport Road, Abakpa",
    kind: "Airport hotel",
    priceLevel: "From ₦55,000/night",
    address: "Airport Road, Enugu",
    image: "https://images.pexels.com/photos/271619/pexels-photo-271619.jpeg?auto=compress&cs=tinysrgb&w=800",
    images: [
      "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
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
    slug: "bridgewaters-hotel-enugu",
    name: "Bridgewaters Hotel",
    category: "hotel",
    area: "New Haven / GRA",
    kind: "Mid-range hotel",
    priceLevel: "From ₦45,000/night",
    address: "New Haven, Enugu",
    image: "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800",
    images: [
      "https://images.pexels.com/photos/1838554/pexels-photo-1838554.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
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
]

export const enuguResorts: Place[] = [
  {
    slug: "landmark-nike-lake-resort",
    name: "Landmark Nike Lake Resort",
    category: "resort",
    area: "Abakpa Nike",
    kind: "Lakefront resort",
    priceLevel: "From $107/night",
    address: "Nike Lake, Abakpa Nike, Enugu",
    image: wikimedia("Nike_Lake_Enugu_Nike_02.jpg"),
    note: "200+ room lakefront resort, 10 minutes from the city centre.",
    description:
      "Founded in 1988 on the bank of Nike Lake in Abakpa Nike, roughly 15 minutes from the airport and 10 minutes from the city centre. Over 200 rooms on a large, tree-lined, 150-hectare site. Now under Landmark's Nike Lake Resort renovation, upgrading rooms, waterfront villas, dining, and a golf course. The natural anchor for a relaxed lakefront stay.",
  },
  {
    slug: "eden-crest-hotel-and-resort",
    name: "Eden Crest Hotel & Resort",
    category: "resort",
    area: "GRA",
    kind: "Hotel + resort",
    priceLevel: "From $45/night",
    address: "4 Antrim Lane, off Abakaliki Road, GRA, Enugu",
    image: wikimedia("Swimming_Pool_at_Kwara_Hotel.jpg"),
    note: "Pool and Wi-Fi resort on Antrim Lane in GRA.",
    description:
      "A hotel-and-resort combo on Antrim Lane in GRA, off Abakaliki Road, with free Wi-Fi and a pool. A mid-priced resort option for a trip that wants pool downtime without Nike Lake Resort's scale.",
  },
]

export const enuguRestaurants: Place[] = [
  {
    slug: "the-manor",
    name: "The Manor",
    category: "restaurant",
    area: "GRA",
    kind: "Fine dining, international + African",
    priceLevel: "₦5,000–₦20,000 per meal",
    address: "24 Chime Lane, GRA, Enugu",
    image: wikimedia("A_well-garnished_Jollof_Rice.jpg"),
    note: "Fancy GRA dining room with spicy linguine and seafood platters.",
    description:
      "A fine-dining restaurant on Chime Lane in GRA, serving international and African dishes including spicy linguine with chicken and seafood platters. Meals run roughly ₦5,000 to ₦20,000. The pick for a sit-down evening rather than a quick food stop.",
  },
  {
    slug: "dolphin-restaurant",
    name: "Dolphin Restaurant",
    category: "restaurant",
    area: "GRA",
    kind: "Nigerian + international, two-storey dining room",
    priceLevel: "$$ (mid to upper)",
    address: "1C Ekpunobi Street, GRA, Enugu",
    image: wikimedia("A_tray_of_jollof_rice,_chicken_with_soft_drink.jpg"),
    note: "Open since 1979, wide local and international menu over two floors.",
    description:
      "Open since 1979 on Ekpunobi Street in GRA, one of Enugu's oldest dining spots. A two-storey building with a wide range of local and international dishes, good soup choice, and a drinks list. Mid-to-upper priced, aimed at diners wanting a proper sit-down meal.",
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
  {
    slug: "7th-planet-international",
    name: "7th Planet International",
    category: "restaurant",
    area: "Trans-Ekulu",
    kind: "Local + continental, sports bar and lounge",
    priceLevel: "$$",
    address: "42 Community Estate Road, opposite Dental School, Trans-Ekulu, Enugu",
    image: wikimedia("A_Nigeria_Jollof_Rice_with_chicken.jpg"),
    note: "Local and continental dishes with a sports bar and live entertainment.",
    description:
      "A local-and-continental restaurant on Community Estate Road in Trans-Ekulu, opposite the Dental School, with a sports bar, lounge, and live entertainment. Popular for an evening out that combines food with a bar atmosphere.",
  },
]

export const nigeriaSpots: Place[] = [
  {
    slug: "obudu-mountain-resort",
    name: "Obudu Mountain Resort",
    category: "nigeria",
    area: "Cross River",
    kind: "Mountain resort + cable car",
    time: "2-3 days",
    image: wikimedia(
      "Cable_Car,_Obudu_Cattle_Ranch,_Obudu,_Cross_river_state_01.jpg"
    ),
    images: [
      wikimedia(
        "Obudu_Conservation_centre,_Obudu_Mountain_resort,_Cross_river_state.jpg"
      ),
    ],
    note: "Cool highland air, cable car ride, waterfalls, a longer extension trip.",
    description:
      "A highland resort on the Obudu Plateau in Cross River State, reached by cable car, with cool mountain air, waterfalls, and hiking trails. A multi-day extension once an Enugu trip has the extra time and road budget.",
  },
  {
    slug: "yankari-game-reserve",
    name: "Yankari Game Reserve",
    category: "nigeria",
    area: "Bauchi",
    kind: "Wildlife reserve + warm spring",
    time: "2-3 days",
    image: wikimedia("Wikki_warm_spring,_YANKARI_Game_Reserve,_Bauchi.jpg"),
    images: [wikimedia("Museum_in_Yankari_Game_Reserve.jpg")],
    note: "Nigeria's top game reserve, elephants and the Wikki warm spring.",
    description:
      "Nigeria's best-known wildlife reserve, in Bauchi State, home to elephants, baboons, and the naturally warm Wikki Spring. Worth the extra travel time for a wildlife-focused multi-day extension.",
  },
  {
    slug: "erin-ijesha-waterfall",
    name: "Erin Ijesha Waterfall",
    category: "nigeria",
    area: "Osun",
    kind: "Multi-tier waterfall",
    time: "Full day",
    image: wikimedia("Erin-Ijesha_Waterfalls_banner.jpg"),
    images: [wikimedia("Erin-Ijesha_Waterfalls_05.jpg")],
    note: "Olumirin's seven-level falls, a serious hike-and-climb day out.",
    description:
      "Also known as Olumirin Waterfalls, a seven-level waterfall in Erin-Ijesha, Osun State. A serious hike-and-climb day, not a casual stop, best attempted with sturdy footwear and daylight to spare.",
  },
  {
    slug: "kajuru-castle",
    name: "Kajuru Castle",
    category: "nigeria",
    area: "Kaduna",
    kind: "Hilltop castle stay",
    time: "Overnight",
    image: wikimedia("Kajuru_Castle.jpg"),
    note: "Medieval-style granite castle on a mountaintop, unusual overnight stop.",
    description:
      "A medieval-inspired granite castle built between 1981 and 1989 on a mountaintop in Kajuru village, Kaduna State, roughly 45km from Kaduna city. An unusual overnight stop for a trip that wants something out of the ordinary.",
  },
  {
    slug: "lekki-conservation-centre",
    name: "Lekki Conservation Centre",
    category: "nigeria",
    area: "Lagos",
    kind: "Canopy walkway + nature reserve",
    time: "Half day",
    image: wikimedia("Canopy_walk_-_Lekki_conservation_center.jpg"),
    images: [
      wikimedia("Lekki_Conservation_Center,_Canopy_walk.jpg"),
      wikimedia("Forest_Canopy_walkway.jpg"),
    ],
    note: "Africa's longest canopy walkway, easy add-on for a Lagos leg.",
    description:
      "A nature reserve in Lekki, Lagos, with a 401-metre canopy walkway billed as the longest in Africa. An easy half-day add-on if a trip extends into a Lagos leg.",
  },
]

export const allEnuguPlaces: Place[] = [
  ...enuguAttractions,
  ...enuguHotels,
  ...enuguResorts,
  ...enuguRestaurants,
]

export const allPlaces: Place[] = [...allEnuguPlaces, ...nigeriaSpots]

export function findPlaceBySlug(slug: string): Place | undefined {
  return allPlaces.find((place) => place.slug === slug)
}
