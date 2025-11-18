# Troubleshooting Guide

## Issue: Tailwind CSS PostCSS Error (RESOLVED)

### Error Message
```
[postcss] It looks like you're trying to use `tailwindcss` directly as a PostCSS plugin.
```

### Root Cause
The project was initially using Tailwind CSS v4, which requires a different PostCSS plugin (`@tailwindcss/postcss`) instead of the legacy `tailwindcss` plugin.

### Solution Applied ✅

1. **Installed the correct PostCSS plugin:**
   ```bash
   npm install -D @tailwindcss/postcss
   ```

2. **Updated `postcss.config.js`:**
   ```javascript
   export default {
     plugins: {
       '@tailwindcss/postcss': {},
       autoprefixer: {},
     },
   }
   ```

3. **Migrated CSS to Tailwind v4 syntax in `src/index.css`:**
   - Changed from `@tailwind` directives to `@import "tailwindcss"`
   - Updated to `@theme` block syntax
   - Updated CSS variable naming convention

4. **Removed legacy config:**
   - Deleted `tailwind.config.js` (not needed in v4)

5. **Cleared Vite cache:**
   ```bash
   rm -rf node_modules/.vite
   ```

### Current Status

✅ **Server running successfully** at http://localhost:5174/
✅ **No PostCSS errors** in server output
✅ **All dependencies correctly installed**

### If You're Still Seeing the Error in Browser

The error might be cached in your browser. Try these steps:

#### Option 1: Hard Refresh
- **Chrome/Edge/Brave:** `Ctrl + Shift + R` (Windows/Linux) or `Cmd + Shift + R` (Mac)
- **Firefox:** `Ctrl + F5` (Windows/Linux) or `Cmd + Shift + R` (Mac)
- **Safari:** `Cmd + Option + R`

#### Option 2: Clear Browser Cache
1. Open DevTools (`F12` or `Ctrl + Shift + I`)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

#### Option 3: Close and Reopen Browser
Sometimes a full browser restart helps clear cached errors.

#### Option 4: Try Incognito/Private Mode
Open http://localhost:5174/ in an incognito/private window to verify the fix.

### Verification Steps

1. **Check server is running:**
   ```bash
   # You should see output like:
   # VITE v7.2.2  ready in XXX ms
   # ➜  Local:   http://localhost:5174/
   ```

2. **Check for errors in terminal:**
   There should be no error messages in the terminal output.

3. **Open in browser:**
   Visit http://localhost:5174/ and you should see your portfolio.

4. **Check browser console:**
   Open DevTools (F12) and check the Console tab for any errors.

### Common Issues

#### Port Already in Use
If you see "Port 5173 is in use", Vite automatically tries another port (5174, 5175, etc.).
Check the terminal output for the actual port number.

#### Module Not Found
If you see module errors, try:
```bash
rm -rf node_modules
npm install
npm run dev
```

#### TypeScript Errors
If you see TypeScript path errors, verify `tsconfig.app.json` has:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Need More Help?

1. **Check terminal output** for any error messages
2. **Check browser DevTools console** for client-side errors
3. **Try building the project:**
   ```bash
   npm run build
   ```
   This will show any build-time errors.

### Successful Build Indicators

When everything is working correctly, you should see:
- ✅ Clean terminal output with no errors
- ✅ Portfolio loads in browser at http://localhost:5174/
- ✅ All sections visible: Hero, About, Projects, Experience, Skills, Contact
- ✅ Animations working (dot pattern, ripple effects)
- ✅ Responsive layout on different screen sizes

---

**Last Updated:** 2025-11-18
**Status:** ✅ RESOLVED
