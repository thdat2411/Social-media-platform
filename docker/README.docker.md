# PostgreSQL (locally)

## Docker Compose

```shell
docker compose down && docker compose up --build -d
```

## Backup with `pg_dump`

- PowerShell:

  ```shell
  docker exec postgres pg_dump -U admin -d platform > ./backup/backup_$(Get-Date -Format "yyyyMMdd_HHmmss").sql
  ```
