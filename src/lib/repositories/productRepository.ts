import { supabase } from '@/lib/supabaseClient';
import { CakeProduct } from '@/types/cake';

/**
 * Everything the UI knows about products, now backed by a real shared Postgres
 * database (Supabase) instead of per-browser localStorage — every visitor and
 * every admin device sees the same catalogue.
 */
export interface ProductRepository {
  getAll(): Promise<CakeProduct[]>;
  getActive(): Promise<CakeProduct[]>;
  getById(id: string): Promise<CakeProduct | undefined>;
  save(product: CakeProduct): Promise<CakeProduct>;
  remove(id: string): Promise<void>;
  duplicate(id: string): Promise<CakeProduct | undefined>;
  /** Used by Import: wipes the catalogue and replaces it with the given products. */
  replaceAll(products: CakeProduct[]): Promise<void>;
}

// snake_case DB row -> camelCase app type
function rowToProduct(row: Record<string, unknown>): CakeProduct {
  return {
    id: row.id as string,
    name: row.name as string,
    category: row.category as CakeProduct['category'],
    creamType: row.cream_type as CakeProduct['creamType'],
    flavour: row.flavour as string,
    description: row.description as string,
    images: (row.images as string[]) || [],
    mainImage: row.main_image as string,
    featured: row.featured as boolean,
    active: row.active as boolean,
    designer: row.designer as boolean,
    customAvailable: row.custom_available as boolean,
    fastMoving: Boolean(row.fast_moving),
    weights: (row.weights as CakeProduct['weights']) || [],
    shapeCharges: (row.shape_charges as CakeProduct['shapeCharges']) || [],
    egglessAvailable: row.eggless_available as boolean,
    egglessCharges: (row.eggless_charges as CakeProduct['egglessCharges']) || [],
    stepOptions: (row.step_options as CakeProduct['stepOptions']) || [1, 2, 3],
    minimumWeightFor2Step: Number(row.minimum_weight_for_2_step),
    minimumWeightFor3Step: Number(row.minimum_weight_for_3_step),
    maximumStandardWeight: Number(row.maximum_standard_weight),
    sortOrder: Number(row.sort_order),
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

// camelCase app type -> snake_case DB row (for insert/update)
function productToRow(product: CakeProduct) {
  return {
    name: product.name,
    category: product.category,
    cream_type: product.creamType,
    flavour: product.flavour,
    description: product.description,
    images: product.images,
    main_image: product.mainImage,
    featured: product.featured,
    active: product.active,
    designer: product.designer,
    custom_available: product.customAvailable,
    fast_moving: product.fastMoving,
    weights: product.weights,
    shape_charges: product.shapeCharges,
    eggless_available: product.egglessAvailable,
    eggless_charges: product.egglessCharges,
    step_options: product.stepOptions,
    minimum_weight_for_2_step: product.minimumWeightFor2Step,
    minimum_weight_for_3_step: product.minimumWeightFor3Step,
    maximum_standard_weight: product.maximumStandardWeight,
    sort_order: product.sortOrder,
  };
}

class SupabaseProductRepository implements ProductRepository {
  async getAll(): Promise<CakeProduct[]> {
    const { data, error } = await supabase.from('products').select('*').order('sort_order');
    if (error) {
      console.error('Failed to load products', error);
      return [];
    }
    return (data || []).map(rowToProduct);
  }

  async getActive(): Promise<CakeProduct[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('active', true)
      .order('sort_order');
    if (error) {
      console.error('Failed to load active products', error);
      return [];
    }
    return (data || []).map(rowToProduct);
  }

  async getById(id: string): Promise<CakeProduct | undefined> {
    const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
    if (error || !data) return undefined;
    return rowToProduct(data);
  }

  async save(product: CakeProduct): Promise<CakeProduct> {
    const row = productToRow(product);
    if (!product.id) {
      const { data, error } = await supabase.from('products').insert(row).select().single();
      if (error || !data) throw new Error(error?.message || 'Failed to create product');
      return rowToProduct(data);
    }
    const { data, error } = await supabase
      .from('products')
      .update(row)
      .eq('id', product.id)
      .select()
      .single();
    if (error || !data) throw new Error(error?.message || 'Failed to update product');
    return rowToProduct(data);
  }

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw new Error(error.message);
  }

  async duplicate(id: string): Promise<CakeProduct | undefined> {
    const original = await this.getById(id);
    if (!original) return undefined;
    const copy: CakeProduct = { ...original, id: '', name: `${original.name} (Copy)`, featured: false };
    return this.save(copy);
  }

  async replaceAll(products: CakeProduct[]): Promise<void> {
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    if (deleteError) throw new Error(deleteError.message);
    if (products.length === 0) return;
    const rows = products.map(productToRow);
    const { error: insertError } = await supabase.from('products').insert(rows);
    if (insertError) throw new Error(insertError.message);
  }
}

let instance: ProductRepository | null = null;

export function useProductRepository(): ProductRepository {
  if (!instance) instance = new SupabaseProductRepository();
  return instance;
}
