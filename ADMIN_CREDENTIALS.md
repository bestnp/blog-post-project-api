# Admin Credentials

> Admin account information for the Blog Post API

---

## ✅ Admin Account Status: **ACTIVE**

The admin account has been created and tested successfully!

---

## 🔑 Admin Login Credentials

### Email:
```
admin@blog.com
```

### Password:
```
admin123
```

---

## 🚀 Quick Login

### Using cURL:
```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@blog.com",
    "password": "admin123"
  }'
```

### Response:
```json
{
  "message": "Signed in successfully",
  "access_token": "eyJhbGciOiJIUzI1NiIsImtpZCI6IlZBNmpUcTdPZjh2dkJhcl..."
}
```

---

## 📝 Using the Admin Token

After login, save the `access_token` and use it in all authenticated requests:

```bash
# Get admin profile
curl http://localhost:3001/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Create post with URL
curl -X POST http://localhost:3001/assignments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "title": "Admin Post",
    "image": "https://example.com/image.jpg",
    "category_id": 1,
    "description": "Description",
    "content": "Content here",
    "status_id": 1
  }'

# Upload post with file
curl -X POST http://localhost:3001/assignments/upload \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -F "imageFile=@image.jpg" \
  -F "title=My Post" \
  -F "category_id=1" \
  -F "description=Description" \
  -F "content=Content" \
  -F "status_id=1"

# Update post
curl -X PUT http://localhost:3001/assignments/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "title": "Updated Post",
    "image": "https://example.com/new-image.jpg",
    "category_id": 1,
    "description": "New description",
    "content": "New content",
    "status_id": 1
  }'

# Delete post
curl -X DELETE http://localhost:3001/assignments/1 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 👑 Admin Permissions

As an admin, you have access to:

✅ **Create** posts (with URL or file upload)  
✅ **Read** all posts  
✅ **Update** any post  
✅ **Delete** any post  
✅ **View** all profiles  
✅ **Manage** users (via database)  

---

## 🔒 Security Note

**IMPORTANT:** 
- ✅ Admin account is active
- ⚠️ Change password in production!
- 🚫 Never commit credentials to git
- 🔑 Use environment variables in production
- 🔐 Keep access tokens secure

---

## 📊 Admin Account Info

**Database:** `authentication`  
**Table:** `users`  
**User ID:** `95905948-3938-43a8-8f9c-3511dab7b0a9`  
**Username:** `admin`  
**Email:** `admin@blog.com`  
**Role:** `admin`  

---

## 🎉 Ready to Use!

The admin account is working perfectly and ready for testing! 🚀
