import { Customer } from '@/types/customer';
import { readJSON, writeJSON } from '@/lib/storage';

const STORAGE_KEY = 'mr_cake_customers';

/**
 * Where customer contact details are kept for this shop — anyone who places an
 * order, submits a custom-cake request, or is added manually by the admin.
 * Same repository pattern as products/settings: this V1 implementation reads
 * and writes browser localStorage, so a future backend can replace it without
 * changing any admin screen.
 */
export interface CustomerRepository {
  getAll(): Customer[];
  getById(id: string): Customer | undefined;
  findByMobile(mobile: string): Customer | undefined;
  save(customer: Customer): Customer;
  /** Create or update by mobile number — used when an order/request comes in. */
  upsertByMobile(details: { name: string; mobile: string; source: Customer['source'] }): Customer | null;
  remove(id: string): void;
  replaceAll(customers: Customer[]): void;
}

function generateId(): string {
  return `cust_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeMobile(mobile: string): string {
  return mobile.replace(/[^0-9]/g, '');
}

class LocalStorageCustomerRepository implements CustomerRepository {
  private load(): Customer[] {
    return readJSON<Customer[]>(STORAGE_KEY, []);
  }

  private persist(customers: Customer[]) {
    writeJSON(STORAGE_KEY, customers);
  }

  getAll(): Customer[] {
    return this.load().sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  getById(id: string): Customer | undefined {
    return this.load().find((c) => c.id === id);
  }

  findByMobile(mobile: string): Customer | undefined {
    const target = normalizeMobile(mobile);
    if (!target) return undefined;
    return this.load().find((c) => normalizeMobile(c.mobile) === target);
  }

  save(customer: Customer): Customer {
    const customers = this.load();
    const now = new Date().toISOString();

    if (!customer.id) {
      const created: Customer = { ...customer, id: generateId(), createdAt: now, updatedAt: now };
      this.persist([...customers, created]);
      return created;
    }

    const index = customers.findIndex((c) => c.id === customer.id);
    const updated: Customer = { ...customer, updatedAt: now };
    if (index === -1) {
      this.persist([...customers, updated]);
    } else {
      const next = [...customers];
      next[index] = updated;
      this.persist(next);
    }
    return updated;
  }

  upsertByMobile(details: { name: string; mobile: string; source: Customer['source'] }): Customer | null {
    if (!details.mobile.trim()) return null;

    const existing = this.findByMobile(details.mobile);
    if (existing) {
      return this.save({
        ...existing,
        name: details.name.trim() || existing.name,
      });
    }

    return this.save({
      ...blankCustomerFor(details),
    });
  }

  remove(id: string): void {
    this.persist(this.load().filter((c) => c.id !== id));
  }

  replaceAll(customers: Customer[]): void {
    this.persist(customers);
  }
}

function blankCustomerFor(details: { name: string; mobile: string; source: Customer['source'] }): Customer {
  const now = new Date().toISOString();
  return {
    id: '',
    name: details.name.trim(),
    mobile: details.mobile.trim(),
    email: '',
    address: '',
    notes: '',
    source: details.source,
    createdAt: now,
    updatedAt: now,
  };
}

let instance: CustomerRepository | null = null;

export function useCustomerRepository(): CustomerRepository {
  if (!instance) instance = new LocalStorageCustomerRepository();
  return instance;
}
