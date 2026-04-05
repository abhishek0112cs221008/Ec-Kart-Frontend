import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import HomePage from './views/home/HomePage'
import LoginPage from './views/auth/LoginPage'
import RegisterPage from './views/auth/RegisterPage'
import SellerDashboard from './views/seller/SellerDashboard'
import AdminDashboard from './views/admin/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import ProductDetailPage from './views/product/ProductDetailPage'
import ShopPage from './views/shop/ShopPage'
import CategoriesPage from './views/categories/CategoriesPage'
import AboutPage from './views/about/AboutPage'
import ProfilePage from './views/profile/ProfilePage'
import CartPage from './views/cart/CartPage'
import WishlistPage from './views/wishlist/WishlistPage'
import CheckoutPage from './views/cart/CheckoutPage'
import PaymentSuccessPage from './views/cart/PaymentSuccessPage'
import PaymentCancelPage from './views/cart/PaymentCancelPage'
import OrdersPage from './views/orders/OrdersPage'
import OrderDetailsPage from './views/orders/OrderDetailsPage'
import PrivacyPolicyPage from './views/legal/PrivacyPolicyPage'
import BottomNavigation from './components/BottomNavigation'
import './App.css'

import ForgotPasswordPage from './views/auth/ForgotPasswordPage'
import ResetPasswordPage from './views/auth/ResetPasswordPage'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route
                path="/seller/dashboard"
                element={
                  <ProtectedRoute role="ROLE_SELLER">
                    <SellerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute role="ROLE_ADMIN">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/cart"
                element={
                  <ProtectedRoute>
                    <CartPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <CheckoutPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payment/success"
                element={<PaymentSuccessPage />}
              />
              <Route
                path="/payment/cancel"
                element={<PaymentCancelPage />}
              />
              <Route
                path="/wishlist"
                element={
                  <ProtectedRoute>
                    <WishlistPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <OrdersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders/:id"
                element={
                  <ProtectedRoute>
                    <OrderDetailsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/privacy-policy"
                element={<PrivacyPolicyPage />}
              />
            </Routes>
            <BottomNavigation />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
