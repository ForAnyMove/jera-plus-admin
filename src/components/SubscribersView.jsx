import React, { useState, useEffect } from 'react';
import { Mail, Download, Trash2, RefreshCw } from 'lucide-react';
import { api } from '../api';

export const SubscribersView = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  const loadSubscribers = async () => {
    try {
      setLoading(true);
      const list = await api.getSubscribers();
      setSubscribers(list || []);
    } catch (err) {
      console.warn('Subscribers load error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubscribers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this subscriber?')) return;
    try {
      await api.deleteSubscriber(id);
      loadSubscribers();
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  const handleExportCsv = async () => {
    try {
      setExporting(true);
      await api.downloadSubscribersCsv();
    } catch (err) {
      alert('Export failed: ' + err.message);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Newsletter Subscribers</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>Emails collected via the homepage newsletter subscription box</p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={handleExportCsv}
            disabled={exporting || subscribers.length === 0}
            className="btn btn-secondary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Download size={14} />
            <span>{exporting ? 'Exporting...' : 'Export Subscribers CSV'}</span>
          </button>

          <button onClick={loadSubscribers} disabled={loading} className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <RefreshCw size={14} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {subscribers.length === 0 ? (
        <div className="stat-card" style={{ padding: '60px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Mail size={48} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
          <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: '6px' }}>No Subscribers Yet</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>When visitors subscribe on the website, their emails will appear here.</p>
        </div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Subscriber Email</th>
              <th>Subscribed At</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.map((s) => (
              <tr key={s.id}>
                <td style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                  <a href={`mailto:${s.email}`} style={{ color: '#0eb0ee' }}>
                    {s.email}
                  </a>
                </td>
                <td style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                  {s.created_at ? new Date(s.created_at).toLocaleString() : 'N/A'}
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button onClick={() => handleDelete(s.id)} className="btn btn-danger" style={{ padding: '6px 10px' }} title="Delete">
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
