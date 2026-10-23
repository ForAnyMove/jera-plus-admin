import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, PlusCircle, Trash, Check, AlertCircle } from 'lucide-react';
import { api } from '../api';

export const ProductsView = ({ products, onRefresh }) => {
  const [editingProduct, setEditingProduct] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = () => {
    setIsNew(true);
    setEditingProduct({
      slug: 'new-product-' + Date.now(),
      title_en: '',
      title_ru: '',
      category_en: 'Petroleum Products',
      category_ru: 'Нефтепродукты',
      excerpt_en: '',
      excerpt_ru: '',
      description_en: '',
      description_ru: '',
      image_url: '/images/bn_2.jpg',
      is_active: true,
      order_num: (products || []).length + 1,
      specs: [
        { name_en: 'Standard', name_ru: 'Стандарт', value: 'EN Standard' },
        { name_en: 'Delivery', name_ru: 'Доставка', value: 'Rail / Road / Sea' }
      ]
    });
  };

  const handleEdit = (prod) => {
    setIsNew(false);
    setEditingProduct(JSON.parse(JSON.stringify(prod)));
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.deleteProduct(id);
      onRefresh();
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isNew) {
        await api.createProduct(editingProduct);
      } else {
        await api.updateProduct(editingProduct.id, editingProduct);
      }
      setEditingProduct(null);
      onRefresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addSpecRow = () => {
    setEditingProduct({
      ...editingProduct,
      specs: [...(editingProduct.specs || []), { name_en: '', name_ru: '', value: '' }]
    });
  };

  const removeSpecRow = (idx) => {
    const updated = [...(editingProduct.specs || [])];
    updated.splice(idx, 1);
    setEditingProduct({ ...editingProduct, specs: updated });
  };

  const updateSpecRow = (idx, field, val) => {
    const updated = [...(editingProduct.specs || [])];
    updated[idx][field] = val;
    setEditingProduct({ ...editingProduct, specs: updated });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Commodity Products Portfolio</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>Manage wholesale products, technical specifications, and photos</p>
        </div>
        <button onClick={handleCreate} className="btn btn-primary">
          <Plus size={16} />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Table */}
      <table className="data-table">
        <thead>
          <tr>
            <th style={{ width: '80px' }}>Image</th>
            <th>Title (EN / RU)</th>
            <th>Category</th>
            <th>Specs Count</th>
            <th>Status</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>
                <img
                  src={p.image_url || '/images/bn_2.jpg'}
                  alt=""
                  style={{ width: '60px', height: '42px', objectFit: 'cover', borderRadius: '6px' }}
                />
              </td>
              <td>
                <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{p.title_en}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{p.title_ru}</div>
              </td>
              <td>
                <span style={{ background: 'var(--badge-bg)', color: 'var(--badge-text)', padding: '3px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>
                  {p.category_en}
                </span>
              </td>
              <td>{(p.specs || []).length} parameters</td>
              <td>
                <span className={`status-badge ${p.is_active ? 'status-done' : 'status-new'}`}>
                  {p.is_active ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td style={{ textAlign: 'right' }}>
                <div style={{ display: 'inline-flex', gap: '8px' }}>
                  <button onClick={() => handleEdit(p)} className="btn btn-secondary" style={{ padding: '6px 10px' }} title="Edit">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="btn btn-danger" style={{ padding: '6px 10px' }} title="Delete">
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Editor */}
      {editingProduct && (
        <div className="modal-overlay" onClick={() => setEditingProduct(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setEditingProduct(null)}
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.4rem', marginBottom: '20px' }}>
              {isNew ? 'Create New Commodity Product' : `Edit Product: ${editingProduct.title_en}`}
            </h3>

            {error && (
              <div style={{ background: 'rgba(239,68,68,0.15)', color: '#fca5a5', padding: '10px', borderRadius: '8px', marginBottom: '16px' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Title (English) *</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    value={editingProduct.title_en}
                    onChange={(e) => setEditingProduct({ ...editingProduct, title_en: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Title (Russian) *</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    value={editingProduct.title_ru}
                    onChange={(e) => setEditingProduct({ ...editingProduct, title_ru: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Category (English)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editingProduct.category_en}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category_en: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Category (Russian)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editingProduct.category_ru}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category_ru: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="text"
                  className="form-control"
                  value={editingProduct.image_url}
                  onChange={(e) => setEditingProduct({ ...editingProduct, image_url: e.target.value })}
                  placeholder="/images/bn_1.jpg or /uploads/..."
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Short Summary (English)</label>
                  <textarea
                    rows={2}
                    className="form-control"
                    value={editingProduct.excerpt_en}
                    onChange={(e) => setEditingProduct({ ...editingProduct, excerpt_en: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Short Summary (Russian)</label>
                  <textarea
                    rows={2}
                    className="form-control"
                    value={editingProduct.excerpt_ru}
                    onChange={(e) => setEditingProduct({ ...editingProduct, excerpt_ru: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Full Description (English)</label>
                  <textarea
                    rows={4}
                    className="form-control"
                    value={editingProduct.description_en}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description_en: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Full Description (Russian)</label>
                  <textarea
                    rows={4}
                    className="form-control"
                    value={editingProduct.description_ru}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description_ru: e.target.value })}
                  />
                </div>
              </div>

              {/* Technical Specifications Dynamic Table */}
              <div style={{ marginTop: '20px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <label style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0eb0ee' }}>
                    Technical Specifications (COA Parameters)
                  </label>
                  <button type="button" onClick={addSpecRow} className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                    <PlusCircle size={14} /> Add Parameter
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {(editingProduct.specs || []).map((spec, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.2fr 40px', gap: '8px', alignItems: 'center' }}>
                      <input
                        type="text"
                        placeholder="Parameter Name (EN)"
                        className="form-control"
                        style={{ padding: '8px 10px', fontSize: '0.85rem' }}
                        value={spec.name_en}
                        onChange={(e) => updateSpecRow(i, 'name_en', e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Параметр (RU)"
                        className="form-control"
                        style={{ padding: '8px 10px', fontSize: '0.85rem' }}
                        value={spec.name_ru}
                        onChange={(e) => updateSpecRow(i, 'name_ru', e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Value (e.g. >= 95% / EN 590)"
                        className="form-control"
                        style={{ padding: '8px 10px', fontSize: '0.85rem' }}
                        value={spec.value}
                        onChange={(e) => updateSpecRow(i, 'value', e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => removeSpecRow(i)}
                        className="btn btn-danger"
                        style={{ padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Trash size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" onClick={() => setEditingProduct(null)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="btn btn-primary">
                  {loading ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
