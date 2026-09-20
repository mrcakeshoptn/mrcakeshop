import { CakeProduct } from '@/types/cake';

const now = new Date().toISOString();

// Demo photography: warm, editorial cake photos from Unsplash's free library,
// used only as V1 placeholder imagery. Replace every image from Admin →
// Products before going live — see README "V1 Limitations".
const IMG = {
  chocTruffle: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=900&q=80',
  redVelvet: 'https://images.unsplash.com/photo-1586985289906-406988974504?w=900&q=80',
  vanillaBerry: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=900&q=80',
  blackForest: 'https://images.unsplash.com/photo-1541599468348-e96984315921?w=900&q=80',
  mangoCream: 'https://images.unsplash.com/photo-1519869325930-281384150729?w=900&q=80',
  pineapple: 'https://images.unsplash.com/photo-1464349153735-7db50ed83c84?w=900&q=80',
  butterVanilla: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=900&q=80',
  butterChoco: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=900&q=80',
  butterPineapple: 'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=900&q=80',
  butterStrawberry: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=900&q=80',
  designerFloral: 'https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=900&q=80',
  designerNaked: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=900&q=80',
  designerGold: 'https://images.unsplash.com/photo-1519654793190-2301e9c72cfe?w=900&q=80',
  designerThemed: 'https://images.unsplash.com/photo-1562777717-dc6984f65a63?w=900&q=80',
};

function weights(base: number, step: number, count: number) {
  return Array.from({ length: count }, (_, i) => ({
    weightKg: Math.round((1 + i * 0.5) * 10) / 10,
    price: base + step * i,
    active: true,
  }));
}

function shapeCharges(count: number, squareStep: number, heartStep: number) {
  return Array.from({ length: count }, (_, i) => ({
    weightKg: Math.round((1 + i * 0.5) * 10) / 10,
    round: 0,
    square: 50 + squareStep * i,
    heart: 100 + heartStep * i,
  }));
}

function egglessCharges(count: number, step: number) {
  return Array.from({ length: count }, (_, i) => ({
    weightKg: Math.round((1 + i * 0.5) * 10) / 10,
    charge: 100 + step * i,
  }));
}

function base(
  overrides: Partial<CakeProduct> & Pick<CakeProduct, 'id' | 'name' | 'category' | 'creamType' | 'flavour' | 'description' | 'mainImage' | 'sortOrder'>
): CakeProduct {
  return {
    images: [overrides.mainImage],
    featured: false,
    active: true,
    designer: false,
    customAvailable: true,
    weights: weights(899, 350, 9),
    shapeCharges: shapeCharges(9, 25, 50),
    egglessAvailable: true,
    egglessCharges: egglessCharges(9, 50),
    stepOptions: [1, 2, 3],
    minimumWeightFor2Step: 1.5,
    minimumWeightFor3Step: 3,
    maximumStandardWeight: 5,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

export const SEED_PRODUCTS: CakeProduct[] = [
  // Fresh Cream (6)
  base({
    id: 'demo-fc-1',
    name: 'Chocolate Truffle',
    category: 'fresh-cream',
    creamType: 'fresh-cream',
    flavour: 'Chocolate',
    description: 'Rich chocolate sponge layered with silky chocolate truffle cream.',
    mainImage: IMG.chocTruffle,
    sortOrder: 1,
    featured: true,
  }),
  base({
    id: 'demo-fc-2',
    name: 'Classic Red Velvet',
    category: 'fresh-cream',
    creamType: 'fresh-cream',
    flavour: 'Red Velvet',
    description: 'Velvety cocoa sponge with a tangy cream cheese frosting.',
    mainImage: IMG.redVelvet,
    sortOrder: 2,
    featured: true,
    weights: weights(999, 380, 9),
  }),
  base({
    id: 'demo-fc-3',
    name: 'Vanilla Berry Bliss',
    category: 'fresh-cream',
    creamType: 'fresh-cream',
    flavour: 'Vanilla & Mixed Berry',
    description: 'Light vanilla sponge with fresh cream and a berry compote centre.',
    mainImage: IMG.vanillaBerry,
    sortOrder: 3,
    weights: weights(849, 320, 9),
  }),
  base({
    id: 'demo-fc-4',
    name: 'Black Forest',
    category: 'fresh-cream',
    creamType: 'fresh-cream',
    flavour: 'Chocolate & Cherry',
    description: 'A bakery classic: chocolate sponge, whipped cream and cherries.',
    mainImage: IMG.blackForest,
    sortOrder: 4,
    weights: weights(899, 340, 9),
  }),
  base({
    id: 'demo-fc-5',
    name: 'Mango Cream Delight',
    category: 'fresh-cream',
    creamType: 'fresh-cream',
    flavour: 'Mango',
    description: 'Seasonal Alphonso mango pulp folded into a light fresh cream sponge.',
    mainImage: IMG.mangoCream,
    sortOrder: 5,
    weights: weights(949, 360, 9),
  }),
  base({
    id: 'demo-fc-6',
    name: 'Pineapple Classic',
    category: 'fresh-cream',
    creamType: 'fresh-cream',
    flavour: 'Pineapple',
    description: 'The everyday favourite — soft sponge, fresh cream, pineapple chunks.',
    mainImage: IMG.pineapple,
    sortOrder: 6,
    weights: weights(799, 300, 9),
  }),

  // Butter Cream (4) — generally lower prices, per spec
  base({
    id: 'demo-bc-1',
    name: 'Butter Vanilla',
    category: 'butter-cream',
    creamType: 'butter-cream',
    flavour: 'Vanilla',
    description: 'A firm, classic buttercream finish over a soft vanilla sponge.',
    mainImage: IMG.butterVanilla,
    sortOrder: 7,
    weights: weights(549, 200, 9),
    shapeCharges: shapeCharges(9, 20, 40),
    egglessCharges: egglessCharges(9, 40),
  }),
  base({
    id: 'demo-bc-2',
    name: 'Butter Chocolate',
    category: 'butter-cream',
    creamType: 'butter-cream',
    flavour: 'Chocolate',
    description: 'Chocolate sponge finished with a smooth chocolate buttercream.',
    mainImage: IMG.butterChoco,
    sortOrder: 8,
    weights: weights(599, 220, 9),
    shapeCharges: shapeCharges(9, 20, 40),
    egglessCharges: egglessCharges(9, 40),
  }),
  base({
    id: 'demo-bc-3',
    name: 'Butter Pineapple',
    category: 'butter-cream',
    creamType: 'butter-cream',
    flavour: 'Pineapple',
    description: 'Buttercream piping over a pineapple-studded vanilla sponge.',
    mainImage: IMG.butterPineapple,
    sortOrder: 9,
    weights: weights(569, 210, 9),
    shapeCharges: shapeCharges(9, 20, 40),
    egglessCharges: egglessCharges(9, 40),
  }),
  base({
    id: 'demo-bc-4',
    name: 'Butter Strawberry',
    category: 'butter-cream',
    creamType: 'butter-cream',
    flavour: 'Strawberry',
    description: 'Pink-tinted buttercream with a fruity strawberry sponge.',
    mainImage: IMG.butterStrawberry,
    sortOrder: 10,
    weights: weights(579, 210, 9),
    shapeCharges: shapeCharges(9, 20, 40),
    egglessCharges: egglessCharges(9, 40),
  }),

  // Designer (4)
  base({
    id: 'demo-des-1',
    name: 'Floral Garden',
    category: 'designer',
    creamType: 'fresh-cream',
    flavour: 'Vanilla & Rose',
    description: 'Hand-piped buttercream florals over a rose-vanilla sponge.',
    mainImage: IMG.designerFloral,
    sortOrder: 11,
    designer: true,
    featured: true,
    weights: weights(1799, 550, 9),
    shapeCharges: shapeCharges(9, 60, 120),
    egglessCharges: egglessCharges(9, 80),
  }),
  base({
    id: 'demo-des-2',
    name: 'Naked Semi-Frosted',
    category: 'designer',
    creamType: 'fresh-cream',
    flavour: 'Chocolate & Hazelnut',
    description: 'A rustic semi-naked finish with fresh fruit and chocolate drip.',
    mainImage: IMG.designerNaked,
    sortOrder: 12,
    designer: true,
    weights: weights(1899, 580, 9),
    shapeCharges: shapeCharges(9, 60, 120),
    egglessCharges: egglessCharges(9, 80),
  }),
  base({
    id: 'demo-des-3',
    name: 'Gold Edition',
    category: 'designer',
    creamType: 'fresh-cream',
    flavour: 'Chocolate Truffle',
    description: 'Edible gold leaf and a mirror-glaze chocolate ganache finish.',
    mainImage: IMG.designerGold,
    sortOrder: 13,
    designer: true,
    featured: true,
    weights: weights(2199, 650, 9),
    shapeCharges: shapeCharges(9, 70, 140),
    egglessCharges: egglessCharges(9, 90),
  }),
  base({
    id: 'demo-des-4',
    name: 'Themed Character Cake',
    category: 'designer',
    creamType: 'fresh-cream',
    flavour: "Kid's choice — Vanilla or Chocolate",
    description: 'Fondant-topped theme cakes for birthdays — tell us the theme.',
    mainImage: IMG.designerThemed,
    sortOrder: 14,
    designer: true,
    weights: weights(1999, 600, 9),
    shapeCharges: shapeCharges(9, 60, 120),
    egglessCharges: egglessCharges(9, 80),
  }),
];
