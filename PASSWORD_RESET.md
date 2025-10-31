# Password Reset & Change Documentation

> Complete guide for password reset and password change functionality

---

## 📋 Overview

We have **2 different endpoints** for password management:

1. **POST `/auth/reset-password`** - Reset password (from forgot password email)
2. **PUT `/auth/reset-password`** - Change password when logged in

---

## 🔑 1. POST /auth/reset-password

**Purpose:** Reset password using reset token from email (forgot password flow)

**Method:** `POST`

**URL:** `/auth/reset-password`

**No Authentication Required** ✅

---

### Request Body:
```json
{
  "password": "newpassword123"
}
```

**Validation:**
- ✅ password is required
- ✅ password must be at least 6 characters

---

### Response Success (200):
```json
{
  "message": "Password reset successful"
}
```

---

### Response Error (400):
```json
{
  "message": "Password must be at least 6 characters"
}
```

---

### Workflow:

```
1. User clicks "Forgot Password"
   ↓
2. User enters email
   ↓
3. POST /auth/forgot-password
   ↓
4. Supabase sends reset email
   ↓
5. User clicks link in email
   ↓
6. Frontend redirects to reset page
   ↓
7. User enters new password
   ↓
8. POST /auth/reset-password with new password
   ↓
9. Password updated successfully
```

---

## 🔐 2. PUT /auth/reset-password

**Purpose:** Change password when user is logged in (requires old password)

**Method:** `PUT`

**URL:** `/auth/reset-password`

**Authentication Required** ✅

---

### Headers:
```
Authorization: Bearer <access_token>
```

### Request Body:
```json
{
  "oldPassword": "oldpassword123",
  "newPassword": "newpassword456"
}
```

**Validation:**
- ✅ Access token required
- ✅ oldPassword required (for verification)
- ✅ newPassword required

---

### Response Success (200):
```json
{
  "message": "Password updated successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    ...
  }
}
```

---

### Response Error (401):
```json
{
  "error": "Unauthorized: Token missing"
}
```

```json
{
  "error": "Unauthorized: Invalid token"
}
```

---

### Response Error (400):
```json
{
  "error": "New password is required"
}
```

```json
{
  "error": "Invalid old password"
}
```

---

### Response Error (500):
```json
{
  "error": "Internal server error"
}
```

---

### Workflow:

```
1. User clicks "Change Password" in profile
   ↓
2. User enters old password and new password
   ↓
3. PUT /auth/reset-password with:
   - Authorization header (Bearer token)
   - oldPassword and newPassword
   ↓
4. Server verifies old password by trying to login
   ↓
5. If old password correct → Update to new password
   ↓
6. Return success message
```

---

## 💻 Usage Examples

### Example 1: Reset Password from Email

```javascript
// After user clicks link in reset email
const resetPassword = async (newPassword) => {
  const response = await fetch('http://localhost:3001/auth/reset-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      password: newPassword
    })
  });
  
  const data = await response.json();
  return data;
};

// Usage
try {
  await resetPassword('MyNewPassword123!');
  alert('Password reset successful!');
} catch (error) {
  alert('Failed to reset password');
}
```

---

### Example 2: Change Password When Logged In

```javascript
// Change password in user settings
const changePassword = async (oldPassword, newPassword) => {
  const token = localStorage.getItem('access_token');
  
  const response = await fetch('http://localhost:3001/auth/reset-password', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      oldPassword: oldPassword,
      newPassword: newPassword
    })
  });
  
  const data = await response.json();
  return data;
};

// Usage in React component
const handleChangePassword = async () => {
  try {
    const result = await changePassword(
      currentPassword,
      newPassword
    );
    
    if (result.message) {
      setSuccessMessage(result.message);
      // Clear form, logout, etc.
    }
  } catch (error) {
    setErrorMessage(error.message);
  }
};
```

---

### Example 3: Using Axios

```javascript
import axios from 'axios';

const changePassword = async (oldPassword, newPassword) => {
  const token = localStorage.getItem('access_token');
  
  try {
    const { data } = await axios.put(
      'http://localhost:3001/auth/reset-password',
      {
        oldPassword,
        newPassword
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    return data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error);
    }
    throw new Error('Network error');
  }
};
```

---

## 🧪 Testing with cURL

### Test 1: Reset Password (from email)

```bash
curl -X POST http://localhost:3001/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "password": "newpassword123"
  }'
```

**Expected:** Status 200 + success message

---

### Test 2: Change Password (logged in)

```bash
curl -X PUT http://localhost:3001/auth/reset-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "oldPassword": "oldpassword123",
    "newPassword": "newpassword456"
  }'
```

**Expected:** Status 200 + user data

---

### Test 3: Change Password without Token

```bash
curl -X PUT http://localhost:3001/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "oldPassword": "oldpassword123",
    "newPassword": "newpassword456"
  }'
```

**Expected:** Status 401 + "Token missing"

---

### Test 4: Change Password with Wrong Old Password

```bash
curl -X PUT http://localhost:3001/auth/reset-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "oldPassword": "wrongpassword",
    "newPassword": "newpassword456"
  }'
```

**Expected:** Status 400 + "Invalid old password"

---

## 📊 Comparison

| Feature | POST /reset-password | PUT /reset-password |
|---------|---------------------|---------------------|
| **Method** | POST | PUT |
| **Authentication** | ❌ No | ✅ Yes (token required) |
| **Old Password** | ❌ Not needed | ✅ Required |
| **Use Case** | Forgot password email | Change password in settings |
| **Email Required** | ✅ From reset email | ❌ Not needed |
| **Workflow** | Reset flow | User-initiated |

---

## 🔒 Security Features

### ✅ For Both Endpoints:
- Password hashing (handled by Supabase)
- Secure token validation
- Error messages don't leak information
- HTTPS in production

### ✅ For PUT /reset-password:
- **Old password verification** - Prevents unauthorized changes
- **Token required** - User must be logged in
- **Double verification** - Token + old password

---

## ⚠️ Common Issues

### Issue 1: "Token missing"
**Solution:** Make sure to send Authorization header:
```javascript
headers: {
  'Authorization': `Bearer ${token}`
}
```

### Issue 2: "Invalid old password"
**Cause:** User entered wrong old password
**Solution:** Ask user to re-enter old password

### Issue 3: "New password is required"
**Cause:** Missing newPassword in request body
**Solution:** Validate on frontend before sending

### Issue 4: "Password must be at least 6 characters"
**Solution:** Add client-side validation

---

## 🎯 Best Practices

### Frontend:

1. **Validate password strength**
   ```javascript
   const isStrongPassword = (password) => {
     return password.length >= 8 &&
            /[A-Z]/.test(password) &&
            /[a-z]/.test(password) &&
            /[0-9]/.test(password);
   };
   ```

2. **Show success/error messages**
   ```javascript
   if (response.ok) {
     showSuccess('Password changed successfully!');
     // Optionally logout user
     logout();
   } else {
     showError(result.error);
   }
   ```

3. **Clear sensitive data after submit**
   ```javascript
   setOldPassword('');
   setNewPassword('');
   ```

4. **Disable form during submission**
   ```javascript
   const [isSubmitting, setIsSubmitting] = useState(false);
   ```

---

## 📝 Implementation Details

### PUT /auth/reset-password Flow:

```
Request comes in
  ↓
Extract token from header
  ↓
If no token → Return 401
  ↓
Get user from token (Supabase)
  ↓
If invalid token → Return 401
  ↓
Try to login with old password
  ↓
If wrong old password → Return 400
  ↓
Update password (Supabase)
  ↓
Return success
```

---

## 🚀 Summary

✅ **POST /reset-password** - Forgot password flow  
✅ **PUT /reset-password** - Change password when logged in  
✅ **Old password verification** - Security feature  
✅ **Token validation** - Authentication required  
✅ **Error handling** - Clear error messages  
✅ **Type safety** - TypeScript support  

**Password management is production-ready!** 🔐

