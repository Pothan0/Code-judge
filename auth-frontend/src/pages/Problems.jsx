import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { problemAPI } from '../services/api';
import toast from 'react-hot-toast';

const Problems = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    difficulty: '',
    tags: '',
    page: 1
  });
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchProblems();
    fetchStats();
  }, [filters]);

  const fetchProblems = async () => {
    try {
      console.log('📋 Fetching problems with filters:', filters);
      setLoading(true);
      const response = await problemAPI.getProblems(filters);
      console.log('✅ Problems fetched successfully:', response.data.problems?.length || 0, 'problems');
      setProblems(response.data.problems);
    } catch (error) {
      console.error('❌ Failed to fetch problems:', error);
      toast.error('Failed to fetch problems');
      console.error('Error fetching problems:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      console.log('📊 Fetching problem stats...');
      const response = await problemAPI.getProblemStats();
      console.log('✅ Stats fetched successfully:', response.data);
      setStats(response.data);
    } catch (error) {
      console.error('❌ Failed to fetch stats:', error);
      console.error('Error fetching stats:', error);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-success-600 bg-success-50 border-success-200';
      case 'Medium': return 'text-warning-600 bg-warning-50 border-warning-200';
      case 'Hard': return 'text-error-600 bg-error-50 border-error-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getDifficultyIcon = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return (
          <svg className="w-4 h-4 text-success-500" fill="currentColor" viewBox="0 0 20 20">
            <circle cx="10" cy="10" r="6" />
          </svg>
        );
      case 'Medium':
        return (
          <svg className="w-4 h-4 text-warning-500" fill="currentColor" viewBox="0 0 20 20">
            <rect x="6" y="6" width="8" height="8" rx="1" />
          </svg>
        );
      case 'Hard':
        return (
          <svg className="w-4 h-4 text-error-500" fill="currentColor" viewBox="0 0 20 20">
            <polygon points="10,4 16,16 4,16" />
          </svg>
        );
      default:
        return null;
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="text-gray-600 font-medium">Loading problems...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Problems</h1>
          <p className="text-gray-600">Sharpen your skills with our curated problem set</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-card p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Problems</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalProblems}</p>
                </div>
                <div className="p-3 bg-primary-100 rounded-lg">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
              </div>
            </div>
            {stats.difficultyStats.map((stat) => (
              <div key={stat._id} className="bg-white rounded-xl shadow-card p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat._id}</p>
                    <p className={`text-2xl font-bold ${getDifficultyColor(stat._id).split(' ')[0]}`}>
                      {stat.count}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${getDifficultyColor(stat._id).split(' ')[1]}`}>
                    {getDifficultyIcon(stat._id)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-card p-6 mb-8 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Difficulty Level
              </label>
              <select
                value={filters.difficulty}
                onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Filter by Tags
              </label>
              <input
                type="text"
                value={filters.tags}
                onChange={(e) => handleFilterChange('tags', e.target.value)}
                placeholder="e.g., array, dynamic-programming"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={() => setFilters({ difficulty: '', tags: '', page: 1 })}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-all duration-200 border border-gray-300"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Problems Table */}
        <div className="bg-white rounded-xl shadow-card overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Problem
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Difficulty
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Acceptance Rate
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Tags
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {problems.map((problem, index) => (
                  <tr key={problem._id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-500">
                          #{index + 1}
                        </span>
                        <Link
                          to={`/problems/${problem._id}`}
                          className="text-primary-600 hover:text-primary-800 font-semibold text-lg transition-colors duration-200"
                        >
                          {problem.title}
                        </Link>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {getDifficultyIcon(problem.difficulty)}
                        <span className={`px-3 py-1 text-sm font-semibold rounded-full border ${getDifficultyColor(problem.difficulty)}`}>
                          {problem.difficulty}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-semibold text-gray-900">
                          {problem.totalSubmissions > 0
                            ? `${Math.round((problem.acceptedSubmissions / problem.totalSubmissions) * 100)}%`
                            : 'N/A'
                          }
                        </span>
                        <span className="text-sm text-gray-500">
                          ({problem.acceptedSubmissions}/{problem.totalSubmissions})
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {problem.tags.slice(0, 3).map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-2 py-1 text-xs font-medium bg-primary-50 text-primary-700 rounded-md border border-primary-200"
                          >
                            {tag}
                          </span>
                        ))}
                        {problem.tags.length > 3 && (
                          <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-md">
                            +{problem.tags.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {problems.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No problems found</h3>
              <p className="text-gray-500">Try adjusting your filters to see more problems.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Problems;
