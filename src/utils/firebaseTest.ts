import { auth, db } from '../firebase/config';
import { signUp, signIn, logOut } from '../firebase/auth';
import { addCustomer, getCustomers } from '../firebase/database';

export const testFirebaseConnection = async () => {
  console.log('🧪 Testing Firebase Connection...');
  
  try {
    // Test 1: Check if Firebase is initialized
    console.log('✅ Firebase Auth initialized:', !!auth);
    console.log('✅ Firestore initialized:', !!db);
    
    // Test 2: Check if we can access Firebase services
    const authApp = auth.app;
    const dbApp = db.app;
    console.log('✅ Firebase App:', authApp.name);
    console.log('✅ Project ID:', authApp.options.projectId);
    
    return {
      success: true,
      message: 'Firebase connection successful',
      projectId: authApp.options.projectId
    };
  } catch (error) {
    console.error('❌ Firebase connection failed:', error);
    return {
      success: false,
      message: 'Firebase connection failed',
      error: error
    };
  }
};

export const testAuthentication = async (email: string, password: string) => {
  console.log('🧪 Testing Authentication...');
  
  try {
    // Test signup
    console.log('📝 Testing signup...');
    const userCredential = await signUp(email, password, 'Test User');
    console.log('✅ Signup successful:', userCredential.user.email);
    
    // Test signin
    console.log('🔐 Testing signin...');
    const signInResult = await signIn(email, password);
    console.log('✅ Signin successful:', signInResult.user.email);
    
    // Test logout
    console.log('🚪 Testing logout...');
    await logOut();
    console.log('✅ Logout successful');
    
    return {
      success: true,
      message: 'Authentication tests passed'
    };
  } catch (error: any) {
    console.error('❌ Authentication test failed:', error.code, error.message);
    return {
      success: false,
      message: 'Authentication test failed',
      error: error.code
    };
  }
};

export const testDatabase = async () => {
  console.log('🧪 Testing Database...');
  
  try {
    // Test reading customers
    console.log('📖 Testing read customers...');
    const customers = await getCustomers();
    console.log('✅ Read customers successful:', customers.length, 'customers found');
    
    // Test adding a customer
    console.log('📝 Testing add customer...');
    const testCustomer = {
      name: 'Test Customer',
      phone: '+1234567890',
      email: 'test@example.com',
      address: '123 Test St',
      solarCapacity: 5.0,
      monthlyBill: 5000,
      installationDate: new Date().toISOString(),
      status: 'pending' as const
    };
    
    const customerId = await addCustomer(testCustomer);
    console.log('✅ Add customer successful:', customerId);
    
    // Verify the customer was added
    const updatedCustomers = await getCustomers();
    const addedCustomer = updatedCustomers.find(c => c.id === customerId);
    console.log('✅ Customer verification:', !!addedCustomer);
    
    return {
      success: true,
      message: 'Database tests passed',
      customerId: customerId
    };
  } catch (error) {
    console.error('❌ Database test failed:', error);
    return {
      success: false,
      message: 'Database test failed',
      error: error
    };
  }
};

export const runAllTests = async () => {
  console.log('🚀 Starting Firebase Integration Tests...\n');
  
  // Test 1: Connection
  const connectionTest = await testFirebaseConnection();
  console.log('\n--- Connection Test ---');
  console.log(connectionTest.success ? '✅ PASSED' : '❌ FAILED');
  console.log(connectionTest.message);
  
  if (!connectionTest.success) {
    console.log('\n❌ Stopping tests due to connection failure');
    return;
  }
  
  // Test 2: Database
  const databaseTest = await testDatabase();
  console.log('\n--- Database Test ---');
  console.log(databaseTest.success ? '✅ PASSED' : '❌ FAILED');
  console.log(databaseTest.message);
  
  // Test 3: Authentication (only if you want to test with real credentials)
  console.log('\n--- Authentication Test ---');
  console.log('⚠️  Skipped - requires real email/password');
  console.log('To test authentication, call testAuthentication(email, password)');
  
  console.log('\n🎉 Firebase Integration Tests Complete!');
  console.log('\n📋 Summary:');
  console.log(`Connection: ${connectionTest.success ? '✅' : '❌'}`);
  console.log(`Database: ${databaseTest.success ? '✅' : '❌'}`);
  console.log(`Authentication: ⚠️  Manual test required`);
};

// Export for use in browser console
if (typeof window !== 'undefined') {
  (window as any).testFirebase = {
    testConnection: testFirebaseConnection,
    testDatabase: testDatabase,
    testAuthentication: testAuthentication,
    runAllTests: runAllTests
  };
} 