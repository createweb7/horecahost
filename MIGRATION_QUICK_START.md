# Quick Start: Run Migration to Supabase

Your connection string is ready. Follow these steps to create the horecahost_quotation schema:

## Option 1: Using Supabase Dashboard (Easiest)

1. Go to [Supabase Console](https://app.supabase.com/)
2. Click **SQL Editor** on the left sidebar
3. Click **New Query**
4. Copy and paste the SQL from: `migrations/001_create_horecahost_quotation_schema.sql`
5. Click **RUN** button
6. Done! Tables are created

## Option 2: Using Command Line (Fastest)

### Prerequisites
```bash
# Install PostgreSQL client (if not already installed)
brew install postgresql  # macOS
# or
sudo apt-get install postgresql-client  # Linux
```

### Run Migration
```bash
# From your project root directory
psql "postgresql://postgres:[YOUR-PASSWORD]@db.wswvummuysfchzxwnyxe.supabase.co:5432/postgres" < migrations/001_create_horecahost_quotation_schema.sql
```

**Replace `[YOUR-PASSWORD]` with your actual Supabase password**

## Option 3: Using Node.js Script

```bash
# Make the script executable (macOS/Linux)
chmod +x run-migration.js

# Run the migration
node run-migration.js
```

## Option 4: Using Bash Script

```bash
# Make the script executable (macOS/Linux)
chmod +x run-migration.sh

# Run the migration
./run-migration.sh
```

---

## Verify Migration Success

After running the migration, verify in Supabase Dashboard:

1. Go to **Table Editor**
2. You should see these new tables:
   - ✅ **brands**
   - ✅ **categories**  
   - ✅ **subcategories**
   - ✅ **products**

3. Each table should show:
   - Correct columns
   - Foreign key relationships
   - Indexes created

---

## Common Issues

### "psql: command not found"
**Solution:** Install PostgreSQL client
```bash
brew install postgresql  # macOS
# or
sudo apt-get install postgresql-client  # Linux
```

### "FATAL: invalid password authentication"
**Solution:** Verify your password in the connection string is correct

### "relation already exists"
**Solution:** The tables might already exist. You can:
- Check in Supabase Dashboard > Table Editor
- Or drop the tables first and re-run migration

### Connection timeout
**Solution:** 
- Check your internet connection
- Verify IP is whitelisted in Supabase: Settings > Database > IP Whitelist
- Check if Supabase project is active

---

## Next Steps

1. ✅ Schema migration complete
2. 📦 Update your app environment variables (if using new database)
3. 🔐 Configure RLS policies in Supabase
4. 📊 Add sample data for testing
5. 🚀 Deploy to production

---

## Connection String Breakdown

```
postgresql://postgres:[YOUR-PASSWORD]@db.wswvummuysfchzxwnyxe.supabase.co:5432/postgres
│                      │                │                                         │
└──────┬──────────────┘ └───────┬──────┘ └──────────────────┬─────────────────────┘
       │                        │                          │
    username              password              host         database

- Username: postgres
- Host: db.wswvummuysfchzxwnyxe.supabase.co
- Port: 5432
- Database: postgres
- Password: [YOUR-PASSWORD]
```

---

## Table Relationships

```
brands
  ├─ id (PK)
  ├─ name_en
  ├─ name_ar
  ├─ slug
  └─ country_en, country_ar

categories
  ├─ id (PK)
  ├─ name_en
  ├─ name_ar
  └─ slug

subcategories
  ├─ id (PK)
  ├─ category_id (FK → categories.id)
  ├─ name_en
  ├─ name_ar
  └─ slug

products
  ├─ id (PK)
  ├─ brand_id (FK → brands.id)
  ├─ category_id (FK → categories.id)
  ├─ subcategory_id (FK → subcategories.id)
  ├─ name_en, name_ar
  ├─ model, slug
  ├─ price, discount_price
  ├─ description_en, description_ar
  ├─ specifications (JSONB)
  ├─ images (JSONB)
  └─ active, created_at, updated_at
```

---

## Support

If you encounter issues:
1. Check Supabase status: https://status.supabase.com/
2. Review migration file: `migrations/001_create_horecahost_quotation_schema.sql`
3. Check Supabase logs: Project > Logs
4. Verify database connection in Supabase dashboard
