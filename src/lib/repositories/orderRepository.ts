import { supabase } from '@/lib/supabaseClient';
import { Order, OrderStatus } from '@/types/order';

export interface OrderRepository {
  getAll(): Promise<Order[]>;
  setStatus(id: string, status: OrderStatus, expectedReadyAt?: Date | null): Promise<Order>;
}

function rowToOrder(row: Record<string, unknown>): Order {
  const customer = row.customers as { name?: string; mobile?: string } | null;
  return {
    id: row.id as string,
    customerId: (row.customer_id as string) || null,
    orderType: row.order_type as Order['orderType'],
    productId: (row.product_id as string) || null,
    productName: (row.product_name as string) || '',
    weightKg: row.weight_kg === null ? null : Number(row.weight_kg),
    shape: (row.shape as string) || null,
    eggType: (row.egg_type as string) || null,
    steps: row.steps === null ? null : Number(row.steps),
    cakeMessage: (row.cake_message as string) || '',
    customDetails: (row.custom_details as Record<string, unknown>) || {},
    totalPrice: row.total_price === null ? null : Number(row.total_price),
    fulfillmentType: row.fulfillment_type as Order['fulfillmentType'],
    status: row.status as OrderStatus,
    confirmedAt: (row.confirmed_at as string) || null,
    expectedReadyAt: (row.expected_ready_at as string) || null,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
    customerName: customer?.name || '',
    customerMobile: customer?.mobile || '',
  };
}

class SupabaseOrderRepository implements OrderRepository {
  async getAll(): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*, customers(name, mobile)')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Failed to load orders', error);
      return [];
    }
    return (data || []).map(rowToOrder);
  }

  async setStatus(id: string, status: OrderStatus, expectedReadyAt?: Date | null): Promise<Order> {
    const update: Record<string, unknown> = { status, updated_at: new Date().toISOString() };
    if (status === 'confirmed') {
      update.confirmed_at = new Date().toISOString();
      if (expectedReadyAt) update.expected_ready_at = expectedReadyAt.toISOString();
    }
    const { data, error } = await supabase
      .from('orders')
      .update(update)
      .eq('id', id)
      .select('*, customers(name, mobile)')
      .single();
    if (error || !data) throw new Error(error?.message || 'Failed to update order');
    return rowToOrder(data);
  }
}

let instance: OrderRepository | null = null;

export function useOrderRepository(): OrderRepository {
  if (!instance) instance = new SupabaseOrderRepository();
  return instance;
}
