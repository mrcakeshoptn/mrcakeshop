export type OrderStatus = 'pending' | 'confirmed' | 'ready' | 'completed' | 'cancelled';
export type OrderType = 'catalog' | 'custom';
export type FulfillmentType = 'pickup' | 'delivery';

export interface Order {
  id: string;
  customerId: string | null;
  orderType: OrderType;
  productId: string | null;
  productName: string;
  weightKg: number | null;
  shape: string | null;
  eggType: string | null;
  steps: number | null;
  cakeMessage: string;
  customDetails: Record<string, unknown>;
  totalPrice: number | null;
  fulfillmentType: FulfillmentType;
  status: OrderStatus;
  confirmedAt: string | null;
  expectedReadyAt: string | null;
  createdAt: string;
  updatedAt: string;
  // Populated by a join when listing, not stored on the order itself.
  customerName?: string;
  customerMobile?: string;
}
