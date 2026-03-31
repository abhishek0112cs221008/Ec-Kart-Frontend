import React from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import './PrivacyPolicyPage.css'

export default function PrivacyPolicyPage() {
  const lastUpdated = "March 31, 2026"

  return (
    <div className="pallet-shell">
      <Navbar />
      
      <main className="pallet-main legal-view">
        <div className="legal-container">
          <header className="legal-header">
            <h1>Privacy Policy</h1>
            <p className="last-updated">Last Updated: {lastUpdated}</p>
          </header>

          <section className="legal-section">
            <h2>1. Introduction</h2>
            <p>Welcome to Ec-Kart. We value your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website.</p>
          </section>

          <section className="legal-section">
            <h2>2. Information We Collect</h2>
            <p>When you use our platform, we may collect the following types of information:</p>
            <ul>
              <li><strong>Account Data:</strong> Name, email address, password, and profile information.</li>
              <li><strong>Transaction Data:</strong> Details about payments (processed securely via Stripe) and items you purchase.</li>
              <li><strong>Shipping Data:</strong> Addresses and phone numbers used for delivery.</li>
              <li><strong>Usage Data:</strong> Information about how you interact with our site and products.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>3. How We Use Your Information</h2>
            <p>We use your data to:</p>
            <ul>
              <li>Process and deliver your orders.</li>
              <li>Manage your account and provide customer support.</li>
              <li>Improve our products and overall user experience.</li>
              <li>Send transaction-related communications and marketing updates (with your consent).</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>4. Data Security</h2>
            <p>We implement industry-standard security measures, including encryption and secure socket layer (SSL) technology, to protect your data. Your payment information is handled directly by Stripe and is never stored on our servers.</p>
          </section>

          <section className="legal-section">
            <h2>5. Your Rights</h2>
            <p>You have the right to access, correct, or delete your personal information. You can manage most of this directly through your Account Profile page.</p>
          </section>

          <section className="legal-section">
            <h2>6. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact our support team at support@eckart.com.</p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
