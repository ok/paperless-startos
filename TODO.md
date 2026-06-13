# TODO

- Wire the `consume/` watched folder to a user-reachable source: optional **File Browser** dependency mounted read-only into the consume path, with a config action to toggle it (see `jellyfin-startos` / `audiobookshelf-startos` for the pattern).
- Consider exposing `PAPERLESS_OCR_LANGUAGE` and `PAPERLESS_TIME_ZONE` via a config action instead of hardcoding `eng` / `UTC`.
