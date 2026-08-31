export type BudgetTierValue = "lean" | "mid-range" | "premium"

export interface BudgetTier {
  value: BudgetTierValue
  label: string
  minPerPersonPerDay: number
  maxPerPersonPerDay: number | null
  description: string
  priorities: string[]
}

export const budgetTiers: Record<BudgetTierValue, BudgetTier> = {
  lean: {
    value: "lean",
    label: "Lean",
    minPerPersonPerDay: 65_000,
    maxPerPersonPerDay: 100_000,
    description:
      "Comfortable essentials, practical accommodation, affordable dining, standard transport and selected experiences.",
    priorities: [
      "good-value accommodation",
      "affordable restaurants and local food",
      "standard transportation",
      "free or inexpensive attractions",
      "carefully selected paid experiences",
      "avoid unnecessary premium services",
    ],
  },
  "mid-range": {
    value: "mid-range",
    label: "Mid-range",
    minPerPersonPerDay: 100_000,
    maxPerPersonPerDay: 150_000,
    description:
      "Comfortable hotels, good restaurants, convenient transport and a broader mix of experiences.",
    priorities: [
      "comfortable hotels",
      "good restaurants",
      "convenient transportation",
      "more paid attractions",
      "better experience variety",
      "reasonable convenience",
    ],
  },
  premium: {
    value: "premium",
    label: "Premium",
    minPerPersonPerDay: 150_000,
    maxPerPersonPerDay: null,
    description:
      "Premium accommodation, private transport, upscale dining and higher-end experiences.",
    priorities: [
      "premium hotels",
      "private transportation where appropriate",
      "upscale restaurants",
      "premium experiences",
      "convenience and flexibility",
      "higher-quality activities",
    ],
  },
}

export const budgetTierList: BudgetTier[] = [
  budgetTiers.lean,
  budgetTiers["mid-range"],
  budgetTiers.premium,
]

export function normalizeBudgetTier(value: string | null | undefined): BudgetTierValue {
  if (!value) return "mid-range"
  const clean = value.toLowerCase().trim().replace("midrange", "mid-range")
  if (clean === "lean") return "lean"
  if (clean === "premium") return "premium"
  if (clean === "mid-range") return "mid-range"
  return "mid-range"
}

export function getBudgetTier(value: string | null | undefined): BudgetTier | null {
  if (!value) return null
  const tier = normalizeBudgetTier(value)
  return budgetTiers[tier] ?? null
}

export const travelerOptions = [
  { value: "1", label: "1 traveler", count: 1 },
  { value: "2", label: "2 travelers", count: 2 },
  { value: "3", label: "3 travelers", count: 3 },
  { value: "4", label: "4 travelers", count: 4 },
  { value: "5", label: "5 travelers", count: 5 },
  { value: "6", label: "6 travelers", count: 6 },
  { value: "7+", label: "7+ travelers", count: 7 },
]

export function travelerCount(value: string | null): number | null {
  if (!value) return null
  const match = travelerOptions.find((option) => option.value === value)
  return match ? match.count : null
}

export interface BudgetBaseline {
  minTotal: number
  maxTotal: number | null
}

export function calculateBudgetBaseline(
  tier: BudgetTier,
  travelers: number,
  duration: number
): BudgetBaseline {
  return {
    minTotal: tier.minPerPersonPerDay * travelers * duration,
    maxTotal:
      tier.maxPerPersonPerDay !== null
        ? tier.maxPerPersonPerDay * travelers * duration
        : null,
  }
}

export function formatNaira(amount: number): string {
  if (amount >= 1_000_000) {
    const millions = amount / 1_000_000
    // up to 2 decimals (e.g. 1.05m), trimming trailing zeros (1.40m -> 1.4m)
    const trimmed = millions.toFixed(2).replace(/\.?0+$/, "")
    return `₦${trimmed}m`
  }
  if (amount >= 1_000) {
    return `₦${Math.round(amount / 1_000)}k`
  }
  return `₦${amount.toLocaleString()}`
}

export function formatBudgetBaseline(baseline: BudgetBaseline): string {
  if (baseline.maxTotal === null) {
    return `${formatNaira(baseline.minTotal)}+`
  }
  return `${formatNaira(baseline.minTotal)}–${formatNaira(baseline.maxTotal)}`
}
