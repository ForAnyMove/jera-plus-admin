import React from 'react';
import { Package, Briefcase, Newspaper, Mail, Database, ExternalLink, ArrowRight } from 'lucide-react';

export const DashboardView = ({ content, messages, health, onNavigate }) => {
  const productsCount = content?.products?.length || 0;
  const servicesCount = content?.services?.length || 0;
  const newsCount = content?.news?.length || 0;
  const messagesCount = messages?.length || 0;
  const unreadCount = messages?.filter(m => m.status === 'new')?.length || 0;

  const isSupabaseLive = health?.supabase === 'connected';

  return (
    <div>
      {/* Welcome Banner */}
      <div style={{
        background: 'var(--banner-bg)',
        border: '1px solid var(--banner-border)',
        borderLeft: 'var(--banner-border-left)',
        borderRadius: '16px',
        padding: '32px',
        marginBottom: '32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px',
        boxShadow: 'var(--card-shadow)'
      }}>
        <div>
          <span style={{ fontSize: '0.8rem', color: 'var(--banner-tag)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.06em' }}>
            Operations & Content Hub
          </span>
          <h1 style={{ fontSize: '1.8rem', marginTop: '6px', color: 'var(--banner-title)' }}>
            Jera Plus Management Console
          </h1>
          <p style={{ color: 'var(--banner-desc)', fontSize: '0.94rem', marginTop: '4px' }}>
            Real-time management for commodities, services, corporate press releases, and inquiries.
          </p>
        </div>

        <a
          href="http://localhost:3000"
          target="_blank"
          rel="noreferrer"
          className="btn btn-secondary"
          style={{ padding: '10px 18px' }}
        >
          <span>Open Live Website</span>
          <ExternalLink size={16} />
        </a>
      </div>

      {/* Database Status Alert */}
      <div style={{
        background: isSupabaseLive ? 'var(--badge-done-bg)' : 'var(--badge-new-bg)',
        border: `1px solid ${isSupabaseLive ? 'var(--badge-done-border)' : 'var(--badge-new-border)'}`,
        borderRadius: '12px',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '32px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Database size={20} color={isSupabaseLive ? 'var(--badge-done-text)' : 'var(--badge-new-text)'} />
          <div>
            <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.95rem' }}>
              Database Mode: {isSupabaseLive ? 'Supabase PostgreSQL (Connected)' : 'Local JSON Flat-file Mode (Active)'}
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.84rem' }}>
              {isSupabaseLive 
                ? 'Your website and admin panel are synchronized directly with Supabase Cloud.'
                : 'Operating seamlessly with local storage. You can link your Supabase URL & Key in the Supabase tab at any time.'}
            </div>
          </div>
        </div>

        <button
          onClick={() => onNavigate('supabase')}
          className="btn btn-secondary"
          style={{ fontSize: '0.82rem', padding: '8px 16px' }}
        >
          <span>Database Settings</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Metric Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
        marginBottom: '36px'
      }}>
        <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => onNavigate('products')}>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', textTransform: 'uppercase', fontWeight: 600 }}>
              Commodity Products
            </div>
            <div className="stat-value">{productsCount}</div>
          </div>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--metric-products-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--metric-products-color)' }}>
            <Package size={24} />
          </div>
        </div>

        <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => onNavigate('services')}>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', textTransform: 'uppercase', fontWeight: 600 }}>
              Advisory & Logistics
            </div>
            <div className="stat-value">{servicesCount}</div>
          </div>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--metric-services-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--metric-services-color)' }}>
            <Briefcase size={24} />
          </div>
        </div>

        <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => onNavigate('news')}>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', textTransform: 'uppercase', fontWeight: 600 }}>
              Press Releases
            </div>
            <div className="stat-value">{newsCount}</div>
          </div>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--metric-news-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--metric-news-color)' }}>
            <Newspaper size={24} />
          </div>
        </div>

        <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => onNavigate('messages')}>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', textTransform: 'uppercase', fontWeight: 600 }}>
              Client Inquiries
            </div>
            <div className="stat-value" style={{ color: unreadCount > 0 ? 'var(--metric-inbox-color)' : 'var(--text-main)' }}>
              {messagesCount} {unreadCount > 0 && <span style={{ fontSize: '0.9rem', color: 'var(--metric-inbox-color)' }}>({unreadCount} new)</span>}
            </div>
          </div>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--metric-inbox-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--metric-inbox-color)' }}>
            <Mail size={24} />
          </div>
        </div>
      </div>

      {/* Quick Action Cards */}
      <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Quick Operations</h3>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px'
      }}>
        <div
          onClick={() => onNavigate('products')}
          className="stat-card"
          style={{ cursor: 'pointer', flexDirection: 'column', alignItems: 'flex-start', gap: '12px' }}
        >
          <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-main)' }}>
            Update Commodity Specifications
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            Edit technical parameters, add new grades, and adjust pricing categories for LPG, fuel, base oils, and minerals.
          </p>
          <span style={{ color: 'var(--accent)', fontSize: '0.85rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            Manage Products &rarr;
          </span>
        </div>

        <div
          onClick={() => onNavigate('messages')}
          className="stat-card"
          style={{ cursor: 'pointer', flexDirection: 'column', alignItems: 'flex-start', gap: '12px' }}
        >
          <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-main)' }}>
            Review Quotation Inquiries
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            Check messages sent by European clients requesting destination CIF quotes and commodity specifications.
          </p>
          <span style={{ color: 'var(--accent)', fontSize: '0.85rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            Open Client Inbox &rarr;
          </span>
        </div>
      </div>
    </div>
  );
};
