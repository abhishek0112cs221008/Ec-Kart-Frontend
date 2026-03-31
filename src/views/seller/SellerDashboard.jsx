import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  fetchMyProducts, fetchCategories,
  createProduct, updateProduct, deleteProduct,
} from '../../services/sellerService'
import logo from '../../assets/logo.png'
import './SellerDashboard.css'

const EMPTY_FORM = { name: '', description: '', price: '', stock: '', categoryId: '' }

export default function SellerDashboard() {
  const { user, logout, isLoggedIn, refreshUser } = useAuth()

  const navigate = useNavigate()

  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  // Modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null) // null = create mode
  const [form, setForm] = useState(EMPTY_FORM)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const fileInputRef = useRef()

  // Delete confirm
  const [deleteId, setDeleteId] = useState(null)

  // Redirect if not seller
  useEffect(() => {
    if (!isLoggedIn) { navigate('/login'); return }
  }, [isLoggedIn, navigate])

  // Load data
  useEffect(() => {
    Promise.all([fetchMyProducts(), fetchCategories()])
      .then(([prods, cats]) => { setProducts(prods); setCategories(cats) })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  function openCreate() {
    setEditingProduct(null)
    setForm(EMPTY_FORM)
    setImageFile(null)
    setImagePreview(null)
    setModalOpen(true)
  }

  function openEdit(product) {
    setEditingProduct(product)
    setForm({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      stock: product.stock || '',
      categoryId: product.categoryId || '',
    })
    setImageFile(null)
    setImagePreview(product.imageUrl || null)
    setModalOpen(true)
  }

  function handleImageChange(e) {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  function handleFormChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name || !form.price || !form.stock || !form.categoryId) {
      setError('Please fill in all required fields.')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      if (editingProduct) {
        const updated = await updateProduct(editingProduct.id, form, imageFile)
        setProducts(prev => prev.map(p => p.id === updated.id ? updated : p))
        setSuccessMsg('Product updated successfully!')
      } else {
        const created = await createProduct(form, imageFile)
        setProducts(prev => [created, ...prev])
        setSuccessMsg('Product created successfully!')
      }
      setModalOpen(false)
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleRefreshStatus() {
    try {
      setLoading(true)
      await refreshUser()
      setSuccessMsg('Account status refreshed!')
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch (e) {
      setError('Could not refresh status. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {

    if (!deleteId) return
    try {
      await deleteProduct(deleteId)
      setProducts(prev => prev.filter(p => p.id !== deleteId))
      setSuccessMsg('Product deleted.')
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setDeleteId(null)
    }
  }

  const totalRevenue = Array.isArray(products) ? products.reduce((sum, p) => sum + (parseFloat(p.price) || 0) * (p.stock || 0), 0) : 0
  const activeCount = Array.isArray(products) ? products.filter(p => p.active).length : 0


  return (
    <div className="sd-shell">
      {/* SIDEBAR */}
      <aside className="sd-sidebar">
        <div className="sd-logo">
          <Link to="/" style={{ color: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <img src={logo} alt="Ec-Kart Logo" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
            <span style={{ fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.02em' }}>Ec-Kart</span>
          </Link>
        </div>

        <nav className="sd-nav">
          <a className="sd-nav-item active" href="#">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            Dashboard
          </a>
          <a className="sd-nav-item" href="#">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
            Products
          </a>
          <a className="sd-nav-item" href="#">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            Orders
          </a>
          <Link className="sd-nav-item" to="/profile">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            Profile
          </Link>
        </nav>

        <button className="sd-logout" onClick={() => { logout(); navigate('/') }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Logout
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="sd-main">
        {/* Top bar */}
        <header className="sd-topbar">
          <div>
            <h1 className="sd-page-title">Seller Dashboard</h1>
            <p className="sd-page-sub">Welcome back, {user?.firstName || 'Seller'} 👋</p>
          </div>
          <button className="sd-add-btn" onClick={openCreate}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Product
          </button>
        </header>

        {/* Success/Error banners */}
        {successMsg && <div className="sd-banner sd-success">{successMsg}</div>}
        {error && <div className="sd-banner sd-error">{error} <button onClick={() => setError('')}>✕</button></div>}
 
        {/* PENDING VERIFICATION STATE */}
        {user?.role === 'ROLE_SELLER' && !user?.sellerVerified ? (
          <div className="sd-pending-state">
            <div className="pending-card">
              <div className="pending-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M12 9v3l2 2"/>
                </svg>
              </div>
              <h2>Verification Pending</h2>
              <p>Wait for verification within some times or soon</p>
              <div className="pending-hint">
                Our team is currently reviewing your account details. You will be able to manage your store and products as soon as you are verified.
              </div>
              <button className="sd-refresh-btn" onClick={handleRefreshStatus} disabled={loading}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
                {loading ? 'Refreshing...' : 'Refresh Status'}
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Stats */}
        <div className="sd-stats">
          <div className="stat-card">
            <p className="stat-label">Total Products</p>
            <p className="stat-value">{products.length}</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Active Listings</p>
            <p className="stat-value">{activeCount}</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Inventory Value</p>
            <p className="stat-value">₹{totalRevenue.toLocaleString('en-IN')}</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Categories</p>
            <p className="stat-value">{new Set(products.map(p => p.categoryName)).size}</p>
          </div>
        </div>

        {/* Product Table */}
        <div className="sd-table-card">
          <div className="sd-table-header">
            <h2>My Products</h2>
            <span>{products.length} items</span>
          </div>

          {loading ? (
            <div className="sd-loading">
              {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton-row" />)}
            </div>
          ) : products.length === 0 ? (
            <div className="sd-empty">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
              <p>No products yet</p>
              <button className="sd-add-btn" onClick={openCreate}>Add your first product</button>
            </div>
          ) : (
            <table className="sd-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id}>
                    <td>
                      <div className="product-cell">
                        <div className="product-thumb">
                          {product.imageUrl
                            ? <img src={product.imageUrl} alt={product.name} />
                            : <span>{product.name?.slice(0, 1)}</span>}
                        </div>
                        <div>
                          <p className="product-name">{product.name}</p>
                          <p className="product-desc">{product.description?.slice(0, 40)}…</p>
                        </div>
                      </div>
                    </td>
                    <td><span className="cat-badge">{product.categoryName}</span></td>
                    <td><strong>₹{parseFloat(product.price).toLocaleString('en-IN')}</strong></td>
                    <td>{product.stock}</td>
                    <td>
                      <span className={`status-badge ${product.active ? 'active' : 'inactive'}`}>
                        {product.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="action-btns">
                        <button className="edit-btn" onClick={() => openEdit(product)}>Edit</button>
                        <button className="del-btn" onClick={() => setDeleteId(product.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
          </>
        )}
      </main>

      {/* ADD / EDIT MODAL */}
      {modalOpen && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setModalOpen(false) }}>
          <div className="modal-card">
            <div className="modal-header">
              <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button className="modal-close" onClick={() => setModalOpen(false)}>✕</button>
            </div>

            {error && <div className="auth-error" style={{ marginBottom: '1rem' }}>{error}</div>}

            <form className="modal-form" onSubmit={handleSubmit}>
              {/* Image Upload */}
              <div className="image-upload-area" onClick={() => fileInputRef.current.click()}>
                {imagePreview
                  ? <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} />
                  : <>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                      <p>Click to upload product image</p>
                    </>
                }
                <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleImageChange} />
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Product Name *</label>
                  <input name="name" value={form.name} onChange={handleFormChange} placeholder="e.g. Wireless Headphones" required />
                </div>
                <div className="form-group">
                  <label>Category *</label>
                  <select name="categoryId" value={form.categoryId} onChange={handleFormChange} required>
                    <option value="">Select a category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Price (₹) *</label>
                  <input name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleFormChange} placeholder="0.00" required />
                </div>
                <div className="form-group">
                  <label>Stock Quantity *</label>
                  <input name="stock" type="number" min="0" value={form.stock} onChange={handleFormChange} placeholder="0" required />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Description</label>
                  <textarea name="description" value={form.description} onChange={handleFormChange} rows={3} placeholder="Describe your product..." />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-save" disabled={submitting}>
                  {submitting ? 'Saving…' : editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM */}
      {deleteId && (
        <div className="modal-overlay">
          <div className="confirm-card">
            <h2>Delete Product?</h2>
            <p>This action cannot be undone. The product will be permanently removed.</p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="btn-delete-confirm" onClick={handleDelete}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
