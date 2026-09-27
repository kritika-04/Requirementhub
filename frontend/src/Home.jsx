import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import './Home.css';
import Navbar from "./navbar.jsx";
export default function Home() {
  const navigate = useNavigate();
  

  return (
    <div className="landing-wrapper">
      {/* Navigation */}
      {/* <header className="navbar">
        <Link to="/" className="brand">
          <div className="logo-icon">⚡</div>
          <span className="brand-name">Requirement Hub</span>
        </Link>
        <div className="nav-actions">
          <Link to="/login" className="nav-link">Sign In</Link>
          <Link to="/register" className="btn-nav">Get Started</Link>
        </div>
      </header> */}
      <Navbar/>
      {/* Hero Section */}
      <main className="landing-container">
        <section className="hero">
          <div className="badge">
            {/* <Sparkles size={14} className="sparkle-icon" /> */}
            <span>Next-Gen Requirement Intelligence</span>
          </div>
          
          <h1>
            Turn Messy Transcripts & Docs into <br />
            <span className="gradient-text">Structured Software Specs</span>
          </h1>
          
          <p className="hero-description">
            Requirement Hub ingests raw Zoom meetings, Slack chats, and client
            emails to automatically extract, classify, deduplicate, and resolve
            conflicting software requirements.
          </p>

          <div className="hero-buttons">
            <Link to="/register" className="btn-hero-primary">
              <span>Get Started Free</span>
              {/* <ArrowRight size={16} /> */}
            </Link>
          </div>
        </section>

        {/* Features Grid - NOW CLICKABLE! */}
        <section className="features-grid">
          <div className="feature-card clickable" onClick={() => navigate('/ingest')}>
            <div className="icon-wrapper">
              {/* <FileText size={20} className="feature-icon" /> */}
            </div>
            <h3>Automated Ingestion</h3>
            <p>
              Drop Zoom VTT transcripts, Slack threads, and PDFs to instantly extract
              Epics and User Stories.
            </p>
          </div>

          <div className="feature-card clickable" onClick={() => navigate('/conflicts')}>
            <div className="icon-wrapper">
              {/* <GitMerge size={20} className="feature-icon" /> */}
            </div>
            <h3>Conflict Resolution</h3>
            <p>
              AI surfaces conflicting stakeholder timelines and specs side-by-side with
              semantic diff analysis.
            </p>
          </div>

          <div className="feature-card clickable" onClick={() => navigate('/repository')}>
            <div className="icon-wrapper">
              {/* <Layers size={20} className="feature-icon" /> */}
            </div>
            <h3>Traceable Provenance</h3>
            <p>
              Every requirement links directly to its original transcript snippet so you
              never lose context.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

