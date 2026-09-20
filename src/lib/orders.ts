import { supabase } from '@/lib/supabaseClient';
import { CakeProduct, CustomCakeRequest, PriceSelection } from '@/types/cake';
import { ShopSettings } from '@/types/settings';
import { calculateCakePrice } from '@/lib/pricing';

/**
 * Places a catalogue order by calling the submit_order() database function —
 * this is the ONLY way the public writes to the orders/customers tables (see
 * the RLS policies in the initial migration). Returns the new order's id, or
 * null if it failed (network issue, Supabase misconfigured, etc.) — callers
 * should still let the WhatsApp message go through even if this fails, since
 * the order itself isn't lost, just the dashboard record of it.
 */
export async function submitCatalogOrder(
  product: CakeProduct,
  selection: PriceSelection,
  cakeMessage: string,
  customerName: string,
  customerMobile: string,
  settings: ShopSettings
): Promise<string | null> {
  const breakdown = calculateCakePrice(product, selection);
  const { data, error } = await supabase.rpc('submit_order', {
    p_customer_name: customerName,
    p_customer_mobile: customerMobile,
    p_order_type: 'catalog',
    p_product_id: product.id,
    p_product_name: product.name,
    p_weight_kg: selection.weightKg,
    p_shape: selection.shape,
    p_egg_type: selection.eggType,
    p_steps: selection.steps,
    p_cake_message: cakeMessage,
    p_custom_details: {},
    p_total_price: breakdown.total,
    // Delivery isn't offered yet (see settings.deliveryEnabled — shown to
    // customers as "coming soon"), so every order is pickup for now.
    p_fulfillment_type: 'pickup',
  });
  if (error) {
    console.error('Failed to record order', error);
    return null;
  }
  return data as string;
}

export async function submitCustomCakeOrder(request: CustomCakeRequest): Promise<string | null> {
  const { data, error } = await supabase.rpc('submit_order', {
    p_customer_name: request.customerName,
    p_customer_mobile: request.mobile,
    p_order_type: 'custom',
    p_product_id: null,
    p_product_name: request.cakeType || 'Custom Cake',
    p_weight_kg: null,
    p_shape: request.shape || null,
    p_egg_type: request.eggType || null,
    p_steps: null,
    p_cake_message: request.cakeMessage,
    p_custom_details: {
      requiredDate: request.requiredDate,
      approxWeight: request.approxWeight,
      cakeType: request.cakeType,
      creamType: request.creamType,
      steps: request.steps,
      specialInstructions: request.specialInstructions,
      hasReferenceImage: request.hasReferenceImage,
    },
    p_total_price: null,
    p_fulfillment_type: 'pickup',
  });
  if (error) {
    console.error('Failed to record custom cake request', error);
    return null;
  }
  return data as string;
}
