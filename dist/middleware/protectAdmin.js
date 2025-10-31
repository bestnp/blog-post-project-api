"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../utils/db");
const db_2 = require("../utils/db");
/**
 * Middleware ตรวจสอบ JWT token และสิทธิ์ Admin
 * สำหรับป้องกันเส้นทาง (เฉพาะผู้ใช้ที่มีสิทธิ์ Admin)
 */
const protectAdmin = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // ดึง token จาก Authorization header
    if (!token) {
        res.status(401).json({ error: 'Unauthorized: Token missing' });
        return;
    }
    try {
        // ใช้ Supabase ดึงข้อมูลผู้ใช้จาก token
        const { data, error } = await db_1.supabase.auth.getUser(token);
        if (error || !data.user) {
            res.status(401).json({ error: 'Unauthorized: Invalid token' });
            return;
        }
        // ดึง user ID จากข้อมูลผู้ใช้ Supabase
        const supabaseUserId = data.user.id;
        // ดึงข้อมูล role ของผู้ใช้จากฐานข้อมูล PostgreSQL
        const query = `
      SELECT role FROM users 
      WHERE id = $1
    `;
        const values = [supabaseUserId];
        const { rows } = await db_2.authPool.query(query, values);
        if (!rows.length) {
            res.status(404).json({ error: 'User role not found' });
            return;
        }
        // แนบข้อมูลผู้ใช้พร้อม role เข้ากับ request object
        req.user = {
            id: data.user.id,
            email: data.user.email || '',
            username: data.user.user_metadata?.username,
            name: data.user.user_metadata?.name,
            role: rows[0].role
        };
        // ตรวจสอบว่าผู้ใช้เป็น admin หรือไม่
        if (req.user.role !== 'admin') {
            res.status(403).json({ error: 'Forbidden: You do not have admin access' });
            return;
        }
        // ดำเนินการต่อไปยัง middleware หรือ route handler ถัดไป
        next();
    }
    catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.default = protectAdmin;
