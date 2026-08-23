function wikimedia(file: string, width = 1600) {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${file}?width=${width}`
}

export type Location = {
  name: string
  area: string
  kind: string
  time: string
  image: string
  note: string
}

export const enuguLocations: Location[] = [
  {
    name: "Awhum Waterfall",
    area: "Udi",
    kind: "Waterfall + cave monastery",
    time: "Half day",
    image: wikimedia(
      "Awhum_monastery_cave_and_waterfall,_Enugu,_Nigeria.jpg"
    ),
    note: "Cool valley walk, limestone scenery, prayer cave, strong photo stop.",
  },
  {
    name: "Ngwo Pine Forest",
    area: "Ngwo",
    kind: "Forest trail + cave",
    time: "3-4 hours",
    image: wikimedia("Ngwo_Pine_Forest_Enugu.jpg"),
    note: "Pine canopy, short hike, cave stream, best with a local guide.",
  },
  {
    name: "Nike Lake",
    area: "Abakpa Nike",
    kind: "Lakefront rest day",
    time: "Easy afternoon",
    image: wikimedia("Nike_Lake_Enugu_Nike_02.jpg"),
    note: "Slow water views, resort lunch, sunset pacing for low-stress trips.",
  },
  {
    name: "Ezeagu Tourist Complex",
    area: "Ezeagu",
    kind: "Cave + waterfall + tunnel",
    time: "Full day",
    image: wikimedia("GURARA_WATERFALLS.jpg"),
    note: "Most adventurous Enugu day trip: caves, rock paths, forest water.",
  },
  {
    name: "Milliken Hill",
    area: "Ngwo",
    kind: "Panoramic hill road",
    time: "1-2 hours",
    image: wikimedia("IDANRE_HILLS_AKURE_iooj.jpg"),
    note: "Coal-mine-era hill road with a sweeping dusk view of Enugu city.",
  },
  {
    name: "National Museum of Unity",
    area: "Enugu city",
    kind: "History + culture museum",
    time: "1-2 hours",
    image: wikimedia("National_Museum_Of_Unity,Enugu.jpg"),
    note: "Coal City history and Igbo cultural galleries, easy indoor stop.",
  },
  {
    name: "Unity Park",
    area: "Enugu city",
    kind: "Urban park",
    time: "Short stop",
    image: wikimedia("Gigantic_Lion_Statue_in_Enugu_Unity_Park.jpg"),
    note: "Central green space with a landmark lion statue, good rest break.",
  },
  {
    name: "Michael Okpara Square",
    area: "Independence Layout",
    kind: "City square + events ground",
    time: "Short stop",
    image: wikimedia("Tafawa_Balewa_Square,_Lagos,_Nigeria.jpg"),
    note: "Civic square used for parades and fitness walks, easy city-day add-on.",
  },
]

export const nigeriaSpots: Location[] = [
  {
    name: "Obudu Mountain Resort",
    area: "Cross River",
    kind: "Mountain resort + cable car",
    time: "2-3 days",
    image: wikimedia(
      "Cable_Car,_Obudu_Cattle_Ranch,_Obudu,_Cross_river_state_01.jpg"
    ),
    note: "Cool highland air, cable car ride, waterfalls, a longer extension trip.",
  },
  {
    name: "Yankari Game Reserve",
    area: "Bauchi",
    kind: "Wildlife reserve + warm spring",
    time: "2-3 days",
    image: wikimedia("Wikki_warm_spring,_YANKARI_Game_Reserve,_Bauchi.jpg"),
    note: "Nigeria's top game reserve, elephants and the Wikki warm spring.",
  },
  {
    name: "Erin Ijesha Waterfall",
    area: "Osun",
    kind: "Multi-tier waterfall",
    time: "Full day",
    image: wikimedia("Erin-Ijesha_Waterfalls_banner.jpg"),
    note: "Olumirin's seven-level falls, a serious hike-and-climb day out.",
  },
  {
    name: "Kajuru Castle",
    area: "Kaduna",
    kind: "Hilltop castle stay",
    time: "Overnight",
    image: wikimedia("Kajuru_Castle.jpg"),
    note: "Medieval-style granite castle on a mountaintop, unusual overnight stop.",
  },
  {
    name: "Lekki Conservation Centre",
    area: "Lagos",
    kind: "Canopy walkway + nature reserve",
    time: "Half day",
    image: wikimedia("Canopy_walk_-_Lekki_conservation_center.jpg"),
    note: "Africa's longest canopy walkway, easy add-on for a Lagos leg.",
  },
]
