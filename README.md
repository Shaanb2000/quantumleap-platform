# QuantumLeap Platform

A full-stack project-based future-skill incubator platform built with React, Node.js, Express, and MongoDB.

## 🚀 Features

- **Project-Based Learning**: Hands-on projects across AI, Climate, Biotech, Marketing, and Social Impact domains
- **User Authentication**: JWT-based authentication with role-based access control
- **Community Features**: Share progress, ask questions, and connect with fellow learners
- **Mentorship System**: Connect with industry experts and get personalized guidance
- **Portfolio Building**: Showcase completed projects and skills
- **Admin Panel**: Manage users, projects, and platform content
- **AI-Powered Suggestions**: Get personalized feedback and recommendations

## 🛠 Tech Stack

### Frontend
- React 18 with TypeScript
- React Router for navigation
- Tailwind CSS for styling
- Axios for API calls
- Context API for state management

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- Express Validator for input validation

### Database
- MongoDB Atlas (cloud) or local MongoDB

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/shaanb2000/quantumleap-platform.git
   cd quantumleap-platform
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/quantumleap
   JWT_SECRET=your-super-secret-jwt-key-here
   PORT=5000
   CLIENT_URL=http://localhost:3000
   ```

4. **Seed the database**
   ```bash
   npm run seed
   ```

5. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend server on http://localhost:5000
   - Frontend React app on http://localhost:3000

## 🗄 Database Setup

### Option 1: MongoDB Atlas (Recommended)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in your `.env` file

### Option 2: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Use `mongodb://localhost:27017/quantumleap` as your `MONGODB_URI`

## 🧪 Testing

### API Testing with cURL

1. **Register a new user**
   ```bash
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test User",
       "email": "test@example.com",
       "password": "password123",
       "interests": ["AI", "Climate"]
     }'
   ```

2. **Login**
   ```bash
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@example.com",
       "password": "password123"
     }'
   ```

3. **Get projects**
   ```bash
   curl -X GET http://localhost:5000/api/projects
   ```

4. **Create a community post** (requires auth token)
   ```bash
   curl -X POST http://localhost:5000/api/community \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -d '{
       "title": "My First Post",
       "text": "Hello community!",
       "tags": ["AI", "Learning"]
     }'
   ```

### Test Credentials
After running the seed script, you can use these test accounts:
- **Admin**: admin@quantumleap.com / admin123
- **User**: john@example.com / password123
- **Mentor**: sarah@example.com / password123

## 🚀 Deployment

### Option 1: Vercel (Full-Stack)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically

### Option 2: Render + Vercel
1. **Backend on Render**:
   - Connect GitHub repository
   - Use `render.yaml` configuration
   - Set environment variables

2. **Frontend on Vercel**:
   - Deploy `client` directory
   - Set `REACT_APP_API_URL` to your Render backend URL

### Option 3: Manual Deployment
1. **Backend**: Deploy to any Node.js hosting service
2. **Frontend**: Build and deploy to any static hosting service

## 📁 Project Structure

```
quantumleap-platform/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── contexts/      # React contexts
│   │   ├── pages/         # Page components
│   │   └── utils/         # Utility functions
│   ├── public/            # Static assets
│   └── package.json
├── server/                # Node.js backend
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── seed.js           # Database seeding
│   └── package.json
├── vercel.json           # Vercel configuration
├── render.yaml           # Render configuration
└── README.md
```

## 🔧 Available Scripts

### Root Level
- `npm run dev` - Start both frontend and backend
- `npm run install-all` - Install all dependencies
- `npm run seed` - Seed the database

### Backend (server/)
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database with sample data

### Frontend (client/)
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

## 🎯 Features Overview

### For Learners
- Browse and filter projects by domain and difficulty
- Track progress on projects with task management
- Connect with mentors for guidance
- Share experiences in the community
- Build a portfolio of completed projects

### For Mentors
- Create mentor profiles with expertise areas
- Manage mentorship requests
- Provide feedback and guidance
- Track mentee progress

### For Admins
- Manage users and roles
- Create and moderate projects
- Monitor platform activity
- Moderate community content

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration
- Role-based access control

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues:

1. Check the troubleshooting section below
2. Create an issue on GitHub
3. Contact the development team

## 🔧 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Verify your MongoDB URI
   - Check if MongoDB service is running
   - Ensure network access in MongoDB Atlas

2. **Port Already in Use**
   - Change the PORT in your .env file
   - Kill existing processes using the port

3. **Build Errors**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility
   - Verify all environment variables

4. **Authentication Issues**
   - Verify JWT_SECRET is set
   - Check token expiration
   - Ensure proper CORS configuration

## 📊 Performance

- Frontend: Optimized with React 18 features
- Backend: Efficient API design with proper indexing
- Database: Optimized queries and connection pooling
- Caching: Implemented where appropriate

## 🔮 Future Enhancements

- Real-time notifications
- Advanced analytics dashboard
- Mobile app development
- Integration with external learning platforms
- AI-powered project recommendations
- Video conferencing for mentorship sessions

---

**Built with ❤️ for the future of learning**