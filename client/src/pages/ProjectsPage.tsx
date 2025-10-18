import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  createdBy: {
    name: string;
  };
  createdAt: string;
}

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    domain: '',
    difficulty: '',
    search: ''
  });

  useEffect(() => {
    fetchProjects();
  }, [filters]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.domain) params.append('domain', filters.domain);
      if (filters.difficulty) params.append('difficulty', filters.difficulty);
      
      const response = await axios.get(`/api/projects?${params.toString()}`);
      let filteredProjects = response.data.projects;

      if (filters.search) {
        filteredProjects = filteredProjects.filter((project: Project) =>
          project.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          project.description.toLowerCase().includes(filters.search.toLowerCase())
        );
      }

      setProjects(filteredProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const domains = ['AI', 'Climate', 'Biotech', 'Marketing', 'Social Impact'];
  const difficulties = ['Beginner', 'Intermediate', 'Advanced'];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Projects</h1>
        <p className="text-gray-600">
          Explore hands-on projects to build future-ready skills.
        </p>
      </div>

      {/* Filters */}
      <div className="card mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="form-label">Search</label>
            <input
              type="text"
              placeholder="Search projects..."
              className="form-input"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
          <div>
            <label className="form-label">Domain</label>
            <select
              className="form-select"
              value={filters.domain}
              onChange={(e) => setFilters({ ...filters, domain: e.target.value })}
            >
              <option value="">All Domains</option>
              {domains.map((domain) => (
                <option key={domain} value={domain}>{domain}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label">Difficulty</label>
            <select
              className="form-select"
              value={filters.difficulty}
              onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
            >
              <option value="">All Levels</option>
              {difficulties.map((difficulty) => (
                <option key={difficulty} value={difficulty}>{difficulty}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => setFilters({ domain: '', difficulty: '', search: '' })}
              className="btn btn-secondary w-full"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="spinner"></div>
        </div>
      ) : projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project._id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getDomainIcon(project.domain)}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{project.title}</h3>
                    <p className="text-sm text-gray-600">{project.domain}</p>
                  </div>
                </div>
                <span className={`badge ${getDifficultyColor(project.difficulty)}`}>
                  {project.difficulty}
                </span>
              </div>
              
              <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>
              
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
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Duration: {project.estimatedDuration} days</span>
                  <span>By {project.createdBy.name}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
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
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects found</h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your filters or search terms.
          </p>
          <button
            onClick={() => setFilters({ domain: '', difficulty: '', search: '' })}
            className="btn btn-primary"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
