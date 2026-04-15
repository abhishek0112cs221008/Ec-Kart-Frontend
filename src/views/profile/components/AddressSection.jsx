import { useState, useEffect, useCallback } from 'react'
import { fetchAddresses, addAddress, updateAddress, deleteAddress, setDefaultAddress } from '../../../services/addressService'

export default function AddressSection({ setAlert }) {
  const [addresses, setAddresses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    streetAddress: '',
    city: '',
    state: '',
    pinCode: '',
    isDefault: false
  })

  const loadAddresses = useCallback(async () => {
    try {
      const data = await fetchAddresses()
      setAddresses(data)
    } catch (err) {
      setAlert({ type: 'error', msg: 'Could not load addresses.' })
    } finally {
      setLoading(false)
    }
  }, [setAlert])

  useEffect(() => {
    loadAddresses()
  }, [loadAddresses])

  const handleEdit = (addr) => {
    setFormData({ ...addr })
    setEditingId(addr.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this address?')) return
    try {
      await deleteAddress(id)
      loadAddresses()
      setAlert({ type: 'success', msg: 'Address deleted.' })
    } catch (err) {
      setAlert({ type: 'error', msg: err.message })
    }
  }

  const handleSetDefault = async (id) => {
    try {
      await setDefaultAddress(id)
      loadAddresses()
      setAlert({ type: 'success', msg: 'Default address updated.' })
    } catch (err) {
      setAlert({ type: 'error', msg: err.message })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await updateAddress(editingId, formData)
        setAlert({ type: 'success', msg: 'Address updated!' })
      } else {
        await addAddress(formData)
        setAlert({ type: 'success', msg: 'Address added!' })
      }
      setShowForm(false)
      setEditingId(null)
      setFormData({ fullName: '', phoneNumber: '', streetAddress: '', city: '', state: '', pinCode: '', isDefault: false })
      loadAddresses()
    } catch (err) {
      setAlert({ type: 'error', msg: err.message })
    }
  }

  if (loading) return <div className="loader"></div>

  return (
    <div className="profile-section-content animate-fadeIn">
      <div className="section-header">
        <h2>Destinations</h2>
        <button className="add-addr-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Discard' : 'New Destination'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="address-form-card">
          <h3>{editingId ? 'Edit Address' : 'Add Address'}</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>10-digit mobile number</label>
              <input type="tel" value={formData.phoneNumber} onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })} required />
            </div>
          </div>
          <div className="form-group">
            <label>Street Address (Area and Colony)</label>
            <textarea value={formData.streetAddress} onChange={e => setFormData({ ...formData, streetAddress: e.target.value })} required rows={3}/>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>City/District/Town</label>
              <input type="text" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>State</label>
              <input type="text" value={formData.state} onChange={e => setFormData({ ...formData, state: e.target.value })} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Pincode</label>
              <input type="text" value={formData.pinCode} onChange={e => setFormData({ ...formData, pinCode: e.target.value })} required />
            </div>
          </div>
          <div className="form-check">
            <label>
              <input type="checkbox" checked={formData.isDefault} onChange={e => setFormData({ ...formData, isDefault: e.target.checked })} />
              Set as default address
            </label>
          </div>
          <div className="form-actions">
            <button type="submit" className="save-btn">SAVE</button>
          </div>
        </form>
      )}

      <div className="address-list">
        {addresses.map(addr => (
          <div key={addr.id} className={`address-card ${addr.isDefault ? 'default' : ''}`}>
            <div className="addr-meta">
              {addr.isDefault && <span className="default-pill">DEFAULT</span>}
            </div>
            <div className="addr-details">
              <p className="addr-user"><strong>{addr.fullName}</strong> <span>{addr.phoneNumber}</span></p>
              <p className="addr-street">{addr.streetAddress}, {addr.city}, {addr.state} - <strong>{addr.pinCode}</strong></p>
            </div>
            <div className="addr-actions">
              <button className="edit" onClick={() => handleEdit(addr)}>Edit</button>
              <button className="delete" onClick={() => handleDelete(addr.id)}>Delete</button>
              {!addr.isDefault && <button className="set-default" onClick={() => handleSetDefault(addr.id)}>Set Default</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
