# Jera Plus Admin CMS

Content Management System for **Jera Plus**. Provides secure control over products, services, news articles, career vacancies, newsletter subscribers, client inquiries, media assets, and SEO settings.

---

## 🌟 Key Features

- **Centralized Management:**
  - 📦 **Products:** Full CRUD with technical specifications (grade, delivery terms, parameters), category filters, and active toggles.
  - 🛠 **Services:** Manage logistics, trade finance, and consulting offerings.
  - 📰 **News & Press:** Rich publication manager with image upload, slugs, and publishing status.
  - 💼 **Careers:** Manage job vacancies (EN/RU titles, locations, responsibilities, requirements).
  - ✉️ **Inquiries Inbox:** View incoming requests from clients, filter by status, and export to CSV.
  - 📬 **Subscribers:** View newsletter subscribers list and export to CSV.
  - 🖼 **Media Library:** Upload images directly to Supabase Storage Bucket `jeraplus_media`, preview, and copy CDN URLs.
  - ⚙️ **Settings & SEO:** Live editor for Company Information, Hero Slides, Advantages, Key Stats, and SEO meta tags.
  - ☁️ **Supabase Cloud Diagnostics:** View connection status, latency, and database seed controls.
- **Enterprise Security:**
  - Cryptographically signed HMAC-SHA256 session tokens with expiration.
  - Centralized API client (`api.js`) attaching Bearer tokens automatically and handling session expiration.
  - CSV formula injection escaping.
  - Zero exposed secrets in client-side code.
- **Theme Switcher:** Day and Night admin color schemes matching the client design language.
- **Production Routing:** Includes `vercel.json` with SPA rewrites.

---

## 🛠 Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment (optional):**
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   *Note: In local development, if `VITE_API_URL` is omitted, Vite automatically proxies `/api` and `/uploads` to `http://localhost:5000`.*

3. **Start local dev server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3001` in your browser.

4. **Build for production:**
   ```bash
   npm run build
   ```

---

## 🌐 Deploy to Vercel

1. Push this repository to GitHub.
2. Go to [Vercel](https://vercel.com) and click **Add New Project**.
3. Import your admin repository.
4. Framework Preset will be automatically detected as **Vite**.
5. In **Environment Variables**, add:
   - `VITE_API_URL`: URL of your Render backend (e.g. `https://jera-plus-api.onrender.com`)
   - `VITE_SITE_URL`: URL of your live client website (e.g. `https://jera-plus.vercel.app`)
6. Click **Deploy**.

---

## 📦 Git Push Commands
```bash
git init
git add .
git commit -m "feat: production admin CMS with careers, subscribers, media library, and Vercel config"
git branch -M main
git remote add origin <YOUR_ADMIN_REPO_URL>
git push -u origin main
```
