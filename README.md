# Warung Makan - Food Storefront App

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/nyuris97-7960s-projects/v0-food-storefront-app)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/2cDa2NjOOf9)

## Overview

Warung Makan is a modern food storefront application that allows customers to browse products, add items to cart, and complete orders with integrated payment processing. Built with Next.js 15, React, and Supabase, this app provides a seamless ordering experience for restaurants and food vendors.

## Features

- **Product Catalog**: Browse food and beverage items with images, descriptions, and prices
- **Category Filtering**: Filter products by category (All, Food, Beverages)
- **Shopping Cart**: Add, remove, and update quantities with real-time cart synchronization
- **Optimistic UI Updates**: Instant feedback for cart operations with database sync
- **Checkout Flow**: Customer information collection and order processing
- **Payment Integration**: Xendit payment gateway integration via n8n webhook
- **Order Management**: Track orders with status updates
- **Responsive Design**: Mobile-first design with optimized layouts for all screen sizes
- **Session-based Cart**: Cart persistence across page refreshes using session IDs

## Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Utility-first styling
- **shadcn/ui** - Component library
- **Geist Font** - Typography (Sans & Mono)

### Backend & Database
- **Supabase** - PostgreSQL database and authentication
- **Server Actions** - Next.js server-side data mutations
- **n8n Webhook** - Payment processing automation

### State Management
- **React Context API** - Cart state management
- **SWR** - Data fetching and caching

### Additional Tools
- **Vercel Analytics** - Performance monitoring
- **Lucide React** - Icon library

## Database Schema

### Products Table
\`\`\`sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
\`\`\`

### Cart Items Table
\`\`\`sql
CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
\`\`\`

### Orders Table
\`\`\`sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  table_number INTEGER NOT NULL,
  total_amount INTEGER NOT NULL,
  payment_method TEXT,
  payment_reference TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
\`\`\`

### Order Items Table
\`\`\`sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  product_id UUID REFERENCES products(id),
  product_name TEXT NOT NULL,
  product_price INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  subtotal INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
\`\`\`

## Environment Variables

Required environment variables (set in Vercel Project Settings):

\`\`\`env
# Supabase Configuration
SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_JWT_SECRET=your_supabase_jwt_secret

# PostgreSQL Configuration (from Supabase)
POSTGRES_URL=your_postgres_url
POSTGRES_PRISMA_URL=your_postgres_prisma_url
POSTGRES_URL_NON_POOLING=your_postgres_url_non_pooling
POSTGRES_USER=your_postgres_user
POSTGRES_PASSWORD=your_postgres_password
POSTGRES_DATABASE=your_postgres_database
POSTGRES_HOST=your_postgres_host

# Payment Integration
XENDIT_API_KEY=your_xendit_api_key
N8N_WEBHOOK_URL=your_n8n_webhook_url
NEXT_PUBLIC_N8N_CREATE_PAYMENT_URL=your_n8n_payment_webhook_url
\`\`\`

## Installation & Setup

### Prerequisites
- Node.js 18+ installed
- Supabase account
- Xendit account (for payments)
- n8n instance (for payment webhook)

### Local Development

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd food-storefront-app
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   - Copy `.env.example` to `.env.local`
   - Fill in all required environment variables

4. **Set up Supabase**
   - Create a new Supabase project
   - Run the database migrations in `scripts/` folder
   - Update environment variables with your Supabase credentials

5. **Run development server**
   \`\`\`bash
   npm run dev
   \`\`\`

6. **Open browser**
   Navigate to `http://localhost:3000`

## Project Structure

\`\`\`
├── app/
│   ├── actions/          # Server actions for data mutations
│   │   ├── cart.ts       # Cart operations
│   │   ├── checkout.ts   # Order creation
│   │   └── products.ts   # Product fetching
│   ├── checkout/         # Checkout page
│   ├── order-success/    # Order confirmation page
│   ├── globals.css       # Global styles and design tokens
│   ├── layout.tsx        # Root layout with providers
│   └── page.tsx          # Home page (product listing)
├── components/
│   ├── ui/               # shadcn/ui components
│   ├── cart-drawer.tsx   # Shopping cart sidebar
│   ├── cart-item.tsx     # Individual cart item
│   ├── category-tabs.tsx # Category filter tabs
│   ├── product-card.tsx  # Product display card
│   └── product-detail-modal.tsx # Product details popup
├── contexts/
│   └── cart-context.tsx  # Cart state management
├── hooks/
│   ├── use-mobile.tsx    # Mobile detection hook
│   └── use-toast.ts      # Toast notification hook
├── lib/
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   │   ├── currency.ts   # Currency formatting
│   │   └── session.ts    # Session ID management
│   └── utils.ts          # General utilities (cn function)
└── scripts/              # Database migration scripts
\`\`\`

## Key Features Implementation

### Cart Management
The cart uses a hybrid approach:
- **Optimistic Updates**: Immediate UI feedback for better UX
- **Database Sync**: All cart operations sync with Supabase
- **Session-based**: Cart persists using browser session IDs
- **Real-time Updates**: Cart state syncs across components using Context API

### Product Detail Modal
- **Mobile-optimized**: Slides from top on mobile devices
- **Fixed Layout**: Consistent height with scrollable description
- **Quantity Controls**: Inline quantity adjustment
- **Responsive Images**: Optimized image loading

### Checkout Flow
1. Customer fills in name, phone (optional), and table number
2. Order is created in database with "pending" status
3. Payment request sent to n8n webhook
4. Xendit invoice URL returned
5. Customer redirected to payment page
6. Cart cleared after successful order creation

### Payment Integration
- **Xendit Gateway**: Secure payment processing
- **n8n Automation**: Webhook-based payment creation
- **Order Tracking**: Payment reference stored with order
- **Success Redirect**: Customers redirected back after payment

## API Routes & Server Actions

### Product Actions (`app/actions/products.ts`)
- `getProducts()` - Fetch all products from database

### Cart Actions (`app/actions/cart.ts`)
- `addToCart(sessionId, productId, quantity)` - Add item to cart
- `updateCartItemQuantity(itemId, quantity)` - Update item quantity
- `removeFromCart(itemId)` - Remove item from cart
- `getCartItems(sessionId)` - Fetch cart items for session
- `clearCart(sessionId)` - Clear all cart items

### Checkout Actions (`app/actions/checkout.ts`)
- `createOrder(orderData)` - Create new order with items

## Styling & Design

### Color Palette
- **Primary**: Amber/Orange (#F59E0B) - Call-to-action buttons
- **Background**: Gray-50 (#F9FAFB) - Page background
- **Cards**: White (#FFFFFF) - Product cards and modals
- **Text**: Gray-900 (#111827) - Primary text
- **Muted**: Gray-500 (#6B7280) - Secondary text

### Typography
- **Headings**: Geist Sans (Bold)
- **Body**: Geist Sans (Regular)
- **Code**: Geist Mono

### Responsive Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## Deployment

### Deploy to Vercel

1. **Push to GitHub**
   \`\`\`bash
   git push origin main
   \`\`\`

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure environment variables
   - Deploy

3. **Set up Integrations**
   - Add Supabase integration in Vercel
   - Configure environment variables
   - Redeploy if needed

### Current Deployment
Your project is live at: **[https://vercel.com/nyuris97-7960s-projects/v0-food-storefront-app](https://vercel.com/nyuris97-7960s-projects/v0-food-storefront-app)**

## Development Workflow

Continue building your app on: **[https://v0.app/chat/projects/2cDa2NjOOf9](https://v0.app/chat/projects/2cDa2NjOOf9)**

### How It Works
1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository

## Troubleshooting

### Cart not syncing
- Check Supabase connection in Project Settings
- Verify `SUPABASE_URL` and `SUPABASE_ANON_KEY` are set
- Check browser console for errors

### Payment not working
- Verify `N8N_WEBHOOK_URL` is correctly set
- Check n8n workflow is active
- Verify Xendit API key is valid
- Check browser console for payment errors

### Products not loading
- Verify Supabase connection
- Check if products table has data
- Run database seed scripts if needed

### Modal animation issues
- Clear browser cache
- Check if Tailwind CSS is properly configured
- Verify `globals.css` is imported in layout

## Contributing

This project is built with v0.app. To contribute:
1. Make changes in the v0 chat interface
2. Test changes in the preview
3. Deploy to sync with this repository

## License

This project is created with v0.app and deployed on Vercel.
