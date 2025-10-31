# Validation Rules Documentation

## Overview
This document describes the validation rules implemented for the blog post API endpoints.

---

## Validation Rules for POST and PUT Operations

### Endpoints with Validation
- `POST /assignments` - Create new blog post
- `PUT /assignments/:id` - Update blog post

### Required Fields and Data Types

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | String | ✅ Yes | Title of the blog post |
| `image` | String | ✅ Yes | URL of the post image |
| `category_id` | Number | ✅ Yes | Category ID (must be a valid integer) |
| `description` | String | ✅ Yes | Short description of the post |
| `content` | String | ✅ Yes | Main content of the post |
| `status_id` | Number | ✅ Yes | Status ID (must be a valid integer) |

---

## Validation Error Messages

### Missing Field Errors
| Field | Error Message |
|-------|---------------|
| `title` | "Title is required" |
| `image` | "Image is required" |
| `category_id` | "Category ID is required" |
| `description` | "Description is required" |
| `content` | "Content is required" |
| `status_id` | "Status ID is required" |

### Type Error Messages
| Field | Error Message |
|-------|---------------|
| `title` | "Title must be a string" |
| `image` | "Image must be a string" |
| `category_id` | "Category ID must be a number" |
| `description` | "Description must be a string" |
| `content` | "Content must be a string" |
| `status_id` | "Status ID must be a number" |

---

## Response Format

### Success Response (201/200)
```json
{
  "message": "Created post successfully"
}
```

### Validation Error Response (400)
```json
{
  "message": "Validation failed",
  "errors": [
    {
      "field": "title",
      "message": "Title is required"
    },
    {
      "field": "category_id",
      "message": "Category ID must be a number"
    }
  ]
}
```

---

## Example Requests

### Valid POST Request
```bash
curl -X POST http://localhost:3001/assignments \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Blog Post",
    "image": "https://example.com/image.jpg",
    "category_id": 1,
    "description": "This is a great post",
    "content": "Full content here...",
    "status_id": 1
  }'
```

**Response:** 
```json
{
  "message": "Created post successfully"
}
```

---

### Invalid POST Request (Missing Fields)
```bash
curl -X POST http://localhost:3001/assignments \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Blog Post"
  }'
```

**Response (400):**
```json
{
  "message": "Validation failed",
  "errors": [
    {
      "field": "image",
      "message": "Image is required"
    },
    {
      "field": "category_id",
      "message": "Category ID is required"
    },
    {
      "field": "description",
      "message": "Description is required"
    },
    {
      "field": "content",
      "message": "Content is required"
    },
    {
      "field": "status_id",
      "message": "Status ID is required"
    }
  ]
}
```

---

### Invalid POST Request (Wrong Types)
```bash
curl -X POST http://localhost:3001/assignments \
  -H "Content-Type: application/json" \
  -d '{
    "title": 12345,
    "image": "https://example.com/image.jpg",
    "category_id": "one",
    "description": "Description",
    "content": "Content",
    "status_id": 1
  }'
```

**Response (400):**
```json
{
  "message": "Validation failed",
  "errors": [
    {
      "field": "title",
      "message": "Title must be a string"
    },
    {
      "field": "category_id",
      "message": "Category ID must be a number"
    }
  ]
}
```

---

## Implementation Details

### Validator Location
- **File:** `validators/postValidator.ts`
- **Function:** `validatePost` (middleware)
- **Validation Logic:** `validatePostData` (pure function)

### How It Works
1. Middleware intercepts POST/PUT requests
2. Validates request body against defined rules
3. If validation fails:
   - Returns 400 status code
   - Returns detailed error messages
   - Request doesn't proceed to database
4. If validation passes:
   - Request continues to route handler
   - Data is saved to database

### Type Safety
The validator uses TypeScript to ensure:
- ✅ Type checking at compile time
- ✅ Clear interface definitions
- ✅ IDE autocomplete support
- ✅ Runtime type validation

---

## Testing

All validation rules have been tested with:
- ✅ Missing fields
- ✅ Wrong data types
- ✅ Multiple validation errors
- ✅ Valid data
- ✅ Both POST and PUT endpoints

**Test Results:** All tests passed ✅

---

## Benefits

1. **Data Integrity** - Ensures only valid data enters the database
2. **Better UX** - Clear error messages help users fix issues
3. **Security** - Prevents invalid or malicious data
4. **Documentation** - Types serve as documentation
5. **Maintainability** - Centralized validation logic

---

## Future Enhancements

Possible improvements:
- [ ] Add length validation (min/max)
- [ ] Add format validation (URL, email)
- [ ] Add custom error messages
- [ ] Add field-level sanitization
- [ ] Add async validation (check if category exists)

