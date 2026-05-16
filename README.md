<p align="center">
  <img src="icon.svg" alt="Paperless-ngx Logo" width="21%">
</p>

# Paperless-ngx on StartOS

> **Upstream repo:** <https://github.com/paperless-ngx/paperless-ngx>

Paperless-ngx is a community-supported document management system: scan, index, and archive all your documents. This StartOS package bundles the official upstream image with a sidecar Redis broker, generates an admin user on install, and exposes the web UI as a StartOS interface.

## Image and Container Runtime

| Property        | Value                                                       |
| --------------- | ----------------------------------------------------------- |
| Paperless image | `ghcr.io/paperless-ngx/paperless-ngx:2.20.15`               |
| Redis image     | `redis:8-alpine`                                            |
| Architectures   | x86_64, aarch64                                             |
| Entrypoint      | Upstream `/init` (s6-overlay supervises web, worker, schedule) |
| Web port        | `8000` (internal)                                           |
| Database        | SQLite (default — no external DB dependency)                |

## Volume and Data Layout

A single `main` volume holds all persistent state, with these subpaths mounted into the Paperless container:

| Subpath    | Mountpoint                       | Purpose                                    |
| ---------- | -------------------------------- | ------------------------------------------ |
| `data`     | `/usr/src/paperless/data`        | SQLite DB, search index, classifier model  |
| `media`    | `/usr/src/paperless/media`       | Stored documents and thumbnails            |
| `consume`  | `/usr/src/paperless/consume`     | Watched folder — drop files here to import |
| `export`   | `/usr/src/paperless/export`      | Document exporter output                   |
| `store.json` | (read by package code)         | Generated admin credentials and secret key |

Redis runs in an ephemeral subcontainer with persistence disabled — task state is regenerated on restart.

## Installation and First-Run Flow

1. Install the package.
2. The install hook (`seedStore`) generates `adminUser=admin`, a random `adminPassword`, and a random `PAPERLESS_SECRET_KEY` into `store.json`.
3. On first start, the Paperless container reads `PAPERLESS_ADMIN_USER` / `PAPERLESS_ADMIN_PASSWORD` and creates the superuser automatically.
4. Run the **Get Admin Credentials** action to retrieve the password, then sign in via the **Web UI** interface.

## Actions (StartOS UI)

| Action ID                | What it does                                              |
| ------------------------ | --------------------------------------------------------- |
| `get-admin-credentials`  | Display the generated admin username and password.        |

## Network Access and Interfaces

A single `ui` interface (`Web UI`) binds the internal port `8000` over HTTP. StartOS handles TLS termination via its reverse proxy.

`PAPERLESS_ALLOWED_HOSTS=*` and `PAPERLESS_CSRF_TRUSTED_ORIGINS` / `PAPERLESS_CORS_ALLOWED_HOSTS` are computed from the interface's hostnames so login works across LAN, Tor, and clearnet.

## Health Checks

| Daemon      | Check                                |
| ----------- | ------------------------------------ |
| `redis`     | TCP listen on port 6379              |
| `paperless` | TCP listen on port 8000 (120 s grace) |

The `paperless` daemon `requires: ['redis']`, so the broker is up before the web app starts.

## Limitations and Differences from Upstream

- The package uses **SQLite**, not PostgreSQL. Suitable for personal archives; large libraries should consider Postgres (not yet packaged here).
- Redis runs as an in-package sidecar, not as a separate StartOS service.
- Gotenberg and Tika (optional document preprocessors for non-PDF formats) are not bundled.

## Backups and Restore

The `main` volume is included in StartOS backups, which covers documents, the search index, the database, and generated credentials.
