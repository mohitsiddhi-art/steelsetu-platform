# Database Migrations

The live SteelSetu Supabase database does **not** match
`packages/database/prisma/schema.prisma`. The Prisma schema describes an
aspirational full platform (Order, Community, Ledger, ~30 models); the actual
database contains three flat, snake_case tables:

| Table             | Notes                                                            |
| ----------------- | ---------------------------------------------------------------- |
| `products`        | Flat catalogue. `price_per_ton_inr`, `inventory_tons`, etc.      |
| `rfq_inquiries`   | RFQ log. `product_id` FKs to `products(id)` ON DELETE SET NULL.  |
| `Company`         | Matches the Prisma `Company` model exactly (camelCase columns).  |

`Category`, `Brand`, `ProductOffer` and `DailyRate` **do not exist** in the live
database. Do not run `prisma db push` — it would create a parallel, conflicting
set of tables and risk dropping the real catalogue.

## How to apply a migration

Migrations here are plain SQL, applied in filename order, and tracked in the
`schema_migrations` table:

```bash
cd packages/database
npm run db:migrate
```

To roll back, run the matching `*.down.sql` file by hand.

## Rules for writing migrations

1. **Additive only.** Never `DROP` a column or table without confirming with the
   user first — the seeded catalogue is the only copy of the price data.
2. Use `IF NOT EXISTS` on every `ADD COLUMN` / `CREATE INDEX` so re-running is safe.
3. Wrap each migration in `BEGIN` / `COMMIT`.
4. New columns get a `DEFAULT` or are nullable, so existing rows stay valid.
