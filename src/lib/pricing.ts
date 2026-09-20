import { CakeProduct, CakeShape, PriceBreakdown, PriceSelection, StepOption } from '@/types/cake';

/**
 * Single source of truth for cake pricing. Every place in the app that needs a
 * price (catalogue card, detail modal, admin preview, WhatsApp message) must
 * call through here rather than re-deriving it, so pricing logic never drifts.
 */

const EPSILON = 0.001;
const sameWeight = (a: number, b: number) => Math.abs(a - b) < EPSILON;

export function getAvailableWeights(product: CakeProduct): number[] {
  return product.weights
    .filter((w) => w.active)
    .map((w) => w.weightKg)
    .sort((a, b) => a - b);
}

export function getStartingPrice(product: CakeProduct): number | null {
  const active = product.weights.filter((w) => w.active);
  if (active.length === 0) return null;
  return Math.min(...active.map((w) => w.price));
}

export function isWeightOverMax(product: CakeProduct, weightKg: number): boolean {
  return weightKg > product.maximumStandardWeight + EPSILON;
}

/** Which step counts (1/2/3) are legal for a given weight, per this product's rules. */
export function getAvailableSteps(product: CakeProduct, weightKg: number): StepOption[] {
  return product.stepOptions.filter((step) => {
    if (step === 1) return true;
    if (step === 2) return weightKg + EPSILON >= product.minimumWeightFor2Step;
    if (step === 3) return weightKg + EPSILON >= product.minimumWeightFor3Step;
    return false;
  });
}

export function isStepValid(product: CakeProduct, weightKg: number, step: StepOption): boolean {
  return getAvailableSteps(product, weightKg).includes(step);
}

function getBaseWeightPrice(product: CakeProduct, weightKg: number): number {
  const match = product.weights.find((w) => sameWeight(w.weightKg, weightKg) && w.active);
  return match ? match.price : 0;
}

function getShapeCharge(product: CakeProduct, weightKg: number, shape: CakeShape): number {
  const row = product.shapeCharges.find((r) => sameWeight(r.weightKg, weightKg));
  if (!row) return 0;
  return row[shape] ?? 0;
}

function getEgglessCharge(product: CakeProduct, weightKg: number): number {
  const row = product.egglessCharges.find((r) => sameWeight(r.weightKg, weightKg));
  return row ? row.charge : 0;
}

// Per-step surcharge. Currently always 0 (see spec: "no additional step charge"),
// kept as a real lookup rather than a hardcoded 0 so it can be turned on later
// without touching every call site.
function getStepCharge(_product: CakeProduct, _weightKg: number, _steps: StepOption): number {
  return 0;
}

export function calculateCakePrice(
  product: CakeProduct,
  selection: PriceSelection
): PriceBreakdown {
  const { weightKg, shape, eggType, steps } = selection;

  const basePrice = getBaseWeightPrice(product, weightKg);
  const shapeCharge = getShapeCharge(product, weightKg, shape);
  const egglessCharge = eggType === 'eggless' ? getEgglessCharge(product, weightKg) : 0;
  const stepCharge = getStepCharge(product, weightKg, steps);

  return {
    basePrice,
    shapeCharge,
    egglessCharge,
    stepCharge,
    total: basePrice + shapeCharge + egglessCharge + stepCharge,
  };
}

export function formatPrice(amount: number, currency = '₹'): string {
  return `${currency}${amount.toLocaleString('en-IN')}`;
}
