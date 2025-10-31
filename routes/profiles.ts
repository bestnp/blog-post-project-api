import { Router, Request, Response } from 'express';
import { User } from '../types';

const router = Router();

// Mock Data
const users: User[] = [
  {
    id: 1,
    name: "john",
    age: 20,
    email: "john@example.com"
  }
];

/**
 * GET /profiles
 * Get user profile
 */
router.get('/', (req: Request, res: Response) => {
  try {
    const user = users.find(u => u.name === 'john');
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    res.status(200).json({
      data: {
        name: user.name,
        age: user.age
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

export default router;

