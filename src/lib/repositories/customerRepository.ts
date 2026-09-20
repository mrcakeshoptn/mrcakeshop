import { supabase } from '@/lib/supabaseClient';
import { Customer } from '@/types/customer';

/**
 * Admin-only access to the customer list. The public never reads or writes
 * this table directly — a customer placing an order goes through the
 * submit_order() database function instead (see src/lib/orders.ts), which is
 * the only way new rows land here from outside the admin dashboard. That
 * keeps every customer's contact details private to logged-in staff.
 */
export interface CustomerRepository {
  getAll(): Promise<Customer[]>;
  save(customer: Customer): Promise<Customer>;
  remove(id: string): Promise<void>;
}

function rowToCustomer(row: Record<string, unknown>): Customer {
  return {
    id: row.id as string,
    name: (row.name as string) || '',
    mobile: (row.mobile as string) || '',
    email: (row.email as string) || '',
    address: (row.address as string) || '',
    notes: (row.notes as string) || '',
    source: row.source as Customer['source'],
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

function customerToRow(customer: Customer) {
  return {
    name: customer.name,
    mobile: customer.mobile,
    email: customer.email,
    address: customer.address,
    notes: customer.notes,
    source: customer.source,
  };
}

class SupabaseCustomerRepository implements CustomerRepository {
  async getAll(): Promise<Customer[]> {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('updated_at', { ascending: false });
    if (error) {
      console.error('Failed to load customers', error);
      return [];
    }
    return (data || []).map(rowToCustomer);
  }

  async save(customer: Customer): Promise<Customer> {
    const row = customerToRow(customer);
    if (!customer.id) {
      const { data, error } = await supabase.from('customers').insert(row).select().single();
      if (error || !data) throw new Error(error?.message || 'Failed to create customer');
      return rowToCustomer(data);
    }
    const { data, error } = await supabase
      .from('customers')
      .update(row)
      .eq('id', customer.id)
      .select()
      .single();
    if (error || !data) throw new Error(error?.message || 'Failed to update customer');
    return rowToCustomer(data);
  }

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from('customers').delete().eq('id', id);
    if (error) throw new Error(error.message);
  }
}

let instance: CustomerRepository | null = null;

export function useCustomerRepository(): CustomerRepository {
  if (!instance) instance = new SupabaseCustomerRepository();
  return instance;
}
