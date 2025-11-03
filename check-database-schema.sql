-- ============================================
-- 📋 Database Schema Check Queries
-- ============================================
-- 
-- วิธีใช้:
-- 1. ไปที่ Supabase Dashboard → SQL Editor
-- 2. เปิด Database ที่ใช้สำหรับ Authentication (AUTH_DATABASE_URL)
-- 3. คัดลอกและรัน queries ด้านล่าง
-- 4. ส่งผลลัพธ์กลับมาเพื่อตรวจสอบ
--
-- ============================================

-- 🔍 Query 1: ตรวจสอบโครงสร้างตาราง users
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length
FROM 
    information_schema.columns
WHERE 
    table_name = 'users'
ORDER BY 
    ordinal_position;

-- 🔍 Query 2: ตรวจสอบข้อมูล constraints (primary key, unique, etc.)
SELECT
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name
FROM
    information_schema.table_constraints AS tc
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
WHERE
    tc.table_name = 'users'
ORDER BY
    tc.constraint_type,
    kcu.column_name;

-- 🔍 Query 3: ดูข้อมูลตัวอย่างในตาราง users (5 แถวแรก)
SELECT 
    id,
    username,
    name,
    email,
    role,
    avatar_url,
    created_at
FROM 
    users
LIMIT 5;

-- 🔍 Query 4: ตรวจสอบจำนวน users ทั้งหมด
SELECT 
    COUNT(*) as total_users,
    COUNT(CASE WHEN role = 'admin' THEN 1 END) as admin_count,
    COUNT(CASE WHEN role = 'user' THEN 1 END) as user_count
FROM 
    users;

-- 🔍 Query 5: ตรวจสอบว่า column avatar_url มีข้อมูลหรือไม่
SELECT 
    COUNT(*) as total_users,
    COUNT(avatar_url) as users_with_avatar,
    COUNT(*) - COUNT(avatar_url) as users_without_avatar
FROM 
    users;

