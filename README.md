# 🔍 MERN Image Search Application

A full-stack MERN (MongoDB, Express, React, Node.js) application that allows users to search for images using the Unsplash API, with OAuth authentication (Google, GitHub, Facebook) and search history tracking.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-18.x-blue.svg)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Screenshots](#screenshots)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

- 🔐 **OAuth Authentication** - Login with Google, GitHub, or Facebook
- 🔎 **Image Search** - Search millions of high-quality images via Unsplash API
- 📊 **Top Searches** - View trending search terms across all users
- 📜 **Search History** - Track your personal search history
- 🎨 **Multi-Select** - Select multiple images for download or further actions
- 💾 **MongoDB Integration** - Persistent data storage for users and search history
- 🎯 **Session Management** - Secure session handling with MongoDB store
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

### Frontend
- **React** 18.x - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Context API** - State management

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **Passport.js** - Authentication middleware
- **Express Session** - Session management

### APIs & Services
- **Unsplash API** - Image search and retrieval
- **Google OAuth 2.0** - Google authentication
- **GitHub OAuth** - GitHub authentication
- **Facebook OAuth** - Facebook authentication
- **MongoDB Atlas** - Cloud database hosting

## 📁 Project Structure

```
mern-image-search/
├── client/                      # React frontend
│   ├── public/
│   │   └── index.html          # HTML template
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   │   ├── ImageGrid.js    # Image display grid
│   │   │   ├── ImageGrid.css
│   │   │   ├── SearchBar.js    # Search input component
│   │   │   ├── SearchBar.css
│   │   │   ├── SearchHistory.js # User search history
│   │   │   ├── SearchHistory.css
│   │   │   ├── TopSearches.js  # Trending searches banner
│   │   │   └── TopSearches.css
│   │   ├── context/
│   │   │   └── AuthContext.js  # Authentication context
│   │   ├── pages/
│   │   │   ├── Home.js         # Main application page
│   │   │   ├── Home.css
│   │   │   ├── Login.js        # OAuth login page
│   │   │   └── Login.css
│   │   ├── App.js              # Main app component
│   │   ├── index.js            # Entry point
│   │   └── index.css           # Global styles
│   └── package.json            # Frontend dependencies
│
├── server/                      # Node.js backend
│   ├── config/
│   │   ├── database.js         # MongoDB connection
│   │   └── passport.js         # Passport OAuth strategies
│   ├── middleware/
│   │   └── auth.js             # Authentication middleware
│   ├── models/
│   │   ├── User.js             # User schema
│   │   └── SearchHistory.js    # Search history schema
│   ├── routes/
│   │   ├── auth.js             # OAuth routes
│   │   └── api.js              # API routes (search, history)
│   ├── server.js               # Server entry point
│   ├── .env.example            # Environment variables template
│   ├── .env                    # Environment variables (not in git)
│   └── package.json            # Backend dependencies
│
├── .gitignore                  # Git ignore rules
├── package.json                # Root package.json for scripts
└── README.md                   # Project documentation
```

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14.x or higher) - [Download](https://nodejs.org/)
- **npm** (v6.x or higher) - Comes with Node.js
- **MongoDB Atlas Account** - [Sign up](https://www.mongodb.com/cloud/atlas/register)
- **Git** - [Download](https://git-scm.com/)

### Required API Keys

You'll need to obtain API keys from:

1. **MongoDB Atlas** - Database connection string
2. **Unsplash API** - Image search functionality
3. **Google OAuth** (optional but recommended) - Google login
4. **GitHub OAuth** (optional) - GitHub login
5. **Facebook OAuth** (optional) - Facebook login

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/mern-image-search.git
cd mern-image-search
```

### 2. Install Dependencies

Install all dependencies for both client and server:

```bash
npm run install-all
```

This will install:
- Root dependencies (concurrently)
- Server dependencies
- Client dependencies

### 3. Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create a **free cluster** (M0 Sandbox)
3. Create a **database user**:
   - Username: Your choice (e.g., `mernuser`)
   - Password: Auto-generate or create secure password
4. **Whitelist IP Address**:
   - Go to Network Access
   - Add IP Address: `0.0.0.0/0` (Allow from anywhere for development)
5. **Get Connection String**:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<username>` and `<password>` with your credentials
   - Add database name: `/mern-image-search`

### 4. Set Up Unsplash API

1. Go to [Unsplash Developers](https://unsplash.com/developers)
2. Create a new application
3. Copy your **Access Key**

### 5. Set Up OAuth Providers

#### Google OAuth (Recommended)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Google+ API**
4. Go to **Credentials** → Create OAuth 2.0 Client ID
5. Application type: **Web application**
6. Authorized redirect URIs:
   - `http://localhost:5000/auth/google/callback`
7. Copy **Client ID** and **Client Secret**

#### GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create **New OAuth App**
3. Fill in:
   - Application name: `MERN Image Search`
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:5000/auth/github/callback`
4. Copy **Client ID** and **Client Secret**

#### Facebook OAuth (Optional)

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add **Facebook Login** product
4. Configure OAuth redirect URI: `http://localhost:5000/auth/facebook/callback`
5. Copy **App ID** and **App Secret**

### 6. Configure Environment Variables

Create a `.env` file in the `server/` directory:

```bash
cd server
cp .env.example .env
```

Edit `server/.env` with your credentials (see [Environment Variables](#environment-variables) section below).

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
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Facebook OAuth (optional)
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

### Environment Variables Explanation

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `MONGO_URI` | MongoDB Atlas connection string | Yes | `mongodb+srv://user:pass@cluster.mongodb.net/dbname` |
| `SESSION_SECRET` | Secret key for session encryption | Yes | `your-random-secret-key-here` |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | At least one OAuth | `123456.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | At least one OAuth | `GOCSPX-xxxxxxxxxxxxx` |
| `GITHUB_CLIENT_ID` | GitHub OAuth Client ID | Optional | `abc123def456` |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth Client Secret | Optional | `ghp_xxxxxxxxxxxxx` |
| `FACEBOOK_APP_ID` | Facebook App ID | Optional | `1234567890` |
| `FACEBOOK_APP_SECRET` | Facebook App Secret | Optional | `abcdef123456` |
| `UNSPLASH_ACCESS_KEY` | Unsplash API Access Key | Yes | `your-unsplash-key` |
| `PORT` | Server port number | No (default: 5000) | `5000` |
| `NODE_ENV` | Environment mode | No | `development` or `production` |
| `CLIENT_URL` | Frontend URL | Yes | `http://localhost:3000` |
| `SERVER_URL` | Backend URL | Yes | `http://localhost:5000` |

## ▶️ Running the Application

### Development Mode

Run both client and server concurrently:

```bash
npm run dev
```

This will start:
- **Backend server** on `http://localhost:5000`
- **Frontend client** on `http://localhost:3000`

### Run Separately

**Server only:**
```bash
npm run server
```

**Client only:**
```bash
npm run client
```

### Production Build

Build the client for production:

```bash
cd client
npm run build
```

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

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

Your Name - [@yourhandle](https://github.com/yourhandle)

## 🙏 Acknowledgments

- [Unsplash](https://unsplash.com/) for providing the image API
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for cloud database hosting
- [Passport.js](http://www.passportjs.org/) for authentication
- All contributors and testers

## 📞 Support

For support, email your-email@example.com or open an issue in the repository.

---

**Made with ❤️ using the MERN Stack**

A full-stack web application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) that allows authenticated users to search for images using the Unsplash API. Features OAuth authentication via Google, Facebook, and GitHub.

## 🌟 Features

- **OAuth Authentication**: Login with Google, Facebook, or GitHub using Passport.js
- **Image Search**: Search millions of high-quality images from Unsplash API
- **Multi-Select Grid**: 4-column responsive grid layout with checkbox overlays for image selection
- **Top Searches Banner**: Display the top 5 most frequent search terms across all users
- **Personal Search History**: View your past searches with timestamps
- **Real-time Selection Counter**: Track the number of selected images
- **Responsive Design**: Mobile-friendly interface

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher)
- **MongoDB** (running locally or MongoDB Atlas account)
- **npm** or **yarn**

## 🔑 Required API Keys

You'll need to obtain API credentials from the following services:

### 1. Unsplash API
- Go to [Unsplash Developers](https://unsplash.com/developers)
- Create a new application
- Copy your **Access Key**

### 2. Google OAuth
- Go to [Google Cloud Console](https://console.cloud.google.com/)
- Create a new project
- Enable Google+ API
- Create OAuth 2.0 credentials
- Add authorized redirect URI: `http://localhost:5000/auth/google/callback`
- Copy **Client ID** and **Client Secret**

### 3. Facebook OAuth
- Go to [Facebook Developers](https://developers.facebook.com/)
- Create a new app
- Add Facebook Login product
- Add Valid OAuth Redirect URI: `http://localhost:5000/auth/facebook/callback`
- Copy **App ID** and **App Secret**

### 4. GitHub OAuth
- Go to [GitHub Developer Settings](https://github.com/settings/developers)
- Create a new OAuth App
- Set Authorization callback URL: `http://localhost:5000/auth/github/callback`
- Copy **Client ID** and **Client Secret**

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd mern-image-search
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the `server` directory:

```bash
cd server
cp .env.example .env
```

Edit the `.env` file with your credentials:

```env
# MongoDB
MONGO_URI=mongodb://localhost:27017/mern-image-search
# OR use MongoDB Atlas
# MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/mern-image-search

# Session Secret
SESSION_SECRET=your-super-secret-session-key-change-this

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here

# Facebook OAuth
FACEBOOK_APP_ID=your-facebook-app-id-here
FACEBOOK_APP_SECRET=your-facebook-app-secret-here

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id-here
GITHUB_CLIENT_SECRET=your-github-client-secret-here

# Unsplash API
UNSPLASH_ACCESS_KEY=your-unsplash-access-key-here

# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
SERVER_URL=http://localhost:5000
```

### 4. Start MongoDB

If using local MongoDB:

```bash
# macOS/Linux
mongod

# Windows
# Make sure MongoDB service is running
```

If using MongoDB Atlas, ensure your connection string is correct in `.env`.

### 5. Run the Application

#### Option 1: Run Both (Recommended)

From the root directory:

```bash
npm run dev
```

This will start both the backend server (port 5000) and React frontend (port 3000).

#### Option 2: Run Separately

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm start
```

### 6. Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## 📁 Project Structure

```
mern-image-search/
├── client/                    # React frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── ImageGrid.js
│   │   │   ├── ImageGrid.css
│   │   │   ├── SearchBar.js
│   │   │   ├── SearchBar.css
│   │   │   ├── SearchHistory.js
│   │   │   ├── SearchHistory.css
│   │   │   ├── TopSearches.js
│   │   │   └── TopSearches.css
│   │   ├── context/          # React context
│   │   │   └── AuthContext.js
│   │   ├── pages/            # Page components
│   │   │   ├── Home.js
│   │   │   ├── Home.css
│   │   │   ├── Login.js
│   │   │   └── Login.css
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
│
├── server/                    # Express backend
│   ├── config/
│   │   ├── database.js       # MongoDB connection
│   │   └── passport.js       # Passport strategies
│   ├── middleware/
│   │   └── auth.js           # Authentication middleware
│   ├── models/
│   │   ├── User.js           # User schema
│   │   └── SearchHistory.js  # Search history schema
│   ├── routes/
│   │   ├── auth.js           # Authentication routes
│   │   └── api.js            # API routes
│   ├── .env.example
│   ├── server.js             # Express server
│   └── package.json
│
├── .gitignore
├── package.json
└── README.md
```

## 🔌 API Endpoints

### Authentication Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/auth/google` | Initiate Google OAuth |
| GET | `/auth/google/callback` | Google OAuth callback |
| GET | `/auth/facebook` | Initiate Facebook OAuth |
| GET | `/auth/facebook/callback` | Facebook OAuth callback |
| GET | `/auth/github` | Initiate GitHub OAuth |
| GET | `/auth/github/callback` | GitHub OAuth callback |
| GET | `/auth/logout` | Logout user |
| GET | `/auth/current-user` | Get current user info |

### API Routes (Protected)

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| GET | `/api/top-searches` | Get top 5 search terms | - |
| POST | `/api/search` | Search images | `{ term: string }` |
| GET | `/api/history` | Get user's search history | - |

## 🎨 Features in Detail

### 1. Authentication
- Secure OAuth 2.0 implementation
- Session-based authentication
- Protected routes

### 2. Top Searches Banner
- Displays the 5 most popular search terms
- Shows search count for each term
- Updates dynamically

### 3. Image Search
- Real-time search using Unsplash API
- Displays search results count
- Shows photographer attribution

### 4. Multi-Select Grid
- 4-column responsive grid layout
- Checkbox overlay on each image
- Visual feedback for selected images
- Real-time selection counter

### 5. Search History
- Personal search history for each user
- Timestamps with relative time display
- Click to re-search previous terms
- Limited to last 20 searches

## 🛠️ Technologies Used

### Frontend
- **React.js** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **CSS3** - Styling with Grid and Flexbox

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Passport.js** - Authentication middleware
  - passport-google-oauth20
  - passport-facebook
  - passport-github2
- **express-session** - Session management
- **connect-mongo** - MongoDB session store

### External APIs
- **Unsplash API** - Image search

## 🔒 Security Features

- Session-based authentication with MongoDB store
- HTTP-only cookies
- Environment variable protection
- CORS configuration
- Secure OAuth implementation

## 📝 Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/dbname` |
| `SESSION_SECRET` | Secret for session encryption | `random-secret-key` |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | `123456.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | `abc123def456` |
| `FACEBOOK_APP_ID` | Facebook app ID | `123456789` |
| `FACEBOOK_APP_SECRET` | Facebook app secret | `abc123def456` |
| `GITHUB_CLIENT_ID` | GitHub OAuth client ID | `abc123def456` |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth client secret | `xyz789uvw012` |
| `UNSPLASH_ACCESS_KEY` | Unsplash API access key | `abc123def456xyz789` |
| `PORT` | Server port | `5000` |
| `CLIENT_URL` | Frontend URL | `http://localhost:3000` |
| `SERVER_URL` | Backend URL | `http://localhost:5000` |

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod` or check MongoDB service
- Verify connection string in `.env`
- Check network connectivity for MongoDB Atlas

### OAuth Redirect Issues
- Verify redirect URIs in OAuth provider settings
- Ensure `SERVER_URL` matches your backend URL
- Check that ports match (default: 5000 for backend)

### CORS Errors
- Verify `CLIENT_URL` in `.env` matches your frontend URL
- Check CORS configuration in `server.js`

### Session Issues
- Clear browser cookies
- Restart the server
- Check MongoDB session store connection

## 📄 License

MIT License

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please open an issue in the repository.

---

**Happy Coding! 🚀**
