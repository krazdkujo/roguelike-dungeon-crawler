# 🚨 RESTART RECOVERY GUIDE - CRITICAL CONFIGURATION ISSUES
**Date:** 2025-08-08  
**Issue:** 500 Errors on Authentication & Port Conflicts  
**Status:** Configuration Fixed, Ready for Testing After Restart

## ⚠️ CRITICAL ISSUES IDENTIFIED

### 1. Port Configuration Conflicts
**Problem:** Multiple conflicting port assignments causing 500 errors
- Original config: Backend 3001, Frontend 3000
- Windows conflicts: Ports already in use by other processes
- Proxy mismatch: Frontend proxy pointing to wrong backend port

**SOLUTION IMPLEMENTED:**
- **Backend Server:** Port 3005 (src/simple-server.js updated)
- **Frontend Server:** Port 3003 (auto-selected by Vite)
- **Proxy Config:** vite.config.ts updated to target localhost:3005

### 2. CORS Configuration Mismatch  
**Problem:** Backend CORS allowing wrong origin
**SOLUTION:** Updated simple-server.js CORS to accept localhost:3003

### 3. Server Process Conflicts
**Problem:** Multiple node processes running simultaneously
**SOLUTION:** Clean restart will resolve all process conflicts

---

## 🔧 CONFIGURATION FILES UPDATED

### Backend Configuration
**File:** `server/src/simple-server.js`
```javascript
const PORT = process.env.PORT || 3005;  // Changed from 3001

app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3003",  // Updated
  credentials: true
}));
```

### Frontend Configuration  
**File:** `client/vite.config.ts`
```javascript
proxy: {
  '/api': {
    target: 'http://localhost:3005',  // Changed from 3001
    changeOrigin: true
  },
  '/socket.io': {
    target: 'http://localhost:3005',  // Changed from 3001
    ws: true
  }
}
```

---

## ⚡ POST-RESTART STARTUP SEQUENCE

### Step 1: Kill Any Lingering Processes (Automatic on Restart) ✅

### Step 2: Start Backend Server
```bash
cd "C:\Dev\Testing the Agent Swarm\server"
node src/simple-server.js
```
**Expected Output:**
```
🚀 Server running on port 3005
📊 Environment: development  
🔐 CORS Origin: http://localhost:3003
⚡ Simple server ready for connections
```

### Step 3: Start Frontend Server (New Terminal)
```bash
cd "C:\Dev\Testing the Agent Swarm\client"
npm run dev
```
**Expected Output:**
```
VITE v5.4.19 ready in XXXms

➜ Local:   http://localhost:3003/
➜ Network: http://192.168.x.x:3003/
```

### Step 4: Verify Connectivity
**Test Backend Direct:** http://localhost:3005/health  
**Test Application:** http://localhost:3003  
**Test API Proxy:** http://localhost:3003/api/v1/status

---

## 🧪 TESTING CHECKLIST AFTER RESTART

### Authentication Testing
- [ ] Navigate to http://localhost:3003
- [ ] Try user registration (should work without 500 error)
- [ ] Try user login (should work without 500 error)
- [ ] Check browser dev tools for API call responses

### Application Flow Testing
- [ ] Complete registration/login
- [ ] Create character (should not timeout)
- [ ] Navigate to game areas
- [ ] Test combat functionality
- [ ] Test inventory/crafting systems

### Server Connectivity Testing
- [ ] Backend health check: GET http://localhost:3005/health
- [ ] API status: GET http://localhost:3005/api/v1/status  
- [ ] Frontend proxy: GET http://localhost:3003/api/v1/status

---

## 🔄 IF ISSUES PERSIST AFTER RESTART

### Port Still Conflicts?
```bash
# Check what's using the ports
netstat -ano | findstr :3005
netstat -ano | findstr :3003

# If needed, change to different ports
# Edit server/src/simple-server.js (line 5): const PORT = 3006;
# Edit client/vite.config.ts (line 25): target: 'http://localhost:3006'
```

### Backend Not Responding?
```bash
# Test with minimal server
cd server
node -e "
const express = require('express');
const app = express();
app.get('/test', (req,res) => res.json({ok:true}));
app.listen(3005, () => console.log('Test server on 3005'));
"
```

### Frontend Proxy Issues?
```bash
# Clear npm cache
npm cache clean --force

# Restart with fresh node_modules
cd client
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

## 📁 BACKUP FILES CREATED

**Original Simple Server:** `server/src/simple-server.js.backup`  
**Original Vite Config:** `client/vite.config.ts.backup`  
**Test Simple Server:** `server/test-simple.js` (for debugging)

---

## 🎯 SUCCESS INDICATORS

### ✅ Configuration Working When:
- Backend starts on port 3005 without errors
- Frontend starts on port 3003 (or shows available port)
- No 500 errors on login/register attempts
- API calls successfully proxy from frontend to backend
- Character creation completes without timeouts

### ⚠️ Still Issues If:
- Server won't start (port conflicts)
- 500 errors persist (CORS or proxy issues)  
- Timeouts on API calls (connectivity problems)
- Frontend can't reach backend (proxy misconfiguration)

---

## 📞 EMERGENCY FALLBACK

### Option 1: Docker Setup
If local setup continues failing, fall back to Docker:
```bash
docker-compose up --build
# Access at http://localhost:3000
```

### Option 2: Simplified Test Server
Use the minimal test server for debugging:
```bash
cd server
node test-simple.js
# Then manually test endpoints
```

### Option 3: Different Port Strategy
Try completely different port range:
```bash
# Backend: Port 8001  
# Frontend: Port 8002
# Update configs accordingly
```

---

**Recovery Guide Created:** 2025-08-08  
**Next Action:** Restart machine, then follow startup sequence  
**Expected Outcome:** Working application with resolved 500 errors
