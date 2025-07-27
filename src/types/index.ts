export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  solarCapacity: number; // in kW
  monthlyBill: number;
  installationDate?: string;
  status: 'pending' | 'in-progress' | 'completed';
  createdAt?: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  quantity: number;
  vendor: string;
  unitCost: number;
  minThreshold: number;
  createdAt?: string;
}

export interface Task {
  id: string;
  customerId: string;
  customerName: string;
  type: 'installation' | 'maintenance' | 'inspection';
  status: 'pending' | 'in-progress' | 'completed';
  assignedTo: string;
  scheduledDate: string;
  completedDate?: string;
  notes?: string;
  createdAt?: string;
}

export interface Invoice {
  id: string;
  customerId: string;
  customerName: string;
  products: Array<{
    productId: string;
    name: string;
    quantity: number;
    unitCost: number;
  }>;
  installationDate: string;
  totalCost: number;
  taxes: number;
  finalAmount: number;
  createdAt?: string;
  companyAddress?: string;
  gstNumber?: string;
  signatory?: string;
}

export interface User {
  id: string;
  username: string;
  name: string;
  role: 'admin';
}