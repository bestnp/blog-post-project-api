"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePostData = validatePostData;
exports.validatePost = validatePost;
/**
 * Validate post data for create and update operations
 * @param data - The data to validate
 * @returns Array of validation errors (empty if valid)
 */
function validatePostData(data) {
    const errors = [];
    // Validate title
    if (data.title === undefined || data.title === null || data.title === '') {
        errors.push({
            field: 'title',
            message: 'Title is required'
        });
    }
    else if (typeof data.title !== 'string') {
        errors.push({
            field: 'title',
            message: 'Title must be a string'
        });
    }
    // Validate image
    if (data.image === undefined || data.image === null || data.image === '') {
        errors.push({
            field: 'image',
            message: 'Image is required'
        });
    }
    else if (typeof data.image !== 'string') {
        errors.push({
            field: 'image',
            message: 'Image must be a string'
        });
    }
    // Validate category_id
    if (data.category_id === undefined || data.category_id === null || data.category_id === '') {
        errors.push({
            field: 'category_id',
            message: 'Category ID is required'
        });
    }
    else if (typeof data.category_id !== 'number') {
        errors.push({
            field: 'category_id',
            message: 'Category ID must be a number'
        });
    }
    // Validate description
    if (data.description === undefined || data.description === null || data.description === '') {
        errors.push({
            field: 'description',
            message: 'Description is required'
        });
    }
    else if (typeof data.description !== 'string') {
        errors.push({
            field: 'description',
            message: 'Description must be a string'
        });
    }
    // Validate content
    if (data.content === undefined || data.content === null || data.content === '') {
        errors.push({
            field: 'content',
            message: 'Content is required'
        });
    }
    else if (typeof data.content !== 'string') {
        errors.push({
            field: 'content',
            message: 'Content must be a string'
        });
    }
    // Validate status_id
    if (data.status_id === undefined || data.status_id === null || data.status_id === '') {
        errors.push({
            field: 'status_id',
            message: 'Status ID is required'
        });
    }
    else if (typeof data.status_id !== 'number') {
        errors.push({
            field: 'status_id',
            message: 'Status ID must be a number'
        });
    }
    return errors;
}
/**
 * Middleware to validate post data
 */
function validatePost(req, res, next) {
    const errors = validatePostData(req.body);
    if (errors.length > 0) {
        res.status(400).json({
            message: 'Validation failed',
            errors: errors
        });
        return;
    }
    next();
}
