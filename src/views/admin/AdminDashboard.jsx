import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  fetchPendingSellerRequests, approveSellerRequest, rejectSellerRequest,
  createCategory, updateCategory, deleteCategory,
  fetchAllUsers
} from '../../services/adminService'
import './AdminDashboard.css'

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('overview')
  const [data, setData] = useState({ requests: [], categories: [], users: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Modal State
  const [catModal, setCatModal] = useState({ open: false, editing: null, name: '', description: '' })
  const [rejectModal, setRejectModal] = useState({ open: false, requestId: null, reason: '' })

  useEffect(() => {
    loadAllData()
  }, [])

  async function loadAllData() {
    setLoading(true)
    try {
      // We also fetch categories from adminService since it uses the same API but with admin headers if needed, 
      // although categories list is public, we might need more info later.
      const [requests, users, categoriesRes] = await Promise.all([
        fetchPendingSellerRequests(),
        fetchAllUsers(),
        fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/v1/categories`).then(r => r.json())
      ])
      setData({ requests, users, categories: categoriesRes })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Seller Request Actions
  async function handleApprove(id) {
    try {
      await approveSellerRequest(id)
      setSuccess('Seller request approved!')
      loadAllData()
    } catch (err) { setError(err.message) }
  }

  async function handleReject() {
    try {
      await rejectSellerRequest(rejectModal.requestId, rejectModal.reason)
      setSuccess('Seller request rejected.')
      setRejectModal({ open: false, requestId: null, reason: '' })
      loadAllData()
    } catch (err) { setError(err.message) }
  }

  // Category Actions
  async function handleSaveCategory(e) {
    e.preventDefault()
    try {
      const payload = { name: catModal.name, description: catModal.description }
      if (catModal.editing) {
        await updateCategory(catModal.editing.id, payload)
        setSuccess('Category updated!')
      } else {
        await createCategory(payload)
        setSuccess('Category created!')
      }
      setCatModal({ open: false, editing: null, name: '', description: '' })
      loadAllData()
    } catch (err) { setError(err.message) }
  }

  async function handleDeleteCategory(id) {
    if (!window.confirm('Are you sure? This might affect products in this category.')) return
    try {
      await deleteCategory(id)
      setSuccess('Category deleted.')
      loadAllData()
    } catch (err) { setError(err.message) }
  }

  return (
    <div className="admin-shell">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <Link to="/" className="brand-link">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            Ec-Kart <span>Admin</span>
          </Link>
        </div>

        <nav className="admin-nav">
          <button className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            Overview
          </button>
          <button className={`nav-item ${activeTab === 'requests' ? 'active' : ''}`} onClick={() => setActiveTab('requests')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
            Seller Requests {data.requests.length > 0 && <span className="badge">{data.requests.length}</span>}
          </button>
          <button className={`nav-item ${activeTab === 'categories' ? 'active' : ''}`} onClick={() => setActiveTab('categories')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
            Categories
          </button>
          <button className={`nav-item ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            User Directory
          </button>
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <div className="admin-avatar">{user?.firstName?.[0]}</div>
            <div className="admin-user-text">
              <p className="admin-user-name">{user?.firstName} {user?.lastName}</p>
              <p className="admin-user-role">Administrator</p>
            </div>
          </div>
          <button className="admin-logout-btn" onClick={() => { logout(); navigate('/') }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header">
          <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
          <div className="admin-date">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
        </header>

        {error && <div className="admin-alert error">{error} <button onClick={() => setError('')}>✕</button></div>}
        {success && <div className="admin-alert success">{success} <button onClick={() => setSuccess('')}>✕</button></div>}

        {loading ? (
          <div className="admin-loading">
            <div className="loader"></div>
            <p>Gathering intelligence...</p>
          </div>
        ) : (
          <div className="admin-content">
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="admin-overview">
                <div className="stats-grid">
                  <div className="stat-box">
                    <div className="stat-icon users"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
                    <div className="stat-info">
                      <h3>Total Users</h3>
                      <p>{data.users.length}</p>
                    </div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-icon requests"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg></div>
                    <div className="stat-info">
                      <h3>Pending Sellers</h3>
                      <p>{data.requests.length}</p>
                    </div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-icon cats"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/></svg></div>
                    <div className="stat-info">
                      <h3>Categories</h3>
                      <p>{data.categories.length}</p>
                    </div>
                  </div>
                </div>

                <div className="recent-activity">
                  <h2>Recent Platform Activity</h2>
                  <div className="activity-placeholder">
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#e2e8f0" strokeWidth="1.5"><path d="M12 20v-6M9 20v-10M15 20v-2M3 20h18"/></svg>
                    <p>Analytics integration coming soon...</p>
                  </div>
                </div>
              </div>
            )}

            {/* SELLER REQUESTS TAB */}
            {activeTab === 'requests' && (
              <div className="admin-table-card">
                {data.requests.length === 0 ? (
                  <div className="empty-state">No pending seller requests.</div>
                ) : (
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Store Name</th>
                        <th>Documents</th>
                        <th>Reason</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.requests.map(req => (
                        <tr key={req.id}>
                          <td><strong>{req.userEmail}</strong></td>
                          <td>{req.storeName}</td>
                          <td>
                            <a href={req.documentUrl} target="_blank" rel="noreferrer" className="doc-link">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                              View PDF
                            </a>
                          </td>
                          <td><span className="reason-text" title={req.reason}>{req.reason || 'N/A'}</span></td>
                          <td>
                            <div className="btn-group">
                              <button className="approve-btn" onClick={() => handleApprove(req.id)}>Approve</button>
                              <button className="reject-btn" onClick={() => setRejectModal({ open: true, requestId: req.id, reason: '' })}>Reject</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {/* CATEGORIES TAB */}
            {activeTab === 'categories' && (
              <div className="admin-card">
                <div className="card-header">
                  <h2>Categories Management</h2>
                  <button className="add-btn" onClick={() => setCatModal({ open: true, editing: null, name: '', description: '' })}>+ New Category</button>
                </div>
                <div className="cat-grid">
                  {data.categories.map(cat => (
                    <div key={cat.id} className="cat-item">
                      <div className="cat-info">
                        <h3>{cat.name}</h3>
                        <p>{cat.description}</p>
                      </div>
                      <div className="cat-actions">
                        <button onClick={() => setCatModal({ open: true, editing: cat, name: cat.name, description: cat.description })}>Edit</button>
                        <button className="delete" onClick={() => handleDeleteCategory(cat.id)}>Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* USERS TAB */}
            {activeTab === 'users' && (
              <div className="admin-table-card">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.users.map(u => (
                      <tr key={u.id}>
                        <td>{u.firstName} {u.lastName}</td>
                        <td>{u.email}</td>
                        <td><span className={`role-badge ${u.role}`}>{u.role?.replace('ROLE_', '')}</span></td>
                        <td>
                          <span className={`status-pill ${u.enabled ? 'enabled' : 'disabled'}`}>
                            {u.enabled ? 'Verified' : 'Pending'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      {/* CATEGORY MODAL */}
      {catModal.open && (
        <div className="modal-wrapper">
          <div className="admin-modal">
            <h2>{catModal.editing ? 'Edit Category' : 'Add Category'}</h2>
            <form onSubmit={handleSaveCategory}>
              <div className="input-group">
                <label>Category Name</label>
                <input value={catModal.name} onChange={e => setCatModal({ ...catModal, name: e.target.value })} required />
              </div>
              <div className="input-group">
                <label>Description</label>
                <textarea value={catModal.description} onChange={e => setCatModal({ ...catModal, description: e.target.value })} />
              </div>
              <div className="modal-btns">
                <button type="button" className="cancel" onClick={() => setCatModal({ ...catModal, open: false })}>Cancel</button>
                <button type="submit" className="save">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REJECT MODAL */}
      {rejectModal.open && (
        <div className="modal-wrapper">
          <div className="admin-modal">
            <h2>Reject Seller Request</h2>
            <p>Please provide a reason for rejection. This will be sent to the user.</p>
            <textarea 
              placeholder="e.g. Documents are blurry or invalid..." 
              value={rejectModal.reason} 
              onChange={e => setRejectModal({ ...rejectModal, reason: e.target.value })}
              required
              rows={4}
            />
            <div className="modal-btns">
              <button className="cancel" onClick={() => setRejectModal({ open: false, requestId: null, reason: '' })}>Back</button>
              <button className="reject-confirm" onClick={handleReject}>Confirm Rejection</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
