# Spectra Solar Solutions CRM

A comprehensive Customer Relationship Management system for solar installation businesses.

## Recent Updates

### Logo and Branding
- **Logo Size**: Increased logo size from `h-8` to `h-12` for better visibility
- **Logo Background**: Added CSS filters (`filter brightness-0 invert`) to remove background and make logo more prominent
- **Logo Placement**: Logo appears in sidebar and mobile navigation

### Currency Conversion
- **Currency**: Changed from USD ($) to INR (₹) throughout the application
- **Updated Components**:
  - Dashboard: Monthly revenue display
  - Analytics: Revenue charts and tooltips
  - Customers: Monthly bill amounts
  - Invoices: All pricing and totals
  - Inventory: Unit costs and total values

### Customer Management
- **Table Format**: Converted customer display from card layout to organized table format
- **Customer ID**: Added customer ID column to the table for better tracking
- **Enhanced Columns**: 
  - Customer ID
  - Name
  - Contact (Phone & Email)
  - Address
  - Solar Capacity
  - Monthly Bill (₹)
  - Status
  - Installation Date
  - Actions (Edit/Delete)

### Invoice Enhancements
- **Spectra Logo**: Added placeholder for Spectra logo in PDF generation
- **Company Information**: Added fields for:
  - Company Address (customizable)
  - GST Number (customizable)
  - Authorized Signatory (customizable)
- **Customer Details**: Enhanced PDF to include complete customer information
- **Currency**: All amounts displayed in INR (₹)
- **PDF Layout**: Improved layout with better spacing and professional formatting

### Technical Improvements
- **Type Safety**: Updated Invoice interface to include new optional fields
- **Form Validation**: Enhanced invoice creation form with new fields
- **Data Persistence**: New invoice fields are saved and retrieved properly

## Features

### Dashboard
- Real-time statistics and metrics
- Monthly revenue tracking in INR
- Installation and customer overview
- Low stock alerts

### Customer Management
- Table-based customer listing with ID
- Search and filter functionality
- Add/Edit/Delete customers
- Export customer data

### Invoice Management
- Create professional invoices with Spectra branding
- Customizable company details (address, GST, signatory)
- PDF generation with customer details
- All amounts in INR
- Product and service tracking

### Inventory Management
- Track solar equipment and components
- Low stock alerts
- Cost tracking in INR
- Category-based organization

### Analytics
- Revenue trends and charts
- Installation statistics
- Performance metrics
- All financial data in INR

## Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up Firebase (see [Firebase Setup Guide](FIREBASE_SETUP.md))
4. Start development server: `npm run dev`
5. Open http://localhost:5173

## Usage

1. **Authentication**: Sign in with internal team credentials
2. **Dashboard**: View overview of business metrics
3. **Customers**: Manage customer information in table format
4. **Invoices**: Create professional invoices with company branding
5. **Inventory**: Track equipment and stock levels
6. **Analytics**: Monitor business performance and trends

## Firebase Integration

This application uses Firebase for:
- **Authentication**: Email/password login for internal team
- **Database**: Firestore for data persistence
- **Real-time Updates**: Automatic data synchronization

See [FIREBASE_SETUP.md](FIREBASE_SETUP.md) for detailed setup instructions.

## File Structure

```
src/
├── components/
│   ├── Layout.tsx          # Main layout with updated logo
│   ├── Dashboard.tsx       # Dashboard with INR currency
│   ├── Customers.tsx       # Table-based customer management
│   ├── Invoices.tsx        # Enhanced invoice system
│   ├── Inventory.tsx       # Inventory with INR pricing
│   └── Analytics.tsx       # Analytics with INR charts
├── firebase/
│   ├── config.ts           # Firebase configuration
│   ├── auth.ts             # Authentication functions
│   └── database.ts         # Firestore database functions
├── types/
│   └── index.ts            # Updated interfaces
└── contexts/
    ├── AuthContext.tsx     # Firebase authentication context
    └── DataContext.tsx     # Firebase data management
```

## Notes

- The Spectra logo in PDF generation is currently a placeholder
- All financial calculations use INR (₹) currency
- Customer IDs are automatically generated
- Invoice PDFs include customizable company information
- Table format provides better data organization for customers # spectra-crm
