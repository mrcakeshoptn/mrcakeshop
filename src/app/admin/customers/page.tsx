'use client';

import { useState } from 'react';
import { useCustomers } from '@/lib/hooks';
import { useCustomerRepository } from '@/lib/repositories/customerRepository';
import { Customer, blankCustomer } from '@/types/customer';
import GlassCard from '@/components/glass/GlassCard';
import GlassButton from '@/components/glass/GlassButton';
import GlassModal from '@/components/glass/GlassModal';
import GlassInput, { GlassTextarea } from '@/components/glass/GlassInput';

const sourceLabel: Record<Customer['source'], string> = {
  manual: 'Added manually',
  order: 'Placed an order',
  'custom-cake-request': 'Custom cake request',
};

export default function AdminCustomersPage() {
  const repo = useCustomerRepository();
  const { customers, loading, refresh } = useCustomers();
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<Customer | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filtered = customers.filter((c) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      c.mobile.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q)
    );
  });

  const handleSave = (customer: Customer) => {
    repo.save(customer);
    setEditing(null);
    refresh();
  };

  const handleDelete = (id: string) => {
    repo.remove(id);
    setConfirmDeleteId(null);
    refresh();
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(customers, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mr-cake-shop-customers-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <p className="mb-5 max-w-2xl text-sm text-ink/60">
        Every customer who places an order, sends a custom cake request, or is added here
        manually — saved right in this browser. <strong className="text-ink/80">Because this V1
        has no shared backend, a record only lands here if it was created on this same device.</strong>{' '}
        If a customer orders from their own phone, their details save to their phone, not to
        this dashboard — see the README for what this means and how to move to a shared,
        multi-device customer list.
      </p>

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <GlassButton size="sm" onClick={() => setEditing(blankCustomer())}>
            + Add Customer
          </GlassButton>
          <GlassButton size="sm" variant="secondary" onClick={handleExport}>
            Export Customers
          </GlassButton>
        </div>
        <GlassInput
          placeholder="Search name, mobile or email"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="sm:max-w-xs"
        />
      </div>

      <GlassCard padded={false} className="overflow-x-auto">
        <table className="w-full min-w-[680px] text-sm">
          <thead>
            <tr className="border-b border-white/60 text-left text-xs uppercase tracking-wide text-ink/50">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Mobile</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">How they came in</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-ink/40">
                  Loading…
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-ink/40">
                  {customers.length === 0
                    ? 'No customers yet. They\u2019ll appear here automatically once someone places an order or sends a custom cake request.'
                    : 'No customers match that search.'}
                </td>
              </tr>
            ) : (
              filtered.map((c) => (
                <tr key={c.id} className="border-b border-white/40 last:border-0">
                  <td className="px-4 py-3 font-medium text-ink">{c.name || '—'}</td>
                  <td className="px-4 py-3 text-ink/70">{c.mobile || '—'}</td>
                  <td className="px-4 py-3 text-ink/70">{c.email || '—'}</td>
                  <td className="px-4 py-3 text-ink/70">{sourceLabel[c.source]}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3 text-xs">
                      <button onClick={() => setEditing(c)} className="text-burgundy hover:underline">
                        Edit
                      </button>
                      <button onClick={() => setConfirmDeleteId(c.id)} className="text-red-600 hover:underline">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </GlassCard>

      <GlassModal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.id ? 'Edit Customer' : 'Add Customer'}
      >
        {editing && (
          <CustomerForm customer={editing} onSave={handleSave} onCancel={() => setEditing(null)} />
        )}
      </GlassModal>

      <GlassModal open={!!confirmDeleteId} onClose={() => setConfirmDeleteId(null)} title="Delete this customer?">
        <p className="text-sm text-ink/70">This removes their details from this browser permanently.</p>
        <div className="mt-5 flex justify-end gap-3">
          <GlassButton variant="ghost" onClick={() => setConfirmDeleteId(null)}>
            Cancel
          </GlassButton>
          <GlassButton
            className="!border-red-600 !bg-red-600 hover:!bg-red-700"
            onClick={() => confirmDeleteId && handleDelete(confirmDeleteId)}
          >
            Delete Customer
          </GlassButton>
        </div>
      </GlassModal>
    </div>
  );
}

function CustomerForm({
  customer,
  onSave,
  onCancel,
}: {
  customer: Customer;
  onSave: (c: Customer) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Customer>(customer);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof Customer>(key: K, value: Customer[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = () => {
    if (!form.name.trim() && !form.mobile.trim()) {
      setError('Enter at least a name or a mobile number.');
      return;
    }
    onSave(form);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <GlassInput label="Name" value={form.name} onChange={(e) => set('name', e.target.value)} />
        <GlassInput label="Mobile" value={form.mobile} onChange={(e) => set('mobile', e.target.value)} />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <GlassInput label="Email (optional)" value={form.email} onChange={(e) => set('email', e.target.value)} />
        <GlassInput label="Address (optional)" value={form.address} onChange={(e) => set('address', e.target.value)} />
      </div>
      <GlassTextarea
        label="Notes"
        rows={3}
        placeholder="Preferences, past orders, allergies to remember…"
        value={form.notes}
        onChange={(e) => set('notes', e.target.value)}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex justify-end gap-3 pt-2">
        <GlassButton variant="ghost" onClick={onCancel} type="button">
          Cancel
        </GlassButton>
        <GlassButton onClick={handleSubmit} type="button">
          Save Customer
        </GlassButton>
      </div>
    </div>
  );
}
