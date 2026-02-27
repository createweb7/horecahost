# Shared Hosting PDF Storage Setup Guide

## Overview
Store all 265 PDF brochures on your shared hosting, keeping your main app lightweight.

---

## **Setup Instructions**

### **Step 1: Prepare Shared Hosting**

1. **Access your shared hosting cPanel**
   - Login to your hosting control panel
   - Go to File Manager

2. **Create brochures directory**
   ```
   public_html/
   └── brochures/  ← Create this folder
   ```

3. **Upload all PDF files**
   - Drag & drop 265 PDFs from `/public/brochure/` to `public_html/brochures/`
   - Or use FTP client (faster for 500MB)
   - Takes 10-30 minutes depending on upload speed

4. **Get your domain URL**
   - Example: `https://yoursite.com/brochures/post_08150_799.pdf`
   - Or: `https://files.yoursite.com/brochures/post_08150_799.pdf`
   - Note this down for Step 2

---

### **Step 2: Update Supabase Database**

1. **Go to Supabase SQL Editor**
   - Open [console.prisma.io](https://console.prisma.io)
   - Select your project → SQL Editor

2. **First, add the column** (if not exists):
   ```sql
   ALTER TABLE brochures ADD COLUMN external_url VARCHAR(500);
   ```

3. **Update all brochures with external URLs**
   - Replace `https://your-shared-hosting.com` with your actual domain
   
   ```sql
   UPDATE brochures 
   SET external_url = CONCAT('https://your-shared-hosting.com/brochures/', filename)
   WHERE external_url IS NULL;
   ```

4. **Verify the update**
   ```sql
   SELECT COUNT(*) as total, COUNT(external_url) as with_urls FROM brochures;
   -- Should show: total: 265, with_urls: 265
   ```

---

### **Step 3: Test the Setup**

1. **Test a single brochure URL**
   ```bash
   curl -I https://your-shared-hosting.com/brochures/post_08150_799.pdf
   # Should return: HTTP/1.1 200 OK
   ```

2. **Test the API**
   ```bash
   curl -X POST http://localhost:3000/api/brochures \
     -H "Content-Type: application/json" \
     -d '{"product_id": 799}'
   
   # Check response - url should be your external URL
   ```

3. **Test in browser**
   - Go to product page
   - Click "View" button
   - PDF should open from your shared hosting

---

### **Step 4: Cleanup (Optional but Recommended)**

Delete local copies to save space:

```bash
# Remove local brochure folder from your app
rm -rf public/brochure/

# Rebuild and deploy
npm run build
# Deploy to production
```

This saves **500 MB** on your deployment!

---

## **Troubleshooting**

| Problem | Solution |
|---------|----------|
| **404 errors when viewing PDF** | Check URL is correct: `https://your-domain.com/brochures/filename.pdf` |
| **CORS errors** | Add headers to shared hosting `.htaccess`: `Header set Access-Control-Allow-Origin "*"` |
| **Slow PDF downloads** | Shared hosting bandwidth is limited; consider CDN or upgrade hosting |
| **Files disappeared** | Shared hosting might have auto-cleanup; keep backups |

---

## **Next Steps**

1. ✅ Upload PDFs to shared hosting
2. ✅ Update database with external URLs
3. ✅ Test everything works
4. ✅ Delete `/public/brochure/` locally
5. ✅ Deploy to production

---

## **Important Notes**

- **Bandwidth**: Shared hosting has bandwidth limits. Monitor usage.
- **Uptime**: Shared hosting can be slow. Consider CDN if issues arise.
- **Future**: If you outgrow shared hosting, migrate to AWS S3 or Supabase Storage
- **Backup**: Keep backup copies of PDFs somewhere safe

---

## **Costs**

- **Shared Hosting**: Already paying for it ✓
- **No additional costs**
- **Bandwidth**: Included in your hosting plan

---

## **Questions?**

If you need help with any step, let me know! 🚀
