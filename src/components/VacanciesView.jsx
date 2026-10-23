import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, PlusCircle, Trash, Users, MapPin } from 'lucide-react';
import { api } from '../api';

export const VacanciesView = ({ vacancies = [], onRefresh }) => {
  const [editingVacancy, setEditingVacancy] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = () => {
    setIsNew(true);
    setEditingVacancy({
      title_en: '',
      title_ru: '',
      location_en: 'Europe / Remote / Podgorica HQ',
      location_ru: 'Европа / Удаленно / Офис в Подгорице',
      resp_en: [''],
      resp_ru: [''],
      req_en: '',
      req_ru: '',
      is_active: true,
      order_num: (vacancies || []).length + 1
    });
  };

  const handleEdit = (v) => {
    setIsNew(false);
    setEditingVacancy(JSON.parse(JSON.stringify(v)));
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this career opening?')) return;
    try {
      await api.deleteVacancy(id);
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
      const cleanData = {
        ...editingVacancy,
        resp_en: (editingVacancy.resp_en || []).filter((r) => r.trim()),
        resp_ru: (editingVacancy.resp_ru || []).filter((r) => r.trim())
      };

      if (isNew) {
        await api.createVacancy(cleanData);
      } else {
        await api.updateVacancy(editingVacancy.id, cleanData);
      }
      setEditingVacancy(null);
      onRefresh();
    } catch (err) {
      setError(err.message || 'Failed to save vacancy');
    } finally {
      setLoading(false);
    }
  };

  const addRespRow = () => {
    setEditingVacancy({
      ...editingVacancy,
      resp_en: [...(editingVacancy.resp_en || []), ''],
      resp_ru: [...(editingVacancy.resp_ru || []), '']
    });
  };

  const updateResp = (idx, lang, val) => {
    const list = [...(editingVacancy[lang] || [])];
    list[idx] = val;
    setEditingVacancy({ ...editingVacancy, [lang]: list });
  };

  const removeResp = (idx) => {
    const ren = [...(editingVacancy.resp_en || [])];
    const rru = [...(editingVacancy.resp_ru || [])];
    ren.splice(idx, 1);
    rru.splice(idx, 1);
    setEditingVacancy({ ...editingVacancy, resp_en: ren, resp_ru: rru });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Careers & Open Positions</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>Manage trader vacancies, job descriptions, requirements and locations</p>
        </div>

        <button onClick={handleCreate} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Plus size={16} />
          <span>Add New Vacancy</span>
        </button>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Position Title (EN / RU)</th>
            <th>Location</th>
            <th>Responsibilities</th>
            <th>Status</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {(vacancies || []).map((v) => (
            <tr key={v.id}>
              <td>
                <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{v.title_en}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{v.title_ru}</div>
              </td>
              <td>
                <span style={{ fontSize: '0.85rem', color: '#0eb0ee' }}>📍 {v.location_en}</span>
              </td>
              <td>
                {(v.resp_en || []).length} key duties
              </td>
              <td>
                <span className={`status-badge ${v.is_active ? 'status-done' : 'status-new'}`}>
                  {v.is_active ? 'Active' : 'Closed'}
                </span>
              </td>
              <td style={{ textAlign: 'right' }}>
                <div style={{ display: 'inline-flex', gap: '8px' }}>
                  <button onClick={() => handleEdit(v)} className="btn btn-secondary" style={{ padding: '6px 10px' }} title="Edit">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => handleDelete(v.id)} className="btn btn-danger" style={{ padding: '6px 10px' }} title="Delete">
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Vacancy Modal */}
      {editingVacancy && (
        <div className="modal-overlay" onClick={() => setEditingVacancy(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '780px' }}>
            <button
              onClick={() => setEditingVacancy(null)}
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.4rem', marginBottom: '20px' }}>
              {isNew ? 'Create Career Vacancy' : `Edit Position: ${editingVacancy.title_en}`}
            </h3>

            {error && (
              <div style={{ background: 'rgba(239,68,68,0.15)', color: '#fca5a5', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Position Title (English) *</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    value={editingVacancy.title_en || ''}
                    onChange={(e) => setEditingVacancy({ ...editingVacancy, title_en: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Название должности (Русский) *</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    value={editingVacancy.title_ru || ''}
                    onChange={(e) => setEditingVacancy({ ...editingVacancy, title_ru: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Location (English)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editingVacancy.location_en || ''}
                    onChange={(e) => setEditingVacancy({ ...editingVacancy, location_en: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Локация (Русский)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editingVacancy.location_ru || ''}
                    onChange={(e) => setEditingVacancy({ ...editingVacancy, location_ru: e.target.value })}
                  />
                </div>
              </div>

              {/* Responsibilities list */}
              <div style={{ marginTop: '14px', marginBottom: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <label style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0eb0ee' }}>
                    Key Responsibilities & Duties
                  </label>
                  <button type="button" onClick={addRespRow} className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                    <PlusCircle size={14} /> Add Responsibility
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {(editingVacancy.resp_en || []).map((_, idx) => (
                    <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 38px', gap: '8px', alignItems: 'center' }}>
                      <input
                        type="text"
                        placeholder="Duty in English"
                        className="form-control"
                        style={{ padding: '8px 10px', fontSize: '0.85rem' }}
                        value={editingVacancy.resp_en?.[idx] || ''}
                        onChange={(e) => updateResp(idx, 'resp_en', e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Обязанность на русском"
                        className="form-control"
                        style={{ padding: '8px 10px', fontSize: '0.85rem' }}
                        value={editingVacancy.resp_ru?.[idx] || ''}
                        onChange={(e) => updateResp(idx, 'resp_ru', e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => removeResp(idx)}
                        className="btn btn-danger"
                        style={{ padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Trash size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Candidate Profile & Requirements (English)</label>
                  <textarea
                    rows={3}
                    className="form-control"
                    value={editingVacancy.req_en || ''}
                    onChange={(e) => setEditingVacancy({ ...editingVacancy, req_en: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Требования к кандидату (Русский)</label>
                  <textarea
                    rows={3}
                    className="form-control"
                    value={editingVacancy.req_ru || ''}
                    onChange={(e) => setEditingVacancy({ ...editingVacancy, req_ru: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={editingVacancy.is_active}
                    onChange={(e) => setEditingVacancy({ ...editingVacancy, is_active: e.target.checked })}
                  />
                  <span>Active & Accepting Applications</span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" onClick={() => setEditingVacancy(null)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="btn btn-primary">
                  {loading ? 'Saving...' : 'Save Vacancy'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
