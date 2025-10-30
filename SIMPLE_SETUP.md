# SIMPLE SETUP GUIDE - Just Follow The Links! 🚀

## You Need 6 Things Total - I'll Get Them One By One

---

## ✅ STEP 1: MongoDB Connection (2 minutes)

### Click this link: https://cloud.mongodb.com/

1. **Login** to MongoDB Atlas
2. Click **"Database"** on the left
3. Click the **"Connect"** button on your cluster
4. Click **"Drivers"**
5. **COPY** the connection string (the long text in the box)

**It looks like this:**
```
mongodb+srv://<username>:<password>@cluster0.8rmfbsc.mongodb.net/?retryWrites=true&w=majority
```

### Now we need your password:

**Still on MongoDB Atlas:**
1. Click **"Database Access"** on the left
2. Find your user: `sagarbawankule334_db_user`
3. Click **"EDIT"** button
4. Click **"Edit Password"**
5. Click **"Autogenerate Secure Password"**
6. **COPY THE PASSWORD** (the green text that appears)
7. Click **"Update User"**

### Give me:
- [ ] The connection string you copied
- [ ] The password you copied

**Just paste them both here in chat!**

---

## ✅ STEP 2: Google Login (3 minutes)

### Click this link: https://console.cloud.google.com/apis/credentials

1. If you see your credential already, **click on it**
2. You'll see two things:
   - **Client ID**: (you already gave me this! ✓)
   - **Client secret**: **COPY THIS**

### If you DON'T see any credential:
1. Click **"Create Credentials"** → **"OAuth client ID"**
2. Choose **"Web application"**
3. Under "Authorized redirect URIs" click **"ADD URI"**
4. Type: `http://localhost:5000/auth/google/callback`
5. Click **"Create"**
6. **COPY** both the Client ID and Client Secret

### Give me:
- [ ] Client Secret (looks like: GOCSPX-xxxxxxxxxxxxx)

**Just paste it here in chat!**

---

## ✅ STEP 3: GitHub Login (2 minutes)

### Click this link: https://github.com/settings/developers

1. Click on your app if you see it, OR click **"New OAuth App"**
2. If creating new:
   - Name: `My MERN App`
   - Homepage: `http://localhost:3000`
   - Callback: `http://localhost:5000/auth/github/callback`
   - Click **"Register application"**

3. You should see **Client ID** (you gave me this! ✓)
4. Click **"Generate a new client secret"**
5. **COPY THE SECRET IMMEDIATELY** (you can only see it once!)

### Give me:
- [ ] Client Secret (a long random string)

**Just paste it here in chat!**

---

## ✅ STEP 4: Unsplash (Already Done!)

You already gave me this: ✓
```
OMmw4bFsHhHJdrm-lSkE0wiikZyUMtQ5lP-uiI5UA8s
```

---

## 📋 QUICK SUMMARY - What I Need From You:

From what you've already given me:
- ✅ Google Client ID: `789570521883-htbudqa7vj49qjdhre3s0m52tq60evm3.apps.googleusercontent.com`
- ✅ GitHub Client ID: `c99d2373c8f6811f5427faa2c0c84f9a2dd6e225`
- ✅ Unsplash Access Key: `OMmw4bFsHhHJdrm-lSkE0wiikZyUMtQ5lP-uiI5UA8s`

Still need:
1. **MongoDB password** (from Step 1)
2. **Google Client Secret** (from Step 2)
3. **GitHub Client Secret** (from Step 3)

---

## 🎯 Easy Format - Just Fill This Out:

```
MongoDB Password: [paste here]
Google Client Secret: [paste here]
GitHub Client Secret: [paste here]
```

That's it! Once you give me these 3 things, I'll update everything and your app will work! 🎉

---

## Need Help?

Just tell me which step you're on and I'll walk you through it!
