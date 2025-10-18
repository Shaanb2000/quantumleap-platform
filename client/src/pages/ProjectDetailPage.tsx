import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface Project {
  _id: string;
  title: string;
  description: string;
  domain: string;
  difficulty: string;
  estimatedDuration: number;
  skills: string[];
  tasks: Array<{
    _id: string;
    title: string;
    description: string;
    status: string;
  }>;
  resources: Array<{
    title: string;
    url: string;
    type: string;
  }>;
  prerequisites: string[];
  createdBy: {
    name: string;
  };
}

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProject = useCallback(async () => {
    try {
      const response = await axios.get(`/api/projects/${id}`);
      setProject(response.data.project);
    } catch (error) {
      console.error('Error fetching project:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchProject();
    }
  }, [id, fetchProject]);

  const updateTaskStatus = async (taskId: string, status: string) => {
    try {
      await axios.post(`/api/projects/${id}/tasks/${taskId}/status`, { status });
      fetchProject(); // Refresh project data
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="card text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Project not found</h2>
          <p className="text-gray-600">The project you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Project Header */}
      <div className="card mb-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.title}</h1>
            <p className="text-gray-600 mb-4">{project.description}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>Domain: {project.domain}</span>
              <span>Duration: {project.estimatedDuration} days</span>
              <span>By {project.createdBy.name}</span>
            </div>
          </div>
          <span className={`badge ${project.difficulty === 'Beginner' ? 'badge-success' : project.difficulty === 'Intermediate' ? 'badge-warning' : 'badge-danger'}`}>
            {project.difficulty}
          </span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {project.skills.map((skill, index) => (
            <span key={index} className="badge badge-secondary">
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Tasks */}
          <div className="card">
            <h2 className="card-title mb-6">Project Tasks</h2>
            <div className="space-y-4">
              {project.tasks.map((task) => (
                <div key={task._id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{task.title}</h3>
                    <select
                      value={task.status}
                      onChange={(e) => updateTaskStatus(task._id, e.target.value)}
                      className="form-select text-sm"
                    >
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                  </div>
                  <p className="text-gray-600 text-sm">{task.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div className="card">
            <h2 className="card-title mb-6">Resources</h2>
            <div className="space-y-3">
              {project.resources.map((resource, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{resource.title}</h4>
                    <p className="text-sm text-gray-600">{resource.type}</p>
                  </div>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-sm"
                  >
                    Visit
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Prerequisites */}
          <div className="card">
            <h3 className="card-title mb-4">Prerequisites</h3>
            <ul className="space-y-2">
              {project.prerequisites.map((prereq, index) => (
                <li key={index} className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-primary-600 rounded-full mr-3"></span>
                  {prereq}
                </li>
              ))}
            </ul>
          </div>

          {/* Progress */}
          <div className="card">
            <h3 className="card-title mb-4">Your Progress</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Completion</span>
                  <span>0%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-primary-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Tasks Completed</span>
                  <span>0 / {project.tasks.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
