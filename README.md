# Co-Op Mystery Game

A real-time, 2-player cooperative unsolved mystery web game.

## Setup Locally

1. Install backend dependencies: `cd backend && npm install`
2. Install frontend dependencies: `cd frontend && npm install`
3. Run backend (Port 3005): `cd backend && node index.js`
4. Run frontend (Port 5173): `cd frontend && npm run dev`

## Deployment & VPS Setup (Caddy)

This project is configured to be deployed automatically to a VPS using GitHub Actions and Docker Compose.

### VPS Requirements
1. **GitHub Secrets**: Ensure `VPS_HOST`, `VPS_USERNAME`, and `VPS_SSH_KEY` are added to this GitHub repository.
2. **Reverse Proxy (Caddy)**: Since you are already hosting `stremio-tracker` on your VPS using Caddy, you need to add a block to your Caddyfile for this game.

### Caddyfile Configuration

SSH into your VPS and edit your Caddyfile (usually located at `/etc/caddy/Caddyfile`).

If you want to host it on a subpath of your existing DuckDNS domain (e.g., `mytrackerstremio.duckdns.org/mystery/*`), add this to your existing block:
```caddyfile
mytrackerstremio.duckdns.org {
    # ... your existing stremio-tracker config ...

    # Add this for the mystery game:
    handle_path /mystery/* {
        reverse_proxy localhost:3005
    }
}
```

**OR**, if you create a new subdomain (e.g., `mysterygame.duckdns.org`), add a completely new block:
```caddyfile
mysterygame.duckdns.org {
    reverse_proxy localhost:3005
}
```

After updating the Caddyfile, reload Caddy on your VPS:
```bash
sudo systemctl reload caddy
```

### Adding New Cases

To add more games, simply create new JSON files in `backend/cases/`. Follow the format in `case1.json`. 
The game will automatically load any new JSON case file placed in that directory.
