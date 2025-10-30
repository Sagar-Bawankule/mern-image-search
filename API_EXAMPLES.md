# 🔌 API Examples - cURL & Postman

Quick reference for testing all API endpoints.

## 🔐 Authentication Endpoints

### 1. Get Current User
Check if user is logged in and get user info.

**cURL:**
```bash
curl -X GET http://localhost:5000/auth/current-user \
  -H "Cookie: connect.sid=YOUR_SESSION_COOKIE" \
  --cookie-jar cookies.txt \
  --cookie cookies.txt
```

**Response (Logged In):**
```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "displayName": "John Doe",
    "email": "john@example.com",
    "avatar": "https://avatars.githubusercontent.com/u/12345"
  }
}
```

**Response (Not Logged In):**
```json
{
  "user": null
}
```

---

### 2. Logout
Destroy user session and logout.

**cURL:**
```bash
curl -X GET http://localhost:5000/auth/logout \
  -H "Cookie: connect.sid=YOUR_SESSION_COOKIE" \
  --cookie-jar cookies.txt \
  --cookie cookies.txt
```

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

---

### 3. OAuth Login
**Note:** OAuth endpoints must be accessed via browser, not cURL.

**Google OAuth:**
```
http://localhost:5000/auth/google
```

**GitHub OAuth:**
```
http://localhost:5000/auth/github
```

**Facebook OAuth:**
```
http://localhost:5000/auth/facebook
```

---

## 🔍 API Endpoints

### 1. Search Images
Search for images using Unsplash API. **Requires authentication.**

**cURL:**
```bash
curl -X GET "http://localhost:5000/api/search?query=mountains&page=1" \
  -H "Cookie: connect.sid=YOUR_SESSION_COOKIE" \
  --cookie-jar cookies.txt \
  --cookie cookies.txt
```

**Parameters:**
- `query` (required): Search term (e.g., "mountains", "sunset")
- `page` (optional): Page number, default is 1

**Response:**
```json
{
  "results": [
    {
      "id": "abc123xyz",
      "urls": {
        "raw": "https://images.unsplash.com/photo-123",
        "full": "https://images.unsplash.com/photo-123?w=2000",
        "regular": "https://images.unsplash.com/photo-123?w=1080",
        "small": "https://images.unsplash.com/photo-123?w=400",
        "thumb": "https://images.unsplash.com/photo-123?w=200"
      },
      "user": {
        "name": "John Doe",
        "username": "johndoe",
        "portfolio_url": "https://unsplash.com/@johndoe"
      },
      "description": "Beautiful mountain landscape",
      "alt_description": "snow covered mountains during daytime",
      "likes": 1234,
      "width": 4000,
      "height": 3000
    }
  ],
  "total": 10000,
  "total_pages": 1000
}
```

**More Examples:**
```bash
# Search for sunset
curl -X GET "http://localhost:5000/api/search?query=sunset" \
  --cookie cookies.txt

# Search for ocean, page 2
curl -X GET "http://localhost:5000/api/search?query=ocean&page=2" \
  --cookie cookies.txt

# Search for city
curl -X GET "http://localhost:5000/api/search?query=city" \
  --cookie cookies.txt
```

---

### 2. Get Search History
Get current user's search history. **Requires authentication.**

**cURL:**
```bash
curl -X GET http://localhost:5000/api/search-history \
  -H "Cookie: connect.sid=YOUR_SESSION_COOKIE" \
  --cookie-jar cookies.txt \
  --cookie cookies.txt
```

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "userId": "507f1f77bcf86cd799439000",
    "query": "mountains",
    "createdAt": "2025-10-30T12:00:00.000Z",
    "updatedAt": "2025-10-30T12:00:00.000Z"
  },
  {
    "_id": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439000",
    "query": "sunset",
    "createdAt": "2025-10-30T11:30:00.000Z",
    "updatedAt": "2025-10-30T11:30:00.000Z"
  },
  {
    "_id": "507f1f77bcf86cd799439013",
    "userId": "507f1f77bcf86cd799439000",
    "query": "ocean",
    "createdAt": "2025-10-30T11:00:00.000Z",
    "updatedAt": "2025-10-30T11:00:00.000Z"
  }
]
```

---

### 3. Get Top Searches
Get top 10 most searched terms across all users. **No authentication required.**

**cURL:**
```bash
curl -X GET http://localhost:5000/api/top-searches
```

**Response:**
```json
[
  {
    "_id": "mountains",
    "count": 145
  },
  {
    "_id": "sunset",
    "count": 98
  },
  {
    "_id": "ocean",
    "count": 87
  },
  {
    "_id": "forest",
    "count": 76
  },
  {
    "_id": "city",
    "count": 65
  },
  {
    "_id": "beach",
    "count": 54
  },
  {
    "_id": "night",
    "count": 48
  },
  {
    "_id": "sky",
    "count": 42
  },
  {
    "_id": "nature",
    "count": 38
  },
  {
    "_id": "landscape",
    "count": 35
  }
]
```

---

## 🍪 Working with Sessions (cURL)

Since the app uses session-based authentication, you need to maintain cookies across requests.

### Method 1: Save and Reuse Cookies

```bash
# First, login via browser at http://localhost:5000/auth/google
# Then export cookies using browser extension or dev tools

# Use the session cookie in subsequent requests
curl -X GET http://localhost:5000/api/search?query=test \
  -H "Cookie: connect.sid=s%3AYourSessionID.signature"
```

### Method 2: Cookie Jar (Automatic)

```bash
# Login via browser first, then:

# Create cookie jar file
curl -X GET http://localhost:5000/auth/current-user \
  --cookie-jar cookies.txt \
  --cookie cookies.txt

# Reuse cookies automatically
curl -X GET http://localhost:5000/api/search?query=mountains \
  --cookie cookies.txt
```

---

## 📮 Postman Collection

### Import the Collection

1. Open Postman
2. Click **Import**
3. Select `MERN-Image-Search.postman_collection.json`
4. Collection will appear in left sidebar

### Set Environment Variable

1. Create new environment in Postman
2. Add variable:
   - **Key:** `baseUrl`
   - **Value:** `http://localhost:5000`

### Authentication in Postman

**Option 1: Login via Browser**
1. Login at `http://localhost:3000`
2. Open Browser Dev Tools → Application → Cookies
3. Copy `connect.sid` cookie value
4. In Postman → Headers → Add:
   - Key: `Cookie`
   - Value: `connect.sid=PASTE_VALUE_HERE`

**Option 2: Use Postman Interceptor**
1. Install Postman Interceptor browser extension
2. Enable in Postman
3. Login via browser
4. Postman will automatically use browser cookies

---

## 🧪 Testing Workflow

### Complete Test Flow

```bash
# 1. Check if logged in
curl -X GET http://localhost:5000/auth/current-user \
  --cookie-jar cookies.txt --cookie cookies.txt

# 2. Login via browser (if not logged in)
# Visit: http://localhost:3000 and login

# 3. Search for images
curl -X GET "http://localhost:5000/api/search?query=mountains" \
  --cookie cookies.txt

# 4. Check search history
curl -X GET http://localhost:5000/api/search-history \
  --cookie cookies.txt

# 5. Get top searches
curl -X GET http://localhost:5000/api/top-searches

# 6. Logout
curl -X GET http://localhost:5000/auth/logout \
  --cookie cookies.txt
```

---

## 🐛 Troubleshooting

### "Unauthorized" Error
**Problem:** Getting 401 Unauthorized

**Solution:**
- Make sure you're logged in via browser first
- Check cookie is being sent correctly
- Verify session hasn't expired

### "Cannot GET /api/search"
**Problem:** 404 Not Found

**Solution:**
- Make sure server is running (`npm run dev`)
- Check URL is correct (include query parameter)
- Verify you're using correct port (5000)

### Empty Search Results
**Problem:** Getting empty results array

**Solution:**
- Check Unsplash API key is valid
- Verify API key in `.env` file
- Check Unsplash API rate limits
- Try different search term

---

## 📊 Response Status Codes

| Status Code | Meaning | Description |
|-------------|---------|-------------|
| 200 | OK | Request successful |
| 401 | Unauthorized | Not logged in / Invalid session |
| 404 | Not Found | Endpoint doesn't exist |
| 500 | Internal Server Error | Server error (check logs) |

---

## 💡 Tips

1. **Always login first** before testing protected endpoints
2. **Use cookie jar** to maintain session across cURL requests
3. **Check server logs** if getting unexpected errors
4. **Verify .env file** has all required credentials
5. **Test in Postman** for easier debugging

---

## 📚 Additional Resources

- [cURL Documentation](https://curl.se/docs/)
- [Postman Learning Center](https://learning.postman.com/)
- [Unsplash API Docs](https://unsplash.com/documentation)
- [Express Session Docs](https://www.npmjs.com/package/express-session)

---

**Happy Testing! 🚀**
