import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, Calendar, Upload } from 'lucide-react';
import { api } from '../api';

export const NewsView = ({ news, onRefresh }) => {
  const [editingArticle, setEditingArticle] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleCreate = () => {
    setIsNew(true);
    setEditingArticle({
      slug: 'news-' + Date.now(),
      title_en: '',
      title_ru: '',
      excerpt_en: '',
      excerpt_ru: '',
      content_en: '',
      content_ru: '',
      published_at: new Date().toISOString().split('T')[0],
      image_url: '/images/news/6261805183cc40193bdc944d2d97cae3.jpeg',
      is_published: true
    });
  };

  const handleEdit = (item) => {
    setIsNew(false);
    setEditingArticle(JSON.parse(JSON.stringify(item)));
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this news release?')) return;
    try {
      await api.deleteNews(id);
      onRefresh();
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const data = await api.uploadMedia(file);
      if (data?.url) {
        setEditingArticle({ ...editingArticle, image_url: data.url });
      }
    } catch (err) {
      alert('Upload error: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isNew) {
        await api.createNews(editingArticle);
      } else {
        await api.updateNews(editingArticle.id, editingArticle);
      }
      setEditingArticle(null);
      onRefresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Corporate News & Press Releases</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>Publish announcements, exhibition reports, and partnership news</p>
        </div>
        <button onClick={handleCreate} className="btn btn-primary">
          <Plus size={16} />
          <span>New Press Release</span>
        </button>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th style={{ width: '80px' }}>Cover</th>
            <th>Title (EN / RU)</th>
            <th>Date</th>
            <th>Status</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {news.map((item) => (
            <tr key={item.id}>
              <td>
                <img
                  src={item.image_url || '/images/bn_1.jpg'}
                  alt=""
                  style={{ width: '60px', height: '42px', objectFit: 'cover', borderRadius: '6px' }}
                />
              </td>
              <td>
                <div style={{ fontWeight: 600, color: 'var(--text-main)', maxWidth: '480px' }}>{item.title_en}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', maxWidth: '480px' }}>{item.title_ru}</div>
              </td>
              <td style={{ color: '#0eb0ee', fontSize: '0.88rem', whiteSpace: 'nowrap' }}>
                {item.published_at}
              </td>
              <td>
                <span className={`status-badge ${item.is_published ? 'status-done' : 'status-new'}`}>
                  {item.is_published ? 'Published' : 'Draft'}
                </span>
              </td>
              <td style={{ textAlign: 'right' }}>
                <div style={{ display: 'inline-flex', gap: '8px' }}>
                  <button onClick={() => handleEdit(item)} className="btn btn-secondary" style={{ padding: '6px 10px' }} title="Edit">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="btn btn-danger" style={{ padding: '6px 10px' }} title="Delete">
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Editor */}
      {editingArticle && (
        <div className="modal-overlay" onClick={() => setEditingArticle(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setEditingArticle(null)}
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.4rem', marginBottom: '20px' }}>
              {isNew ? 'Create Press Release' : `Edit News: ${editingArticle.title_en}`}
            </h3>

            {error && (
              <div style={{ background: 'rgba(239,68,68,0.15)', color: '#fca5a5', padding: '10px', borderRadius: '8px', marginBottom: '16px' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Title (English) *</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    value={editingArticle.title_en}
                    onChange={(e) => setEditingArticle({ ...editingArticle, title_en: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Published Date</label>
                  <input
                    type="date"
                    required
                    className="form-control"
                    value={editingArticle.published_at}
                    onChange={(e) => setEditingArticle({ ...editingArticle, published_at: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Title (Russian) *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  value={editingArticle.title_ru}
                  onChange={(e) => setEditingArticle({ ...editingArticle, title_ru: e.target.value })}
                />
              </div>

              {/* Cover Image Upload / URL */}
              <div className="form-group">
                <label>Cover Image (URL or Upload)</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="text"
                    className="form-control"
                    value={editingArticle.image_url}
                    onChange={(e) => setEditingArticle({ ...editingArticle, image_url: e.target.value })}
                    placeholder="/images/news/... or /uploads/..."
                  />
                  <label className="btn btn-secondary" style={{ flexShrink: 0, cursor: 'pointer' }}>
                    <Upload size={14} />
                    <span>{uploading ? 'Uploading...' : 'Upload'}</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
                  </label>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Summary / Excerpt (English)</label>
                  <textarea
                    rows={2}
                    className="form-control"
                    value={editingArticle.excerpt_en}
                    onChange={(e) => setEditingArticle({ ...editingArticle, excerpt_en: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Summary / Excerpt (Russian)</label>
                  <textarea
                    rows={2}
                    className="form-control"
                    value={editingArticle.excerpt_ru}
                    onChange={(e) => setEditingArticle({ ...editingArticle, excerpt_ru: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Full Story Content (English)</label>
                  <textarea
                    rows={6}
                    className="form-control"
                    value={editingArticle.content_en}
                    onChange={(e) => setEditingArticle({ ...editingArticle, content_en: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Full Story Content (Russian)</label>
                  <textarea
                    rows={6}
                    className="form-control"
                    value={editingArticle.content_ru}
                    onChange={(e) => setEditingArticle({ ...editingArticle, content_ru: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" onClick={() => setEditingArticle(null)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="btn btn-primary">
                  {loading ? 'Saving...' : 'Save Press Release'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
