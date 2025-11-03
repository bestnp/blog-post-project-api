/**
 * Script สำหรับสร้าง Admin Account
 * วิธีใช้: npx ts-node create-admin.ts
 */

import { supabase } from './utils/db';
import { authPool } from './utils/db';
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query: string): Promise<string> {
  return new Promise(resolve => rl.question(query, resolve));
}

async function createAdmin() {
  try {
    console.log('🔐 สร้าง Admin Account\n');

    const email = await question('📧 กรอก Email: ');
    const password = await question('🔑 กรอก Password (อย่างน้อย 6 ตัวอักษร): ');
    const username = await question('👤 กรอก Username: ');
    const name = await question('📝 กรอก Name: ');

    if (!email || !password || !username) {
      console.error('❌ Email, Password และ Username จำเป็นต้องมี');
      rl.close();
      return;
    }

    if (password.length < 6) {
      console.error('❌ Password ต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
      rl.close();
      return;
    }

    console.log('\n⏳ กำลังสร้าง Admin Account...\n');

    // 1. สร้าง user ใน Supabase Auth
    const { data, error: supabaseError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (supabaseError) {
      if (supabaseError.code === 'user_already_exists') {
        console.log('ℹ️  User นี้มีอยู่แล้วใน Supabase Auth');
        console.log('📋 กำลังอัปเดต role เป็น admin...\n');
        
        // ถ้ามี user อยู่แล้ว ให้หา user ID จาก database
        const findUserQuery = 'SELECT id FROM users WHERE email = $1';
        const findResult = await authPool.query(findUserQuery, [email]);
        
        if (findResult.rows.length > 0) {
          const userId = findResult.rows[0].id;
          
          // อัปเดต role เป็น admin
          const updateQuery = 'UPDATE users SET role = $1 WHERE id = $2 RETURNING *';
          const updateResult = await authPool.query(updateQuery, ['admin', userId]);
          
          console.log('✅ อัปเดต role เป็น admin สำเร็จ!');
          console.log('📊 Admin Account:');
          console.log(JSON.stringify(updateResult.rows[0], null, 2));
          rl.close();
          return;
        } else {
          console.error('❌ ไม่พบ user ใน database');
          rl.close();
          return;
        }
      }
      
      console.error('❌ Error:', supabaseError.message);
      rl.close();
      return;
    }

    if (!data.user) {
      console.error('❌ ไม่สามารถสร้าง user ได้');
      rl.close();
      return;
    }

    const supabaseUserId = data.user.id;

    // 2. สร้าง user ใน database ด้วย role = 'admin'
    const query = `
      INSERT INTO users (id, username, name, role, email)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [supabaseUserId, username, name || username, 'admin', email];
    const { rows } = await authPool.query(query, values);

    console.log('✅ สร้าง Admin Account สำเร็จ!\n');
    console.log('📊 Admin Account Details:');
    console.log(JSON.stringify(rows[0], null, 2));
    console.log('\n🔐 Login Credentials:');
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log(`   Role: admin`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    rl.close();
  }
}

createAdmin();

