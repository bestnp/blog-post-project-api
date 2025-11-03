/**
 * Script สำหรับตรวจสอบ Database Schema
 * วิธีใช้: npx ts-node check-database.ts
 */

import { authPool } from './utils/db';
import pool from './utils/db';

async function checkUsersTable() {
  console.log('🔍 กำลังตรวจสอบตาราง users...\n');

  try {
    // 1. ตรวจสอบโครงสร้างตาราง
    const schemaQuery = `
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
    `;

    const schemaResult = await authPool.query(schemaQuery);
    
    console.log('📊 โครงสร้างตาราง users:');
    console.log('─'.repeat(80));
    console.table(schemaResult.rows);

    // 2. ตรวจสอบ columns ที่จำเป็น
    const requiredColumns = ['id', 'username', 'name', 'email', 'role', 'avatar_url'];
    const existingColumns = schemaResult.rows.map((row: any) => row.column_name);
    
    console.log('\n✅ Columns ที่มีอยู่:', existingColumns);
    console.log('📋 Columns ที่ต้องการ:', requiredColumns);

    const missingColumns = requiredColumns.filter(col => !existingColumns.includes(col));
    
    if (missingColumns.length > 0) {
      console.error('\n❌ พบ columns ที่ขาดหายไป:', missingColumns);
      console.log('\n🔧 รัน SQL นี้เพื่อเพิ่ม columns:');
      missingColumns.forEach(col => {
        if (col === 'avatar_url') {
          console.log(`   ALTER TABLE users ADD COLUMN avatar_url TEXT;`);
        } else if (col === 'role') {
          console.log(`   ALTER TABLE users ADD COLUMN role VARCHAR(50) NOT NULL DEFAULT 'user';`);
        }
      });
    } else {
      console.log('\n✅ พบ columns ทั้งหมดที่จำเป็น!');
    }

    // 3. ตรวจสอบ constraints
    const constraintsQuery = `
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
    `;

    const constraintsResult = await authPool.query(constraintsQuery);
    
    console.log('\n📌 Constraints:');
    console.table(constraintsResult.rows);

    // 4. ตรวจสอบข้อมูลตัวอย่าง
    const sampleQuery = 'SELECT id, username, name, email, role, avatar_url FROM users LIMIT 3';
    const sampleResult = await authPool.query(sampleQuery);
    
    console.log('\n📝 ข้อมูลตัวอย่าง (3 แถวแรก):');
    if (sampleResult.rows.length > 0) {
      console.table(sampleResult.rows);
    } else {
      console.log('   (ไม่มีข้อมูลในตาราง)');
    }

    // 5. ตรวจสอบจำนวน users
    const countQuery = `
      SELECT 
          COUNT(*) as total_users,
          COUNT(CASE WHEN role = 'admin' THEN 1 END) as admin_count,
          COUNT(CASE WHEN role = 'user' THEN 1 END) as user_count
      FROM 
          users;
    `;
    const countResult = await authPool.query(countQuery);
    
    console.log('\n📊 สถิติ Users:');
    console.table(countResult.rows);

    // 6. ตรวจสอบ data types
    console.log('\n🔍 ตรวจสอบ Data Types:');
    const idColumn = schemaResult.rows.find((row: any) => row.column_name === 'id');
    const roleColumn = schemaResult.rows.find((row: any) => row.column_name === 'role');
    
    if (idColumn) {
      if (idColumn.data_type !== 'uuid') {
        console.warn(`⚠️  column 'id' ควรเป็น UUID แต่เป็น ${idColumn.data_type}`);
      } else {
        console.log('✅ column "id" เป็น UUID');
      }
    }
    
    if (roleColumn) {
      console.log(`✅ column "role" เป็น ${roleColumn.data_type}`);
      if (roleColumn.column_default !== "'user'::character varying") {
        console.warn('⚠️  column "role" อาจจะไม่มี default = "user"');
      } else {
        console.log('✅ column "role" มี default = "user"');
      }
    }

  } catch (error) {
    console.error('❌ Error:', error);
    if ((error as any).code === '42P01') {
      console.error('\n❌ ตาราง "users" ไม่มีอยู่ใน database!');
      console.log('\n🔧 สร้างตารางด้วย SQL นี้:');
      console.log(`
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
      `);
    }
  }
}

async function checkPostsTables() {
  console.log('\n\n🔍 กำลังตรวจสอบตาราง blog posts...\n');

  try {
    // ตรวจสอบตาราง posts
    const postsSchemaQuery = `
      SELECT 
          column_name,
          data_type,
          is_nullable
      FROM 
          information_schema.columns
      WHERE 
          table_name = 'posts'
      ORDER BY 
          ordinal_position;
    `;

    const postsResult = await pool.query(postsSchemaQuery);
    
    if (postsResult.rows.length > 0) {
      console.log('📊 โครงสร้างตาราง posts:');
      console.table(postsResult.rows);
    } else {
      console.log('⚠️  ไม่พบตาราง "posts"');
    }

    // ตรวจสอบตาราง categories
    const categoriesSchemaQuery = `
      SELECT 
          column_name,
          data_type,
          is_nullable
      FROM 
          information_schema.columns
      WHERE 
          table_name = 'categories'
      ORDER BY 
          ordinal_position;
    `;

    const categoriesResult = await pool.query(categoriesSchemaQuery);
    
    if (categoriesResult.rows.length > 0) {
      console.log('\n📊 โครงสร้างตาราง categories:');
      console.table(categoriesResult.rows);
    } else {
      console.log('\n⚠️  ไม่พบตาราง "categories"');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

async function main() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('   📋 Database Schema Checker');
  console.log('═══════════════════════════════════════════════════════════════\n');

  await checkUsersTable();
  await checkPostsTables();

  console.log('\n✅ ตรวจสอบเสร็จสิ้น!\n');
  process.exit(0);
}

main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});

