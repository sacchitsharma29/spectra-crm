import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  orderBy,
  limit,
  startAfter,
  writeBatch,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db } from './config';
import { Customer, Invoice, Product } from '../types';

// Helper function to convert Firestore timestamps to ISO strings
const convertTimestamps = (data: any): any => {
  if (data && typeof data === 'object') {
    Object.keys(data).forEach(key => {
      if (data[key] instanceof Timestamp) {
        data[key] = data[key].toDate().toISOString();
      } else if (typeof data[key] === 'object') {
        data[key] = convertTimestamps(data[key]);
      }
    });
  }
  return data;
};

// Customers
export const customersCollection = collection(db, 'customers');

export const getCustomers = async (): Promise<Customer[]> => {
  try {
    const querySnapshot = await getDocs(customersCollection);
    return querySnapshot.docs.map(doc => {
      const data = convertTimestamps(doc.data());
      return {
        id: doc.id,
        ...data
      } as Customer;
    });
  } catch (error) {
    console.error('Error getting customers:', error);
    throw error;
  }
};

export const getCustomerById = async (id: string): Promise<Customer | null> => {
  try {
    const docRef = doc(db, 'customers', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = convertTimestamps(docSnap.data());
      return {
        id: docSnap.id,
        ...data
      } as Customer;
    }
    return null;
  } catch (error) {
    console.error('Error getting customer:', error);
    throw error;
  }
};

export const addCustomer = async (customer: Omit<Customer, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(customersCollection, {
      ...customer,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding customer:', error);
    throw error;
  }
};

export const updateCustomer = async (id: string, customer: Partial<Customer>): Promise<void> => {
  try {
    const customerRef = doc(db, 'customers', id);
    await updateDoc(customerRef, {
      ...customer,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating customer:', error);
    throw error;
  }
};

export const deleteCustomer = async (id: string): Promise<void> => {
  try {
    const customerRef = doc(db, 'customers', id);
    await deleteDoc(customerRef);
  } catch (error) {
    console.error('Error deleting customer:', error);
    throw error;
  }
};

// Invoices
export const invoicesCollection = collection(db, 'invoices');

export const getInvoices = async (): Promise<Invoice[]> => {
  try {
    const querySnapshot = await getDocs(invoicesCollection);
    return querySnapshot.docs.map(doc => {
      const data = convertTimestamps(doc.data());
      return {
        id: doc.id,
        ...data
      } as Invoice;
    });
  } catch (error) {
    console.error('Error getting invoices:', error);
    throw error;
  }
};

export const getInvoiceById = async (id: string): Promise<Invoice | null> => {
  try {
    const docRef = doc(db, 'invoices', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = convertTimestamps(docSnap.data());
      return {
        id: docSnap.id,
        ...data
      } as Invoice;
    }
    return null;
  } catch (error) {
    console.error('Error getting invoice:', error);
    throw error;
  }
};

export const addInvoice = async (invoice: Omit<Invoice, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(invoicesCollection, {
      ...invoice,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding invoice:', error);
    throw error;
  }
};

export const updateInvoice = async (id: string, invoice: Partial<Invoice>): Promise<void> => {
  try {
    const invoiceRef = doc(db, 'invoices', id);
    await updateDoc(invoiceRef, {
      ...invoice,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating invoice:', error);
    throw error;
  }
};

export const deleteInvoice = async (id: string): Promise<void> => {
  try {
    const invoiceRef = doc(db, 'invoices', id);
    await deleteDoc(invoiceRef);
  } catch (error) {
    console.error('Error deleting invoice:', error);
    throw error;
  }
};

// Products
export const productsCollection = collection(db, 'products');

export const getProducts = async (): Promise<Product[]> => {
  try {
    const querySnapshot = await getDocs(productsCollection);
    return querySnapshot.docs.map(doc => {
      const data = convertTimestamps(doc.data());
      return {
        id: doc.id,
        ...data
      } as Product;
    });
  } catch (error) {
    console.error('Error getting products:', error);
    throw error;
  }
};

export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = convertTimestamps(docSnap.data());
      return {
        id: docSnap.id,
        ...data
      } as Product;
    }
    return null;
  } catch (error) {
    console.error('Error getting product:', error);
    throw error;
  }
};

export const addProduct = async (product: Omit<Product, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(productsCollection, {
      ...product,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

export const updateProduct = async (id: string, product: Partial<Product>): Promise<void> => {
  try {
    const productRef = doc(db, 'products', id);
    await updateDoc(productRef, {
      ...product,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (id: string): Promise<void> => {
  try {
    const productRef = doc(db, 'products', id);
    await deleteDoc(productRef);
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// Batch operations
export const batchDeleteCustomers = async (customerIds: string[]): Promise<void> => {
  try {
    const batch = writeBatch(db);
    customerIds.forEach(id => {
      const docRef = doc(db, 'customers', id);
      batch.delete(docRef);
    });
    await batch.commit();
  } catch (error) {
    console.error('Error batch deleting customers:', error);
    throw error;
  }
};

export const batchUpdateProducts = async (updates: Array<{ id: string; data: Partial<Product> }>): Promise<void> => {
  try {
    const batch = writeBatch(db);
    updates.forEach(({ id, data }) => {
      const docRef = doc(db, 'products', id);
      batch.update(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
    });
    await batch.commit();
  } catch (error) {
    console.error('Error batch updating products:', error);
    throw error;
  }
};

// Query helpers
export const getCustomersByStatus = async (status: string): Promise<Customer[]> => {
  try {
    const q = query(customersCollection, where('status', '==', status));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = convertTimestamps(doc.data());
      return {
        id: doc.id,
        ...data
      } as Customer;
    });
  } catch (error) {
    console.error('Error getting customers by status:', error);
    throw error;
  }
};

export const getLowStockProducts = async (threshold: number = 10): Promise<Product[]> => {
  try {
    const q = query(productsCollection, where('quantity', '<=', threshold));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = convertTimestamps(doc.data());
      return {
        id: doc.id,
        ...data
      } as Product;
    });
  } catch (error) {
    console.error('Error getting low stock products:', error);
    throw error;
  }
}; 