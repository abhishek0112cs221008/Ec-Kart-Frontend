import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
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
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
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
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
