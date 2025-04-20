'use client';

import Link from "next/link";
import { useAuth } from '@/lib/firebase/auth-context';

export default function Home() {
  const { user } = useAuth();
  
  return (
    <div>
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div>
              <h1 className="logo">Docsyde</h1>
            </div>
            <div className="nav-links">
              {user ? (
                <Link href="/dashboard" className="button button-primary">
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/auth" className="link">
                    Sign In
                  </Link>
                  <Link href="/auth?mode=signup" className="button button-primary">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-container">
            <div className="hero-content">
              <h2 className="hero-title">
                Collaborate on documents
                <span>in real time</span>
              </h2>
              <p className="hero-subtitle">
                A powerful document editing platform designed for teams. Create, edit, and share documents securely with your team members and clients.
              </p>
              <div className="hero-buttons">
                {!user ? (
                  <>
                    <Link href="/auth?mode=signup" className="button button-primary">
                      Get started for free
                    </Link>
                    <a href="#features" className="button button-secondary">
                      Learn more
                    </a>
                  </>
                ) : (
                  <Link href="/dashboard" className="button button-primary">
                    Go to Dashboard
                  </Link>
                )}
              </div>
            </div>
            <div className="hero-image">
              <div style={{ width: '100%', height: '320px', background: 'var(--primary)', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 25px rgba(79, 70, 229, 0.15)' }}>
                <svg style={{ width: '128px', height: '128px', color: 'white' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="feature-section">
        <div className="container">
          <div className="section-title">
            <h3>Features</h3>
            <h2>
              Everything you need for document collaboration
            </h2>
            <p>
              Our platform provides all the tools you need for seamless document collaboration.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
              </div>
              <h3 className="feature-title">Real-time Collaboration</h3>
              <p>
                Edit documents simultaneously with your team members. See changes as they happen in real-time, eliminating version conflicts.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="feature-title">Secure Storage</h3>
              <p>
                Your documents are encrypted and securely stored in the cloud, accessible only to authorized team members.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </div>
              <h3 className="feature-title">Easy Sharing</h3>
              <p>
                Share documents with anyone, with customizable permission levels. Control who can view, edit, or comment on your documents.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="feature-title">Version History</h3>
              <p>
                Track changes and revert to previous versions at any time. Never lose important edits or content with our robust history tracking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">
              Ready to get started?
            </h2>
            <p className="cta-description">
              Join thousands of professionals who trust Docsyde for their document collaboration needs.
            </p>
            {!user ? (
              <Link href="/auth?mode=signup" className="cta-button">
                Sign up for free
              </Link>
            ) : (
              <Link href="/dashboard" className="cta-button">
                Go to dashboard
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>
            &copy; {new Date().getFullYear()} Docsyde. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
