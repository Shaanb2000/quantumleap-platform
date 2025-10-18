import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

interface Mentor {
  _id: string;
  user: {
    name: string;
    email: string;
  };
  domains: string[];
  bio: string;
  experience: string;
  rating: {
    average: number;
    count: number;
  };
  availability: {
    timezone: string;
    availableDays: string[];
  };
}

const MentorshipPage: React.FC = () => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDomain, setSelectedDomain] = useState('');

  const fetchMentors = useCallback(async () => {
    try {
      const params = selectedDomain ? `?domain=${selectedDomain}` : '';
      const response = await axios.get(`/api/mentorship/mentors${params}`);
      setMentors(response.data.mentors);
    } catch (error) {
      console.error('Error fetching mentors:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedDomain]);

  useEffect(() => {
    fetchMentors();
  }, [fetchMentors]);

  const domains = ['AI', 'Climate', 'Biotech', 'Marketing', 'Social Impact'];

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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Find a Mentor</h1>
        <p className="text-gray-600">
          Connect with experienced professionals who can guide your learning journey.
        </p>
      </div>

      {/* Filter */}
      <div className="card mb-8">
        <div className="flex items-center space-x-4">
          <label className="form-label mb-0">Filter by Domain:</label>
          <select
            className="form-select w-48"
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
          >
            <option value="">All Domains</option>
            {domains.map((domain) => (
              <option key={domain} value={domain}>{domain}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Mentors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mentors.map((mentor) => (
          <div key={mentor._id} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{mentor.user.name}</h3>
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <span>⭐</span>
                  <span>{mentor.rating.average.toFixed(1)}</span>
                  <span>({mentor.rating.count} reviews)</span>
                </div>
              </div>
            </div>
            
            <p className="text-gray-600 mb-4 line-clamp-3">{mentor.bio}</p>
            
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Domains</h4>
                <div className="flex flex-wrap gap-2">
                  {mentor.domains.map((domain, index) => (
                    <span key={index} className="badge badge-primary text-xs">
                      {domain}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Experience</h4>
                <p className="text-sm text-gray-600 line-clamp-2">{mentor.experience}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Availability</h4>
                <p className="text-sm text-gray-600">
                  {mentor.availability.availableDays.join(', ')} • {mentor.availability.timezone}
                </p>
              </div>
            </div>
            
            <div className="mt-6">
              <button className="btn btn-primary w-full">
                Request Mentorship
              </button>
            </div>
          </div>
        ))}
      </div>

      {mentors.length === 0 && (
        <div className="card text-center py-12">
          <div className="text-4xl mb-4">👨‍🏫</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No mentors found</h3>
          <p className="text-gray-600">
            Try adjusting your domain filter or check back later.
          </p>
        </div>
      )}
    </div>
  );
};

export default MentorshipPage;
