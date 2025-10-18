const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import models
const User = require('./models/User');
const Project = require('./models/Project');
const CommunityPost = require('./models/CommunityPost');
const { MentorshipRequest, Mentor } = require('./models/Mentorship');

// Sample data
const sampleUsers = [
  {
    name: 'Admin User',
    email: 'admin@quantumleap.com',
    password: 'admin123',
    role: 'admin',
    interests: ['AI', 'Climate']
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    interests: ['AI', 'Marketing'],
    profile: {
      bio: 'Passionate about AI and machine learning',
      skills: ['Python', 'JavaScript', 'React', 'Node.js'],
      experience: '3 years in software development',
      github: 'https://github.com/johndoe'
    }
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    interests: ['Climate', 'Social Impact'],
    profile: {
      bio: 'Environmental scientist and climate activist',
      skills: ['Data Analysis', 'Python', 'R', 'GIS'],
      experience: '5 years in environmental research',
      linkedin: 'https://linkedin.com/in/janesmith'
    }
  },
  {
    name: 'Dr. Sarah Wilson',
    email: 'sarah@example.com',
    password: 'password123',
    role: 'mentor',
    interests: ['AI', 'Biotech'],
    profile: {
      bio: 'AI researcher with expertise in healthcare applications',
      skills: ['Machine Learning', 'Deep Learning', 'Python', 'TensorFlow'],
      experience: '10 years in AI research and healthcare',
      linkedin: 'https://linkedin.com/in/sarahwilson'
    }
  },
  {
    name: 'Mike Johnson',
    email: 'mike@example.com',
    password: 'password123',
    role: 'mentor',
    interests: ['Climate', 'Marketing'],
    profile: {
      bio: 'Sustainability consultant and green marketing expert',
      skills: ['Sustainability', 'Marketing Strategy', 'Data Analysis', 'Project Management'],
      experience: '8 years in sustainability and marketing',
      linkedin: 'https://linkedin.com/in/mikejohnson'
    }
  }
];

const sampleProjects = [
  {
    title: 'AI-Powered Climate Data Analyzer',
    description: 'Build a machine learning model to analyze climate data and predict environmental trends. This project combines AI, data science, and climate science to create a powerful tool for environmental researchers.',
    domain: 'AI',
    skills: ['Python', 'Machine Learning', 'Data Analysis', 'Climate Science'],
    difficulty: 'Intermediate',
    estimatedDuration: 21,
    tasks: [
      {
        title: 'Data Collection and Preprocessing',
        description: 'Gather climate datasets and clean the data for analysis',
        status: 'todo'
      },
      {
        title: 'Exploratory Data Analysis',
        description: 'Analyze the data to understand patterns and relationships',
        status: 'todo'
      },
      {
        title: 'Model Development',
        description: 'Build and train machine learning models for prediction',
        status: 'todo'
      },
      {
        title: 'Visualization Dashboard',
        description: 'Create an interactive dashboard to display results',
        status: 'todo'
      },
      {
        title: 'Testing and Validation',
        description: 'Test the model accuracy and validate results',
        status: 'todo'
      }
    ],
    resources: [
      {
        title: 'Climate Data Sources',
        url: 'https://climate.nasa.gov/data/',
        type: 'article'
      },
      {
        title: 'Python for Data Science',
        url: 'https://pandas.pydata.org/',
        type: 'tutorial'
      },
      {
        title: 'Machine Learning with Scikit-learn',
        url: 'https://scikit-learn.org/',
        type: 'tutorial'
      }
    ],
    prerequisites: ['Basic Python knowledge', 'Understanding of data analysis', 'Interest in climate science']
  },
  {
    title: 'Sustainable E-commerce Platform',
    description: 'Develop a full-stack e-commerce platform focused on sustainable products. This project teaches modern web development while promoting environmental consciousness.',
    domain: 'Climate',
    skills: ['React', 'Node.js', 'MongoDB', 'Sustainability', 'E-commerce'],
    difficulty: 'Beginner',
    estimatedDuration: 14,
    tasks: [
      {
        title: 'Project Setup and Planning',
        description: 'Set up development environment and plan the application architecture',
        status: 'todo'
      },
      {
        title: 'Backend API Development',
        description: 'Create RESTful APIs for product management and user authentication',
        status: 'todo'
      },
      {
        title: 'Frontend Development',
        description: 'Build responsive user interface with React',
        status: 'todo'
      },
      {
        title: 'Database Integration',
        description: 'Set up MongoDB and implement data models',
        status: 'todo'
      },
      {
        title: 'Sustainability Features',
        description: 'Add features to track and promote sustainable practices',
        status: 'todo'
      }
    ],
    resources: [
      {
        title: 'React Documentation',
        url: 'https://reactjs.org/docs/',
        type: 'tutorial'
      },
      {
        title: 'Node.js Best Practices',
        url: 'https://nodejs.org/en/docs/',
        type: 'tutorial'
      },
      {
        title: 'MongoDB University',
        url: 'https://university.mongodb.com/',
        type: 'tutorial'
      }
    ],
    prerequisites: ['Basic JavaScript knowledge', 'Understanding of web development', 'Interest in sustainability']
  },
  {
    title: 'Biotech Lab Management System',
    description: 'Create a comprehensive lab management system for biotech research. This project combines software development with biotechnology knowledge to solve real-world lab challenges.',
    domain: 'Biotech',
    skills: ['Python', 'Django', 'Database Design', 'Laboratory Management', 'Data Visualization'],
    difficulty: 'Advanced',
    estimatedDuration: 28,
    tasks: [
      {
        title: 'Requirements Analysis',
        description: 'Analyze lab workflows and identify system requirements',
        status: 'todo'
      },
      {
        title: 'Database Design',
        description: 'Design database schema for lab data management',
        status: 'todo'
      },
      {
        title: 'Backend Development',
        description: 'Build Django backend with REST APIs',
        status: 'todo'
      },
      {
        title: 'Frontend Interface',
        description: 'Create user-friendly interface for lab staff',
        status: 'todo'
      },
      {
        title: 'Data Visualization',
        description: 'Implement charts and reports for lab data',
        status: 'todo'
      },
      {
        title: 'Testing and Deployment',
        description: 'Test the system and deploy to production',
        status: 'todo'
      }
    ],
    resources: [
      {
        title: 'Django Documentation',
        url: 'https://docs.djangoproject.com/',
        type: 'tutorial'
      },
      {
        title: 'Laboratory Information Systems',
        url: 'https://en.wikipedia.org/wiki/Laboratory_information_management_system',
        type: 'article'
      },
      {
        title: 'Python for Biologists',
        url: 'https://pythonforbiologists.com/',
        type: 'tutorial'
      }
    ],
    prerequisites: ['Python programming', 'Database concepts', 'Understanding of laboratory workflows']
  }
];

const sampleCommunityPosts = [
  {
    title: 'My AI Climate Project Journey',
    text: 'I just completed the AI-Powered Climate Data Analyzer project and wanted to share my experience. The project was challenging but incredibly rewarding! The most difficult part was preprocessing the climate data, but once I got the hang of it, the machine learning model training was smooth. I learned so much about both AI and climate science.',
    tags: ['AI', 'Climate', 'Machine Learning', 'Success Story']
  },
  {
    title: 'Looking for Collaboration on Sustainable E-commerce',
    text: 'I\'m working on the Sustainable E-commerce Platform project and would love to collaborate with others who are interested in sustainability and web development. I\'m particularly strong in frontend development but could use help with the backend API design.',
    tags: ['Collaboration', 'E-commerce', 'Sustainability', 'Web Development']
  },
  {
    title: 'Biotech Lab System - Database Design Help',
    text: 'I\'m stuck on the database design for the Biotech Lab Management System. The relationships between samples, experiments, and results are more complex than I initially thought. Any advice on designing a flexible schema that can handle different types of lab workflows?',
    tags: ['Biotech', 'Database Design', 'Help', 'Laboratory Management']
  }
];

const sampleMentors = [
  {
    domains: ['AI', 'Biotech'],
    bio: 'AI researcher with 10+ years of experience in healthcare applications. I specialize in machine learning, deep learning, and their applications in biotechnology and medical research.',
    experience: 'Led AI research teams at major biotech companies, published 50+ papers in top-tier journals, and mentored 20+ PhD students and junior researchers.',
    availability: {
      timezone: 'PST',
      availableDays: ['Monday', 'Wednesday', 'Friday'],
      availableHours: {
        start: '09:00',
        end: '17:00'
      }
    },
    hourlyRate: 0,
    maxMentees: 5
  },
  {
    domains: ['Climate', 'Marketing'],
    bio: 'Sustainability consultant with expertise in green marketing and environmental impact assessment. I help businesses develop sustainable practices and communicate their environmental efforts effectively.',
    experience: '8 years in sustainability consulting, worked with Fortune 500 companies on green initiatives, and developed marketing strategies for sustainable products.',
    availability: {
      timezone: 'EST',
      availableDays: ['Tuesday', 'Thursday', 'Saturday'],
      availableHours: {
        start: '10:00',
        end: '18:00'
      }
    },
    hourlyRate: 0,
    maxMentees: 3
  }
];

// Seed function
async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/quantumleap', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Project.deleteMany({});
    await CommunityPost.deleteMany({});
    await MentorshipRequest.deleteMany({});
    await Mentor.deleteMany({});
    console.log('🧹 Cleared existing data');

    // Create users
    const users = [];
    for (const userData of sampleUsers) {
      const user = new User(userData);
      await user.save();
      users.push(user);
      console.log(`👤 Created user: ${user.name}`);
    }

    // Create projects
    const projects = [];
    for (const projectData of sampleProjects) {
      const project = new Project({
        ...projectData,
        createdBy: users[0]._id // Admin user
      });
      await project.save();
      projects.push(project);
      console.log(`📁 Created project: ${project.title}`);
    }

    // Create community posts
    for (let i = 0; i < sampleCommunityPosts.length; i++) {
      const postData = sampleCommunityPosts[i];
      const post = new CommunityPost({
        ...postData,
        author: users[1 + i]._id, // Regular users
        projectRef: projects[i]._id
      });
      await post.save();
      console.log(`💬 Created community post: ${post.title}`);
    }

    // Create mentor profiles
    const mentors = [];
    for (let i = 0; i < sampleMentors.length; i++) {
      const mentorData = sampleMentors[i];
      const mentor = new Mentor({
        ...mentorData,
        user: users[3 + i]._id // Mentor users
      });
      await mentor.save();
      mentors.push(mentor);
      console.log(`🎓 Created mentor profile for: ${users[3 + i].name}`);
    }

    // Create some mentorship requests
    const mentorshipRequest = new MentorshipRequest({
      mentee: users[1]._id,
      mentor: mentors[0]._id,
      projectRef: projects[0]._id,
      message: 'I\'m working on the AI Climate project and would love some guidance on machine learning model selection and optimization.',
      status: 'pending'
    });
    await mentorshipRequest.save();
    console.log('🤝 Created mentorship request');

    // Update user completed projects
    users[1].completedProjects.push(projects[0]._id);
    await users[1].save();

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Users: ${users.length}`);
    console.log(`- Projects: ${projects.length}`);
    console.log(`- Community Posts: ${sampleCommunityPosts.length}`);
    console.log(`- Mentors: ${mentors.length}`);
    console.log(`- Mentorship Requests: 1`);
    
    console.log('\n🔑 Test Credentials:');
    console.log('Admin: admin@quantumleap.com / admin123');
    console.log('User: john@example.com / password123');
    console.log('User: jane@example.com / password123');
    console.log('Mentor: sarah@example.com / password123');
    console.log('Mentor: mike@example.com / password123');

  } catch (error) {
    console.error('❌ Seeding error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
