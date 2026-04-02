import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { negotiatePrice } from '../services/negotiationService'
import { useCart } from '../context/CartContext'
import './PriceNegotiator.css'

function PriceNegotiator({ isOpen, onClose, product, onAcceptPrice }) {
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: `Hi! I'm your Personal Deal assistant. I see you're eyeing the '${product.name}'. Want to skip the listed price and make a direct offer?` 
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [expiryTimer, setExpiryTimer] = useState(null)
  const [offerAccepted, setOfferAccepted] = useState(false)
  const [finalPrice, setFinalPrice] = useState(null)
  // Animation state
  const [isSuccessVisible, setIsSuccessVisible] = useState(false)
  
  const chatEndRef = useRef(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    let interval;
    if (expiryTimer) {
      interval = setInterval(() => {
        const now = new Date().getTime();
        const distance = expiryTimer - now;
        if (distance < 0) {
          clearInterval(interval);
          setExpiryTimer(null);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [expiryTimer]);

  const formatTime = (time) => {
    const distance = time - new Date().getTime();
    if (distance < 0) return "Expired";
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  }

  const negotiationChips = [
    { label: '5% off?', val: 'Can I get a 5% discount?' },
    { label: '10% off?', val: 'Is a 10% discount possible?' },
    { label: 'Best Price?', val: "What's the absolute lowest price you can do?" },
  ]

  const infoChips = [
    { label: 'Quality Check', val: 'Tell me about the quality of this item.' },
    { label: 'Delivery Time', val: 'How long will it take to arrive?' },
    { label: 'Return Policy', val: 'What is the return policy for this product?' },
  ]

  const handleSendMessage = async (msgText) => {
    const text = msgText || input
    if (!text.trim()) return

    const userMsg = { role: 'user', content: text }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }))
      const data = await negotiatePrice(product.id, text, history)
      
      const assistantMsg = { role: 'assistant', content: data.response }
      setMessages(prev => [...prev, assistantMsg])

      if (data.accepted) {
        setOfferAccepted(true)
        setFinalPrice(data.finalPrice)
        setExpiryTimer(new Date().getTime() + 24 * 60 * 60 * 1000)
        
        setTimeout(() => {
          setIsSuccessVisible(true)
          onAcceptPrice(data.finalPrice)
        }, 800)
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connecting... Please try again in a moment!' }])
    } finally {
      setLoading(false)
    }
  }

  const handleDirectAdd = async () => {
    if (!finalPrice) return
    const res = await addToCart(product.id, 1)
    if (res.success) {
      navigate('/cart')
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="negotiator-glass-overlay">
      <div className={`negotiator-glass-modal ${isSuccessVisible ? 'success-mode' : ''} animate-scaleIn`}>
        
        <header className="nego-glass-header">
           <div className="nego-header-brand">
              <div className="bot-orb">
                 <div className="orb-inner" />
              </div>
              <div className="nego-titles">
                 <h3>Deal Negotiator</h3>
                 <span className="nego-status">
                   {expiryTimer ? `Locked in! Expires in: ${formatTime(expiryTimer)}` : 'AI • Live Concierge'}
                 </span>
              </div>
           </div>
           <button className="nego-close" onClick={onClose} aria-label="Close">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
           </button>
        </header>

        <div className="nego-glass-body">
          <div className="nego-product-context">
              <img src={product.imageUrl} alt="" className="context-img" />
              <div className="context-txt">
                 <p className="context-name">{product.name}</p>
                 <div className="context-price-row">
                    <span className="listed-label">Listed: ₹{product.price?.toLocaleString('en-IN')}</span>
                    {finalPrice && <span className="offered-label">Deal: ₹{finalPrice.toLocaleString('en-IN')}</span>}
                 </div>
              </div>
          </div>

          <div className="nego-messages-wrap">
            {messages.map((m, i) => (
              <div key={i} className={`nego-bubble-group ${m.role}`}>
                 {m.role === 'assistant' && <div className="bot-dot" />}
                 <div className="nego-bubble">
                    {m.content}
                 </div>
              </div>
            ))}
            {loading && (
              <div className="nego-bubble-group assistant">
                <div className="bot-dot" />
                <div className="nego-typing">
                   <div className="dot" /><div className="dot" /><div className="dot" />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </div>

        <footer className="nego-glass-footer">
          {offerAccepted ? (
            <div className="nego-success-actions animate-fadeInUp">
               <div className="success-banner">
                  <span className="party-icon">🎉</span>
                  <p>Offer Accepted! This deal is active for 24h.</p>
               </div>
               <div className="action-button-row">
                  <button className="btn-direct-add" onClick={handleDirectAdd}>
                     Add to Bag at ₹{finalPrice?.toLocaleString('en-IN')}
                  </button>
                  <button className="btn-renego" onClick={() => { setOfferAccepted(false); setIsSuccessVisible(false); }}>
                     Try for more?
                  </button>
               </div>
            </div>
          ) : (
            <>
              <div className="nego-shortcuts">
                 <div className="shortcut-row">
                    {negotiationChips.map((c, i) => (
                      <button key={i} className="glass-chip" onClick={() => handleSendMessage(c.val)} disabled={loading}>
                        {c.label}
                      </button>
                    ))}
                 </div>
                 <div className="shortcut-row">
                    {infoChips.map((c, i) => (
                      <button key={i} className="glass-chip info" onClick={() => handleSendMessage(c.val)} disabled={loading}>
                        {c.label}
                      </button>
                    ))}
                 </div>
              </div>
              
              <form className="nego-input-area" onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}>
                <input 
                  type="text" 
                  placeholder="Make your offer..." 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={loading}
                />
                <button type="submit" className="nego-send" disabled={!input.trim() || loading}>
                   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                </button>
              </form>
            </>
          )}
        </footer>
      </div>
    </div>
  )
}

export default PriceNegotiator
