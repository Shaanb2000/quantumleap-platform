import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

interface CompletedProject {
  _id: string;
  title: string;
  description: string;
  domain: string;
  skills: string[];
  completedAt: string;
}

const PortfolioPage: React.FC = () => {
  const { user } = useAuth();
  const [completedProjects, setCompletedProjects] = useState<CompletedProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompletedProjects();
  }, []);

  const fetchCompletedProjects = async () => {
    try {
      const response = await axios.get('/api/auth/me');
      setCompletedProjects(response.data.user.completedProjects || []);
    } catch (error) {
      console.error('Error fetching completed projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportPortfolio = () => {
    const portfolioData = {
      user: {
        name: user?.name,
        email: user?.email,
        interests: user?.interests
      },
      completedProjects,
      exportedAt: new Date().toISOString()
    };

    const dataStr = JSON.stringify(portfolioData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `portfolio-${user?.name?.replace(' ', '-')}-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
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
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Portfolio</h1>
          <p className="text-gray-600">
            Showcase your completed projects and skills.
          </p>
        </div>
        <button
          onClick={exportPortfolio}
          className="btn btn-primary"
        >
          Export Portfolio
        </button>
      </div>

      {/* Profile Summary */}
      <div className="card mb-8">
        <div className="flex items-center space-x-6">
          <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-primary-600 font-bold text-2xl">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
            <p className="text-gray-600 mb-2">{user?.email}</p>
            <div className="flex flex-wrap gap-2">
              {user?.interests?.map((interest, index) => (
                <span key={index} className="badge badge-primary">
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card text-center">
          <div className="text-3xl font-bold text-primary-600 mb-2">
            {completedProjects.length}
          </div>
          <div className="text-gray-600">Projects Completed</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-primary-600 mb-2">
            {completedProjects.reduce((acc, project) => acc + project.skills.length, 0)}
          </div>
          <div className="text-gray-600">Skills Learned</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-primary-600 mb-2">
            {new Set(completedProjects.map(p => p.domain)).size}
          </div>
          <div className="text-gray-600">Domains Explored</div>
        </div>
      </div>

      {/* Completed Projects */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Completed Projects</h2>
        
        {completedProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedProjects.map((project) => (
              <div key={project._id} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getDomainIcon(project.domain)}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
                      <p className="text-sm text-gray-600">{project.domain}</p>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Skills Learned</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.skills.map((skill, index) => (
                        <span key={index} className="badge badge-secondary text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    Completed: {new Date(project.completedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center py-12">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No completed projects yet</h3>
            <p className="text-gray-600 mb-4">
              Start working on projects to build your portfolio.
            </p>
            <a href="/projects" className="btn btn-primary">
              Browse Projects
            </a>
          </div>
        )}
      </div>

      {/* Skills Summary */}
      {completedProjects.length > 0 && (
        <div className="card">
          <h2 className="card-title mb-6">Skills Summary</h2>
          <div className="flex flex-wrap gap-2">
            {Array.from(new Set(completedProjects.flatMap(p => p.skills))).map((skill, index) => (
              <span key={index} className="badge badge-primary">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioPage;
