import { CakeProduct } from '@/types/cake';
import { readJSON, writeJSON } from '@/lib/storage';
import { SEED_PRODUCTS } from '@/data/seed';

const STORAGE_KEY = 'mr_cake_products';

/**
 * Everything the UI knows about products. The V1 implementation below reads
 * and writes browser localStorage. A future version backed by PostgreSQL +
 * Prisma can implement this exact interface (likely as async fetch() calls)
 * and no component that calls useProductRepository() needs to change.
 */
export interface ProductRepository {
  getAll(): CakeProduct[];
  getActive(): CakeProduct[];
  getById(id: string): CakeProduct | undefined;
  save(product: CakeProduct): CakeProduct;
  remove(id: string): void;
  duplicate(id: string): CakeProduct | undefined;
  replaceAll(products: CakeProduct[]): void;
  resetToDemoData(): void;
}

function generateId(): string {
  return `cake_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

class LocalStorageProductRepository implements ProductRepository {
  private load(): CakeProduct[] {
    return readJSON<CakeProduct[]>(STORAGE_KEY, SEED_PRODUCTS);
  }

  private persist(products: CakeProduct[]) {
    writeJSON(STORAGE_KEY, products);
  }

  getAll(): CakeProduct[] {
    return this.load().sort((a, b) => a.sortOrder - b.sortOrder);
  }

  getActive(): CakeProduct[] {
    return this.getAll().filter((p) => p.active);
  }

  getById(id: string): CakeProduct | undefined {
    return this.load().find((p) => p.id === id);
  }

  save(product: CakeProduct): CakeProduct {
    const products = this.load();
    const now = new Date().toISOString();

    if (!product.id) {
      const created: CakeProduct = {
        ...product,
        id: generateId(),
        createdAt: now,
        updatedAt: now,
      };
      this.persist([...products, created]);
      return created;
    }

    const index = products.findIndex((p) => p.id === product.id);
    const updated: CakeProduct = { ...product, updatedAt: now };
    if (index === -1) {
      this.persist([...products, updated]);
    } else {
      const next = [...products];
      next[index] = updated;
      this.persist(next);
    }
    return updated;
  }

  remove(id: string): void {
    this.persist(this.load().filter((p) => p.id !== id));
  }

  duplicate(id: string): CakeProduct | undefined {
    const original = this.getById(id);
    if (!original) return undefined;
    const now = new Date().toISOString();
    const copy: CakeProduct = {
      ...original,
      id: generateId(),
      name: `${original.name} (Copy)`,
      featured: false,
      createdAt: now,
      updatedAt: now,
    };
    this.persist([...this.load(), copy]);
    return copy;
  }

  replaceAll(products: CakeProduct[]): void {
    this.persist(products);
  }

  resetToDemoData(): void {
    this.persist(SEED_PRODUCTS);
  }
}

let instance: ProductRepository | null = null;

export function useProductRepository(): ProductRepository {
  if (!instance) instance = new LocalStorageProductRepository();
  return instance;
}
