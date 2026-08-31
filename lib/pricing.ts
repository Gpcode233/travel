/** Tiered Trails service-fee rate: higher accommodation spend, lower rate. */
export type ServiceFeeTier = {
  maxTotal: number | null
  rate: number
}

export const serviceFeeTiers: ServiceFeeTier[] = [
  { maxTotal: 200_000, rate: 0.05 },
  { maxTotal: 400_000, rate: 0.03 },
  { maxTotal: 600_000, rate: 0.02 },
  { maxTotal: 1_000_000, rate: 0.015 },
  { maxTotal: null, rate: 0.015 },
]

export function getServiceFeeRate(accommodationTotal: number): number {
  const tier = serviceFeeTiers.find(
    (t) => t.maxTotal === null || accommodationTotal <= t.maxTotal
  )
  return tier?.rate ?? 0.015
}

export function calculateServiceFee(accommodationTotal: number): number {
  return Math.round(accommodationTotal * getServiceFeeRate(accommodationTotal))
}
