import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import {
  getWishlist,
  addToWishlist as apiAddToWishlist,
  removeFromWishlist as apiRemoveFromWishlist,
  clearWishlist as apiClearWishlist,
} from '../services/wishlistService'
import { useAuth } from './AuthContext'

const WishlistContext = createContext(null)

export function WishlistProvider({ children }) {
  const { isLoggedIn } = useAuth()
  const [wishlistItems, setWishlistItems] = useState([])
  const [wishlistId, setWishlistId] = useState(null)
  const [loading, setLoading] = useState(false)

  const syncWishlist = useCallback(async () => {
    if (!isLoggedIn) {
      setWishlistItems([])
      return
    }
    try {
      const data = await getWishlist()
      setWishlistItems(data.products || [])
      setWishlistId(data.wishlistId || null)
    } catch {
      setWishlistItems([])
    }
  }, [isLoggedIn])

  useEffect(() => {
    syncWishlist()
  }, [syncWishlist])

  const addToWishlist = useCallback(async (productId) => {
    setLoading(true)
    try {
      const data = await apiAddToWishlist(productId)
      setWishlistItems(data.products || [])
      setWishlistId(data.wishlistId || null)
      return { success: true }
    } catch (err) {
      return { success: false, message: err.message }
    } finally {
      setLoading(false)
    }
  }, [])

  const removeFromWishlist = useCallback(async (productId) => {
    setLoading(true)
    try {
      const data = await apiRemoveFromWishlist(productId)
      setWishlistItems(data.products || [])
      setWishlistId(data.wishlistId || null)
      return { success: true }
    } catch (err) {
      return { success: false, message: err.message }
    } finally {
      setLoading(false)
    }
  }, [])

  const clearWishlist = useCallback(async () => {
    setLoading(true)
    try {
      await apiClearWishlist()
      setWishlistItems([])
    } catch (err) {
      console.error('Clear wishlist error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const isInWishlist = useCallback(
    (productId) => wishlistItems.some((p) => p.id === productId),
    [wishlistItems]
  )

  const wishlistCount = wishlistItems.length

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistCount,
        wishlistId,
        loading,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        isInWishlist,
        syncWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  return useContext(WishlistContext)
}
