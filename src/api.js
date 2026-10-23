// Centralized API client for Jera Plus Admin CMS
const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

export const getToken = () => {
  try {
    return localStorage.getItem('jeraplus_admin_token') || '';
  } catch {
    return '';
  }
};

export const setToken = (t) => {
  try {
    if (t) localStorage.setItem('jeraplus_admin_token', t);
    else localStorage.removeItem('jeraplus_admin_token');
  } catch {}
};

export const clearToken = () => {
  try {
    localStorage.removeItem('jeraplus_admin_token');
  } catch {}
};

export const apiUrl = (path) => {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE}${clean}`;
};

export async function apiFetch(path, options = {}) {
  const url = apiUrl(path);
  const token = getToken();

  const headers = {
    ...(options.headers || {})
  };

  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Auto-set Content-Type for JSON payloads if not FormData
  if (options.body && !(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(url, { ...options, headers });

  if (res.status === 401 && !path.includes('/auth/login')) {
    clearToken();
    window.dispatchEvent(new CustomEvent('jeraplus:unauthorized'));
    throw new Error('Session expired. Please log in again.');
  }

  return res;
}

// -------------------------------------------------------------
// API METHODS
// -------------------------------------------------------------
export const api = {
  // Auth
  async login(password) {
    const res = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Authentication failed');
    return data;
  },

  async getSession() {
    const res = await apiFetch('/api/admin/session');
    if (!res.ok) throw new Error('Invalid session');
    return res.json();
  },

  // Public / Health
  async getHealth() {
    const res = await apiFetch('/api/health');
    return res.json();
  },

  async getContent(includeHidden = true) {
    const endpoint = includeHidden ? '/api/admin/content' : '/api/content';
    const res = await apiFetch(endpoint);
    return res.json();
  },

  // Products
  async createProduct(data) {
    const res = await apiFetch('/api/admin/products', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to create product');
    return json;
  },

  async updateProduct(id, data) {
    const res = await apiFetch(`/api/admin/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to update product');
    return json;
  },

  async deleteProduct(id) {
    const res = await apiFetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to delete product');
    return json;
  },

  // Services
  async createService(data) {
    const res = await apiFetch('/api/admin/services', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to create service');
    return json;
  },

  async updateService(id, data) {
    const res = await apiFetch(`/api/admin/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to update service');
    return json;
  },

  async deleteService(id) {
    const res = await apiFetch(`/api/admin/services/${id}`, { method: 'DELETE' });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to delete service');
    return json;
  },

  // News
  async createNews(data) {
    const res = await apiFetch('/api/admin/news', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to create news');
    return json;
  },

  async updateNews(id, data) {
    const res = await apiFetch(`/api/admin/news/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to update news');
    return json;
  },

  async deleteNews(id) {
    const res = await apiFetch(`/api/admin/news/${id}`, { method: 'DELETE' });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to delete news');
    return json;
  },

  // Vacancies
  async createVacancy(data) {
    const res = await apiFetch('/api/admin/vacancies', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to create vacancy');
    return json;
  },

  async updateVacancy(id, data) {
    const res = await apiFetch(`/api/admin/vacancies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to update vacancy');
    return json;
  },

  async deleteVacancy(id) {
    const res = await apiFetch(`/api/admin/vacancies/${id}`, { method: 'DELETE' });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to delete vacancy');
    return json;
  },

  // Messages (Inquiries)
  async getMessages() {
    const res = await apiFetch('/api/admin/messages');
    return res.json();
  },

  async updateMessageStatus(id, status) {
    const res = await apiFetch(`/api/admin/messages/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to update message');
    return json;
  },

  async deleteMessage(id) {
    const res = await apiFetch(`/api/admin/messages/${id}`, { method: 'DELETE' });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to delete message');
    return json;
  },

  async downloadMessagesCsv() {
    const res = await apiFetch('/api/admin/messages/export.csv');
    if (!res.ok) throw new Error('Export failed');
    const blob = await res.blob();
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `jeraplus-inquiries-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  },

  // Subscribers
  async getSubscribers() {
    const res = await apiFetch('/api/admin/subscribers');
    return res.json();
  },

  async deleteSubscriber(id) {
    const res = await apiFetch(`/api/admin/subscribers/${id}`, { method: 'DELETE' });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to delete subscriber');
    return json;
  },

  async downloadSubscribersCsv() {
    const res = await apiFetch('/api/admin/subscribers/export.csv');
    if (!res.ok) throw new Error('Export failed');
    const blob = await res.blob();
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `jeraplus-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  },

  // Settings
  async updateSettings(data) {
    const res = await apiFetch('/api/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to update settings');
    return json;
  },

  // Media
  async listMedia() {
    const res = await apiFetch('/api/admin/media');
    return res.json();
  },

  async uploadMedia(file) {
    const form = new FormData();
    form.append('file', file);
    const res = await apiFetch('/api/admin/upload', {
      method: 'POST',
      body: form
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Upload failed');
    return json;
  },

  async deleteMedia(path) {
    const res = await apiFetch('/api/admin/media', {
      method: 'DELETE',
      body: JSON.stringify({ path })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Delete failed');
    return json;
  },

  // Supabase Seed
  async seedSupabase() {
    const res = await apiFetch('/api/admin/seed-supabase', { method: 'POST' });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Seeding failed');
    return json;
  }
};
