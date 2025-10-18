import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const domains = [
    {
      name: 'AI',
      description: 'Artificial Intelligence & Machine Learning',
      icon: '🤖',
      color: 'bg-blue-100 text-blue-800'
    },
    {
      name: 'Climate',
      description: 'Climate Science & Environmental Solutions',
      icon: '🌱',
      color: 'bg-green-100 text-green-800'
    },
    {
      name: 'Biotech',
      description: 'Biotechnology & Life Sciences',
      icon: '🧬',
      color: 'bg-purple-100 text-purple-800'
    },
    {
      name: 'Marketing',
      description: 'Digital Marketing & Growth',
      icon: '📈',
      color: 'bg-orange-100 text-orange-800'
    },
    {
      name: 'Social Impact',
      description: 'Social Innovation & Change',
      icon: '🌍',
      color: 'bg-pink-100 text-pink-800'
    }
  ];

  const features = [
    {
      title: 'Project-Based Learning',
      description: 'Learn through hands-on projects that build real-world skills',
      icon: '🎯'
    },
    {
      title: 'Expert Mentorship',
      description: 'Get guidance from industry professionals and domain experts',
      icon: '👨‍🏫'
    },
    {
      title: 'Community Support',
      description: 'Connect with like-minded learners and share your journey',
      icon: '🤝'
    },
    {
      title: 'Portfolio Building',
      description: 'Showcase your completed projects and skills to employers',
      icon: '💼'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Master Future Skills Through
              <span className="text-primary-600"> Real Projects</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Join QuantumLeap and build the skills that matter for tomorrow's world. 
              Learn through hands-on projects, get expert mentorship, and connect with a community of future-focused learners.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link to="/dashboard" className="btn btn-primary btn-lg">
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn btn-primary btn-lg">
                    Start Learning
                  </Link>
                  <Link to="/login" className="btn btn-secondary btn-lg">
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Domains Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Explore Future Domains
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose from cutting-edge domains that will shape the future of work and innovation.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {domains.map((domain) => (
              <div key={domain.name} className="card hover:shadow-lg transition-shadow duration-300">
                <div className="text-center">
                  <div className="text-4xl mb-4">{domain.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{domain.name}</h3>
                  <p className="text-gray-600">{domain.description}</p>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-4 ${domain.color}`}>
                    Learn More
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose QuantumLeap?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform is designed to help you build the skills that matter for the future.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Build Your Future?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of learners who are already building the skills that will define tomorrow's world.
          </p>
          {!isAuthenticated && (
            <Link to="/register" className="btn bg-white text-primary-600 hover:bg-gray-100 btn-lg">
              Get Started Today
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">Q</span>
                </div>
                <span className="text-xl font-bold">QuantumLeap</span>
              </div>
              <p className="text-gray-400">
                Building the future through project-based learning.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/projects" className="hover:text-white transition-colors">Projects</Link></li>
                <li><Link to="/community" className="hover:text-white transition-colors">Community</Link></li>
                <li><Link to="/mentorship" className="hover:text-white transition-colors">Mentorship</Link></li>
                <li><Link to="/portfolio" className="hover:text-white transition-colors">Portfolio</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Domains</h3>
              <ul className="space-y-2 text-gray-400">
                <li>AI & Machine Learning</li>
                <li>Climate Science</li>
                <li>Biotechnology</li>
                <li>Digital Marketing</li>
                <li>Social Impact</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 QuantumLeap. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
