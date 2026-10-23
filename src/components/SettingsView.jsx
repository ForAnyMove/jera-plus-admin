import React, { useState } from 'react';
import { Save, Check, Globe, Building2, Sliders, Award, BarChart2 } from 'lucide-react';
import { api } from '../api';

export const SettingsView = ({ content, onRefresh }) => {
  const [companyInfo, setCompanyInfo] = useState(content?.company_info || {});
  const [heroSlides, setHeroSlides] = useState(content?.hero_slides || []);
  const [advantages, setAdvantages] = useState(content?.advantages || []);
  const [stats, setStats] = useState(content?.stats || [
    { value: '8+', label_en: 'Years of profitable trading', label_ru: 'Лет прибыльной работы' },
    { value: '100%', label_en: 'Contract fulfilment', label_ru: 'Исполнение контрактов' },
    { value: '15+', label_en: 'Countries of delivery', label_ru: 'Стран поставок' },
    { value: '7', label_en: 'Commodity sectors', label_ru: 'Товарных направлений' }
  ]);
  const [seo, setSeo] = useState(content?.seo || {
    title_en: 'Jera Plus | International Petroleum & Commodity Trading',
    title_ru: 'Jera Plus | Международный трейдинг нефтепродуктов и сырья',
    description_en: 'Jera Plus is a European company supplying LPG, diesel, gasoline, oils, petrochemicals, plastics, flax seed and minerals with end-to-end logistics.',
    description_ru: 'Jera Plus — европейская компания: поставки СУГ, дизеля, бензина, масел, нефтехимии, пластиков, льна и минералов с полной логистикой.'
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError('');

    try {
      await api.updateSettings({
        company_info: companyInfo,
        hero_slides: heroSlides,
        advantages: advantages,
        stats: stats,
        seo: seo
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      onRefresh();
    } catch (err) {
      setError(err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const updateSlide = (idx, field, val) => {
    const updated = [...heroSlides];
    updated[idx] = { ...updated[idx], [field]: val };
    setHeroSlides(updated);
  };

  const updateAdvantage = (idx, field, val) => {
    const updated = [...advantages];
    updated[idx] = { ...updated[idx], [field]: val };
    setAdvantages(updated);
  };

  const updateStat = (idx, field, val) => {
    const updated = [...stats];
    updated[idx] = { ...updated[idx], [field]: val };
    setStats(updated);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Corporate Information & Global Settings</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>Modify office coordinates, SEO metadata, hero sliders, stats, and advantages</p>
        </div>

        <button onClick={handleSave} disabled={saving} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          {saved ? <Check size={16} /> : <Save size={16} />}
          <span>{saving ? 'Saving Changes...' : saved ? 'Saved Successfully!' : 'Save All Settings'}</span>
        </button>
      </div>

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        {/* Section 1: SEO Settings */}
        <div className="stat-card" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', color: '#0eb0ee', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Globe size={18} />
            SEO & Search Engine Metadata
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '14px' }}>
            <div className="form-group">
              <label>Page Title Tag (English)</label>
              <input
                type="text"
                className="form-control"
                value={seo.title_en || ''}
                onChange={(e) => setSeo({ ...seo, title_en: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Заголовок страницы Title (Русский)</label>
              <input
                type="text"
                className="form-control"
                value={seo.title_ru || ''}
                onChange={(e) => setSeo({ ...seo, title_ru: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label>Meta Description (English)</label>
              <textarea
                rows={2}
                className="form-control"
                value={seo.description_en || ''}
                onChange={(e) => setSeo({ ...seo, description_en: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Мета-описание Description (Русский)</label>
              <textarea
                rows={2}
                className="form-control"
                value={seo.description_ru || ''}
                onChange={(e) => setSeo({ ...seo, description_ru: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Section 2: Company Desk Coordinates */}
        <div className="stat-card" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', color: '#0eb0ee', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Building2 size={18} />
            Headquarters & Trading Desk Coordinates
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div className="form-group">
              <label>Company Legal Name</label>
              <input
                type="text"
                className="form-control"
                value={companyInfo.company_name || ''}
                onChange={(e) => setCompanyInfo({ ...companyInfo, company_name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Headquarters City / Country</label>
              <input
                type="text"
                className="form-control"
                value={companyInfo.address || ''}
                onChange={(e) => setCompanyInfo({ ...companyInfo, address: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Direct Phone</label>
              <input
                type="text"
                className="form-control"
                value={companyInfo.phone || ''}
                onChange={(e) => setCompanyInfo({ ...companyInfo, phone: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Corporate Email</label>
              <input
                type="email"
                className="form-control"
                value={companyInfo.email || ''}
                onChange={(e) => setCompanyInfo({ ...companyInfo, email: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label>LinkedIn Company URL</label>
              <input
                type="text"
                className="form-control"
                value={companyInfo.linkedin || ''}
                onChange={(e) => setCompanyInfo({ ...companyInfo, linkedin: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>YouTube Presentation Video ID</label>
              <input
                type="text"
                className="form-control"
                value={companyInfo.youtube_id || ''}
                onChange={(e) => setCompanyInfo({ ...companyInfo, youtube_id: e.target.value })}
                placeholder="_DuaZLvPNHs"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Company Key Numbers / Stats */}
        <div className="stat-card" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', color: '#0eb0ee', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart2 size={18} />
            Company Performance Metrics (About Section Stats)
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            {stats.map((st, idx) => (
              <div key={idx} style={{ background: 'var(--bg-subtle)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border)' }}>
                <div className="form-group" style={{ marginBottom: '8px' }}>
                  <label style={{ fontSize: '0.78rem' }}>Display Value (e.g. 8+, 100%)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={st.value || ''}
                    onChange={(e) => updateStat(idx, 'value', e.target.value)}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '8px' }}>
                  <label style={{ fontSize: '0.78rem' }}>Label (English)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={st.label_en || ''}
                    onChange={(e) => updateStat(idx, 'label_en', e.target.value)}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ fontSize: '0.78rem' }}>Подпись (Русский)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={st.label_ru || ''}
                    onChange={(e) => updateStat(idx, 'label_ru', e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Hero Sliders */}
        <div className="stat-card" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', color: '#0eb0ee', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sliders size={18} />
            Hero Presentation Slides (Homepage Top)
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {heroSlides.map((slide, idx) => (
              <div
                key={slide.id || idx}
                style={{
                  background: 'var(--bg-subtle)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '20px'
                }}
              >
                <div style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: '12px' }}>
                  Slide #{idx + 1}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Headline (English)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={slide.title_en || ''}
                      onChange={(e) => updateSlide(idx, 'title_en', e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Заголовок (Русский)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={slide.title_ru || ''}
                      onChange={(e) => updateSlide(idx, 'title_ru', e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Subtitle (English)</label>
                    <textarea
                      rows={2}
                      className="form-control"
                      value={slide.subtitle_en || ''}
                      onChange={(e) => updateSlide(idx, 'subtitle_en', e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Подзаголовок (Русский)</label>
                    <textarea
                      rows={2}
                      className="form-control"
                      value={slide.subtitle_ru || ''}
                      onChange={(e) => updateSlide(idx, 'subtitle_ru', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Background Image Path / URL</label>
                  <input
                    type="text"
                    className="form-control"
                    value={slide.image_url || ''}
                    onChange={(e) => updateSlide(idx, 'image_url', e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Advantages */}
        <div className="stat-card" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', color: '#0eb0ee', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={18} />
            Corporate Advantages (4 Key Pillars)
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {advantages.map((adv, idx) => (
              <div key={idx} style={{ background: 'var(--bg-subtle)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border)' }}>
                <div style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: '10px', fontSize: '0.9rem' }}>
                  Advantage #{idx + 1} ({adv.icon || 'Star'})
                </div>
                <div className="form-group" style={{ marginBottom: '10px' }}>
                  <label style={{ fontSize: '0.78rem' }}>Title (English)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={adv.title_en || ''}
                    onChange={(e) => updateAdvantage(idx, 'title_en', e.target.value)}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '10px' }}>
                  <label style={{ fontSize: '0.78rem' }}>Заголовок (Русский)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={adv.title_ru || ''}
                    onChange={(e) => updateAdvantage(idx, 'title_ru', e.target.value)}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '10px' }}>
                  <label style={{ fontSize: '0.78rem' }}>Description (English)</label>
                  <textarea
                    rows={2}
                    className="form-control"
                    value={adv.desc_en || ''}
                    onChange={(e) => updateAdvantage(idx, 'desc_en', e.target.value)}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ fontSize: '0.78rem' }}>Описание (Русский)</label>
                  <textarea
                    rows={2}
                    className="form-control"
                    value={adv.desc_ru || ''}
                    onChange={(e) => updateAdvantage(idx, 'desc_ru', e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
};
