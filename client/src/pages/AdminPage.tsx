import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface DashboardStats {
  totalUsers: number;
  totalProjects: number;
  totalPosts: number;
  totalMentors: number;
  totalRequests: number;
}

const AdminPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get('/api/admin/dashboard');
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">
          Manage the QuantumLeap platform and monitor user activity.
        </p>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="card text-center">
            <div className="text-3xl font-bold text-primary-600 mb-2">
              {stats.totalUsers}
            </div>
            <div className="text-gray-600">Total Users</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-primary-600 mb-2">
              {stats.totalProjects}
            </div>
            <div className="text-gray-600">Projects</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-primary-600 mb-2">
              {stats.totalPosts}
            </div>
            <div className="text-gray-600">Community Posts</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-primary-600 mb-2">
              {stats.totalMentors}
            </div>
            <div className="text-gray-600">Mentors</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-primary-600 mb-2">
              {stats.totalRequests}
            </div>
            <div className="text-gray-600">Mentorship Requests</div>
          </div>
        </div>
      )}

      {/* Admin Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card">
          <div className="text-center">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">User Management</h3>
            <p className="text-gray-600 mb-4">Manage users, roles, and permissions</p>
            <button className="btn btn-primary w-full">
              Manage Users
            </button>
          </div>
        </div>

        <div className="card">
          <div className="text-center">
            <div className="text-4xl mb-4">📁</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Project Management</h3>
            <p className="text-gray-600 mb-4">Create and manage learning projects</p>
            <button className="btn btn-primary w-full">
              Manage Projects
            </button>
          </div>
        </div>

        <div className="card">
          <div className="text-center">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Content Moderation</h3>
            <p className="text-gray-600 mb-4">Review and moderate community posts</p>
            <button className="btn btn-primary w-full">
              Moderate Content
            </button>
          </div>
        </div>

        <div className="card">
          <div className="text-center">
            <div className="text-4xl mb-4">👨‍🏫</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Mentor Management</h3>
            <p className="text-gray-600 mb-4">Manage mentors and mentorship requests</p>
            <button className="btn btn-primary w-full">
              Manage Mentors
            </button>
          </div>
        </div>

        <div className="card">
          <div className="text-center">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics</h3>
            <p className="text-gray-600 mb-4">View platform analytics and insights</p>
            <button className="btn btn-primary w-full">
              View Analytics
            </button>
          </div>
        </div>

        <div className="card">
          <div className="text-center">
            <div className="text-4xl mb-4">⚙️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Settings</h3>
            <p className="text-gray-600 mb-4">Configure platform settings</p>
            <button className="btn btn-primary w-full">
              Platform Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
