# Ec-Kart Frontend

A premium, high-performance React application for the Ec-Kart e-commerce platform.

## ✨ Highlights
- **Pallet Design Language**: Implements the clean, minimalist, and elite "Pallet" design aesthetic with high-end typography and smooth transitions.
- **Real-time Shopping**: Responsive Cart and Wishlist management powered by **React Context API**.
- **Checkout Flow**: Secure and seamless Stripe redirect and confirmation flow.
- **Product Reviews**: Comprehensive data-driven review system with sentiment analysis.
- **User Dashboard**: Advanced profile management, multi-address support, and order tracking stepper.

## 🛠️ Technology Stack
- **Library**: React 19+
- **Build Tool**: Vite 8+
- **Routing**: React Router DOM 7+
- **State Management**: React Context & Hooks
- **Styling**: Vanilla CSS (Optimized for performance and flexibility)
- **HTTP Client**: Fetch API with custom service wrappers

## 📋 Prerequisites
- **Node.js** (v20 or later)
- **NPM** or **Yarn**

## ⚙️ Setup & Installation

1. **Clone the repository**
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Configure API connection**: (Optional) Update `src/shared/config/api.js` with your backend URL.
4. **Run the application**:
   ```bash
   npm run dev
   ```

## 🗺️ Project Structure
- `src/components` - Shared UI elements (Navbar, Footer, ProductCard).
- `src/views` - Feature-based page components (Shop, Cart, Profile).
- `src/services` - API communication layer.
- `src/context` - Global application state providers.
- `src/shared/config` - Centralized configuration.

## 🛍️ Supported Routes
- `/shop` - Browse all products
- `/cart` - Review and manage purchases
- `/profile` - Personal dashboard
- `/orders` - Order history & tracking
- `/wishlist` - Saved items
