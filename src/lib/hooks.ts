'use client';

import { useCallback, useEffect, useState } from 'react';
import { CakeProduct } from '@/types/cake';
import { ShopSettings } from '@/types/settings';
import { Customer } from '@/types/customer';
import { useProductRepository } from '@/lib/repositories/productRepository';
import { useSettingsRepository } from '@/lib/repositories/settingsRepository';
import { useCustomerRepository } from '@/lib/repositories/customerRepository';

/** All products (including inactive) — for admin screens. */
export function useAllProducts() {
  const repo = useProductRepository();
  const [products, setProducts] = useState<CakeProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setProducts(repo.getAll());
    setLoading(false);
  }, [repo]);

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { products, loading, refresh };
}

/** Active-only products — for the customer-facing catalogue. */
export function useActiveProducts() {
  const repo = useProductRepository();
  const [products, setProducts] = useState<CakeProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setProducts(repo.getActive());
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { products, loading };
}

export function useShopSettings() {
  const repo = useSettingsRepository();
  const [settings, setSettings] = useState<ShopSettings | null>(null);

  const refresh = useCallback(() => {
    setSettings(repo.get());
  }, [repo]);

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { settings, refresh };
}

/** Every stored customer — for the admin Customers page. */
export function useCustomers() {
  const repo = useCustomerRepository();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setCustomers(repo.getAll());
    setLoading(false);
  }, [repo]);

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { customers, loading, refresh };
}
