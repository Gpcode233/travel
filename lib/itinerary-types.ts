import { BudgetTierValue } from "./budget-tiers"

export type PacePreference = "relaxed" | "balanced" | "fast" | string

export interface LocationCoordinates {
  latitude: number
  longitude: number
  address?: string
}

export interface ActivityLocation {
  name: string
  area?: string
  latitude: number
  longitude: number
  address?: string
}

export type ActivityCategory =
  | "food"
  | "nature"
  | "culture"
  | "attraction"
  | "relaxation"
  | "adventure"
  | "transport"
  | "hotel"

export interface ItineraryActivity {
  id: string
  title: string
  description: string
  startTime: string
  endTime?: string
  durationMinutes?: number
  durationLabel?: string
  estimatedCost: number
  formattedCost?: string
  category: ActivityCategory
  tags: string[]
  imageUrl: string
  location: ActivityLocation
  travelFromPreviousMinutes?: number
  travelMode?: "drive" | "walk" | "transit"
  bookingUrl?: string
  rating?: number
  isOptional?: boolean
}

export interface ItineraryDay {
  id: string
  dayNumber: number
  dateLabel: string
  title: string
  summary?: string
  activities: ItineraryActivity[]
}

export interface AccommodationOption {
  id: string
  slug?: string
  name: string
  area: string
  address?: string
  rating: number
  reviewCount?: number
  pricePerNight: number
  formattedPrice: string
  imageUrl: string
  images?: string[]
  badge?: "BEST MATCH" | "ALTERNATIVE" | "PREMIUM" | "VALUE"
  isSelected: boolean
  amenities: string[]
  description: string
  recommendationReason?: string
  bookingUrl?: string
}

export interface BudgetCategoryItem {
  key: "accommodation" | "food" | "transport" | "activities" | "other"
  label: string
  amount: number
  formattedAmount: string
  iconName?: string
}

export interface EstBudgetBreakdown {
  currency: string
  categories: BudgetCategoryItem[]
  estimatedTotalMin: number
  estimatedTotalMax: number
  formattedTotal: string
  formattedRange: string
  targetBaselineMin?: number
  targetBaselineMax?: number | null
}

export interface TripDossier {
  id: string
  title: string
  destination: string
  destinationCountry: string
  startDate: string
  endDate: string
  dateRangeLabel: string
  daysCount: number
  travelersCount: number
  travelersLabel: string
  budgetTier: BudgetTierValue
  budgetTierLabel: string
  pace: PacePreference
  interests: string[]
  heroImageUrl: string
}

export interface TripItinerary {
  dossier: TripDossier
  days: ItineraryDay[]
  accommodations: AccommodationOption[]
  selectedAccommodationId: string
  budgetBreakdown: EstBudgetBreakdown
  totalTravelTimeMinutesSaved?: number
  status: "draft" | "confirmed" | "completed"
}

export interface PlanningStep {
  id: string
  label: string
  status: "pending" | "active" | "completed"
  description?: string
}
