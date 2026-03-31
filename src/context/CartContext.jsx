import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import {
  getCart,
  addToCart as apiAddToCart,
  updateCartItem as apiUpdateCartItem,
  removeFromCart as apiRemoveFromCart,
  clearCart as apiClearCart,
} from '../services/cartService'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { isLoggedIn } = useAuth()
  const [cartItems, setCartItems] = useState([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [cartId, setCartId] = useState(null)
  const [loading, setLoading] = useState(false)

  const syncCart = useCallback(async () => {
    if (!isLoggedIn) {
      setCartItems([])
      setTotalPrice(0)
      return
    }
    try {
      const data = await getCart()
      setCartItems(data.items || [])
      setTotalPrice(data.totalPrice || 0)
      setCartId(data.cartId || null)
    } catch {
      setCartItems([])
    }
  }, [isLoggedIn])

  useEffect(() => {
    syncCart()
  }, [syncCart])

  const addToCart = useCallback(async (productId, quantity = 1) => {
    setLoading(true)
    try {
      const data = await apiAddToCart(productId, quantity)
      setCartItems(data.items || [])
      setTotalPrice(data.totalPrice || 0)
      setCartId(data.cartId || null)
      return { success: true }
    } catch (err) {
      return { success: false, message: err.message }
    } finally {
      setLoading(false)
    }
  }, [])

  const updateQuantity = useCallback(async (productId, quantity) => {
    setLoading(true)
    try {
      const data = await apiUpdateCartItem(productId, quantity)
      setCartItems(data.items || [])
      setTotalPrice(data.totalPrice || 0)
    } catch (err) {
      console.error('Update qty error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const removeFromCart = useCallback(async (productId) => {
    setLoading(true)
    try {
      const data = await apiRemoveFromCart(productId)
      setCartItems(data.items || [])
      setTotalPrice(data.totalPrice || 0)
    } catch (err) {
      console.error('Remove item error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const clearCart = useCallback(async () => {
    setLoading(true)
    try {
      await apiClearCart()
      setCartItems([])
      setTotalPrice(0)
    } catch (err) {
      console.error('Clear cart error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const cartCount = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0)

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        totalPrice,
        cartId,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        syncCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
