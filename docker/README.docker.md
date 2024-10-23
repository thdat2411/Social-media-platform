# PostgreSQL (locally)

## Docker Compose

```shell
docker compose down && docker compose up --build -d
```

## Backup with `pg_dump`

- PowerShell:

  ```powershell
  docker exec postgres pg_dump -d platform > ./backups/platform_$(Get-Date -Format "yyyyMMdd_HHmmss").sql
  ```
