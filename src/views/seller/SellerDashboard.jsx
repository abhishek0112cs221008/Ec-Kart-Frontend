import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getApiBaseUrl } from '../../shared/config/api';
import logo from '../../assets/logo.png';
import './SellerDashboard.css';

const BASE = getApiBaseUrl();

const SellerDashboard = () => {
    const { logout, user } = useAuth();
    const token = user?.accessToken;
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState(null);
    const [orders, setOrders] = useState([]);
    const [inventory, setInventory] = useState([]);
    const [profile, setProfile] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(null);

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('add_product'); // add_product, edit_product
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [productForm, setProductForm] = useState({
        name: '',
        description: '',
        price: '',
        floorPrice: '',
        stock: '',
        categoryId: '',
        targetGroup: ''
    });
    const [productImage, setProductImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        if (token) {
            fetchInitialData();
        }
    }, [token]);

    const fetchInitialData = async () => {
        if (!token) return;
        setLoading(true);

        const fetchData = async (url, setter) => {
            try {
                const res = await fetch(url, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setter(data);
                }
            } catch (err) {
                console.error(`Error fetching data:`, err);
            }
        };

        // Run fetches in parallel but independently
        await Promise.all([
            fetchData(`${BASE}/api/v1/seller/dashboard/stats`, setStats),
            fetchData(`${BASE}/api/v1/seller/dashboard/orders`, setOrders),
            fetchData(`${BASE}/api/v1/products/my`, setInventory),
            fetchData(`${BASE}/api/v1/seller/profile`, setProfile),
            fetchData(`${BASE}/api/v1/categories`, setCategories)
        ]);

        setLoading(false);
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        setUpdatingStatus(orderId);
        try {
            const res = await fetch(`${BASE}/api/v1/seller/orders/${orderId}/status?status=${newStatus}`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) fetchInitialData();
        } catch (error) {
            alert("Status update failed");
        } finally {
            setUpdatingStatus(null);
        }
    };

    const handleProductSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', productForm.name);
        formData.append('description', productForm.description);
        formData.append('price', productForm.price);
        formData.append('stock', productForm.stock);
        formData.append('categoryId', productForm.categoryId);
        if (productForm.floorPrice) formData.append('floorPrice', productForm.floorPrice);
        if (productForm.targetGroup) formData.append('targetGroup', productForm.targetGroup);
        if (productImage) formData.append('file', productImage);

        const url = modalType === 'add_product' 
            ? `${BASE}/api/v1/products`
            : `${BASE}/api/v1/products/${selectedProduct.id}`;
        
        try {
            const res = await fetch(url, {
                method: modalType === 'add_product' ? 'POST' : 'PUT',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (res.ok) {
                setImagePreview(null);
                setProductImage(null);
                setShowModal(false);
                fetchInitialData();
            } else {
                const data = await res.json();
                alert(data.message || "Failed to save product");
            }
        } catch (error) {
            alert("Error saving product");
        }
    };

    const handleProductDelete = async (productId) => {
        if (!window.confirm("Are you sure you want to hide/delete this product?")) return;
        try {
            const res = await fetch(`${BASE}/api/v1/products/${productId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) fetchInitialData();
        } catch (error) {
            alert("Deletion failed");
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${BASE}/api/v1/seller/profile`, {
                method: 'PUT',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(profile)
            });
            if (res.ok) alert("Profile updated!");
        } catch (error) {
            alert("Profile update failed");
        }
    };

    const openEditModal = (product) => {
        setSelectedProduct(product);
        setProductForm({
            name: product.name,
            description: product.description,
            price: product.price,
            floorPrice: product.floorPrice || '',
            stock: product.stock,
            categoryId: product.categoryId || '',
            targetGroup: product.targetGroup || ''
        });
        setImagePreview(product.imageUrl); 
        setModalType('edit_product');
        setShowModal(true);
    };

    if (loading && !stats) {
        return <div className="loading-screen"><div className="loader"></div></div>;
    }

    return (
        <div className="seller-dashboard-shell">
            <aside className="dashboard-sidebar">
                <div className="sidebar-logo" onClick={() => navigate('/')} title="Go to Store">
                    <img src={logo} alt="Logo" className="logo-image" />
                </div>
                <div className="sidebar-brand">Merchant Portal</div>
                <nav className="sidebar-nav">
                    <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>Overview</button>
                    <button className={activeTab === 'inventory' ? 'active' : ''} onClick={() => setActiveTab('inventory')}>Inventory</button>
                    <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>Orders</button>
                    <button className={activeTab === 'profile' ? 'active' : ''} onClick={() => setActiveTab('profile')}>Profile</button>
                    <button className={activeTab === 'settings' ? 'active' : ''} onClick={() => setActiveTab('settings')}>Settings</button>
                </nav>
                <div className="sidebar-footer">
                   <p>{user?.firstName} {user?.lastName}</p>
                   <small>{profile?.storeName || 'My Store'}</small>
                   <button className="btn-back-store" onClick={() => navigate('/')}>← Back to Store</button>
                </div>
            </aside>

            <main className="dashboard-main">
                <header className="main-header">
                    <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
                    {activeTab === 'inventory' && (
                        <button className="btn-primary" onClick={() => { setModalType('add_product'); setProductForm({name:'', description:'', price:'', stock:'', categoryId:''}); setShowModal(true); }}>
                            Add New Product
                        </button>
                    )}
                </header>

                <div className="tab-content anim-fade-in">
                    {activeTab === 'overview' && (
                        stats ? (
                            <div className="overview-grid">
                                <div className="metric-box">
                                    <label>Total Revenue</label>
                                    <h3>₹{stats.totalRevenue.toLocaleString()}</h3>
                                </div>
                                <div className="metric-box">
                                    <label>Orders</label>
                                    <h3>{stats.totalOrders}</h3>
                                </div>
                                <div className="metric-box">
                                    <label>Products</label>
                                    <h3>{stats.activeProducts}</h3>
                                </div>
                                <div className="status-chart">
                                    <h4>Orders by Status</h4>
                                    <div className="status-bars">
                                        {Object.entries(stats.ordersByStatus || {}).length > 0 ? (
                                            Object.entries(stats.ordersByStatus).map(([s, c]) => (
                                                <div key={s} className="bar-row">
                                                    <span>{s}</span>
                                                    <div className="bar-bg"><div className="bar-fill" style={{ width: `${stats.totalOrders > 0 ? (c/stats.totalOrders)*100 : 0}%` }}></div></div>
                                                    <small>{c}</small>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="empty-text">No status data available.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="empty-state-card">
                                <p>Loading business insights or no data found.</p>
                            </div>
                        )
                    )}

                    {activeTab === 'inventory' && (
                        <div className="inventory-view">
                            {inventory.length > 0 ? (
                                <table className="brutalist-table">
                                    <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th>Price</th>
                                            <th>Stock</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {inventory.map(p => (
                                            <tr key={p.id}>
                                                <td className="product-cell">
                                                    <img src={p.imageUrl || 'https://via.placeholder.com/50'} alt="" />
                                                    <div>
                                                        <strong>{p.name}</strong>
                                                        <small>{p.categoryName}</small>
                                                    </div>
                                                </td>
                                                <td>₹{p.price}</td>
                                                <td>{p.stock}</td>
                                                <td><span className={`badge ${p.active ? 'active' : 'hidden'}`}>{p.active ? 'Active' : 'Hidden'}</span></td>
                                                <td>
                                                    <button className="btn-icon" onClick={() => openEditModal(p)}>Edit</button>
                                                    <button className="btn-icon delete" onClick={() => handleProductDelete(p.id)}>Hide</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="empty-state-card">
                                    <p>No products in your inventory. Add your first item to start selling!</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'orders' && (
                        <div className="orders-view">
                            <table className="brutalist-table">
                                <thead>
                                    <tr>
                                        <th>Order Info</th>
                                        <th>Customer</th>
                                        <th>Quantity</th>
                                        <th>Total</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map(o => (
                                        <tr key={o.orderId}>
                                            <td>#{o.orderId}<br/><small>{o.productTitle}</small></td>
                                            <td>{o.customerName}<br/><small>{o.shippingAddress}</small></td>
                                            <td>{o.quantity}</td>
                                            <td>₹{o.price.toLocaleString()}</td>
                                            <td>
                                                <select value={o.status} onChange={(e) => handleStatusUpdate(o.orderId, e.target.value)}>
                                                    <option value="CREATED">Created</option>
                                                    <option value="PROCESSING">Processing</option>
                                                    <option value="SHIPPED">Shipped</option>
                                                    <option value="DELIVERED">Delivered</option>
                                                    <option value="CANCELLED">Cancelled</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'profile' && profile && (
                        <form className="profile-form brutalist-form" onSubmit={handleProfileUpdate}>
                            <div className="form-group">
                                <label>Store Name</label>
                                <input type="text" value={profile.storeName} onChange={(e) => setProfile({...profile, storeName: e.target.value})} />
                            </div>
                            <div className="form-group">
                                <label>Business Bio</label>
                                <textarea value={profile.bio || ''} onChange={(e) => setProfile({...profile, bio: e.target.value})} placeholder="Tell customers about your store..." />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Contact Email</label>
                                    <input type="email" value={profile.contactEmail || ''} onChange={(e) => setProfile({...profile, contactEmail: e.target.value})} />
                                </div>
                                <div className="form-group">
                                    <label>Contact Phone</label>
                                    <input type="text" value={profile.contactPhone || ''} onChange={(e) => setProfile({...profile, contactPhone: e.target.value})} />
                                </div>
                            </div>
                            <button type="submit" className="btn-primary">Save Changes</button>
                        </form>
                    )}

                    {activeTab === 'settings' && (
                        <div className="settings-view">
                            <div className="settings-card brutalist-card">
                                <h4>Account & Security</h4>
                                <p>Manage your account settings and merchant preferences.</p>
                                <button className="btn-secondary" onClick={logout}>Sign Out of Merchant Portrait</button>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* PRODUCT MODAL */}
            {showModal && (
                <div className="modal-overlay anim-fade-in">
                    <div className="modal-content brutalist-card">
                        <header>
                            <h3>{modalType === 'add_product' ? 'New Product' : 'Edit Product'}</h3>
                            <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
                        </header>
                        <form onSubmit={handleProductSubmit}>
                            <div className="form-group">
                                <label>Product Name</label>
                                <input required type="text" value={productForm.name} onChange={(e) => setProductForm({...productForm, name: e.target.value})} />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea required value={productForm.description} onChange={(e) => setProductForm({...productForm, description: e.target.value})} />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Price (₹)</label>
                                    <input required type="number" value={productForm.price} onChange={(e) => setProductForm({...productForm, price: e.target.value})} />
                                </div>
                                <div className="form-group">
                                    <label>Stock</label>
                                    <input required type="number" value={productForm.stock} onChange={(e) => setProductForm({...productForm, stock: e.target.value})} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Category</label>
                                <select required value={productForm.categoryId} onChange={(e) => setProductForm({...productForm, categoryId: e.target.value})}>
                                    <option value="">Select Category</option>
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Min. AI Price (₹) <span className="floor-hint">AI won't go below this</span></label>
                                    <input 
                                        type="number" 
                                        placeholder="e.g. 850" 
                                        value={productForm.floorPrice} 
                                        onChange={(e) => setProductForm({...productForm, floorPrice: e.target.value})} 
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Target Audience</label>
                                    <select value={productForm.targetGroup} onChange={(e) => setProductForm({...productForm, targetGroup: e.target.value})}>
                                        <option value="">Select Audience</option>
                                        <option value="all">All / Unisex</option>
                                        <option value="men">Men</option>
                                        <option value="women">Women</option>
                                        <option value="boys">Boys</option>
                                        <option value="girls">Girls</option>
                                        <option value="kids">Kids (Boys & Girls)</option>
                                        <option value="children">Children (0–12 yrs)</option>
                                        <option value="teens">Teens</option>
                                        <option value="elderly">Elderly</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Product Image</label>
                                <div className="image-upload-wrapper">
                                    <input 
                                        type="file" 
                                        id="product-image-upload" 
                                        hidden 
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                setProductImage(file);
                                                setImagePreview(URL.createObjectURL(file));
                                            }
                                        }} 
                                    />
                                    <label htmlFor="product-image-upload" className="drop-zone">
                                        {imagePreview ? (
                                            <div className="image-preview-container">
                                                <img src={imagePreview} alt="Preview" />
                                                <div className="change-overlay">Click to change</div>
                                            </div>
                                        ) : (
                                            <div className="upload-placeholder">
                                                <span className="icon">📸</span>
                                                <span>Click or Drag to upload product image</span>
                                            </div>
                                        )}
                                    </label>
                                </div>
                            </div>
                            <div className="modal-actions">
                                <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn-primary">
                                    {modalType === 'add_product' ? 'Create Product' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SellerDashboard;
