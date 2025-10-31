"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Mount all routes
app.use('/', routes_1.default);
// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Endpoint not found'
    });
});
// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`\n📋 API Endpoints:`);
    console.log(`\n🔐 Authentication:`);
    console.log(`   POST   /auth/register        - Register new user`);
    console.log(`   POST   /auth/login           - Login user`);
    console.log(`   POST   /auth/logout          - Logout user (protected)`);
    console.log(`   GET    /auth/me              - Get current user (protected)`);
    console.log(`   POST   /auth/refresh         - Refresh access token`);
    console.log(`   POST   /auth/forgot-password - Request password reset`);
    console.log(`   POST   /auth/reset-password  - Reset password`);
    console.log(`\n📝 Blog Posts:`);
    console.log(`   GET    /assignments          - Get all blog posts`);
    console.log(`   GET    /assignments/:id      - Get single blog post`);
    console.log(`   POST   /assignments          - Create new blog post`);
    console.log(`   PUT    /assignments/:id      - Update blog post`);
    console.log(`   DELETE /assignments/:id      - Delete blog post`);
    console.log(`\n👤 Other:`);
    console.log(`   GET    /profiles             - Get John's profile`);
    console.log(`   GET    /health               - Health check`);
    console.log(``);
});
exports.default = app;
