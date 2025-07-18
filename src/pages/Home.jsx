import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; // Import the new CSS file

const Home = () => {
  return (
    <div className="home-container">
      <h1 className="home-title">
        Welcome to <span className="text-blue-600">DiviMate</span>
      </h1>
      <p className="home-subtitle">
        The seamless solution for splitting expenses with friends, family, and colleagues. Track balances, settle debts, and focus on what matters most.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link to="/login">
          <button className="home-cta-button">
            Get Started
          </button>
        </Link>
      </div>
      <div className="home-features-section">
        <h2 className="home-features-title">Features</h2>
        <div className="home-features-grid">
          <div className="home-feature-card">
            <h3 className="home-feature-card-title">Create Groups</h3>
            <p>Easily create groups for trips, households, or any shared expenses.</p>
          </div>
          <div className="home-feature-card">
            <h3 className="home-feature-card-title">Add Expenses</h3>
            <p>Quickly add expenses and specify who paid and how it should be split.</p>
          </div>
          <div className="home-feature-card">
            <h3 className="home-feature-card-title">Track Balances</h3>
            <p>See who owes who at a glance and settle up with ease.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
