# 🚀 Deployment Guide

This guide covers deployment options for the MERN Image Search application.

## 📋 Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] MongoDB Atlas database set up
- [ ] OAuth credentials (Google, GitHub) configured with production URLs
- [ ] Unsplash API key obtained
- [ ] Code tested locally
- [ ] Git repository up to date

---

## 🎯 Recommended Deployment Stack

### Backend (Node.js/Express)
- **Render** (Recommended - Free tier available)
- Railway
- Heroku
- AWS Elastic Beanstalk

### Frontend (React)
- **Vercel** (Recommended - Free tier, automatic deployments)
- Netlify
- AWS Amplify
- GitHub Pages (requires additional setup)

### Database
- **MongoDB Atlas** (Required - Free tier available)

---

## 📦 Option 1: Render + Vercel (Recommended)

### Backend Deployment on Render

1. **Create Render Account**
   - Sign up at [render.com](https://render.com)
   - Connect your GitHub account

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: `mern-image-search-api`
     - **Environment**: Node
     - **Build Command**: `cd server && npm install`
     - **Start Command**: `cd server && npm start`
     - **Plan**: Free

3. **Set Environment Variables**
   Go to Environment tab and add:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/mern-image-search
   SESSION_SECRET=your-super-secret-key-change-this
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GITHUB_CLIENT_ID=your-github-client-id
   GITHUB_CLIENT_SECRET=your-github-client-secret
   UNSPLASH_ACCESS_KEY=your-unsplash-key
   PORT=5000
   NODE_ENV=production
   CLIENT_URL=https://your-app.vercel.app
   SERVER_URL=https://your-service.onrender.com
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Note your backend URL: `https://your-service.onrender.com`

### Frontend Deployment on Vercel

1. **Create Vercel Account**
   - Sign up at [vercel.com](https://vercel.com)
   - Connect your GitHub account

2. **Import Project**
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Configure:
     - **Framework Preset**: Create React App
     - **Root Directory**: `client`
     - **Build Command**: `npm run build`
     - **Output Directory**: `build`

3. **Set Environment Variables**
   Go to Settings → Environment Variables:
   ```
   REACT_APP_API_URL=https://your-service.onrender.com
   ```

4. **Update Backend URL in Code**
   In `client/src/context/AuthContext.js`, update:
   ```javascript
   axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
   ```

5. **Deploy**
   - Click "Deploy"
   - Vercel will automatically deploy on every push to main branch
   - Your app will be live at: `https://your-app.vercel.app`

6. **Update OAuth Redirect URLs**
   - **Google Console**: Add `https://your-service.onrender.com/auth/google/callback`
   - **GitHub Settings**: Add `https://your-service.onrender.com/auth/github/callback`

---

## 📦 Option 2: Railway (All-in-One)

1. **Create Railway Account**
   - Sign up at [railway.app](https://railway.app)
   - Connect GitHub

2. **Deploy Backend**
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Add environment variables (same as Render)
   - Railway will auto-detect Node.js

3. **Deploy Frontend**
   - Click "New" → "GitHub Repo"
   - Configure root directory to `client`
   - Add build command: `npm run build`
   - Serve with static file server

4. **Set Up Custom Domains** (optional)
   - Go to Settings → Domains
   - Add custom domain or use Railway subdomain

---

## 📦 Option 3: Heroku

### Backend

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   heroku login
   ```

2. **Create Heroku App**
   ```bash
   cd server
   heroku create mern-image-search-api
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set MONGO_URI=your_mongo_uri
   heroku config:set SESSION_SECRET=your_secret
   heroku config:set GOOGLE_CLIENT_ID=your_google_id
   heroku config:set GOOGLE_CLIENT_SECRET=your_google_secret
   heroku config:set GITHUB_CLIENT_ID=your_github_id
   heroku config:set GITHUB_CLIENT_SECRET=your_github_secret
   heroku config:set UNSPLASH_ACCESS_KEY=your_unsplash_key
   heroku config:set NODE_ENV=production
   heroku config:set CLIENT_URL=https://your-frontend.vercel.app
   ```

4. **Create Procfile**
   Create `server/Procfile`:
   ```
   web: node server.js
   ```

5. **Deploy**
   ```bash
   git subtree push --prefix server heroku main
   ```

### Frontend on Vercel
Follow steps from Option 1

---

## 🗄️ MongoDB Atlas Setup

1. **Create Account**
   - Sign up at [mongodb.com/atlas](https://www.mongodb.com/atlas)

2. **Create Cluster**
   - Click "Build a Database"
   - Choose FREE tier (M0)
   - Select cloud provider and region
   - Create cluster

3. **Create Database User**
   - Go to Database Access
   - Add New Database User
   - Choose password authentication
   - Save credentials

4. **Configure Network Access**
   - Go to Network Access
   - Click "Add IP Address"
   - Choose "Allow Access from Anywhere" (0.0.0.0/0)
   - Confirm

5. **Get Connection String**
   - Go to Database → Connect
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<password>` with your database user password
   - Replace `<database>` with `mern-image-search`

---

## 🔐 OAuth Configuration for Production

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Select your project
3. Edit OAuth 2.0 Client ID
4. Add to **Authorized redirect URIs**:
   ```
   https://your-backend-url.onrender.com/auth/google/callback
   ```
5. Add to **Authorized JavaScript origins**:
   ```
   https://your-frontend-url.vercel.app
   https://your-backend-url.onrender.com
   ```

### GitHub OAuth

1. Go to [GitHub Settings → Developer settings → OAuth Apps](https://github.com/settings/developers)
2. Edit your OAuth App
3. Update:
   - **Homepage URL**: `https://your-frontend-url.vercel.app`
   - **Authorization callback URL**: `https://your-backend-url.onrender.com/auth/github/callback`

---

## 🔧 Production Optimizations

### Backend (server/server.js)

Update CORS configuration:
```javascript
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### Frontend Security

Update `client/package.json` to add proxy for local development only:
```json
"proxy": "http://localhost:5000"
```

For production, use environment variable:
```javascript
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
```

---

## 🧪 Testing Production Build Locally

### Backend
```bash
cd server
NODE_ENV=production npm start
```

### Frontend
```bash
cd client
npm run build
npx serve -s build -p 3000
```

---

## 📊 Monitoring & Maintenance

### Recommended Tools
- **Uptime Monitoring**: UptimeRobot, Pingdom
- **Error Tracking**: Sentry
- **Analytics**: Google Analytics, Mixpanel
- **Logging**: Papertrail, Loggly

### Performance Tips
1. Enable gzip compression in Express
2. Use CDN for static assets
3. Implement caching strategies
4. Optimize images (already using Unsplash CDN)
5. Use production builds
6. Monitor API rate limits (Unsplash: 50 requests/hour)

---

## 🆘 Troubleshooting

### CORS Errors
- Ensure `CLIENT_URL` in backend matches frontend URL exactly
- Check OAuth redirect URIs are correct
- Verify `credentials: true` in CORS config

### Session/Cookie Issues
- Set `sameSite: 'none'` and `secure: true` in session config for production
- Update in `server/server.js`:
  ```javascript
  app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    }
  }));
  ```

### OAuth Not Working
- Double-check all redirect URLs
- Ensure OAuth credentials are correct
- Check if callbacks are accessible

### Database Connection Issues
- Verify MongoDB Atlas network access allows your deployment IP
- Check connection string format
- Ensure database user has proper permissions

---

## 📝 Environment Variables Reference

### Backend (.env)
```bash
MONGO_URI=                  # MongoDB connection string
SESSION_SECRET=             # Session encryption key
GOOGLE_CLIENT_ID=          # Google OAuth client ID
GOOGLE_CLIENT_SECRET=      # Google OAuth client secret
GITHUB_CLIENT_ID=          # GitHub OAuth client ID
GITHUB_CLIENT_SECRET=      # GitHub OAuth client secret
UNSPLASH_ACCESS_KEY=       # Unsplash API access key
PORT=5000                  # Server port
NODE_ENV=production        # Environment mode
CLIENT_URL=                # Frontend URL
SERVER_URL=                # Backend URL
```

### Frontend (Vercel Environment Variables)
```bash
REACT_APP_API_URL=         # Backend API URL
```

---

## ✅ Post-Deployment Checklist

- [ ] Backend API accessible and responding
- [ ] Frontend loads without errors
- [ ] OAuth login works (Google, GitHub)
- [ ] Image search functionality working
- [ ] Favorites feature working
- [ ] Collections feature working
- [ ] Dashboard displaying data
- [ ] Profile updates saving
- [ ] Dark mode toggle working
- [ ] All API endpoints tested
- [ ] HTTPS enabled
- [ ] Custom domain configured (optional)
- [ ] Monitoring tools set up
- [ ] Backups configured for MongoDB

---

## 🎉 Success!

Your MERN Image Search application is now deployed and ready for production use!

For issues or questions:
- Check server logs in your hosting platform
- Review browser console for frontend errors
- Verify all environment variables are set correctly
- Test API endpoints directly using Postman or curl

---

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Express.js Production Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)
- [React Deployment Guide](https://create-react-app.dev/docs/deployment/)
