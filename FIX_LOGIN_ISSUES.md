# Fix Login Issues - Complete Guide

## Current Issues Detected:

1. ✅ **MongoDB Password Issue** - Fixed (removed angle brackets)
2. ⚠️ **SSL/TLS Error** - MongoDB Atlas connection failing
3. ❌ **Missing OAuth Credentials** - Google/Facebook/GitHub login not configured
4. ❌ **Server Crashed** - Due to MongoDB connection failure

---

## CRITICAL FIX: MongoDB Atlas Connection

### The SSL Error indicates one of these issues:

### **Option A: Verify MongoDB Atlas Credentials**

1. **Go to MongoDB Atlas** → https://cloud.mongodb.com
2. **Database Access** (left sidebar)
3. **Verify your user exists**: `sagarbawankule334_db_user`
4. **Click "Edit"** on the user
5. **Reset Password** → Click "Autogenerate Secure Password"
6. **COPY THE NEW PASSWORD** (without < > brackets!)
7. Click **"Update User"**

### **Option B: Check Network Access**

1. Go to **Network Access** in MongoDB Atlas
2. Verify `0.0.0.0/0` is in the IP Access List
3. If not, click **"Add IP Address"** → **"Allow Access from Anywhere"**
4. Wait 2-3 minutes for changes to take effect

### **Option C: Get Fresh Connection String**

1. Go to **Database** → Click **"Connect"** on your cluster
2. Choose **"Connect your application"**
3. **COPY** the new connection string
4. It should look like:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

---

## Step-by-Step Fix Instructions

### STEP 1: Get Your Correct MongoDB Connection String

**Method 1: From MongoDB Atlas UI**
1. Login to https://cloud.mongodb.com
2. Click "Connect" on your cluster
3. Choose "Drivers" → Node.js
4. Copy the connection string
5. Replace:
   - `<username>` with your actual username (NO brackets!)
   - `<password>` with your actual password (NO brackets!)
   - Add `/mern-image-search` after `.mongodb.net` and before `?`

**Final format should be:**
```
mongodb+srv://yourusername:yourpassword@cluster0.xxxxx.mongodb.net/mern-image-search?retryWrites=true&w=majority
```

### STEP 2: Update .env File

1. Open `server/.env`
2. Replace the MONGO_URI line with your corrected connection string
3. Make sure there are NO:
   - Angle brackets `< >`
   - Spaces
   - Line breaks
   - Comments on the same line

**Example:**
```env
MONGO_URI=mongodb+srv://myuser:MyP@ssw0rd@cluster0.abc123.mongodb.net/mern-image-search?retryWrites=true&w=majority
```

**Special Characters in Password?**
If your password contains special characters like `@`, `:`, `/`, `%`, encode them:
- `@` → `%40`
- `:` → `%3A`
- `/` → `%2F`
- `%` → `%25`

Or **create a new password without special characters** in MongoDB Atlas.

### STEP 3: Test Connection

1. Stop the server (Ctrl+C in terminal)
2. Run `npm run dev` again
3. Look for: **"MongoDB connected successfully"** ✅

---

## STEP 4: Setup OAuth (Required for Login)

Your app uses OAuth for authentication. You need at least ONE provider:

### **Quick Setup: Google OAuth (Recommended)**

1. **Go to Google Cloud Console**: https://console.cloud.google.com
2. **Create a new project** or select existing
3. **Enable APIs**:
   - Search for "Google+ API" → Enable
4. **Create Credentials**:
   - Go to "Credentials" (left sidebar)
   - Click "Create Credentials" → "OAuth client ID"
   - Application type: **Web application**
   - Name: `MERN Image Search`
   - Authorized redirect URIs:
     - `http://localhost:5000/auth/google/callback`
     - `http://localhost:5000/auth/google/callback`
5. **Copy Client ID and Client Secret**
6. Update `server/.env`:
   ```env
   GOOGLE_CLIENT_ID=your-google-client-id-here.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-google-client-secret-here
   ```

### **Alternative: GitHub OAuth (Easier)**

1. **Go to GitHub**: https://github.com/settings/developers
2. Click **"New OAuth App"**
3. Fill in:
   - Application name: `MERN Image Search Dev`
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:5000/auth/github/callback`
4. Click **"Register application"**
5. **Copy Client ID**
6. Click **"Generate a new client secret"** → Copy it
7. Update `server/.env`:
   ```env
   GITHUB_CLIENT_ID=your-github-client-id
   GITHUB_CLIENT_SECRET=your-github-client-secret
   ```

---

## STEP 5: Get Unsplash API Key (For Image Search)

1. **Go to Unsplash Developers**: https://unsplash.com/developers
2. **Register as a developer** (free)
3. **Create a New Application**
4. **Copy the Access Key**
5. Update `server/.env`:
   ```env
   UNSPLASH_ACCESS_KEY=your-unsplash-access-key
   ```

---

## Quick Fix Checklist

- [ ] MongoDB Atlas user password verified (no `< >` brackets)
- [ ] Network Access set to `0.0.0.0/0` in MongoDB Atlas
- [ ] MONGO_URI updated in `server/.env` with correct credentials
- [ ] Database name `mern-image-search` added to connection string
- [ ] At least ONE OAuth provider configured (Google or GitHub)
- [ ] Unsplash API key added
- [ ] Server restarted with `npm run dev`
- [ ] See "MongoDB connected successfully" message
- [ ] Can access http://localhost:3000

---

## Expected .env File Format

```env
# MongoDB
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/mern-image-search?retryWrites=true&w=majority

# Session Secret
SESSION_SECRET=mern-image-search-super-secret-key-2025-change-in-production

# Google OAuth (at least one provider needed)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth (optional)
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Unsplash API
UNSPLASH_ACCESS_KEY=your-unsplash-access-key

# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
SERVER_URL=http://localhost:5000
```

---

## Common Errors & Solutions

### Error: "bad auth : authentication failed"
- ✅ **Fixed!** Username or password incorrect
- Solution: Reset password in MongoDB Atlas → Update .env

### Error: "tlsv1 alert internal error"
- ⚠️ **CURRENT ERROR!** SSL/TLS connection issue
- Solutions:
  1. Verify MongoDB Atlas credentials are correct
  2. Check Network Access (0.0.0.0/0)
  3. Get fresh connection string from Atlas
  4. Wait 2-3 minutes after changes

### Error: "ECONNREFUSED"
- Server crashed or not running
- Solution: Fix MongoDB connection first

### "Could not proxy request /auth/current-user"
- Server is down
- Solution: Fix MongoDB → Restart server

---

## Next Steps After Fix

1. **Test MongoDB**: Server should show "MongoDB connected successfully"
2. **Test Login**: Visit http://localhost:3000 → Click login button
3. **Try OAuth**: Click "Sign in with Google" (or GitHub)
4. **Search Images**: After login, search for images

---

**Need Help?**
Share the error message you see after following these steps!
