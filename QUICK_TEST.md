# 🧪 Quick Test After Integration

> ทดสอบว่าทำงานแล้วหรือยัง

---

## ✅ **What's Done**

1. ✅ **Code Updated:** `utils/db.ts` supports `POSTGRES_URL`
2. ✅ **Integration Installed:** Vercel Supabase Integration added
3. ✅ **Variables Set:** `POSTGRES_URL` is in Environment Variables
4. ✅ **Code Pushed:** Committed and pushed to GitHub

---

## ⏳ **Wait for Vercel Auto-Deploy**

Vercel จะ auto-deploy เมื่อ detect push จาก GitHub

**Wait:** 1-2 minutes

---

## 🧪 **Test After Deploy**

### **Test Health Check:**
```bash
curl https://blog-post-project-api-five.vercel.app/health
```

**Expected:** `{"status":"OK","message":"Server is running"}`

### **Test Database Connection:**
```bash
curl https://blog-post-project-api-five.vercel.app/assignments
```

**Expected:** `{"data":[...]}` (array of blog posts)

---

## 🔍 **If Still Error**

### **Check Deployment Status:**

1. Go to Vercel Dashboard → **Deployments**
2. Click on the latest deployment
3. Check **"Build Logs"** and **"Runtime Logs"**

### **Check Variables:**

Vercel Dashboard → **Settings** → **Environment Variables**

Should have:
- ✅ `POSTGRES_URL` (green bolt icon)
- ✅ `SUPABASE_URL`
- ✅ `SUPABASE_ANON_KEY`
- ✅ Other integration variables

### **Check Code:**

Make sure `utils/db.ts` has:
```typescript
const databaseUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;
```

---

## 🎯 **Summary**

- **Integration:** ✅ Installed
- **Code:** ✅ Updated
- **Variables:** ✅ Set automatically
- **Deploy:** ⏳ Waiting...

**Wait 1-2 minutes, then test again!**

