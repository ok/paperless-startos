# Paperless-ngx

Paperless-ngx is a document management system that scans, indexes, and archives your physical documents. It runs OCR, organizes files by tags and correspondents, and exposes a fast searchable web interface.

## First-run setup

1. Wait for the **Web Interface** health check to turn green. The first start may take a minute or two while databases are migrated and OCR resources are unpacked.
2. From the service page, run the **Get Admin Credentials** action to retrieve the auto-generated username (`admin`) and password.
3. Open the **Web UI** interface and sign in. After the first login, change the password from the user menu inside Paperless-ngx.

## Adding documents

- **Web upload**: use the drag-and-drop area in the Paperless-ngx UI.
- **Consume folder**: drop files into the `consume/` directory inside the package's `main` volume — Paperless-ngx will pick them up automatically.

## Documentation

- [Paperless-ngx docs](https://docs.paperless-ngx.com/) — usage, configuration, and the consume directory workflow.
- [Upstream repository](https://github.com/paperless-ngx/paperless-ngx).
