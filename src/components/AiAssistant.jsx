import { useState, useEffect, useRef } from 'react'
import { summarizeReviews } from '../services/aiService'

/**
 * AiAssistant.jsx
 * Interactive chat-style interface for review summarization.
 */
function AiAssistant({ reviews }) {
  const [messages, setMessages] = useState([
    { 
      role: 'ai', 
      text: "Hello! I'm your Pallet AI assistant. I can analyze recent customer reviews to give you a quick summary of what people are saying about this product. Would you like me to start the analysis?" 
    }
  ])
  const [loading, setLoading] = useState(false)
  const [hasSummarized, setHasSummarized] = useState(false)
  const chatEndRef = useRef(null)

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, loading])

  const handleSummarize = async () => {
    if (loading || !reviews || reviews.length === 0) return

    setLoading(true)
    // Add user message
    setMessages(prev => [...prev, { role: 'user', text: "Yes, please summarize the reviews for me." }])

    try {
      const result = await summarizeReviews(reviews)
      
      if (result) {
        setMessages(prev => [...prev, { 
          role: 'ai', 
          text: result.summary,
          data: result // Store pros/cons/sentiment
        }])
        setHasSummarized(true)
      } else {
        setMessages(prev => [...prev, { 
          role: 'ai', 
          text: "I'm sorry, I couldn't process the reviews at this moment. Please try again later." 
        }])
      }
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'ai', 
        text: "Oops! Something went wrong while connecting to my brain. Please check your connection." 
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="ai-assistant-wrapper">
      <div className="ai-assistant-card">
        <div className="ai-assistant-header">
          <h3>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
            </svg>
            Pallet AI Assistant
          </h3>
          <div className="ai-status-badge">Powered by Llama 3</div>
        </div>

        <div className="chat-window">
          {messages.map((msg, idx) => (
            <div key={idx} className={`chat-message ${msg.role === 'ai' ? 'message-received' : 'message-sent'}`}>
              <div className="message-bubble">
                {msg.text}
                
                {msg.data && (
                  <div className="ai-chat-summary-grid">
                    <div className="chat-col">
                      <h5>Pros</h5>
                      <ul>
                        {msg.data.pros?.slice(0, 3).map((p, i) => <li key={i}>{p}</li>)}
                      </ul>
                    </div>
                    <div className="chat-col">
                      <h5>Cons</h5>
                      <ul>
                        {msg.data.cons?.slice(0, 3).map((c, i) => <li key={i}>{c}</li>)}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="chat-message message-received">
              <div className="message-bubble">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {!hasSummarized && (
          <div className="ai-assistant-footer">
            <button 
              className="btn-ai-trigger" 
              onClick={handleSummarize} 
              disabled={loading || !reviews || reviews.length === 0}
            >
              Analyze {reviews?.length || 0} Reviews
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default AiAssistant
