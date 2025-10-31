import { Request, Response, NextFunction } from 'express';
import { supabase } from '../utils/db';

/**
 * Middleware ตรวจสอบ JWT token และดึง user_id
 * สำหรับป้องกันเส้นทาง (เฉพาะผู้ใช้ที่ล็อกอินแล้ว)
 */
const protectUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const token = req.headers.authorization?.split(' ')[1]; // ดึง token จาก Authorization header

  if (!token) {
    res.status(401).json({ error: 'Unauthorized: Token missing' });
    return;
  }

  try {
    // ใช้ Supabase ตรวจสอบ token และดึงข้อมูลผู้ใช้
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      res.status(401).json({ error: 'Unauthorized: Invalid token' });
      return;
    }

    // แนบข้อมูลผู้ใช้เข้ากับ request object
    req.user = {
      id: data.user.id,
      email: data.user.email || '',
      username: data.user.user_metadata?.username,
      name: data.user.user_metadata?.name,
      role: data.user.role
    };

    // ดำเนินการต่อไปยัง middleware หรือ route handler ถัดไป
    next();
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export default protectUser;

