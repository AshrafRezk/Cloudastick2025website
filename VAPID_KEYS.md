# VAPID Keys for Push Notifications

## Generated VAPID Keys

**⚠️ IMPORTANT: Keep the Private Key secret! Never commit it to git.**

### Public Key (VAPID_PUBLIC_KEY & VITE_VAPID_PUBLIC_KEY):
```
BAw0VgVtvr2bqwUrrtZdZDPKq47B04siOKdT2kOOaqVJegYBRYPtG0--lbKt_IOryiWfF--XxOwe0XvLeH6ej_4
```

### Private Key (VAPID_PRIVATE_KEY):
```
R2AtjgwdL9pLBYU8WmEYqN5GdnQES5AiNx-qf7okFdU
```

### Subject (VAPID_SUBJECT):
```
mailto:arezk@cloudastick.com
```

## Setup in Netlify

1. Go to **Netlify Dashboard** → Your Site → **Site Settings** → **Environment Variables**

2. Add these 4 variables:

   **Variable 1:**
   - Key: `VAPID_PUBLIC_KEY`
   - Value: `BAw0VgVtvr2bqwUrrtZdZDPKq47B04siOKdT2kOOaqVJegYBRYPtG0--lbKt_IOryiWfF--XxOwe0XvLeH6ej_4`

   **Variable 2:**
   - Key: `VAPID_PRIVATE_KEY`
   - Value: `R2AtjgwdL9pLBYU8WmEYqN5GdnQES5AiNx-qf7okFdU`
   - ⚠️ Keep this secret!

   **Variable 3:**
   - Key: `VAPID_SUBJECT`
   - Value: `mailto:arezk@cloudastick.com`

   **Variable 4:**
   - Key: `VITE_VAPID_PUBLIC_KEY`
   - Value: `BAw0VgVtvr2bqwUrrtZdZDPKq47B04siOKdT2kOOaqVJegYBRYPtG0--lbKt_IOryiWfF--XxOwe0XvLeH6ej_4`
   - (Same as VAPID_PUBLIC_KEY)

3. **Save** all variables

4. **Redeploy** your site:
   - Go to **Deploys** → **Trigger deploy** → **Deploy site**
   - Or push a commit to trigger auto-deploy

## After Deployment

1. Refresh your website
2. Try enabling notifications again
3. Check browser console - should see: `🔑 Using VAPID key: BAw0VgVtvr2bqwUrrtZdZDPKq47B04siOKdT2kOOaqVJegYBRYPtG0--lbKt_IOryiWfF--XxOwe0XvLeH6ej_4`
4. Should successfully subscribe!

## Security Note

- ✅ Public Key can be shared (it's public)
- ❌ Private Key must be kept secret
- ❌ Never commit private key to git
- ✅ This file is in .gitignore (should be)

