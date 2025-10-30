# How to Get Your Real Cradle API Key

## ⚠️ Current Issue

Your `.env.local` file contains a **placeholder** API key like:
```bash
CRADLE_API_KEY=your-actual-api-key-here
```

This is just an example - you need to replace it with your **real** API key!

## ✅ How to Fix

### Option 1: Check with Your Backend Team

Ask your backend/devops team for:
- The **Cradle API Key** for development
- The correct API endpoint URL (if different from production)

They should provide something like:
```
sk_test_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

### Option 2: Check Your Backend Dashboard

If you have access to the Cradle backend:

1. Log into your Cradle backend dashboard
2. Navigate to Settings → API Keys (or similar)
3. Copy the API key for your environment (dev/staging/production)

### Option 3: Check Documentation/Slack/Email

Search for:
- Onboarding emails from the backend team
- Slack messages with API credentials
- Project documentation or README files
- Shared password manager (1Password, LastPass, etc.)

## 📝 Update Your .env.local

Once you have the real API key, update your `.env.local`:

```bash
# .env.local (in your project root)

# API URL (already correct)
NEXT_PUBLIC_CRADLE_API_URL=https://cradle-back-end-production.up.railway.app

# Replace this with your REAL API key!
CRADLE_API_KEY=sk_test_your_real_api_key_goes_here_it_will_be_long
```

**Important:**
- ✅ The key should be 20-50+ characters long
- ✅ It usually starts with a prefix like `sk_`, `key_`, or similar
- ✅ It should NOT contain words like "your-actual", "example", "placeholder"
- ✅ No quotes needed around the value
- ✅ No spaces

## 🔄 Restart Your Dev Server

After updating `.env.local`:

```bash
# Stop your server (Ctrl+C)
# Then restart:
pnpm dev
# or
npm run dev
```

## ✅ Test It Works

After restarting, the client will now validate your API key. If it's still a placeholder, you'll get a clear error message telling you what's wrong.

Try creating an account again - it should work now!

## 🆘 Still Need Help?

If you can't find the API key:

1. **Check the existing account.ts that works**
   - Look at `packages/lib/cradle-client-ts/account.ts`
   - It uses `process.env.API_SECRET_KEY`
   - Check if you have `API_SECRET_KEY` in your `.env.local` instead

2. **Check both environment variable names**
   Your `.env.local` might need:
   ```bash
   API_SECRET_KEY=your_real_key_here
   # OR
   CRADLE_API_KEY=your_real_key_here
   # (Either one works - the client checks both)
   ```

3. **Test with cURL**
   Verify your API key works directly:
   ```bash
   curl -X GET \
     https://cradle-back-end-production.up.railway.app/health \
     -H "Authorization: Bearer YOUR_API_KEY_HERE" \
     -H "Content-Type: application/json"
   ```
   
   Should return:
   ```json
   {
     "status": "ok",
     "timestamp": "2024-..."
   }
   ```

## 🔑 What a Real API Key Looks Like

**Good examples:**
- `sk_test_abc123def456ghi789jkl012mno345pqr678`
- `key_live_XyZ789AbC123DeF456GhI789JkL012`
- `crdl_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`

**Bad examples (placeholders):**
- `your-actual-api-key-here`
- `example-key-replace-me`
- `test`
- `changeme`

The real key will be a long string of random characters!

