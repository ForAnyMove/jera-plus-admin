import React, { useState, useEffect, useCallback } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { DashboardView } from './components/DashboardView';
import { ProductsView } from './components/ProductsView';
import { ServicesView } from './components/ServicesView';
import { NewsView } from './components/NewsView';
import { VacanciesView } from './components/VacanciesView';
import { MessagesView } from './components/MessagesView';
import { SubscribersView } from './components/SubscribersView';
import { MediaView } from './components/MediaView';
import { SettingsView } from './components/SettingsView';
import { SupabaseConfigView } from './components/SupabaseConfigView';
import { api, getToken, setToken as saveToken, clearToken } from './api';
import {
  LayoutDashboard,
  Package,
  Briefcase,
  Newspaper,
  Users,
  Mail,
  AtSign,
  Image,
  Settings,
  Database,
  LogOut,
  ExternalLink,
  Sun,
  Moon
} from 'lucide-react';

export default function App() {
  const [token, setTokenState] = useState(() => getToken());
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('jeraplus_admin_theme') || 'light';
    } catch {
      return 'light';
    }
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [content, setContent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('jeraplus_admin_theme', theme);
    } catch {}
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  // Listen to 401 unauthorized event from api client
  useEffect(() => {
    const handleUnauthorized = () => {
      setTokenState('');
    };
    window.addEventListener('jeraplus:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('jeraplus:unauthorized', handleUnauthorized);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleLogin = (newToken) => {
    saveToken(newToken);
    setTokenState(newToken);
  };

  const handleLogout = () => {
    clearToken();
    setTokenState('');
  };

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [cData, mData, hData] = await Promise.all([
        api.getContent(true),
        api.getMessages(),
        api.getHealth()
      ]);

      if (cData) setContent(cData);
      if (mData) setMessages(mData);
      if (hData) setHealth(hData);
    } catch (err) {
      console.warn('Admin fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      loadData();
    }
  }, [token, loadData]);

  if (!token) {
    return <LoginScreen onLogin={handleLogin} theme={theme} onToggleTheme={toggleTheme} />;
  }

  const unreadMessagesCount = (messages || []).filter((m) => m.status === 'new').length;
  const publicSiteUrl = import.meta.env.VITE_SITE_URL || 'http://localhost:3000';

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package, badge: content?.products?.length },
    { id: 'services', label: 'Services', icon: Briefcase, badge: content?.services?.length },
    { id: 'news', label: 'News & Press', icon: Newspaper, badge: content?.news?.length },
    { id: 'vacancies', label: 'Careers', icon: Users, badge: content?.vacancies?.length },
    { id: 'messages', label: 'Inquiries', icon: Mail, badge: unreadMessagesCount > 0 ? unreadMessagesCount : null, alert: unreadMessagesCount > 0 },
    { id: 'subscribers', label: 'Newsletter', icon: AtSign },
    { id: 'media', label: 'Media Library', icon: Image },
    { id: 'settings', label: 'Settings & Hero', icon: Settings },
    { id: 'supabase', label: 'Database & Cloud', icon: Database, alert: health?.supabase !== 'connected' }
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <img src="/images/logo.png" alt="Jera Plus" style={{ height: '36px', filter: 'brightness(1.1)' }} />
          <div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--sidebar-logo-text)' }}>Jera Plus</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--sidebar-logo-sub)', textTransform: 'uppercase', fontWeight: 600 }}>Admin Panel</div>
          </div>
        </div>

        <nav style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={18} />
                <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>
                {item.badge !== undefined && item.badge !== null && (
                  <span
                    style={{
                      background: item.alert ? '#0eb0ee' : 'rgba(255, 255, 255, 0.25)',
                      color: item.alert ? '#000' : '#ffffff',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '2px 7px',
                      borderRadius: '12px'
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div style={{ paddingTop: '16px', borderTop: '1px solid var(--sidebar-border)' }}>
          <a
            href={publicSiteUrl}
            target="_blank"
            rel="noreferrer"
            className="nav-item"
            style={{ marginBottom: '8px' }}
          >
            <ExternalLink size={16} />
            <span>View Public Site</span>
          </a>

          <button onClick={handleLogout} className="nav-item" style={{ color: '#fca5a5' }}>
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content View */}
      <main className="main-content">
        <header className="top-header">
          <div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Operations Control &bull; Podgorica Desk</div>
            <h2 style={{ fontSize: '1.4rem' }}>
              {navItems.find((n) => n.id === activeTab)?.label || 'Console'}
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Day / Night Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="btn btn-secondary"
              style={{
                fontSize: '0.82rem',
                padding: '7px 14px',
                borderRadius: '20px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
              title={theme === 'dark' ? 'Включить дневную тему' : 'Включить ночную тему'}
            >
              {theme === 'dark' ? (
                <>
                  <Sun size={15} color="#0eb0ee" />
                  <span>Дневная</span>
                </>
              ) : (
                <>
                  <Moon size={15} color="#42672e" />
                  <span>Ночная</span>
                </>
              )}
            </button>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '20px',
              background: health?.supabase === 'connected' ? 'var(--badge-done-bg)' : 'var(--badge-new-bg)',
              border: `1px solid ${health?.supabase === 'connected' ? 'var(--badge-done-border)' : 'var(--badge-new-border)'}`,
              fontSize: '0.78rem',
              fontWeight: 700,
              color: health?.supabase === 'connected' ? 'var(--badge-done-text)' : 'var(--badge-new-text)'
            }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: health?.supabase === 'connected' ? 'var(--badge-done-text)' : 'var(--badge-new-text)' }} />
              <span>{health?.supabase === 'connected' ? 'Supabase Live' : 'Local JSON Mode'}</span>
            </div>

            <button
              onClick={loadData}
              disabled={loading}
              className="btn btn-secondary"
              style={{ fontSize: '0.82rem', padding: '6px 14px' }}
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <DashboardView
            content={content}
            messages={messages}
            health={health}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'products' && (
          <ProductsView
            products={content?.products || []}
            onRefresh={loadData}
          />
        )}

        {activeTab === 'services' && (
          <ServicesView
            services={content?.services || []}
            onRefresh={loadData}
          />
        )}

        {activeTab === 'news' && (
          <NewsView
            news={content?.news || []}
            onRefresh={loadData}
          />
        )}

        {activeTab === 'vacancies' && (
          <VacanciesView
            vacancies={content?.vacancies || []}
            onRefresh={loadData}
          />
        )}

        {activeTab === 'messages' && (
          <MessagesView
            messages={messages}
            onRefresh={loadData}
          />
        )}

        {activeTab === 'subscribers' && (
          <SubscribersView />
        )}

        {activeTab === 'media' && (
          <MediaView />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            content={content}
            onRefresh={loadData}
          />
        )}

        {activeTab === 'supabase' && (
          <SupabaseConfigView
            health={health}
            onRefresh={loadData}
            content={content}
          />
        )}
      </main>
    </div>
  );
}
