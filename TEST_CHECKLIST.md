# QuantumLeap Platform - Test Checklist

## 🧪 Pre-Deployment Testing

### 1. Environment Setup
- [ ] Node.js installed (v16+)
- [ ] MongoDB running (local or Atlas)
- [ ] Environment variables configured
- [ ] Dependencies installed (`npm run install-all`)

### 2. Database Testing
- [ ] Database connection successful
- [ ] Seed script runs without errors (`npm run seed`)
- [ ] Sample data created (users, projects, mentors)
- [ ] Database collections populated

### 3. Backend API Testing

#### Authentication Endpoints
- [ ] POST `/api/auth/register` - User registration
- [ ] POST `/api/auth/login` - User login
- [ ] GET `/api/auth/me` - Get current user (with auth token)
- [ ] PUT `/api/auth/profile` - Update user profile

#### Project Endpoints
- [ ] GET `/api/projects` - List all projects
- [ ] GET `/api/projects/:id` - Get single project
- [ ] GET `/api/projects/user/recommendations` - Get user recommendations
- [ ] POST `/api/projects/:id/tasks/:taskId/status` - Update task status

#### Community Endpoints
- [ ] GET `/api/community` - List community posts
- [ ] POST `/api/community` - Create new post
- [ ] POST `/api/community/:id/like` - Like/unlike post
- [ ] POST `/api/community/:id/comments` - Add comment

#### Mentorship Endpoints
- [ ] GET `/api/mentorship/mentors` - List mentors
- [ ] POST `/api/mentorship/requests` - Create mentorship request
- [ ] GET `/api/mentorship/requests` - Get user requests

#### Admin Endpoints
- [ ] GET `/api/admin/dashboard` - Admin dashboard stats
- [ ] GET `/api/admin/users` - List users
- [ ] PUT `/api/admin/users/:id/role` - Update user role

### 4. Frontend Testing

#### Navigation
- [ ] Homepage loads correctly
- [ ] Navigation menu works
- [ ] Protected routes redirect to login
- [ ] Admin routes require admin role

#### Authentication Flow
- [ ] Registration form works
- [ ] Login form works
- [ ] Logout clears session
- [ ] Protected pages require authentication

#### Core Features
- [ ] Dashboard displays user data
- [ ] Projects page loads and filters
- [ ] Project detail page shows tasks
- [ ] Community page displays posts
- [ ] Mentorship page shows mentors
- [ ] Portfolio page shows completed projects
- [ ] Admin panel accessible to admins only

### 5. Integration Testing

#### User Journey Tests
- [ ] New user can register and login
- [ ] User can browse and view projects
- [ ] User can update project task status
- [ ] User can create community posts
- [ ] User can request mentorship
- [ ] User can view their portfolio

#### Admin Journey Tests
- [ ] Admin can access admin panel
- [ ] Admin can view dashboard stats
- [ ] Admin can manage users
- [ ] Admin can moderate content

## 🚀 Deployment Testing

### 1. Production Build
- [ ] Frontend builds successfully (`npm run build`)
- [ ] Backend starts in production mode
- [ ] Environment variables set correctly
- [ ] Database connection works in production

### 2. Deployment Platforms

#### Vercel Deployment
- [ ] Repository connected to Vercel
- [ ] Environment variables configured
- [ ] Build process completes successfully
- [ ] Frontend accessible via Vercel URL
- [ ] API routes work correctly

#### Render Deployment
- [ ] Backend service deployed successfully
- [ ] Database connection established
- [ ] Environment variables configured
- [ ] Health check endpoint responds
- [ ] API endpoints accessible

### 3. Post-Deployment Verification
- [ ] Frontend loads from production URL
- [ ] API calls work from production frontend
- [ ] Authentication flow works in production
- [ ] Database operations work correctly
- [ ] File uploads work (if applicable)

## 🔧 API Test Commands

### Authentication Tests
```bash
# Register
curl -X POST https://your-api-url.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123","interests":["AI"]}'

# Login
curl -X POST https://your-api-url.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get current user (replace TOKEN with actual token)
curl -X GET https://your-api-url.com/api/auth/me \
  -H "Authorization: Bearer TOKEN"
```

### Project Tests
```bash
# Get all projects
curl -X GET https://your-api-url.com/api/projects

# Get single project
curl -X GET https://your-api-url.com/api/projects/PROJECT_ID

# Get user recommendations (requires auth)
curl -X GET https://your-api-url.com/api/projects/user/recommendations \
  -H "Authorization: Bearer TOKEN"
```

### Community Tests
```bash
# Get community posts
curl -X GET https://your-api-url.com/api/community

# Create post (requires auth)
curl -X POST https://your-api-url.com/api/community \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"title":"Test Post","text":"This is a test post","tags":["test"]}'
```

### Mentorship Tests
```bash
# Get mentors
curl -X GET https://your-api-url.com/api/mentorship/mentors

# Create mentorship request (requires auth)
curl -X POST https://your-api-url.com/api/mentorship/requests \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"mentor":"MENTOR_ID","message":"I need help with AI projects"}'
```

## 🐛 Common Issues & Solutions

### Backend Issues
- **MongoDB Connection Error**: Check MONGODB_URI and network access
- **JWT Token Issues**: Verify JWT_SECRET is set and consistent
- **CORS Errors**: Check CLIENT_URL configuration
- **Port Conflicts**: Change PORT in environment variables

### Frontend Issues
- **API Connection Errors**: Verify REACT_APP_API_URL is correct
- **Build Failures**: Clear node_modules and reinstall
- **Routing Issues**: Check React Router configuration
- **Authentication Loops**: Verify token storage and API responses

### Deployment Issues
- **Build Failures**: Check environment variables and dependencies
- **Database Connection**: Verify production database credentials
- **CORS Issues**: Update CORS configuration for production URLs
- **File Upload Issues**: Check file size limits and storage configuration

## ✅ Success Criteria

### Functional Requirements
- [ ] All user stories implemented
- [ ] Authentication system working
- [ ] CRUD operations functional
- [ ] Role-based access control working
- [ ] Responsive design on all devices

### Performance Requirements
- [ ] Page load times under 3 seconds
- [ ] API response times under 1 second
- [ ] Database queries optimized
- [ ] Images and assets optimized

### Security Requirements
- [ ] Passwords properly hashed
- [ ] JWT tokens secure
- [ ] Input validation implemented
- [ ] SQL injection prevention
- [ ] XSS protection enabled

### Usability Requirements
- [ ] Intuitive navigation
- [ ] Clear error messages
- [ ] Loading states implemented
- [ ] Mobile-friendly design
- [ ] Accessibility considerations

---

**Test Status**: ⏳ In Progress  
**Last Updated**: [Current Date]  
**Tester**: [Your Name]
