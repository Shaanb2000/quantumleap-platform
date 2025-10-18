# QuantumLeap Platform - Deployment Guide

## 🚀 Quick Deployment Options

### Option 1: Vercel (Recommended for Full-Stack)

1. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will auto-detect the configuration

2. **Set Environment Variables**
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/quantumleap
   JWT_SECRET=your-super-secret-jwt-key-here
   NODE_ENV=production
   CLIENT_URL=https://your-app.vercel.app
   ```

3. **Deploy**
   - Vercel will automatically deploy both frontend and backend
   - Your app will be available at `https://your-app.vercel.app`

### Option 2: Render + Vercel (Separate Services)

#### Backend on Render

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Deploy Backend**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Use these settings:
     - **Build Command**: `cd server && npm install`
     - **Start Command**: `cd server && npm start`
     - **Environment**: Node

3. **Set Environment Variables**
   ```
   NODE_ENV=production
   MONGODB_URI=your-mongodb-connection-string
   JWT_SECRET=your-jwt-secret
   PORT=10000
   ```

4. **Create Database**
   - In Render dashboard, create a new MongoDB database
   - Copy the connection string to MONGODB_URI

#### Frontend on Vercel

1. **Deploy Frontend**
   - Go to [vercel.com](https://vercel.com)
   - Import your repository
   - Set root directory to `client`

2. **Set Environment Variables**
   ```
   REACT_APP_API_URL=https://your-backend.onrender.com
   ```

### Option 3: Manual Deployment

#### Backend Deployment

1. **Choose a Hosting Service**
   - Heroku, DigitalOcean, AWS, etc.

2. **Prepare for Production**
   ```bash
   # Install dependencies
   cd server && npm install --production
   
   # Set environment variables
   export NODE_ENV=production
   export MONGODB_URI=your-mongodb-uri
   export JWT_SECRET=your-jwt-secret
   export PORT=5000
   ```

3. **Deploy**
   - Upload your server files
   - Start the Node.js process
   - Ensure port is accessible

#### Frontend Deployment

1. **Build for Production**
   ```bash
   cd client
   npm install
   npm run build
   ```

2. **Deploy Static Files**
   - Upload `client/build` folder to any static hosting
   - Examples: Netlify, Vercel, GitHub Pages, AWS S3

## 🗄 Database Setup

### MongoDB Atlas (Recommended)

1. **Create Account**
   - Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for free account

2. **Create Cluster**
   - Click "Build a Database"
   - Choose "FREE" tier
   - Select region closest to your users
   - Create cluster

3. **Configure Access**
   - Go to "Database Access"
   - Add new database user
   - Set username and password
   - Grant "Read and write to any database"

4. **Network Access**
   - Go to "Network Access"
   - Add IP address (0.0.0.0/0 for all IPs)
   - Or add your specific IP

5. **Get Connection String**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<password>` with your database password

### Local MongoDB (Development Only)

1. **Install MongoDB**
   ```bash
   # macOS
   brew install mongodb-community
   
   # Ubuntu
   sudo apt-get install mongodb
   
   # Windows
   # Download from mongodb.com
   ```

2. **Start MongoDB**
   ```bash
   # macOS
   brew services start mongodb-community
   
   # Ubuntu
   sudo systemctl start mongod
   ```

3. **Connection String**
   ```
   MONGODB_URI=mongodb://localhost:27017/quantumleap
   ```

## 🔧 Environment Variables

### Required Variables

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/quantumleap

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random

# Server
PORT=5000
NODE_ENV=production

# CORS
CLIENT_URL=https://your-frontend-domain.com

# Admin (Optional)
ADMIN_EMAIL=admin@quantumleap.com
ADMIN_PASSWORD=admin123
```

### Frontend Variables

```env
# API URL
REACT_APP_API_URL=https://your-backend-domain.com
```

## 🧪 Pre-Deployment Testing

### 1. Local Testing
```bash
# Install dependencies
npm run install-all

# Set up environment
cp env.example .env
# Edit .env with your values

# Seed database
npm run seed

# Start development servers
npm run dev

# Test endpoints
curl http://localhost:5000/api/health
```

### 2. Production Build Testing
```bash
# Build frontend
cd client && npm run build

# Test backend
cd server && npm start
```

### 3. Database Testing
```bash
# Test database connection
cd server && node -e "
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Database connected'))
  .catch(err => console.error('Connection failed:', err));
"
```

## 🚀 Deployment Steps

### Step 1: Prepare Repository
```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit"

# Push to GitHub
git remote add origin https://github.com/yourusername/quantumleap-platform.git
git push -u origin main
```

### Step 2: Deploy Backend
1. Choose your hosting platform
2. Connect GitHub repository
3. Set environment variables
4. Deploy and test

### Step 3: Deploy Frontend
1. Update API URL in frontend
2. Deploy to static hosting
3. Test frontend-backend connection

### Step 4: Seed Production Database
```bash
# Run seed script on production
# This creates sample data for testing
```

## 🔍 Post-Deployment Verification

### 1. Health Checks
```bash
# Backend health
curl https://your-backend-url.com/api/health

# Frontend loads
curl https://your-frontend-url.com
```

### 2. API Testing
```bash
# Test registration
curl -X POST https://your-backend-url.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"password123","interests":["AI"]}'

# Test login
curl -X POST https://your-backend-url.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### 3. Frontend Testing
- [ ] Homepage loads
- [ ] Registration works
- [ ] Login works
- [ ] Dashboard loads
- [ ] Projects page works
- [ ] Community features work

## 🛠 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check MONGODB_URI format
   - Verify network access in MongoDB Atlas
   - Check username/password

2. **CORS Errors**
   - Update CLIENT_URL in backend
   - Check CORS configuration

3. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies installed
   - Check for TypeScript errors

4. **Environment Variables Not Loading**
   - Verify variable names match exactly
   - Check for typos in variable names
   - Restart application after changes

### Debug Commands

```bash
# Check environment variables
echo $MONGODB_URI
echo $JWT_SECRET

# Test database connection
node -e "console.log(process.env.MONGODB_URI)"

# Check port availability
netstat -tulpn | grep :5000
```

## 📊 Monitoring

### Health Monitoring
- Set up health check endpoints
- Monitor response times
- Track error rates

### Database Monitoring
- Monitor connection count
- Track query performance
- Set up alerts for failures

### User Analytics
- Track user registrations
- Monitor project completions
- Analyze user engagement

## 🔄 Updates and Maintenance

### Regular Updates
1. Keep dependencies updated
2. Monitor security vulnerabilities
3. Update environment variables as needed
4. Backup database regularly

### Scaling Considerations
- Database connection pooling
- CDN for static assets
- Load balancing for high traffic
- Caching strategies

---

**Deployment Status**: ✅ Ready for Production  
**Last Updated**: [Current Date]  
**Deployed By**: [Your Name]
