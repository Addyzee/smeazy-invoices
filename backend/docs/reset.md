### Clear alembic

Drop postgres schemas:

```sh
psql -U <username> -d smeazyinvoices
```

```sql
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
```

At /backend

```sh
rm -rf alembic/versions/*
alembic revision --autogenerate -m "init schema"
alembic upgrade head
```
