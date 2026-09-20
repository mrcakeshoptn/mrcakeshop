'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { CakeProduct } from '@/types/cake';
import { ShopSettings } from '@/types/settings';
import { Customer } from '@/types/customer';
import { Order } from '@/types/order';
import { useProductRepository } from '@/lib/repositories/productRepository';
import { useSettingsRepository } from '@/lib/repositories/settingsRepository';
import { useCustomerRepository } from '@/lib/repositories/customerRepository';
import { useOrderRepository } from '@/lib/repositories/orderRepository';
import { getSession, onAuthStateChange } from '@/lib/adminAuth';

/** All products (including inactive) — for admin screens. */
export function useAllProducts() {
  const repo = useProductRepository();
  const [products, setProducts] = useState<CakeProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    setProducts(await repo.getAll());
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
    (async () => {
      setProducts(await repo.getActive());
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { products, loading };
}

export function useShopSettings() {
  const repo = useSettingsRepository();
  const [settings, setSettings] = useState<ShopSettings | null>(null);

  const refresh = useCallback(async () => {
    setSettings(await repo.get());
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

  const refresh = useCallback(async () => {
    setLoading(true);
    setCustomers(await repo.getAll());
    setLoading(false);
  }, [repo]);

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { customers, loading, refresh };
}

/** Every order — for the admin Orders page. */
export function useOrders() {
  const repo = useOrderRepository();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    setOrders(await repo.getAll());
    setLoading(false);
  }, [repo]);

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { orders, loading, refresh };
}

/** The current Supabase Auth session, kept in sync as it changes. */
export function useAdminSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    getSession().then((s) => {
      setSession(s);
      setChecked(true);
    });
    const unsubscribe = onAuthStateChange((s) => setSession(s));
    return unsubscribe;
  }, []);

  return { session, checked };
}
