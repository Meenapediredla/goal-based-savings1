# Deployment guide (Render / production)

After deploy, registration, login, and goals fail when the **frontend cannot reach the API** or the **database env vars** are missing. Follow one of the setups below.

## Option A — Single service (recommended)

One Render web service serves **both** the React UI and the API (Dockerfile bundles them).

1. Create a **Web Service** on Render.
2. **Root directory:** repository root.
3. **Dockerfile path:** `server/demo/Dockerfile`
4. **Docker context:** `.` (repository root)
5. Set environment variables:

| Variable | Example |
|----------|---------|
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://ep-xxx.neon.tech/neondb?sslmode=require` |
| `SPRING_DATASOURCE_USERNAME` | your Neon user |
| `SPRING_DATASOURCE_PASSWORD` | your Neon password |
| `JWT_SECRET` | long random string (32+ characters) |
| `APP_CORS_ORIGINS` | `*` (or your site URL) |

6. Open your Render URL (e.g. `https://goal-based-savings.onrender.com`).
7. No `VITE_API_URL` needed — the app uses the same origin.

**Neon URL tip:** Neon gives `postgresql://...`. Spring needs:

```text
jdbc:postgresql://HOST/DATABASE?sslmode=require
```

**Health check:** `GET /health` → `{"status":"ok"}`

---

## Option B — Frontend and backend separate

### Backend (Render / Railway)

Deploy the Spring Boot app. Set the same database and `JWT_SECRET` variables as above.

Note the API URL, e.g. `https://your-api.onrender.com`.

Set **APP_CORS_ORIGINS** to your frontend URL:

```text
https://your-frontend.onrender.com
```

### Frontend (Render Static Site / Vercel / Netlify)

**Before build**, set:

```text
VITE_API_URL=https://your-api.onrender.com
```

(No trailing slash.)

Then build:

```bash
cd client
npm install
npm run build
```

Publish the `client/dist` folder.

---

## Local development

```bash
# Terminal 1 — API (needs local Postgres or Neon URL in env)
cd server/demo
./mvnw spring-boot:run

# Terminal 2 — UI (proxies /api → localhost:8080)
cd client
npm install
npm run dev
```

---

## Verify after deploy

1. `https://YOUR-API-URL/health` → `{"status":"ok"}`
2. Register a new user (use a new email if you had duplicate rows before).
3. Login → Dashboard → Create goal.

If step 1 fails, fix database env vars and redeploy.  
If step 1 works but the UI fails, check browser **Network** tab: requests should go to your API host, not `localhost` or the wrong `/api` path.
