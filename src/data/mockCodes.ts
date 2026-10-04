import type { ProductCode } from './types.ts'

export const SEED_CODE_LIST = ['AGR269514Q', 'AGR260028S', 'AGR264129J', 'AGR263337W'] as const

export const DEMO_SCRATCH_CODE = 'AGR269514Q'

export const COUNTERFEIT_SAMPLE = 'AGR000000X'

type SeedCode = Omit<ProductCode, 'issuedAt'>

const seed: SeedCode[] = [
  {
    code: 'AGR269514Q',
    pin: 'AGR269514Q',
    status: 'genuine',
    product: 'SeedCo SC 727 Late Maturity Maize Seed 25kg',
    shortName: 'SeedCo SC 727',
    manufacturer: 'SeedCo',
    batch: '2026-HIT',
    manufactureDate: '12 Jan 2026',
    expiry: '12 Jan 2028',
    retailer: 'Mukushi Agro Dealers, Murehwa',
    category: 'seed',
  },
  {
    code: 'AGR260028S',
    pin: 'AGR260028S',
    status: 'genuine',
    product: 'FarmSafe 30EC Lambda-Cyhalothrin 500mL',
    shortName: 'FarmSafe 30EC',
    manufacturer: 'Agricura',
    batch: 'B2407-112',
    manufactureDate: '04 Jul 2026',
    expiry: '04 Jul 2028',
    retailer: 'Farm & City, Harare',
    category: 'pesticide',
  },
  {
    code: 'AGR264129J',
    pin: 'AGR264129J',
    status: 'genuine',
    product: 'Windmill Compound D Fertilizer 50kg',
    shortName: 'Windmill Compound D',
    manufacturer: 'Windmill',
    batch: 'WD-2026-441',
    manufactureDate: '18 Mar 2026',
    expiry: '18 Mar 2029',
    retailer: 'Windmill Depot, Gweru',
    category: 'fertilizer',
  },
  {
    code: 'AGR263337W',
    pin: 'AGR263337W',
    status: 'already_used',
    product: 'SeedCo SC 513 Early Maize Seed 10kg',
    shortName: 'SeedCo SC 513',
    manufacturer: 'SeedCo',
    batch: '2026-MRW',
    manufactureDate: '02 Feb 2026',
    expiry: '02 Feb 2028',
    retailer: 'Chigumba Stores, Murehwa',
    category: 'seed',
    verifiedAt: '2026-10-03T07:40:00.000Z',
    verifiedLocation: 'Murehwa',
  },
]

export function createSeedCodes(issuedAt = Date.now()): ProductCode[] {
  return seed.map((item) => ({ ...item, issuedAt }))
}

export const MANUFACTURERS = ['SeedCo', 'Windmill', 'ZFC', 'Agricura'] as const

export type ManufacturerName = (typeof MANUFACTURERS)[number]

export const SUGGESTED_PRODUCTS: Record<ManufacturerName, { product: string; batch: string; category: ProductCode['category'] }> = {
  SeedCo: { product: 'SeedCo SC 727 Late Maturity Maize Seed 25kg', batch: '2026-HIT', category: 'seed' },
  Windmill: { product: 'Windmill Compound D Fertilizer 50kg', batch: 'WD-2026-441', category: 'fertilizer' },
  ZFC: { product: 'ZFC Broiler Starter Stockfeed 50kg', batch: 'ZFC-BF-88', category: 'feed' },
  Agricura: { product: 'FarmSafe 30EC Lambda-Cyhalothrin 500mL', batch: 'B2407-112', category: 'pesticide' },
}
