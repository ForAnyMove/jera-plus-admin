import React, { useState, useEffect } from 'react';
import { Image, Upload, Trash2, Copy, Check, RefreshCw } from 'lucide-react';
import { api } from '../api';

export const MediaView = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [copiedPath, setCopiedPath] = useState('');

  const loadMedia = async () => {
    try {
      setLoading(true);
      const list = await api.listMedia();
      setFiles(list || []);
    } catch (err) {
      console.warn('Failed to load media:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      await api.uploadMedia(file);
      await loadMedia();
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async (path) => {
    if (!window.confirm('Delete this media file?')) return;
    try {
      await api.deleteMedia(path);
      await loadMedia();
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  const handleCopy = (url, path) => {
    navigator.clipboard.writeText(url);
    setCopiedPath(path);
    setTimeout(() => setCopiedPath(''), 2500);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Media Library & Asset Storage</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>Uploaded commodity photos and press release covers in Supabase Storage</p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <label className="btn btn-primary" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Upload size={16} />
            <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
            <input type="file" accept="image/*" onChange={handleUpload} style={{ display: 'none' }} disabled={uploading} />
          </label>

          <button onClick={loadMedia} disabled={loading} className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <RefreshCw size={14} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {files.length === 0 ? (
        <div className="stat-card" style={{ padding: '60px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Image size={48} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
          <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: '6px' }}>No Media Files Stored Yet</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Upload images using the button above or attach them inside news articles.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
          {files.map((f) => (
            <div key={f.path} className="card-light" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: '160px', overflow: 'hidden', background: '#0b1120', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img
                  src={f.url}
                  alt={f.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <div style={{ padding: '14px', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', wordBreak: 'break-all' }}>
                  {f.name}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  Size: {(f.size / 1024).toFixed(1)} KB
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', paddingTop: '8px', borderTop: '1px solid var(--border)' }}>
                  <button
                    onClick={() => handleCopy(f.url, f.path)}
                    className="btn btn-secondary"
                    style={{ flex: 1, padding: '6px 10px', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                    title="Copy URL to clipboard"
                  >
                    {copiedPath === f.path ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
                    <span>{copiedPath === f.path ? 'Copied!' : 'Copy URL'}</span>
                  </button>

                  <button
                    onClick={() => handleDelete(f.path)}
                    className="btn btn-danger"
                    style={{ padding: '6px 10px' }}
                    title="Delete Image"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
