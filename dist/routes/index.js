"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const assignments_1 = __importDefault(require("./assignments"));
const profiles_1 = __importDefault(require("./profiles"));
const health_1 = __importDefault(require("./health"));
const router = (0, express_1.Router)();
// Mount routes
router.use('/assignments', assignments_1.default);
router.use('/profiles', profiles_1.default);
router.use('/health', health_1.default);
exports.default = router;
