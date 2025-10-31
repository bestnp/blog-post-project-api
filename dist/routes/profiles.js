"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// Mock Data
const users = [
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
router.get('/', (req, res) => {
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
    }
    catch (error) {
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});
exports.default = router;
