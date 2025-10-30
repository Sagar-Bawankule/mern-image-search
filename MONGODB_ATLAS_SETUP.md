# MongoDB Atlas Setup Guide

## Step 1: Create a MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up with:
   - Google account (recommended for quick setup)
   - Or create a new account with email
3. Verify your email if needed

## Step 2: Create a Free Cluster

1. After logging in, click **"Create"** or **"Build a Database"**
2. Choose **FREE** tier (M0 Sandbox)
   - 512 MB storage
   - Shared RAM
   - Perfect for development
3. Select a **Cloud Provider & Region**:
   - Choose AWS, Google Cloud, or Azure
   - Pick a region closest to you (e.g., US East, Europe, Asia)
4. **Cluster Name**: Keep default or name it `mern-image-search`
5. Click **"Create Cluster"** (takes 3-5 minutes to deploy)

## Step 3: Create Database User

1. While cluster is deploying, you'll see a **Security Quickstart** modal
2. Choose **Username and Password** authentication
3. Create credentials:
   - **Username**: `mernuser` (or your choice)
   - **Password**: Click "Autogenerate Secure Password" or create your own
   - **⚠️ IMPORTANT**: Copy and save the password securely!
4. Click **"Create User"**

## Step 4: Set Up Network Access

1. In the same modal, or go to **Network Access** in left sidebar
2. Click **"Add IP Address"**
3. For development, click **"Allow Access from Anywhere"**
   - This adds `0.0.0.0/0` (all IPs)
   - ⚠️ For production, restrict to specific IPs
4. Click **"Confirm"**

## Step 5: Get Your Connection String

1. Go to **Database** in the left sidebar
2. Click **"Connect"** button on your cluster
3. Choose **"Connect your application"**
4. Select:
   - **Driver**: Node.js
   - **Version**: 4.1 or later
5. Copy the connection string, it looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

## Step 6: Update Your Connection String

Replace `<username>` and `<password>` in the connection string:
- `<username>`: Your database username (e.g., `mernuser`)
- `<password>`: The password you created (⚠️ NO angle brackets!)

Add database name after `.net/`:
```
mongodb+srv://mernuser:YourPassword123@cluster0.xxxxx.mongodb.net/mern-image-search?retryWrites=true&w=majority
```

## Step 7: Update .env File

Open `server/.env` and replace the MONGO_URI line with your connection string:

```env
MONGO_URI=mongodb+srv://mernuser:YourPassword123@cluster0.xxxxx.mongodb.net/mern-image-search?retryWrites=true&w=majority
```

⚠️ **Important Notes**:
- Remove `< >` brackets from username and password
- If password contains special characters (@, :, /, etc.), URL encode them:
  - `@` becomes `%40`
  - `:` becomes `%3A`
  - `/` becomes `%2F`
  - Or use a password without special characters

## Step 8: Restart Your Server

After updating `.env`:
1. Stop the current server (Ctrl+C in terminal)
2. Run `npm run dev` again
3. Look for: **"MongoDB connected successfully"**

## Troubleshooting

### "MongoServerError: bad auth"
- Double-check username and password
- Ensure special characters are URL encoded
- Make sure you copied the password correctly

### "Connection timeout"
- Check Network Access settings (Allow 0.0.0.0/0)
- Wait a few minutes, IP whitelist takes time to propagate

### "Database user not found"
- Go to Database Access and verify user exists
- Check username matches in connection string

## Next Steps

Once connected, you can:
1. View data in Atlas UI: **Browse Collections**
2. Monitor performance in **Metrics** tab
3. Set up alerts and backups (optional)

---

**Need help?** Come back to the chat and let me know which step you're on!
