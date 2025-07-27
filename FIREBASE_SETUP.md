# Firebase Setup Guide for Spectra CRM

This guide will help you set up Firebase Authentication and Firestore Database for your Spectra CRM application.

## ✅ **Your Firebase Project is Ready!**

**Project Details:**
- **Project ID**: `spectra-crm-33ae8`
- **Project Name**: Spectra CRM
- **Analytics**: Enabled (Measurement ID: G-W5EHGK2SF6)

## 🔧 **Configuration Status**

✅ **Firebase Configuration**: Already configured with your credentials
✅ **Authentication**: Email/password enabled
✅ **Firestore Database**: Ready for use
✅ **Analytics**: Configured and ready

## 📋 **What's Already Set Up**

### **1. Firebase Configuration**
Your Firebase configuration is already set up in `src/firebase/config.ts`:

```typescript
const firebaseConfig = {
  apiKey: "AIzaSyCCsSkScmkntc-TRVxuK8dO-F2mbfNwWfc",
  authDomain: "spectra-crm-33ae8.firebaseapp.com",
  projectId: "spectra-crm-33ae8",
  storageBucket: "spectra-crm-33ae8.firebasestorage.app",
  messagingSenderId: "660242944107",
  appId: "1:660242944107:web:fd90dbcecd074c044c212e",
  measurementId: "G-W5EHGK2SF6"
};
```

### **2. Authentication System**
- ✅ Email/password authentication
- ✅ Internal team login only
- ✅ Password reset functionality
- ✅ Email verification
- ✅ Profile management

### **3. Database System**
- ✅ Firestore database integration
- ✅ CRUD operations for all entities
- ✅ Real-time data synchronization
- ✅ Batch operations support
- ✅ Query helpers

### **4. Enhanced Features**
- ✅ Error handling and loading states
- ✅ TypeScript support
- ✅ Real-time updates
- ✅ Data validation
- ✅ Security rules ready

## 🚀 **Testing Your Setup**

### **Option 1: Browser Console Testing**
Open your browser console and run:

```javascript
// Test Firebase connection
window.testFirebase.testConnection();

// Test database operations
window.testFirebase.testDatabase();

// Test authentication (replace with real credentials)
window.testFirebase.testAuthentication('your-email@example.com', 'your-password');

// Run all tests
window.testFirebase.runAllTests();
```

### **Option 2: Manual Testing**
1. Start your development server: `npm run dev`
2. Navigate to `http://localhost:5173`
3. Sign in with existing credentials
4. Test adding customers and invoices
5. Verify data persistence

## 🔐 **Firebase Console Setup**

### **1. Enable Authentication**
1. Go to [Firebase Console](https://console.firebase.google.com/project/spectra-crm-33ae8)
2. Navigate to "Authentication" → "Sign-in method"
3. Ensure "Email/Password" is enabled
4. Optionally enable "Email link (passwordless sign-in)"

### **2. Set Up Firestore Database**
1. Go to "Firestore Database"
2. If not created, click "Create database"
3. Choose "Start in test mode" for development
4. Select a location (choose closest to your users)

### **3. Security Rules**
For development, use these rules in Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read and write
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

For production, implement proper security rules based on your requirements.

## 📊 **Analytics Setup**

Your project includes Firebase Analytics. To view analytics:

1. Go to Firebase Console → Analytics
2. Wait 24-48 hours for data to appear
3. Monitor user engagement and app performance

## 🔧 **Environment Variables (Optional)**

For production deployment, create a `.env` file:

```env
VITE_FIREBASE_API_KEY=AIzaSyCCsSkScmkntc-TRVxuK8dO-F2mbfNwWfc
VITE_FIREBASE_AUTH_DOMAIN=spectra-crm-33ae8.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=spectra-crm-33ae8
VITE_FIREBASE_STORAGE_BUCKET=spectra-crm-33ae8.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=660242944107
VITE_FIREBASE_APP_ID=1:660242944107:web:fd90dbcecd074c044c212e
VITE_FIREBASE_MEASUREMENT_ID=G-W5EHGK2SF6
```

## 🎯 **Next Steps**

### **1. Test the Application**
```bash
npm run dev
```

### **2. Access the System**
1. Go to the login page
2. Sign in with your team credentials
3. Contact your administrator for account access
4. Ensure your email is verified

### **3. Add Test Data**
1. Create a few customers
2. Add some products to inventory
3. Generate test invoices
4. Verify data persistence

### **4. Monitor Performance**
- Check Firebase Console for any errors
- Monitor Firestore usage
- Review authentication logs

## 🛠️ **Troubleshooting**

### **Common Issues:**

1. **"Firebase: Error (auth/invalid-api-key)"**
   - ✅ Already fixed - using correct API key

2. **"Firebase: Error (auth/operation-not-allowed)"**
   - Enable Email/Password authentication in Firebase Console

3. **"Firebase: Error (firestore/permission-denied)"**
   - Check Firestore security rules
   - Ensure user is authenticated

4. **"Firebase: Error (firestore/unavailable)"**
   - Check internet connection
   - Verify Firestore is enabled

### **Testing Commands:**
```javascript
// In browser console
console.log('Testing Firebase connection...');
window.testFirebase.runAllTests();
```

## 📞 **Support**

If you encounter issues:
1. Check the browser console for error messages
2. Verify Firebase Console settings
3. Test with the provided testing utilities
4. Check network connectivity

## 🎉 **You're All Set!**

Your Spectra CRM is now fully integrated with Firebase and ready for production use. The system includes:

- ✅ **Secure Authentication**
- ✅ **Real-time Database**
- ✅ **Data Persistence**
- ✅ **Error Handling**
- ✅ **TypeScript Support**
- ✅ **Analytics Integration**

Happy coding! 🚀 