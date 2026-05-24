# Goal Based Savings Tracker

## Live setup (after this push)

### Backend on Render

1. Open [Render Dashboard](https://dashboard.render.com) → your **Web Service**.
2. **Settings → Build:**
   - **Dockerfile path:** `server/demo/Dockerfile`
   - **Docker context / root directory:** repository root (`.`)
3. **Environment variables** (required):

| Variable | Value |
|----------|--------|
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://...` (from Neon) |
| `SPRING_DATASOURCE_USERNAME` | Neon user |
| `SPRING_DATASOURCE_PASSWORD` | Neon password |
| `JWT_SECRET` | 32+ random characters |
| `APP_CORS_ORIGINS` | `https://goal-based-savings.vercel.app,http://localhost:5173,*` |

4. **Manual Deploy** → Deploy latest commit.
5. Test: `https://YOUR-SERVICE.onrender.com/health` → `{"status":"ok"}`

### Frontend on Vercel

1. [Vercel Dashboard](https://vercel.com) → project **goal-based-savings**.
2. **Settings → Environment Variables** → add:

```
VITE_API_URL = https://YOUR-RENDER-SERVICE.onrender.com
```

(No trailing slash. Use the exact URL from Render.)

3. **Deployments → Redeploy** (must rebuild after adding the variable).

### Local dev

```bash
cd server/demo && ./mvnw spring-boot:run
cd client && npm install && npm run dev
```

See [DEPLOY.md](./DEPLOY.md) for details.
