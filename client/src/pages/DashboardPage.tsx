import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

interface Project {
  _id: string;
  title: string;
  description: string;
  domain: string;
  difficulty: string;
  estimatedDuration: number;
  skills: string[];
  completionPercentage: number;
  tasks: Array<{
    _id: string;
    title: string;
    status: string;
  }>;
}

interface CommunityPost {
  _id: string;
  title: string;
  text: string;
  author: {
    name: string;
  };
  createdAt: string;
  likeCount: number;
}

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [projectsRes, communityRes] = await Promise.all([
          axios.get('/api/projects/user/recommendations?limit=3'),
          axios.get('/api/community?limit=3')
        ]);
        
        setProjects(projectsRes.data.projects);
        setCommunityPosts(communityRes.data.posts);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'badge-success';
      case 'Intermediate': return 'badge-warning';
      case 'Advanced': return 'badge-danger';
      default: return 'badge-secondary';
    }
  };

  const getDomainIcon = (domain: string) => {
    const icons: { [key: string]: string } = {
      'AI': '🤖',
      'Climate': '🌱',
      'Biotech': '🧬',
      'Marketing': '📈',
      'Social Impact': '🌍'
    };
    return icons[domain] || '📚';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600">
          Continue your learning journey and explore new opportunities.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recommended Projects */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recommended Projects</h2>
            <Link to="/projects" className="text-primary-600 hover:text-primary-700 font-medium">
              View all
            </Link>
          </div>
          
          <div className="space-y-6">
            {projects.length > 0 ? (
              projects.map((project) => (
                <div key={project._id} className="card hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getDomainIcon(project.domain)}</span>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
                        <p className="text-sm text-gray-600">{project.domain} • {project.estimatedDuration} days</p>
                      </div>
                    </div>
                    <span className={`badge ${getDifficultyColor(project.difficulty)}`}>
                      {project.difficulty}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.skills.slice(0, 3).map((skill, index) => (
                      <span key={index} className="badge badge-secondary text-xs">
                        {skill}
                      </span>
                    ))}
                    {project.skills.length > 3 && (
                      <span className="badge badge-secondary text-xs">
                        +{project.skills.length - 3} more
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${project.completionPercentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">{project.completionPercentage}%</span>
                    </div>
                    <Link 
                      to={`/projects/${project._id}`}
                      className="btn btn-primary btn-sm"
                    >
                      View Project
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="card text-center py-12">
                <div className="text-4xl mb-4">📚</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects yet</h3>
                <p className="text-gray-600 mb-4">Start your learning journey by exploring available projects.</p>
                <Link to="/projects" className="btn btn-primary">
                  Browse Projects
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="card">
            <h3 className="card-title mb-4">Your Progress</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Completed Projects</span>
                <span className="font-semibold text-gray-900">0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">In Progress</span>
                <span className="font-semibold text-gray-900">0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Skills Learned</span>
                <span className="font-semibold text-gray-900">0</span>
              </div>
            </div>
          </div>

          {/* Community Activity */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="card-title">Community Activity</h3>
              <Link to="/community" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View all
              </Link>
            </div>
            
            <div className="space-y-4">
              {communityPosts.length > 0 ? (
                communityPosts.map((post) => (
                  <div key={post._id} className="border-l-4 border-primary-200 pl-4">
                    <h4 className="text-sm font-medium text-gray-900 line-clamp-1">{post.title}</h4>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">{post.text}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">{post.author.name}</span>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span>❤️ {post.likeCount}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <div className="text-2xl mb-2">💬</div>
                  <p className="text-sm text-gray-600">No recent activity</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h3 className="card-title mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link to="/projects" className="block w-full btn btn-primary btn-sm text-center">
                Browse Projects
              </Link>
              <Link to="/community" className="block w-full btn btn-secondary btn-sm text-center">
                Join Community
              </Link>
              <Link to="/mentorship" className="block w-full btn btn-secondary btn-sm text-center">
                Find Mentor
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
