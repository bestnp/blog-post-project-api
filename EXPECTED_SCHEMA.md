# 📋 Expected Database Schema

## 🔐 Authentication Database (AUTH_DATABASE_URL)

### ตาราง `users`

ตารางนี้เก็บข้อมูลผู้ใช้ในระบบ ต้องอยู่ใน **Authentication Database** (AUTH_DATABASE_URL)

#### โครงสร้างที่ต้องการ:

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255),
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);
```

#### Columns ที่ Code ต้องการ:

| Column Name | Data Type | Nullable | Default | Description |
|------------|-----------|----------|---------|-------------|
| `id` | UUID | NOT NULL | - | Primary Key (ต้องตรงกับ Supabase Auth user id) |
| `username` | VARCHAR(255) | NOT NULL | - | Username (unique) |
| `name` | VARCHAR(255) | NULL | - | Display name |
| `email` | VARCHAR(255) | NOT NULL | - | Email (unique) |
| `role` | VARCHAR(50) | NOT NULL | 'user' | Role: 'user' หรือ 'admin' |
| `avatar_url` | TEXT | NULL | - | URL ของรูป avatar |
| `created_at` | TIMESTAMP | NULL | NOW() | วันที่สร้าง (optional) |
| `updated_at` | TIMESTAMP | NULL | NOW() | วันที่อัปเดต (optional) |

---

## 📝 Blog Posts Database (DATABASE_URL หรือ POSTGRES_URL)

### ตาราง `posts`

ตารางนี้เก็บข้อมูล blog posts อยู่ใน **Blog Posts Database** (DATABASE_URL/POSTGRES_URL)

#### โครงสร้างที่ต้องการ:

```sql
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    image TEXT,
    category_id INTEGER,
    description TEXT,
    content TEXT,
    status_id INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### ตาราง `categories`

```sql
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### ตาราง `statuses`

```sql
CREATE TABLE statuses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);
```

---

## ✅ การตรวจสอบ

### 1. ตรวจสอบตาราง users

รัน query นี้ใน Supabase SQL Editor (Authentication Database):

```sql
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM 
    information_schema.columns
WHERE 
    table_name = 'users'
ORDER BY 
    ordinal_position;
```

**ผลลัพธ์ที่ต้องการ:**
- ต้องมี columns: `id`, `username`, `name`, `email`, `role`, `avatar_url`
- `id` ต้องเป็น UUID และเป็น PRIMARY KEY
- `username` และ `email` ต้องเป็น UNIQUE
- `role` ต้องมี default = 'user'

### 2. ตรวจสอบข้อมูลในตาราง

```sql
SELECT * FROM users LIMIT 1;
```

**สิ่งที่ต้องตรวจสอบ:**
- มีข้อมูลในตารางหรือไม่
- `id` ตรงกับ Supabase Auth user id หรือไม่
- `role` เป็น 'user' หรือ 'admin'

---

## ⚠️ ปัญหาที่อาจพบ

### ปัญหา 1: ตาราง users ไม่มี column `avatar_url`

**แก้ไข:**
```sql
ALTER TABLE users ADD COLUMN avatar_url TEXT;
```

### ปัญหา 2: ตาราง users ไม่มี column `role`

**แก้ไข:**
```sql
ALTER TABLE users ADD COLUMN role VARCHAR(50) NOT NULL DEFAULT 'user';
```

### ปัญหา 3: `username` หรือ `email` ไม่ใช่ UNIQUE

**แก้ไข:**
```sql
-- ตรวจสอบก่อนว่ามีข้อมูลซ้ำหรือไม่
SELECT username, COUNT(*) 
FROM users 
GROUP BY username 
HAVING COUNT(*) > 1;

-- ถ้าไม่มีข้อมูลซ้ำ ให้เพิ่ม unique constraint
ALTER TABLE users ADD CONSTRAINT unique_username UNIQUE (username);
ALTER TABLE users ADD CONSTRAINT unique_email UNIQUE (email);
```

### ปัญหา 4: `id` ไม่ใช่ PRIMARY KEY

**แก้ไข:**
```sql
ALTER TABLE users ADD PRIMARY KEY (id);
```

---

## 🔧 สร้างตารางใหม่ (ถ้ายังไม่มี)

```sql
-- สร้างตาราง users ใหม่
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255),
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- สร้าง indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
```

---

## 📝 หมายเหตุ

1. **Database แยกกัน:**
   - `users` อยู่ใน **Authentication Database** (AUTH_DATABASE_URL)
   - `posts`, `categories`, `statuses` อยู่ใน **Blog Posts Database** (DATABASE_URL)

2. **User ID:**
   - `id` ในตาราง `users` ต้องตรงกับ `user.id` จาก Supabase Auth
   - เมื่อ register user ใหม่ จะได้ `id` จาก Supabase Auth และใช้ insert ลงตาราง `users`

3. **Role:**
   - Default role คือ `'user'`
   - Admin ต้องแก้ไข role เป็น `'admin'` ด้วยตนเอง

