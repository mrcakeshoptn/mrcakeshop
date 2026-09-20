export interface Customer {
  id: string;
  name: string;
  mobile: string;
  email: string;
  address: string;
  notes: string;
  source: 'manual' | 'order' | 'custom-cake-request';
  createdAt: string;
  updatedAt: string;
}

export function blankCustomer(): Customer {
  const now = new Date().toISOString();
  return {
    id: '',
    name: '',
    mobile: '',
    email: '',
    address: '',
    notes: '',
    source: 'manual',
    createdAt: now,
    updatedAt: now,
  };
}
