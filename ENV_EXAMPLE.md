# Environment Variables Configuration

## 📝 .env File Template

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration (PostgreSQL)
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres

# Supabase Configuration (for Authentication)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here

# Frontend URL (for password reset emails)
FRONTEND_URL=http://localhost:3000
```

---

## 🔧 How to Get Supabase Credentials

### 1. Go to Supabase Dashboard
Visit: [https://supabase.com/dashboard](https://supabase.com/dashboard)

### 2. Select Your Project

### 3. Get API Credentials
- Navigate to: **Settings** → **API**
- Copy these values:
  - **Project URL** → `SUPABASE_URL`
  - **anon public** key → `SUPABASE_ANON_KEY`

### 4. Get Database URL
- Navigate to: **Settings** → **Database**
- Scroll to **Connection string**
- Select **"URI"** tab
- Copy the connection string → `DATABASE_URL`
- **Important:** Replace `[YOUR-PASSWORD]` with your actual database password

---

## 📊 Required Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `PORT` | No | Server port | `3001` |
| `NODE_ENV` | No | Environment mode | `development` or `production` |
| `DATABASE_URL` | **Yes** | PostgreSQL connection string | `postgresql://postgres:...` |
| `SUPABASE_URL` | **Yes** | Supabase project URL | `https://xxx.supabase.co` |
| `SUPABASE_ANON_KEY` | **Yes** | Supabase anonymous key | `eyJhbGc...` |
| `FRONTEND_URL` | No | Frontend URL for emails | `http://localhost:3000` |

---

## ⚠️ Security Notes

1. **Never commit `.env` file to version control**
   - Already added to `.gitignore`

2. **Keep your keys secret**
   - Don't share SUPABASE_ANON_KEY publicly
   - Don't expose DATABASE_URL

3. **Use different keys for production**
   - Development and production should have separate Supabase projects

4. **Rotate keys regularly**
   - Update keys periodically for security

---

## ✅ Verification

To verify your environment variables are loaded:

```bash
# Start the server
npm run dev

# You should see:
✅ Connected to PostgreSQL database
✅ Supabase client initialized
🚀 Server is running on http://localhost:3001
```

If you see warnings:
```
⚠️  Supabase credentials not found in environment variables
```

This means `SUPABASE_URL` or `SUPABASE_ANON_KEY` is missing.

---

## 📖 Example .env File

```env
# Server
PORT=3001
NODE_ENV=development

# PostgreSQL Database
DATABASE_URL=postgresql://postgres:_Blog@post01@db.ywzvkyrmlggwhnzrfpdt.supabase.co:5432/postgres

# Supabase Auth
SUPABASE_URL=https://ywzvkyrmlggwhnzrfpdt.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3enZreXJtbGdnd2huenJmcGR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTg3NTM2MDAsImV4cCI6MjAxNDMyOTYwMH0.example

# Frontend
FRONTEND_URL=http://localhost:3000
```

---

## 🚀 Quick Start

1. Copy this file as `.env`:
```bash
cp ENV_EXAMPLE.md .env
```

2. Edit `.env` and replace values with your actual credentials

3. Start the server:
```bash
npm run dev
```

---

## 🆘 Troubleshooting

### Problem: "Database connection error"
- Check `DATABASE_URL` is correct
- Verify password doesn't have special characters (or URL encode them)
- Test connection: `psql "YOUR_DATABASE_URL"`

### Problem: "Supabase credentials not found"
- Verify `SUPABASE_URL` and `SUPABASE_ANON_KEY` are set
- Check for typos in variable names
- Restart server after changing `.env`

### Problem: Authentication not working
- Make sure Supabase Auth is enabled in your project
- Check email confirmation settings in Supabase dashboard
- Verify CORS settings allow your frontend URL

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Environment Variables in Node.js](https://nodejs.dev/learn/how-to-read-environment-variables-from-nodejs)
- [dotenv Package](https://www.npmjs.com/package/dotenv)

