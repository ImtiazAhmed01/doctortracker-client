'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  IconMedicalCross,
  IconDoctor,
  IconPatient,
  IconShield,
  IconTrendUp,
  IconBot,
  IconStethoscope,
  IconHospital
} from '@/components/Icons';
import api from '@/lib/api';

const carouselSlides = [
  {
    id: 1,
    tag: 'Healthcare Operations & Governance',
    title: 'Precision Doctor & Patient Roster Management',
    desc: 'Empowering hospital administrators with unified physician directories, categorized patient rosters, real-time analytics, and automated clinical workload tracking.',
    ctaPrimary: 'Access Clinical Portal',
    ctaLink: '/login',
    stat1: '100% HIPAA Aligned',
    stat2: 'Dual JWT & Firebase Security',
    stat3: 'Real-time Analytics'
  },
  {
    id: 2,
    tag: 'Clinical Intelligence',
    title: 'AI-Powered Clinical MedBot Assistant',
    desc: 'Integrated with Google Gemini 1.5 Flash to provide instant query resolution, aggregate caseload lookups, and medical guidelines assistance directly in your workflow.',
    ctaPrimary: 'Explore Capabilities',
    ctaLink: '#features',
    stat1: 'Gemini 1.5 Flash',
    stat2: '<500ms Response',
    stat3: 'Database Context Aware'
  },
  {
    id: 3,
    tag: 'Data Visualization & Insights',
    title: 'Executive Dashboards with Interactive Metrics',
    desc: 'Track admission distributions, doctor-to-patient ratios, diagnostic frequency breakdowns, and month-over-month facility trends in high-clarity visualizations.',
    ctaPrimary: 'View Administration',
    ctaLink: '/login',
    stat1: 'Multi-Chart Analytics',
    stat2: 'Live Aggregation Pipelines',
    stat3: 'Role-Based Protection'
  }
];

export default function HomePage() {
  const { user } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [blogs, setBlogs] = useState([]);
  const [loadingBlogs, setLoadingBlogs] = useState(true);

  // Fetch blogs from MongoDB database via /api/blogs endpoint
  useEffect(() => {
    let isMounted = true;
    api.get('/api/blogs')
      .then((res) => {
        if (isMounted) {
          setBlogs(res.data?.data || []);
        }
      })
      .catch(() => {
        if (isMounted) setBlogs([]);
      })
      .finally(() => {
        if (isMounted) setLoadingBlogs(false);
      });
    return () => { isMounted = false; };
  }, []);

  // Auto-advance carousel every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = carouselSlides[currentSlide];

  return (
    <div className="landing-page">
      {/* ─── Top Navigation Bar ────────────────────────────────────────────── */}
      <header className="landing-nav">
        <Link href="/" className="landing-nav-brand">
          <div className="sidebar-logo-icon" style={{ width: 36, height: 36 }}>
            <IconMedicalCross size={20} />
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', letterSpacing: '-0.3px', lineHeight: 1.2 }}>
              DoctorTracker
            </div>
            <div style={{ fontSize: 10.5, color: 'var(--text-muted)', fontWeight: 500 }}>
              Clinical Administration System
            </div>
          </div>
        </Link>

        <nav className="landing-nav-links">
          <a href="#about" className="landing-nav-link">About System</a>
          <a href="#features" className="landing-nav-link">Core Features</a>
          <a href="#blogs" className="landing-nav-link">Health Insights</a>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {user ? (
            <Link href="/dashboard" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: 13 }}>
              Go to Dashboard &rarr;
            </Link>
          ) : (
            <>
              <Link href="/login" className="btn btn-outline" style={{ padding: '7px 16px', fontSize: 13 }}>
                Sign In
              </Link>
              <Link href="/login?mode=register" className="btn btn-primary" style={{ padding: '7px 18px', fontSize: 13 }}>
                Sign Up &rarr;
              </Link>
            </>
          )}
        </div>
      </header>

      {/* ─── Hero Carousel Header ─────────────────────────────────────────── */}
      <section className="carousel-hero">
        <button
          className="carousel-arrow prev"
          onClick={() => setCurrentSlide((prev) => (prev === 0 ? carouselSlides.length - 1 : prev - 1))}
          aria-label="Previous Slide"
        >
          &#8249;
        </button>

        <div className="carousel-slide" key={slide.id}>
          <div>
            <div className="carousel-tag">
              <IconShield size={12} />
              {slide.tag}
            </div>
            <h1 className="carousel-title">{slide.title}</h1>
            <p className="carousel-desc">{slide.desc}</p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href={user ? '/dashboard' : '/login'} className="btn" style={{ background: '#ffffff', color: '#0369a1', fontWeight: 600, padding: '10px 20px', borderRadius: 8 }}>
                {user ? 'Open Dashboard' : 'Sign In'}
              </Link>
              {!user && (
                <Link href="/login?mode=register" className="btn" style={{ background: 'rgba(255,255,255,0.2)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.4)', fontWeight: 600, padding: '10px 20px', borderRadius: 8 }}>
                  Create Free Account
                </Link>
              )}
              <a href="#about" className="btn" style={{ background: 'transparent', color: '#ffffff', border: '1px solid rgba(255,255,255,0.25)', padding: '10px 18px', borderRadius: 8 }}>
                Explore Platform Overview
              </a>
            </div>
          </div>

          <div>
            <div className="carousel-badge-card">
              <div style={{ fontSize: 11.5, textTransform: 'uppercase', letterSpacing: 0.8, color: 'rgba(255,255,255,0.7)', fontWeight: 600, marginBottom: 12 }}>
                System Telemetry & Guarantees
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <IconDoctor size={18} color="#ffffff" />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{slide.stat1}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)' }}>Hospital-grade administrative controls</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <IconPatient size={18} color="#ffffff" />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{slide.stat2}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)' }}>Encrypted session state & verification</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <IconTrendUp size={18} color="#ffffff" />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{slide.stat3}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)' }}>Recharts-driven operational KPIs</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          className="carousel-arrow next"
          onClick={() => setCurrentSlide((prev) => (prev + 1) % carouselSlides.length)}
          aria-label="Next Slide"
        >
          &#8250;
        </button>

        <div className="carousel-controls">
          {carouselSlides.map((s, index) => (
            <button
              key={s.id}
              className={`carousel-dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* ─── About Section ─────────────────────────────────────────────────── */}
      <section id="about" className="landing-section">
        <div className="section-head-center">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', background: '#e0f2fe', color: '#0369a1', borderRadius: 20, fontSize: 11, fontWeight: 600, marginBottom: 10 }}>
            <IconStethoscope size={13} />
            ABOUT DOCTORTRACKER
          </div>
          <h2>What is DoctorTracker?</h2>
          <p>
            DoctorTracker is an administrative clinical management platform engineered to eliminate friction between healthcare providers, administrative rosters, and patient care workflows. Built with a decoupled Next.js & Node/Express architecture, it gives medical directors complete control over practitioner credentials, patient records, and real-time facility metrics.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-box">
            <div className="feature-icon-wrapper" style={{ background: '#e0f2fe', color: '#0284c7' }}>
              <IconDoctor size={22} />
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: '#0f172a' }}>Doctor Directory</h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Maintain verified practitioner profiles with specialization metadata, affiliated hospital wings, consultation rates, and contact records with multi-criteria regex search.
            </p>
          </div>

          <div className="feature-box">
            <div className="feature-icon-wrapper" style={{ background: '#ccfbf1', color: '#0f766e' }}>
              <IconPatient size={22} />
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: '#0f172a' }}>Patient Registry</h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Organize medical cases with designated primary doctors, triage status tracking (Active, Critical, Discharged), blood group documentation, and condition tracking.
            </p>
          </div>

          <div className="feature-box">
            <div className="feature-icon-wrapper" style={{ background: '#ede9fe', color: '#6d28d9' }}>
              <IconTrendUp size={22} />
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: '#0f172a' }}>Real-time Analytics</h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Monitor operational load through MongoDB aggregation pipelines rendered into responsive Area, Bar, and Pie charts powered by Recharts.
            </p>
          </div>

          <div className="feature-box">
            <div className="feature-icon-wrapper" style={{ background: '#fef3c7', color: '#b45309' }}>
              <IconBot size={22} />
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: '#0f172a' }}>MedBot AI Assistant</h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              On-demand Google Gemini 1.5 Flash conversational assistant integrated directly into the workspace to answer clinical workflow questions and database lookups.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Enterprise Clinical Portal Banner ─────────────────────────────── */}
      <section style={{ background: '#ffffff', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '52px 32px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', background: '#f0fdf4', color: '#166534', borderRadius: 20, fontSize: 11, fontWeight: 600, marginBottom: 8 }}>
              <IconShield size={13} />
              HEALTHCARE ADMINISTRATION
            </div>
            <h3 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>
              Hospital & Clinical Administration Portal
            </h3>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', maxWidth: 620, lineHeight: 1.5 }}>
              Authorized healthcare facility directors, clinical department leads, and administrative coordinators can securely sign in to access physician directories, patient rosters, and analytical dashboards.
            </p>
          </div>

          <div>
            <Link href={user ? '/dashboard' : '/login'} className="btn btn-primary btn-lg" style={{ padding: '12px 24px', fontSize: 14 }}>
              {user ? 'Open Dashboard \u2192' : 'Access Clinical Portal \u2192'}
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Health Blogs Section ──────────────────────────────────────────── */}
      <section id="blogs" className="landing-section">
        <div className="section-head-center">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', background: '#ecfdf5', color: '#047857', borderRadius: 20, fontSize: 11, fontWeight: 600, marginBottom: 10 }}>
            <IconHospital size={13} />
            CLINICAL KNOWLEDGE HUB
          </div>
          <h2>Curated Health Insights & Medical Blogs</h2>
          <p>
            Stay updated with peer-reviewed medical publications, healthcare standards, and wellness research curated from recognized global health organizations.
          </p>
        </div>

        <div className="blogs-grid">
          {loadingBlogs ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
              <div className="spinner spinner-sm" style={{ margin: '0 auto 12px' }} />
              <p>Fetching clinical blogs from database...</p>
            </div>
          ) : blogs.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
              <p>No publications currently in the database. Add documents to the <code>blogs</code> collection.</p>
            </div>
          ) : (
            blogs.map((blog) => (
              <a
                key={blog._id || blog.id}
                href={blog.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="blog-card"
              >
                <div className="blog-img-placeholder" style={{ background: blog.bgGradient || 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' }}>
                  <span className="blog-badge">{blog.category}</span>
                </div>
                <div className="blog-content">
                  <div className="blog-source">
                    <IconShield size={12} />
                    {blog.source}
                  </div>
                  <h3 className="blog-title">{blog.title}</h3>
                  <p className="blog-snippet">{blog.summary}</p>
                  <div className="blog-meta">
                    <span>{blog.date}</span>
                    <span style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>{blog.readTime || '5 min read'} &bull; Read Paper &rarr;</span>
                  </div>
                </div>
              </a>
            ))
          )}
        </div>
      </section>

      {/* ─── Comprehensive Footer ──────────────────────────────────────────── */}
      <footer className="landing-footer">
        <div className="footer-inner">
          <div className="footer-col">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div className="sidebar-logo-icon" style={{ width: 32, height: 32 }}>
                <IconMedicalCross size={18} />
              </div>
              <span style={{ fontSize: 17, fontWeight: 700, color: '#ffffff' }}>DoctorTracker</span>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.6, color: '#94a3b8', maxWidth: 360, marginBottom: 16 }}>
              Enterprise medical administration portal facilitating doctor tracking, patient rosters, clinical telemetry, and AI workflow support.
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 10px', background: '#1e293b', borderRadius: 6, fontSize: 11, color: '#38bdf8' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#38bdf8' }} />
              API Services Operational
            </div>
          </div>

          <div className="footer-col">
            <h4>Platform</h4>
            <ul>
              <li><Link href="/login">Admin Portal</Link></li>
              <li><a href="#about">About System</a></li>
              <li><a href="#features">Features Matrix</a></li>
              <li><a href="#blogs">Health Publications</a></li>
              <li><Link href="/dashboard">Executive Dashboard</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Clinical Resources</h4>
            <ul>
              <li><a href="https://www.who.int" target="_blank" rel="noopener noreferrer">WHO Guidelines</a></li>
              <li><a href="https://www.heart.org" target="_blank" rel="noopener noreferrer">AHA Cardiology</a></li>
              <li><a href="https://diabetes.org" target="_blank" rel="noopener noreferrer">ADA Diabetes Standards</a></li>
              <li><a href="https://www.thelancet.com" target="_blank" rel="noopener noreferrer">The Lancet Publications</a></li>
              <li><a href="https://www.hipaajournal.com" target="_blank" rel="noopener noreferrer">HIPAA Security Journal</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Security & Governance</h4>
            <ul>
              <li><span style={{ color: '#ffffff', fontWeight: 600 }}>Access Control:</span> Role-Based JWT</li>
              <li><span style={{ color: '#ffffff', fontWeight: 600 }}>Database:</span> MongoDB Atlas Distributed</li>
              <li><span style={{ color: '#ffffff', fontWeight: 600 }}>Data Encryption:</span> TLS / HTTPS Enforced</li>
              <li><span style={{ color: '#ffffff', fontWeight: 600 }}>Assistant:</span> Google Gemini 1.5 Flash</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            &copy; 2026 DoctorTracker Healthcare System. Developed by Imtiaz Ahmed. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <span>Privacy Policy</span>
            <span>&bull;</span>
            <span>Terms of Clinical Service</span>
            <span>&bull;</span>
            <span>Security Statement</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
