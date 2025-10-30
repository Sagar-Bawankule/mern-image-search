# 🔍 MERN Image Search Application

A full-stack MERN application for searching and managing images using Unsplash API with OAuth authentication.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-18.x-blue.svg)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Screenshots](#screenshots)

## ✨ Features

- 🔐 OAuth Authentication (Google, GitHub, Facebook)
- 🔎 Image Search via Unsplash API
- 📊 Top Searches Display
- 📜 Personal Search History
- 🎨 Multi-Select Images
- 💾 MongoDB Data Persistence

## 🛠️ Tech Stack

**Frontend:** React, React Router, Axios  
**Backend:** Node.js, Express, Passport.js  
**Database:** MongoDB Atlas  
**APIs:** Unsplash, Google/GitHub/Facebook OAuth

## � Installation & Setup

### Prerequisites
- Node.js (v14+)
- MongoDB Atlas account
- API keys (see Environment Variables section)

### Quick Start

```bash
# Clone repository
git clone https://github.com/Sagar-Bawankule/mern-image-search.git
cd mern-image-search

# Install dependencies
npm run install-all

# Configure environment (see below)
cd server
cp .env.example .env
# Edit .env with your credentials

# Run application
npm run dev
```

The app will run on:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 🔐 Environment Variables

Create `server/.env` file with the following variables:

```env
# MongoDB Connection
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/mern-image-search?retryWrites=true&w=majority

# Session Secret (generate a random string)
SESSION_SECRET=your-super-secret-session-key-change-in-production

# Google OAuth (at least one OAuth provider required)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-google-client-secret

# GitHub OAuth (optional)
## 🔑 Environment Variables

Create `server/.env`:

```env
# MongoDB
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/mern-image-search

# Session
SESSION_SECRET=your-random-secret-key

# OAuth Providers (at least one required)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret

# Unsplash API
UNSPLASH_ACCESS_KEY=your-unsplash-access-key

# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
SERVER_URL=http://localhost:5000
```

**Get API Keys:**
- **MongoDB**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) → Create cluster → Get connection string
- **Unsplash**: [Unsplash Developers](https://unsplash.com/developers) → Create app → Copy access key
- **Google OAuth**: [Google Console](https://console.cloud.google.com/) → Credentials → OAuth 2.0 Client → Redirect: `http://localhost:5000/auth/google/callback`
- **GitHub OAuth**: [GitHub Settings](https://github.com/settings/developers) → New OAuth App → Callback: `http://localhost:5000/auth/github/callback`
- **Facebook OAuth**: [Facebook Developers](https://developers.facebook.com/) → Create App → Facebook Login → Redirect: `http://localhost:5000/auth/facebook/callback`

## 📡 API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/auth/google` | Initiate Google OAuth | No |
| GET | `/auth/google/callback` | Google OAuth callback | No |
| GET | `/auth/github` | Initiate GitHub OAuth | No |
| GET | `/auth/github/callback` | GitHub OAuth callback | No |
| GET | `/auth/facebook` | Initiate Facebook OAuth | No |
| GET | `/auth/facebook/callback` | Facebook OAuth callback | No |
| GET | `/auth/current-user` | Get current logged-in user | No |
| GET | `/auth/logout` | Logout user | Yes |

### API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/search?query={term}` | Search images on Unsplash | Yes |
| GET | `/api/search-history` | Get user's search history | Yes |
| GET | `/api/top-searches` | Get top 10 search terms | No |

### Example API Requests

#### 1. Search Images

**cURL:**
```bash
curl -X GET "http://localhost:5000/api/search?query=mountains" \
  -H "Cookie: connect.sid=YOUR_SESSION_COOKIE"
```

**Response:**
```json
{
  "results": [
    {
      "id": "abc123",
      "urls": {
        "small": "https://images.unsplash.com/photo-123?w=400",
        "regular": "https://images.unsplash.com/photo-123?w=1080",
        "full": "https://images.unsplash.com/photo-123"
      },
      "user": {
        "name": "John Doe",
        "username": "johndoe"
      },
      "description": "Beautiful mountains",
      "alt_description": "Mountain landscape"
    }
  ],
  "total": 1000
}
```

#### 2. Get Search History

**cURL:**
```bash
curl -X GET "http://localhost:5000/api/search-history" \
  -H "Cookie: connect.sid=YOUR_SESSION_COOKIE"
```

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "query": "mountains",
    "createdAt": "2025-10-30T12:00:00.000Z"
  },
  {
    "_id": "507f1f77bcf86cd799439012",
    "query": "sunset",
    "createdAt": "2025-10-30T11:30:00.000Z"
  }
]
```

#### 3. Get Top Searches

**cURL:**
```bash
curl -X GET "http://localhost:5000/api/top-searches"
```

**Response:**
```json
[
  {
    "_id": "mountains",
    "count": 45
  },
  {
    "_id": "sunset",
    "count": 32
  },
  {
    "_id": "ocean",
    "count": 28
  }
]
```

## 📸 Screenshots

### OAuth Login Page
![Login Page](./screenshots/login-page.png)
*Multiple OAuth providers for authentication*

### Top Searches Banner
![Top Searches](./screenshots/top-searches.png)
*Trending search terms displayed prominently*

### Search Results with Multi-Select
![Search Results](./screenshots/search-results.png)
*Grid of images with multi-select functionality*

### Search History Section
![Search History](./screenshots/search-history.png)
*User's personal search history*

## 🌐 Deployment

### Deploy to Heroku

1. **Prepare for deployment:**
   ```bash
   # In server/package.json, add start script
   "start": "node server.js"
   ```

2. **Create Heroku app:**
   ```bash
   heroku create your-app-name
   ```

3. **Set environment variables:**
   ```bash
   heroku config:set MONGO_URI=your-mongodb-uri
   heroku config:set SESSION_SECRET=your-secret
   heroku config:set GOOGLE_CLIENT_ID=your-google-id
   heroku config:set GOOGLE_CLIENT_SECRET=your-google-secret
   heroku config:set UNSPLASH_ACCESS_KEY=your-unsplash-key
   heroku config:set CLIENT_URL=https://your-frontend-url.com
   heroku config:set SERVER_URL=https://your-app-name.herokuapp.com
   ```

4. **Deploy:**
   ```bash
   git push heroku main
   ```

### Deploy Frontend to Vercel/Netlify

1. Build the client:
   ```bash
   cd client
   npm run build
   ```

2. Deploy the `build/` folder to Vercel or Netlify

3. Update OAuth callback URLs in Google/GitHub to use production URLs

## � Screenshots

### OAuth Login Page
![Login Page](./screenshots/login-page.png)

### Top Searches Banner
![Top Searches](./screenshots/top-searches.png)

### Search Results with Multi-Select
![Search Results](./screenshots/search-results.png)

### Search History Section
![Search History](./screenshots/search-history.png)

## 🛠️ Troubleshooting

**MongoDB Connection Issues:**
- Ensure MongoDB is running or Atlas connection string is correct
- Check username/password don't contain special characters like `<>` in `.env`

**OAuth Redirect Issues:**
- Verify redirect URIs match in OAuth provider settings
- Check `SERVER_URL` and `CLIENT_URL` in `.env`

**CORS Errors:**
- Ensure `CLIENT_URL` matches your frontend URL

**Session Issues:**
- Clear browser cookies and restart server

---

**Made with ❤️ using the MERN Stack**

