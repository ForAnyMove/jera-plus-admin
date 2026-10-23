import React, { useState } from 'react';
import { Database, CheckCircle, AlertCircle, RefreshCw, Download, Upload, ExternalLink, ShieldCheck } from 'lucide-react';
import { api } from '../api';

export const SupabaseConfigView = ({ health, onRefresh, content }) => {
  const [seeding, setSeeding] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  const isConnected = health?.supabase === 'connected';

  const handleSeedDatabase = async () => {
    if (!window.confirm('Populate Supabase tables with the complete portfolio catalog (products, services, news, vacancies, settings)?')) return;
    setSeeding(true);
    setStatusMsg({ type: '', text: '' });

    try {
      const data = await api.seedSupabase();
      setStatusMsg({ type: 'success', text: data?.message || 'Database successfully seeded!' });
      onRefresh();
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Seeding failed' });
    } finally {
      setSeeding(false);
    }
  };

  const handleDownloadBackup = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(content, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `jeraplus_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Database & Cloud Synchronization</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>Manage PostgreSQL cloud storage, seed initial catalogs, and download backups</p>
        </div>

        <button onClick={onRefresh} className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <RefreshCw size={14} />
          <span>Refresh Status</span>
        </button>
      </div>

      {statusMsg.text && (
        <div style={{
          background: statusMsg.type === 'success' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
          border: `1px solid ${statusMsg.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
          color: statusMsg.type === 'success' ? '#10b981' : '#ef4444',
          padding: '12px 16px',
          borderRadius: '10px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          {statusMsg.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Cloud Status Card */}
      <div className="stat-card" style={{ flexDirection: 'column', alignItems: 'stretch', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: isConnected ? 'rgba(16, 185, 129, 0.14)' : 'rgba(239, 68, 68, 0.14)',
              color: isConnected ? '#10b981' : '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Database size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '4px' }}>
                {isConnected ? 'Supabase PostgreSQL Cloud Active' : 'Operating in Local Storage Fallback'}
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem' }}>
                {isConnected
                  ? 'Your backend server is authenticated and securely connected to Supabase.'
                  : 'Backend is operating locally. Check server environment variables on Render.'}
              </p>
            </div>
          </div>

          <span className={`status-badge ${isConnected ? 'status-done' : 'status-new'}`} style={{ fontSize: '0.86rem', padding: '6px 14px' }}>
            {isConnected ? 'Live Cloud Connected' : 'Local Fallback Mode'}
          </span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '14px',
          background: 'var(--bg-subtle)',
          padding: '16px',
          borderRadius: '10px',
          border: '1px solid var(--border)'
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Active Products</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>{content?.products?.length || 0}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Services & Logistics</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>{content?.services?.length || 0}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Press Releases</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>{content?.news?.length || 0}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Vacancies</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>{content?.vacancies?.length || 0}</div>
          </div>
        </div>
      </div>

      {/* Database Operations */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        <div className="stat-card" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Upload size={20} color="#0eb0ee" />
            <h4 style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>Initial Seed & Sync</h4>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6 }}>
            Populate clean Supabase tables with initial products, logistics services, press releases, vacancies, and corporate settings.
          </p>
          <button
            onClick={handleSeedDatabase}
            disabled={seeding || !isConnected}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: 'auto' }}
          >
            <span>{seeding ? 'Seeding Database...' : 'Seed Database from Initial Catalog'}</span>
          </button>
        </div>

        <div className="stat-card" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Download size={20} color="#0eb0ee" />
            <h4 style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>Download Backup</h4>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6 }}>
            Export the complete current catalog and configuration state as a standalone JSON backup file to your computer.
          </p>
          <button
            onClick={handleDownloadBackup}
            className="btn btn-secondary"
            style={{ width: '100%', marginTop: 'auto' }}
          >
            <span>Download Full JSON Backup</span>
          </button>
        </div>
      </div>

      {/* Security Architecture Note */}
      <div style={{
        marginTop: '24px',
        background: 'var(--banner-bg)',
        border: '1px solid var(--banner-border)',
        borderLeft: 'var(--banner-border-left)',
        borderRadius: '12px',
        padding: '20px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '14px'
      }}>
        <ShieldCheck size={24} color="#0eb0ee" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div style={{ fontSize: '0.88rem', color: 'var(--banner-desc)', lineHeight: 1.6 }}>
          <strong style={{ color: 'var(--banner-title)' }}>Security Architecture:</strong> Direct writing of database credentials from the browser has been removed for security. All Supabase connections and secrets are managed safely through server environment variables (<code style={{ color: '#0eb0ee' }}>SUPABASE_URL</code> and <code style={{ color: '#0eb0ee' }}>SUPABASE_SERVICE_ROLE_KEY</code>) on your Render dashboard.
        </div>
      </div>
    </div>
  );
};
