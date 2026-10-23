import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, PlusCircle, Trash } from 'lucide-react';
import { api } from '../api';

export const ServicesView = ({ services, onRefresh }) => {
  const [editingService, setEditingService] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const icons = ['Truck', 'Compass', 'Building2', 'Banknote', 'BarChart3', 'Briefcase'];

  const handleCreate = () => {
    setIsNew(true);
    setEditingService({
      slug: 'service-' + Date.now(),
      title_en: '',
      title_ru: '',
      excerpt_en: '',
      excerpt_ru: '',
      description_en: '',
      description_ru: '',
      icon: 'Briefcase',
      image_url: '/images/bn_2.jpg',
      is_active: true,
      order_num: (services || []).length + 1,
      stages: [
        { title_en: 'Initial Audit & Requirement Analysis', title_ru: 'Анализ потребностей и аудит' },
        { title_en: 'Contractual Execution', title_ru: 'Исполнение контракта' }
      ]
    });
  };

  const handleEdit = (srv) => {
    setIsNew(false);
    setEditingService(JSON.parse(JSON.stringify(srv)));
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this service?')) return;
    try {
      await api.deleteService(id);
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
        await api.createService(editingService);
      } else {
        await api.updateService(editingService.id, editingService);
      }
      setEditingService(null);
      onRefresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addStageRow = () => {
    setEditingService({
      ...editingService,
      stages: [...(editingService.stages || []), { title_en: '', title_ru: '' }]
    });
  };

  const removeStageRow = (idx) => {
    const updated = [...(editingService.stages || [])];
    updated.splice(idx, 1);
    setEditingService({ ...editingService, stages: updated });
  };

  const updateStageRow = (idx, field, val) => {
    const updated = [...(editingService.stages || [])];
    updated[idx][field] = val;
    setEditingService({ ...editingService, stages: updated });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Logistics & Advisory Services</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>Manage brokerage, financing, and transport consulting solutions</p>
        </div>
        <button onClick={handleCreate} className="btn btn-primary">
          <Plus size={16} />
          <span>Add New Service</span>
        </button>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Icon</th>
            <th>Service Title (EN / RU)</th>
            <th>Stages</th>
            <th>Status</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {services.map((s) => (
            <tr key={s.id}>
              <td style={{ color: '#0eb0ee', fontWeight: 700 }}>
                {s.icon || 'Briefcase'}
              </td>
              <td>
                <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{s.title_en}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{s.title_ru}</div>
              </td>
              <td>{(s.stages || []).length} steps</td>
              <td>
                <span className={`status-badge ${s.is_active ? 'status-done' : 'status-new'}`}>
                  {s.is_active ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td style={{ textAlign: 'right' }}>
                <div style={{ display: 'inline-flex', gap: '8px' }}>
                  <button onClick={() => handleEdit(s)} className="btn btn-secondary" style={{ padding: '6px 10px' }} title="Edit">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => handleDelete(s.id)} className="btn btn-danger" style={{ padding: '6px 10px' }} title="Delete">
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Editor */}
      {editingService && (
        <div className="modal-overlay" onClick={() => setEditingService(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setEditingService(null)}
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.4rem', marginBottom: '20px' }}>
              {isNew ? 'Create New Service' : `Edit Service: ${editingService.title_en}`}
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
                    value={editingService.title_en}
                    onChange={(e) => setEditingService({ ...editingService, title_en: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Icon</label>
                  <select
                    className="form-control"
                    value={editingService.icon}
                    onChange={(e) => setEditingService({ ...editingService, icon: e.target.value })}
                  >
                    {icons.map((ic) => (
                      <option key={ic} value={ic}>{ic}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Title (Russian) *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  value={editingService.title_ru}
                  onChange={(e) => setEditingService({ ...editingService, title_ru: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Summary (English)</label>
                  <textarea
                    rows={2}
                    className="form-control"
                    value={editingService.excerpt_en}
                    onChange={(e) => setEditingService({ ...editingService, excerpt_en: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Summary (Russian)</label>
                  <textarea
                    rows={2}
                    className="form-control"
                    value={editingService.excerpt_ru}
                    onChange={(e) => setEditingService({ ...editingService, excerpt_ru: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Detailed Description (English)</label>
                  <textarea
                    rows={4}
                    className="form-control"
                    value={editingService.description_en}
                    onChange={(e) => setEditingService({ ...editingService, description_en: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Detailed Description (Russian)</label>
                  <textarea
                    rows={4}
                    className="form-control"
                    value={editingService.description_ru}
                    onChange={(e) => setEditingService({ ...editingService, description_ru: e.target.value })}
                  />
                </div>
              </div>

              {/* Workflow Stages Editor */}
              <div style={{ marginTop: '20px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <label style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0eb0ee' }}>
                    Execution Workflow Stages
                  </label>
                  <button type="button" onClick={addStageRow} className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                    <PlusCircle size={14} /> Add Stage
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {(editingService.stages || []).map((stage, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 40px', gap: '8px', alignItems: 'center' }}>
                      <input
                        type="text"
                        placeholder="Stage Title (English)"
                        className="form-control"
                        style={{ padding: '8px 10px', fontSize: '0.85rem' }}
                        value={stage.title_en}
                        onChange={(e) => updateStageRow(i, 'title_en', e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Название этапа (Русский)"
                        className="form-control"
                        style={{ padding: '8px 10px', fontSize: '0.85rem' }}
                        value={stage.title_ru}
                        onChange={(e) => updateStageRow(i, 'title_ru', e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => removeStageRow(i)}
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
                <button type="button" onClick={() => setEditingService(null)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="btn btn-primary">
                  {loading ? 'Saving...' : 'Save Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
