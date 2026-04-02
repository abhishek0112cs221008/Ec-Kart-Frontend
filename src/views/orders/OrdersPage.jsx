import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { listOrders } from '../../services/orderService'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import './OrdersPage.css'

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    fetchOrders()
  }, [page])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const data = await listOrders(page, 5)
      setOrders(data.content)
      setTotalPages(data.totalPages)
    } catch (err) {
      setError('Failed to load orders. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const getStatusInfo = (status) => {
    switch (status) {
      case 'PAID': return { label: 'Paid', color: '#10b981', bg: '#ecfdf5' }
      case 'PENDING_PAYMENT': return { label: 'Pending Payment', color: '#f59e0b', bg: '#fffbeb' }
      case 'DELIVERED': return { label: 'Delivered', color: '#3b82f6', bg: '#eff6ff' }
      case 'CANCELLED': return { label: 'Cancelled', color: '#ef4444', bg: '#fef2f2' }
      case 'FAILED': return { label: 'Failed', color: '#ef4444', bg: '#fef2f2' }
      case 'REFUNDED': return { label: 'Refunded', color: '#8b5cf6', bg: '#f5f3ff' }
      default: return { label: status, color: '#64748b', bg: '#f8fafc' }
    }
  }

  return (
    <div className="pallet-shell">
      <Navbar />
      
      <main className="pallet-main">
        <div className="orders-wrapper">
          <div className="orders-container">
            {/* BREADCRUMB */}
            <div className="orders-header-row">
              <div className="orders-breadcrumb">
                <Link to="/">Home</Link> <span>/</span> <Link to="/profile">Account</Link> <span>/</span> My Orders
              </div>
              <h1 className="orders-title">Order History</h1>
            </div>

            <div className="orders-layout">
              {/* SIDEBAR FILTERS */}
              <aside className="orders-sidebar">
                <div className="filter-card">
                  <div className="filter-header">
                    <h3>Filters</h3>
                  </div>
                  <div className="filter-body">
                    <div className="filter-group">
                      <h4>ORDER STATUS</h4>
                      {['On the way', 'Delivered', 'Cancelled', 'Returned'].map(s => (
                        <label key={s} className="checkbox-label">
                          <input type="checkbox" />
                          <span className="checkbox-text">{s}</span>
                        </label>
                      ))}
                    </div>
                    <div className="filter-group">
                      <h4>ORDER TIME</h4>
                      {['Last 30 days', 'Last 6 months', '2023', '2022'].map(t => (
                        <label key={t} className="radio-label">
                          <input type="radio" name="time" />
                          <span className="radio-text">{t}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </aside>

              {/* ORDERS LIST */}
              <div className="orders-main">
                {loading ? (
                  <div className="loading-state">
                    <div className="pallet-spinner"></div>
                    <p>Loading your orders...</p>
                  </div>
                ) : error ? (
                  <div className="error-state">
                    <p>{error}</p>
                    <button onClick={fetchOrders}>Retry</button>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">
                      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4H6z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                    </div>
                    <h2>No orders found</h2>
                    <p>Looks like you haven't placed any orders yet.</p>
                    <Link to="/shop" className="shop-now-btn">Shop Now</Link>
                  </div>
                ) : (
                  <>
                    <div className="orders-list">
                      {orders.map(order => {
                        const sInfo = getStatusInfo(order.status)
                        return (
                          <div key={order.id} className="order-item-card">
                            <div className="order-item-body">
                              {/* PRODUCT PREVIEWS */}
                              <div className="order-previews">
                                {order.itemThumbnails?.slice(0, 3).map((img, idx) => (
                                  <div key={idx} className="preview-img-box">
                                    <img src={img || 'https://via.placeholder.com/80'} alt="Order item" />
                                  </div>
                                ))}
                                {order.itemThumbnails?.length > 3 && (
                                  <div className="preview-more">
                                    +{order.itemThumbnails.length - 3}
                                  </div>
                                )}
                                {(!order.itemThumbnails || order.itemThumbnails.length === 0) && (
                                   <div className="preview-img-box empty">
                                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                                   </div>
                                )}
                              </div>

                              {/* ORDER DETAILS */}
                              <div className="order-info">
                                <div className="info-header">
                                  <span className="order-id">Order ID: #{order.id}</span>
                                  <span className="order-date">Date: {new Date(order.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="order-total-row">
                                  <span className="total-label">Total Amount</span>
                                  <span className="total-value">₹{order.totalAmount.toLocaleString('en-IN')}</span>
                                </div>
                              </div>

                              {/* STATUS & ACTIONS */}
                              <div className="order-status-actions">
                                <span className="status-pill" style={{ color: sInfo.color, backgroundColor: sInfo.bg }}>
                                  <span className="pill-dot" style={{ backgroundColor: sInfo.color }}></span>
                                  {sInfo.label}
                                </span>
                                <Link to={`/orders/${order.id}`} className="details-link">
                                  View Details
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                                </Link>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* PAGINATION */}
                    {totalPages > 1 && (
                      <div className="pagination">
                        <button disabled={page === 0} onClick={() => setPage(page - 1)} className="page-btn">
                          Previous
                        </button>
                        <span className="page-count">Page {page + 1} of {totalPages}</span>
                        <button disabled={page === totalPages - 1} onClick={() => setPage(page + 1)} className="page-btn">
                          Next
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
