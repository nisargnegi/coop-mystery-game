# 🕵️ Unsolved: Co-Op Mystery Game

A real-time, 2-player cooperative unsolved mystery web game built with React (Vite), Node.js, and Socket.io. Features 6 deeply unique cases, progressive location unlocking, evidence boards, shared detective notebooks, and formal accusation mechanics.

## 🚀 Quick Setup (Local Development)

1. **Backend**:
   ```bash
   cd backend
   npm install
   node index.js
   ```
   *(Backend runs on `http://localhost:3005`)*

2. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   *(Frontend runs on `http://localhost:5173`)*

3. Open `http://localhost:5173` in two browser tabs/devices, enter the same Room Code, and play co-op!

---

## 🌐 Production Architecture & VPS Setup

This repository is containerized via Docker and auto-deploys to VPS via GitHub Actions.

### Multi-App VPS Architecture (`~/reverse-proxy/`)

The VPS uses an independent global reverse proxy in `~/reverse-proxy/` to decouple Caddy and SSL from application repositories:

```text
                                              ┌──> Stremio Tracker (`~/stremio-tracker/` - Port 7000)
User Browser ──> Global Reverse Proxy ────────┼──> Co-Op Mystery Game (`~/coop-mystery-game/` - Port 3005)
                 (`~/reverse-proxy/` - Caddy) └──> Future Applications
```

### Global Caddyfile Route (`~/reverse-proxy/Caddyfile`)
```caddyfile
{$DUCKDNS_DOMAIN} {
    # Co-Op Mystery Game
    handle_path /mystery/* {
        reverse_proxy host.docker.internal:3005
    }

    # Stremio Tracker (Default)
    handle {
        reverse_proxy host.docker.internal:7000
    }

    header {
        Strict-Transport-Security "max-age=31536000; includeSubDomains"
        X-Content-Type-Options "nosniff"
        Referrer-Policy "no-referrer"
    }

    log {
        output file /data/access.log
    }
}
```

---

## 📁 Case Engine & Content Expansion

Cases are stored dynamically in `backend/cases/*.json`. To add new cases:
1. Create `case7.json` in `backend/cases/`.
2. Follow the JSON schema (title, genre, difficulty, locations, suspects, hotspots, clues, and solution).
3. The server automatically loads all cases in the catalogue without requiring a restart!
