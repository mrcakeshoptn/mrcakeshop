import { CakeProduct, CakeShape, CustomCakeRequest, PriceSelection } from '@/types/cake';
import { calculateCakePrice, formatPrice } from '@/lib/pricing';

const shapeLabel: Record<CakeShape, string> = {
  round: 'Round',
  square: 'Square',
  heart: 'Heart',
};

export function buildWhatsAppUrl(whatsappNumber: string, message: string): string {
  const digitsOnly = whatsappNumber.replace(/[^0-9]/g, '');
  return `https://wa.me/${digitsOnly}?text=${encodeURIComponent(message)}`;
}

export function buildOrderMessage(
  businessName: string,
  product: CakeProduct,
  selection: PriceSelection,
  cakeMessage: string,
  customerName: string,
  customerMobile: string,
  currency: string
): string {
  const breakdown = calculateCakePrice(product, selection);
  const lines = [
    `Hello ${businessName},`,
    '',
    'I would like to order a cake.',
    '',
    `Cake: ${product.name}`,
    `Cream: ${product.creamType === 'fresh-cream' ? 'Fresh Cream' : 'Butter Cream'}`,
    `Weight: ${selection.weightKg} kg`,
    `Shape: ${shapeLabel[selection.shape]}`,
    `Egg Type: ${selection.eggType === 'egg' ? 'Egg' : 'Eggless'}`,
    `Steps: ${selection.steps} Step`,
  ];
  if (cakeMessage.trim()) lines.push(`Cake Message: ${cakeMessage.trim()}`);
  lines.push(
    '',
    `Estimated Price: ${formatPrice(breakdown.total, currency)}`,
    '',
    `Customer Name: ${customerName || '(not entered)'}`,
    `Mobile: ${customerMobile || '(not entered)'}`,
    '',
    'Please confirm availability and final price.'
  );
  return lines.join('\n');
}

export function buildOversizedQuoteMessage(businessName: string, weightKg: number): string {
  return [
    `Hello ${businessName},`,
    '',
    `I'd like a quote for a cake above the standard online size (around ${weightKg} kg).`,
    'Please let me know availability, pricing and lead time.',
  ].join('\n');
}

export function buildCustomCakeMessage(businessName: string, request: CustomCakeRequest): string {
  const lines = [
    `Hello ${businessName},`,
    '',
    'I would like to request a custom cake.',
    '',
    `Customer Name: ${request.customerName || '(not entered)'}`,
    `Mobile: ${request.mobile || '(not entered)'}`,
    `Required Date: ${request.requiredDate || '(not entered)'}`,
    `Approximate Weight: ${request.approxWeight || '(not entered)'}`,
    `Cake Type: ${request.cakeType || '(not entered)'}`,
    `Cream: ${request.creamType || '(not entered)'}`,
    `Shape: ${request.shape || '(not entered)'}`,
    `Egg/Eggless: ${request.eggType || '(not entered)'}`,
    `Steps: ${request.steps || '(not entered)'}`,
    '',
    `Cake Message: ${request.cakeMessage || '(none)'}`,
    '',
    `Special Instructions: ${request.specialInstructions || '(none)'}`,
    '',
  ];
  if (request.hasReferenceImage) {
    lines.push('Reference design:', 'I have a reference design image. I will attach the image in WhatsApp.', '');
  }
  lines.push('Please provide a quotation.');
  return lines.join('\n');
}
