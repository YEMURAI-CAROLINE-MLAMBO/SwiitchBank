import React from 'react';
import './AboutUsPage.css';

const AboutUsPage = () => {
  return (
    <div className="about-us-container">
      <header className="about-us-header">
        <h1>About SwiitchBank</h1>
        <p className="subtitle">Anywhere, Anytime.</p>
      </header>

      <section className="about-us-section">
        <h2>Our Vision</h2>
        <p>
          To be the world's most intelligent and intuitive financial platform, empowering individuals and businesses to thrive in the global digital economy.
        </p>
        <p>
          We envision a future where finance is not a barrier but a catalyst for opportunity. A world where everyone, regardless of their location or financial standing, has access to sophisticated financial tools that are simple, transparent, and personalized.
        </p>
      </section>

      <section className="about-us-section">
        <h2>Our Mission</h2>
        <p>
          Our mission is to provide a seamless, intelligent, and universally accessible financial experience that empowers our users to manage, grow, and connect their wealth across the global economy.
        </p>
      </section>

      <section className="about-us-section">
        <h2>What Makes Us Different</h2>
        <div className="differentiators">
          <div className="differentiator-item">
            <h3>AI-Powered Insights</h3>
            <p>Our advanced AI, Sophia-2, provides deep transaction analysis and personalized financial advice in real-time.</p>
          </div>
          <div className="differentiator-item">
            <h3>Seamless Crypto-Fiat Exchange</h3>
            <p>Instantly convert between fiat currencies and top-tier cryptocurrencies with our bidirectional exchange.</p>
          </div>
          <div className="differentiator-item">
            <h3>Global Financial Control</h3>
            <p>Manage multi-currency accounts and access peer-to-peer lending, all from a single, unified platform.</p>
          </div>
        </div>
      </section>

      <section className="about-us-section">
        <h2>Our Core Values</h2>
        <div className="core-values">
          <div className="core-value-item">
            <div className="value-title">Innovative</div>
            <p>We are relentless in our pursuit of technological advancement to build a smarter financial future.</p>
          </div>
          <div className="core-value-item">
            <div className="value-title">Bold</div>
            <p>We are not afraid to challenge the status quo and push the boundaries of what's possible in finance.</p>
          </div>
          <div className="core-value-item">
            <div className="value-title">True</div>
            <p>We are committed to transparency, security, and the trust of our users. Your financial well-being is our priority.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;
