import type { TripItinerary } from "./itinerary-types"

/**
 * Hidden QA trip: 1 traveler, 1 day, packed pace, ₦500 accommodation only.
 * Triggered by the spacebar-x5 easter egg on the homepage — never surfaced
 * in normal search/recommend paths.
 */
export const TEST_HOTEL_PRICE = 500

export function generateTestTripItinerary(): TripItinerary {
  const now = new Date()
  const dateLabel = now.toLocaleDateString("en-GB", { day: "numeric", month: "short" })

  return {
    dossier: {
      id: `trip-test-${Date.now()}`,
      title: "Test Trip (QA)",
      destination: "Enugu",
      destinationCountry: "Nigeria",
      startDate: dateLabel,
      endDate: dateLabel,
      dateRangeLabel: dateLabel,
      daysCount: 1,
      travelersCount: 1,
      travelersLabel: "1 Traveler",
      budgetTier: "lean",
      budgetTierLabel: "Lean",
      pace: "Packed",
      interests: ["Test"],
      heroImageUrl:
        "https://images.pexels.com/photos/38099166/pexels-photo-38099166.jpeg?auto=compress&cs=tinysrgb&w=1800",
    },
    days: [
      {
        id: "day-1",
        dayNumber: 1,
        dateLabel,
        title: "QA Payment Test Day",
        summary: "Synthetic single-day trip used to test the checkout and payment flow end to end.",
        activities: [
          {
            id: "day-1-act-1",
            title: "Breakfast at Test Hotel",
            description: "Placeholder activity — this trip exists only to test the payment flow.",
            startTime: "8:00 AM",
            durationMinutes: 30,
            durationLabel: "0.5 hr",
            estimatedCost: 0,
            formattedCost: "Free",
            category: "hotel",
            tags: ["test"],
            imageUrl:
              "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800",
            location: { name: "Test Hotel", area: "Enugu", latitude: 6.45, longitude: 7.51 },
            travelFromPreviousMinutes: 0,
            travelMode: "drive",
          },
          {
            id: "day-1-act-2",
            title: "Run payment flow test",
            description: "Head to checkout and pay ₦500 to confirm the Paystack flow works end to end.",
            startTime: "10:00 AM",
            durationMinutes: 15,
            durationLabel: "0.3 hr",
            estimatedCost: 0,
            formattedCost: "Free",
            category: "attraction",
            tags: ["test"],
            imageUrl:
              "https://images.pexels.com/photos/38099166/pexels-photo-38099166.jpeg?auto=compress&cs=tinysrgb&w=800",
            location: { name: "Checkout", area: "Enugu", latitude: 6.45, longitude: 7.51 },
            travelFromPreviousMinutes: 5,
            travelMode: "drive",
          },
        ],
      },
    ],
    accommodations: [
      {
        id: "acc-test-hotel",
        slug: "test-hotel",
        name: "Test Hotel",
        area: "Enugu",
        address: "QA sandbox — not a real listing",
        rating: 5,
        reviewCount: 1,
        pricePerNight: TEST_HOTEL_PRICE,
        formattedPrice: `₦${TEST_HOTEL_PRICE}/night`,
        imageUrl:
          "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800",
        badge: "BEST MATCH",
        isSelected: true,
        amenities: ["QA only"],
        description: "Synthetic ₦500/night listing for testing the payment flow. Not a real hotel.",
        recommendationReason: "Cheapest possible way to test checkout end to end.",
      },
    ],
    selectedAccommodationId: "acc-test-hotel",
    budgetBreakdown: {
      currency: "NGN",
      categories: [
        {
          key: "accommodation",
          label: "Accommodation",
          amount: TEST_HOTEL_PRICE,
          formattedAmount: `₦${TEST_HOTEL_PRICE}`,
        },
      ],
      estimatedTotalMin: TEST_HOTEL_PRICE,
      estimatedTotalMax: TEST_HOTEL_PRICE,
      formattedTotal: `₦${TEST_HOTEL_PRICE}`,
      formattedRange: `₦${TEST_HOTEL_PRICE}`,
    },
    totalTravelTimeMinutesSaved: 0,
    status: "draft",
  }
}
