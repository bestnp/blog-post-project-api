"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
/**
 * GET /health
 * Health check endpoint
 */
router.get('/', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'Server is running'
    });
});
exports.default = router;
