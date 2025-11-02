import { Router, Request, Response } from 'express';
import pool from '../utils/db';
import protectAdmin from '../middleware/protectAdmin';

const router = Router();

/**
 * GET /categories
 * Get all categories
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const query = `
      SELECT id, name
      FROM categories
      ORDER BY id ASC
    `;
    
    const result = await pool.query(query);

    res.status(200).json({
      data: result.rows
    });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      message: 'Server could not fetch categories because database connection'
    });
  }
});

/**
 * GET /categories/:id
 * Get single category by ID
 */
router.get('/:id', async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT id, name
      FROM categories
      WHERE id = $1
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Server could not find a requested category'
      });
    }

    res.status(200).json({
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({
      message: 'Server could not fetch category because database connection'
    });
  }
});

/**
 * POST /categories
 * Create a new category (Protected - requires admin authentication)
 */
router.post('/', protectAdmin, async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    // Validate input
    if (!name) {
      return res.status(400).json({
        message: 'Category name is required'
      });
    }

    if (typeof name !== 'string') {
      return res.status(400).json({
        message: 'Category name must be a string'
      });
    }

    // Check if category already exists
    const checkQuery = 'SELECT id FROM categories WHERE name = $1';
    const checkResult = await pool.query(checkQuery, [name]);

    if (checkResult.rows.length > 0) {
      return res.status(400).json({
        message: 'Category with this name already exists'
      });
    }

    // Create category
    const query = `
      INSERT INTO categories (name)
      VALUES ($1)
      RETURNING *
    `;
    
    const values = [name];
    const result = await pool.query(query, values);

    res.status(201).json({
      message: 'Created category successfully',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({
      message: 'Server could not create category because database connection'
    });
  }
});

/**
 * PUT /categories/:id
 * Update a category by ID (Protected - requires admin authentication)
 */
router.put('/:id', protectAdmin, async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    // Validate input
    if (!name) {
      return res.status(400).json({
        message: 'Category name is required'
      });
    }

    if (typeof name !== 'string') {
      return res.status(400).json({
        message: 'Category name must be a string'
      });
    }

    // Check if category exists
    const checkQuery = 'SELECT id FROM categories WHERE id = $1';
    const checkResult = await pool.query(checkQuery, [id]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        message: 'Server could not find a requested category to update'
      });
    }

    // Check if new name is already taken by another category
    const nameCheckQuery = 'SELECT id FROM categories WHERE name = $1 AND id != $2';
    const nameCheckResult = await pool.query(nameCheckQuery, [name, id]);

    if (nameCheckResult.rows.length > 0) {
      return res.status(400).json({
        message: 'Category with this name already exists'
      });
    }

    // Update category
    const query = `
      UPDATE categories 
      SET name = $1
      WHERE id = $2
      RETURNING *
    `;
    
    const values = [name, id];
    await pool.query(query, values);

    res.status(200).json({
      message: 'Updated category successfully'
    });

  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({
      message: 'Server could not update category because database connection'
    });
  }
});

/**
 * DELETE /categories/:id
 * Delete a category by ID (Protected - requires admin authentication)
 */
router.delete('/:id', protectAdmin, async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;

    // Check if category exists
    const checkQuery = 'SELECT id FROM categories WHERE id = $1';
    const checkResult = await pool.query(checkQuery, [id]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        message: 'Server could not find a requested category to delete'
      });
    }

    // Check if category is used in any posts
    const usageQuery = 'SELECT id FROM posts WHERE category_id = $1 LIMIT 1';
    const usageResult = await pool.query(usageQuery, [id]);

    if (usageResult.rows.length > 0) {
      return res.status(400).json({
        message: 'Cannot delete category because it is used in existing posts'
      });
    }

    // Delete category
    const deleteQuery = 'DELETE FROM categories WHERE id = $1';
    await pool.query(deleteQuery, [id]);

    res.status(200).json({
      message: 'Deleted category successfully'
    });

  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      message: 'Server could not delete category because database connection'
    });
  }
});

export default router;

