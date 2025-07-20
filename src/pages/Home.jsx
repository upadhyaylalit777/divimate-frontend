import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Split expenses with ease using <span className="brand-name">DiviMate</span>
            </h1>
            <p className="hero-subtitle">
              The smart, seamless solution for managing shared expenses with friends, family, and colleagues. 
              Track balances, settle debts instantly, and focus on creating memories—not managing money.
            </p>
            <div className="hero-actions" style={{ display: 'flex', justifyContent: 'center' }}>
              <Link to="/login" className="cta-primary">
                Get Started Free
              </Link>
              {/* <Link to="/demo" className="cta-secondary">
                See How It Works
              </Link> */}
            </div>
            {/* <div className="trust-indicators">
              <span className="trust-text">Trusted by 50,000+ users worldwide</span>
              <div className="trust-badges">
                <span className="badge">🔒 Bank-level Security</span>
                <span className="badge">⚡ Real-time Sync</span>
                <span className="badge">📱 Mobile Ready</span>
              </div>
            </div> */}
          </div>
          <div className="hero-image">
            <img 
              src="https://images.unsplash.com/photo-1539635278303-d4002c07eae3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
              alt="Group of friends enjoying vacation together"
              className="hero-img"
            />
            <div className="hero-overlay">
              <div className="expense-preview">
                <div className="expense-card">
                  <h4>Trip to Goa</h4>
                  <p>4 friends • ₹12,400 total</p>
                  <div className="balance-indicator">
                    <span className="positive">+₹3100</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2 className="section-title">Everything you need to split expenses</h2>
          <p className="section-subtitle">Powerful features designed to make expense sharing effortless</p>
        </div>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3 className="feature-title">Smart Groups</h3>
            <p className="feature-description">
              Create groups for trips, households, or any shared expenses. 
              Add members easily.
            </p>
            <div className="feature-highlight">
              <span>✓ Create groups</span>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h3 className="feature-title">Quick Expense Tracking</h3>
            <p className="feature-description">
              Add expenses in seconds with smart categorization. 
              Split equally.
            </p>
            <div className="feature-highlight">
              <span>✓ Receipt scanning</span>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3 className="feature-title">Real-time Balances</h3>
            <p className="feature-description">
              See who owes what instantly with live balance updates. 
              No more confusion or manual calculations.
            </p>
            <div className="feature-highlight">
              <span>✓ Payment reminders</span>
            </div>
          </div>

          {/* <div className="feature-card">
            <div className="feature-icon">🔄</div>
            <h3 className="feature-title">Easy Settlements</h3>
            <p className="feature-description">
              Settle debts with integrated payment options coming soon !. 
               keep everyone in sync.
            </p>
            <div className="feature-highlight">
              <span>✓ Multiple payment methods</span>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3 className="feature-title">Cross-Platform Sync</h3>
            <p className="feature-description">
              Access your data anywhere with real-time synchronization 
              across all devices and platforms.
            </p>
            <div className="feature-highlight">
              <span>✓ Offline mode available</span>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3 className="feature-title">Expense Analytics</h3>
            <p className="feature-description">
              Understand your spending patterns with detailed reports 
              and insights. Export data anytime.
            </p>
            <div className="feature-highlight">
              <span>✓ PDF/Excel exports</span>
            </div>
          </div> */}
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="testimonial-section">
        <h2 className="section-title">Loved by thousands of users</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="testimonial-rating">⭐⭐⭐⭐⭐</div>
            <p>"DiviMate made our group trip so much easier. No more awkward money conversations!"</p>
            <div className="testimonial-author">
              <strong>Priya S.</strong> • Frequent traveler
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-rating">⭐⭐⭐⭐⭐</div>
            <p>"Perfect for managing household expenses with roommates. Clean interface and reliable."</p>
            <div className="testimonial-author">
              <strong>Rahul M.</strong> • Software Engineer
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-rating">⭐⭐⭐⭐⭐</div>
            <p>"Finally, an expense app that actually works! The real-time sync is fantastic."</p>
            <div className="testimonial-author">
              <strong>Anita K.</strong> • Project Manager
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="final-cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to simplify your shared expenses?</h2>
          <p className="cta-subtitle">Join thousands of users who trust DiviMate for their expense sharing needs</p>
          <Link to="/login" className="cta-primary large">
            Start Free Today
          </Link>
          <p className="cta-note">No credit card required • Free forever plan available</p>
        </div>
      </section>
    </div>
  );
};

export default Home;