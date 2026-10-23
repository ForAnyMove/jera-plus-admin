import React, { useState } from 'react';
import { Mail, Send, Download, Trash2 } from 'lucide-react';
import { api } from '../api';

export const MessagesView = ({ messages, onRefresh }) => {
  const [filter, setFilter] = useState('all');
  const [exporting, setExporting] = useState(false);

  const filtered = (messages || []).filter((m) => {
    if (filter === 'all') return true;
    return m.status === filter;
  });

  const handleToggleStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'completed' ? 'new' : 'completed';
    try {
      await api.updateMessageStatus(id, nextStatus);
      onRefresh();
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      await api.deleteMessage(id);
      onRefresh();
    } catch (err) {
      alert('Failed to delete message: ' + err.message);
    }
  };

  const handleExportCsv = async () => {
    try {
      setExporting(true);
      await api.downloadMessagesCsv();
    } catch (err) {
      alert('Failed to export CSV: ' + err.message);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Client Inquiries & Quotation Desk</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>Submissions received via website contact forms and quote requests</p>
        </div>

        {/* Actions & Filters */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={handleExportCsv}
            disabled={exporting || (messages || []).length === 0}
            className="btn btn-secondary"
            style={{ padding: '6px 14px', fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            title="Export all inquiries to CSV"
          >
            <Download size={14} />
            <span>{exporting ? 'Exporting...' : 'Export CSV'}</span>
          </button>

          <button
            onClick={() => setFilter('all')}
            className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '6px 14px', fontSize: '0.82rem' }}
          >
            All ({(messages || []).length})
          </button>
          <button
            onClick={() => setFilter('new')}
            className={`btn ${filter === 'new' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '6px 14px', fontSize: '0.82rem' }}
          >
            New ({(messages || []).filter(m => m.status === 'new').length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`btn ${filter === 'completed' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '6px 14px', fontSize: '0.82rem' }}
          >
            Processed ({(messages || []).filter(m => m.status === 'completed').length})
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="stat-card" style={{ padding: '60px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Mail size={48} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
          <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: '6px' }}>No Inquiries in this view</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>When clients request quotes on the website, they will appear here in real time.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filtered.map((msg) => (
            <div
              key={msg.id}
              className="stat-card"
              style={{
                alignItems: 'flex-start',
                flexDirection: 'column',
                gap: '16px',
                borderLeft: msg.status === 'new' ? '4px solid #0eb0ee' : '4px solid #10b981'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>{msg.name}</span>
                    <span className={`status-badge ${msg.status === 'completed' ? 'status-done' : 'status-new'}`}>
                      {msg.status === 'completed' ? 'Processed' : 'New Lead'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <span>🏢 {msg.company || 'Private'}</span>
                    <span>✉️ <a href={`mailto:${msg.email}`} style={{ color: '#0eb0ee' }}>{msg.email}</a></span>
                    {msg.phone && <span>📞 {msg.phone}</span>}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={() => handleToggleStatus(msg.id, msg.status)}
                    className="btn btn-secondary"
                    style={{ fontSize: '0.82rem', padding: '6px 14px' }}
                  >
                    {msg.status === 'completed' ? 'Mark as New' : 'Mark as Processed'}
                  </button>

                  <a
                    href={`mailto:${msg.email}?subject=Re: Inquiry regarding ${encodeURIComponent(msg.project || 'Jera Plus Trading')}`}
                    className="btn btn-primary"
                    style={{ fontSize: '0.82rem', padding: '6px 14px' }}
                  >
                    <Send size={13} />
                    <span>Reply by Email</span>
                  </a>

                  <button
                    onClick={() => handleDelete(msg.id)}
                    className="btn btn-danger"
                    style={{ padding: '6px 10px' }}
                    title="Delete Inquiry"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {msg.project && (
                <div style={{ background: 'rgba(245, 158, 11, 0.08)', padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                  <strong>Commodity / Project Scope:</strong> {msg.project}
                </div>
              )}

              <div style={{ background: 'var(--bg-subtle)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border)', width: '100%', color: 'var(--text-main)', fontSize: '0.92rem', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                {msg.message}
              </div>

              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Received on: {new Date(msg.created_at).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
