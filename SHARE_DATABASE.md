# Share horecahost_quotation Database with Others

There are multiple ways to share your new Supabase database with team members:

---

## Option 1: Share Supabase Project (Best for Team Collaboration)

### Step 1: Invite Team Members to Supabase Project
1. Go to [Supabase Console](https://app.supabase.com/)
2. Click your **Project** name
3. Go to **Settings** → **Team** (or **Members**)
4. Click **Invite Member**
5. Enter their email address
6. Select their role:
   - **Owner** - Full access
   - **Developer** - Full database access
   - **Viewer** - Read-only access
7. Click **Send Invite**

### Step 2: They Accept the Invitation
- They'll receive an email with the invite link
- Click the link to join the project
- They'll have immediate access to all databases

**Advantages:**
- ✅ Full control over permissions
- ✅ Can manage role-based access
- ✅ See all tables and data
- ✅ Can modify schema if needed
- ✅ Team collaboration features

---

## Option 2: Share Connection String (For Developers)

### For Direct Database Access:
```
postgresql://postgres:[PASSWORD]@db.wswvummuysfchzxwnyxe.supabase.co:5432/postgres
```

### How to Share Safely:
1. **Via Email (NOT SECURE)** ❌ - Only for testing
2. **Via Password Manager** (1Password, LastPass, Bitwarden) ✅ - Recommended
3. **Via Secure Sharing Service** (e.g., Tresorit, Sync.com) ✅
4. **Via Environment Variables** - Share only the `.env` file securely

### Connection String Parts:
```
postgresql://
  username : password
  @ host : port / database
```

---

## Option 3: Generate API Keys for Frontend Access

### Step 1: Get Your API Keys
1. Go to **Project Settings** → **API**
2. Copy:
   - **Project URL**: `https://uzwydvsprvwejpgfsejp.supabase.co`
   - **Anon Key**: (Public, safe to share in frontend)
   - **Service Role Key**: (Secret, keep private!)

### Step 2: Share with Frontend Developers
```typescript
// .env.local (safe to commit to git)
NEXT_PUBLIC_SUPABASE_URL=https://uzwydvsprvwejpgfsejp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Advantages:**
- ✅ Anon key is public-safe
- ✅ Can be committed to git
- ✅ RLS policies protect data
- ✅ Scalable access control

---

## Option 4: Create Read-Only Database User

### Step 1: Create Database Role
```sql
-- Connect as postgres user first

-- Create read-only user
CREATE ROLE quotation_reader WITH LOGIN PASSWORD 'your-secure-password';

-- Grant read-only access
GRANT CONNECT ON DATABASE postgres TO quotation_reader;
GRANT USAGE ON SCHEMA public TO quotation_reader;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO quotation_reader;

-- Make it default for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO quotation_reader;
```

### Share the Read-Only Credentials:
```
postgresql://quotation_reader:your-secure-password@db.wswvummuysfchzxwnyxe.supabase.co:5432/postgres
```

**Advantages:**
- ✅ Users can only read, not modify
- ✅ Safe for external stakeholders
- ✅ Audit trail available

---

## Option 5: Create Limited Access User (Editor)

```sql
-- Create editor user
CREATE ROLE quotation_editor WITH LOGIN PASSWORD 'editor-password';

-- Grant read + write access
GRANT CONNECT ON DATABASE postgres TO quotation_editor;
GRANT USAGE ON SCHEMA public TO quotation_editor;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO quotation_editor;

-- Make it default for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO quotation_editor;
```

---

## Option 6: Use Supabase RLS (Row Level Security)

### Step 1: Set Up RLS Policies
```sql
-- Example: Allow users to see only their own quotations

-- Create a quotations table (if needed)
CREATE TABLE quotations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  product_id integer REFERENCES products(id),
  created_at timestamp DEFAULT now()
);

-- Enable RLS
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;

-- Policy: Users can see only their own quotations
CREATE POLICY "Users can view own quotations"
  ON quotations FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own quotations
CREATE POLICY "Users can create quotations"
  ON quotations FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

### Step 2: Share Access
- Users sign in with their email
- They automatically see only their data
- No need to share credentials

**Advantages:**
- ✅ Most secure option
- ✅ Automatic data isolation
- ✅ Multi-user support
- ✅ Audit trail

---

## Option 7: Export Data & Share as File

### Export from Supabase:
1. Go to **Table Editor**
2. Select table → **More** (⋯) → **Download as CSV**
3. Send CSV file to others

```bash
# Or via command line
psql "postgresql://..." -c "COPY brands TO STDOUT WITH CSV HEADER" > brands.csv
```

**Advantages:**
- ✅ One-time share
- ✅ No ongoing access needed
- ✅ Can be emailed

---

## Security Best Practices

### ✅ DO:
- Use Supabase team invitations for permanent access
- Keep service role keys private
- Use RLS policies for data isolation
- Change passwords regularly
- Enable 2FA on Supabase account
- Use environment variables for secrets

### ❌ DON'T:
- Share `SERVICE_ROLE_KEY` publicly
- Commit credentials to git
- Share passwords via plain text email
- Use same password for multiple services
- Share credentials via messaging apps
- Allow access longer than needed

---

## Comparison Table

| Method | Security | Ease of Use | Best For |
|--------|----------|------------|----------|
| **Team Invite** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Team members (Recommended) |
| **API Keys** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Frontend developers |
| **Connection String** | ⭐⭐⭐ | ⭐⭐⭐ | Direct database access |
| **Read-Only User** | ⭐⭐⭐⭐ | ⭐⭐⭐ | External stakeholders |
| **RLS Policies** | ⭐⭐⭐⭐⭐ | ⭐⭐ | Multi-user applications |
| **CSV Export** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | One-time sharing |

---

## Quick Setup: Share via Team Invitation (Recommended)

```bash
# Step 1: Copy your Supabase Project URL
https://app.supabase.com/project/uzwydvsprvwejpgfsejp

# Step 2: Invite team member
# Go to Project Settings → Team → Invite Member
# Enter their email: colleague@company.com
# Select role: Developer
# Click Send Invite

# Step 3: They click the email link and join!
```

---

## Share Database Access Demo

### For Internal Team (Same Workspace):
```yaml
Project: horecahost-quotation
Members:
  - admin@company.com (Owner)
  - dev@company.com (Developer)
  - viewer@company.com (Viewer)

Database: postgres
Tables: brands, categories, subcategories, products
```

### For External Partners:
```yaml
Method: Read-Only Connection
URL: postgresql://quotation_reader:***@db...supabase.co:5432/postgres
Access: SELECT only on all tables
```

### For Frontend App:
```yaml
Method: API Keys + RLS
Public URL: https://uzwydvsprvwejpgfsejp.supabase.co
Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
RLS: Row-level policies enforce data isolation
```

---

## Troubleshooting Access Issues

### "Access Denied" Error
```sql
-- Check user permissions
SELECT grantee, privilege_type 
FROM information_schema.role_table_grants 
WHERE table_name = 'brands';
```

### "Connection Refused"
- Verify IP is whitelisted: Settings → Database → IP Whitelist
- Check credentials are correct
- Verify database is running

### "Invalid Credentials"
- Reset password in Supabase console
- Check connection string format
- Ensure no extra spaces in password

---

## Next Steps

1. **For team members**: Send Supabase project invite link
2. **For external**: Create read-only user account
3. **For apps**: Share API keys via environment variables
4. **Document**: Create team wiki with connection details
5. **Monitor**: Check Supabase logs for usage

Choose the method based on your use case and security requirements!
