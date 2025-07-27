import React, { createContext, useContext, useState, useEffect } from 'react';
import { Customer, Product, Task, Invoice } from '../types';
import { 
  getCustomers, 
  addCustomer as addCustomerToFirebase, 
  updateCustomer as updateCustomerInFirebase, 
  deleteCustomer as deleteCustomerFromFirebase,
  getInvoices,
  addInvoice as addInvoiceToFirebase,
  updateInvoice as updateInvoiceInFirebase,
  deleteInvoice as deleteInvoiceFromFirebase,
  getProducts,
  addProduct as addProductToFirebase,
  updateProduct as updateProductInFirebase,
  deleteProduct as deleteProductFromFirebase
} from '../firebase/database';

interface DataContextType {
  customers: Customer[];
  products: Product[];
  tasks: Task[];
  invoices: Invoice[];
  loading: boolean;
  addCustomer: (customer: Omit<Customer, 'id'>) => Promise<void>;
  updateCustomer: (id: string, customer: Partial<Customer>) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  addInvoice: (invoice: Omit<Invoice, 'id'>) => Promise<void>;
  exportData: (type: 'customers' | 'products' | 'tasks' | 'invoices') => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Load data from Firebase on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [customersData, productsData, invoicesData] = await Promise.all([
          getCustomers(),
          getProducts(),
          getInvoices()
        ]);
        
        setCustomers(customersData);
        setProducts(productsData);
        setInvoices(invoicesData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const addCustomer = async (customerData: Omit<Customer, 'id'>) => {
    try {
      const newId = await addCustomerToFirebase(customerData);
      const newCustomer: Customer = {
        ...customerData,
        id: newId,
      };
      setCustomers(prev => [...prev, newCustomer]);
    } catch (error) {
      console.error('Error adding customer:', error);
      throw error;
    }
  };

  const updateCustomer = async (id: string, updates: Partial<Customer>) => {
    try {
      await updateCustomerInFirebase(id, updates);
      setCustomers(prev => prev.map(customer => 
        customer.id === id ? { ...customer, ...updates } : customer
      ));
    } catch (error) {
      console.error('Error updating customer:', error);
      throw error;
    }
  };

  const deleteCustomer = async (id: string) => {
    try {
      await deleteCustomerFromFirebase(id);
      setCustomers(prev => prev.filter(customer => customer.id !== id));
    } catch (error) {
      console.error('Error deleting customer:', error);
      throw error;
    }
  };

  const addProduct = async (productData: Omit<Product, 'id'>) => {
    try {
      const newId = await addProductToFirebase(productData);
      const newProduct: Product = {
        ...productData,
        id: newId,
      };
      setProducts(prev => [...prev, newProduct]);
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      await updateProductInFirebase(id, updates);
      setProducts(prev => prev.map(product => 
        product.id === id ? { ...product, ...updates } : product
      ));
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await deleteProductFromFirebase(id);
      setProducts(prev => prev.filter(product => product.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  };

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [...prev, newTask]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, ...updates } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const addInvoice = async (invoiceData: Omit<Invoice, 'id'>) => {
    try {
      const newId = await addInvoiceToFirebase(invoiceData);
      const newInvoice: Invoice = {
        ...invoiceData,
        id: newId,
      };
      setInvoices(prev => [...prev, newInvoice]);
    } catch (error) {
      console.error('Error adding invoice:', error);
      throw error;
    }
  };

  const exportData = (type: 'customers' | 'products' | 'tasks' | 'invoices') => {
    let data: any[] = [];
    let filename = '';

    switch (type) {
      case 'customers':
        data = customers;
        filename = 'customers.csv';
        break;
      case 'products':
        data = products;
        filename = 'products.csv';
        break;
      case 'tasks':
        data = tasks;
        filename = 'tasks.csv';
        break;
      case 'invoices':
        data = invoices;
        filename = 'invoices.csv';
        break;
    }

    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csv = [
      headers.join(','),
      ...data.map(row => headers.map(header => 
        typeof row[header] === 'string' && row[header].includes(',') 
          ? `"${row[header]}"` 
          : row[header]
      ).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <DataContext.Provider value={{
      customers,
      products,
      tasks,
      invoices,
      loading,
      addCustomer,
      updateCustomer,
      deleteCustomer,
      addProduct,
      updateProduct,
      deleteProduct,
      addTask,
      updateTask,
      deleteTask,
      addInvoice,
      exportData
    }}>
      {children}
    </DataContext.Provider>
  );
};