import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { 
  Briefcase, 
  FileText, 
  TrendingUp, 
  MessageSquare, 
  Bell, 
  User, 
  Upload,
  Sparkles,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Clock
} from 'lucide-react';

const StudentDashboard = () => {
  const [stats, setStats] = useState({
    totalApplied: 0,
    shortlisted: 0,
    interviews: 0,
    placed: 0,
  });
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // In real implementation, these will be actual API calls
      // const statsRes = await api.get('/students/stats');
      // const jobsRes = await api.get('/students/recommended-jobs');
      // const appsRes = await api.get('/students/applications');
      
      // Mock data for now
      setStats({
        totalApplied: 12,
        shortlisted: 5,
        interviews: 3,
        placed: 1,
      });
      
      setRecommendedJobs([
        {
          _id: '1',
          title: 'Software Engineer Intern',
          company: 'Google',
          package: 8,
          location: 'Bangalore',
          matchPercentage: 92,
          deadline: '2026-08-15',
          type: 'internship',
        },
        {
          _id: '2',
          title: 'Full Stack Developer',
          company: 'Microsoft',
          package: 12,
          location: 'Hyderabad',
          matchPercentage: 85,
          deadline: '2026-08-20',
          type: 'full-time',
        },
        {
          _id: '3',
          title: 'React Developer',
          company: 'Amazon',
          package: 10,
          location: 'Bangalore',
          matchPercentage: 78,
          deadline: '2026-08-25',
          type: 'full-time',
        },
      ]);
      
      setApplications([
        {
          _id: '1',
          jobTitle: 'Software Engineer',
          company: 'Google',
          status: 'shortlisted',
          appliedAt: '2026-07-10',
          updatedAt: '2026-07-12',
        },
        {
          _id: '2',
          jobTitle: 'Frontend Developer',
          company: 'Flipkart',
          status: 'interview',
          appliedAt: '2026-07-08',
          updatedAt: '2026-07-14',
        },
        {
          _id: '3',
          jobTitle: 'Backend Developer',
          company: 'Paytm',
          status: 'applied',
          appliedAt: '2026-07-15',
          updatedAt: '2026-07-15',
        },
      ]);
      
      setLoading(false);
    } catch (err) {
      setError('Failed to load dashboard data');
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      applied: 'bg-yellow-100 text-yellow-700',
      shortlisted: 'bg-blue-100 text-blue-700',
      interview: 'bg-purple-100 text-purple-700',
      placed: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getStatusIcon = (status) => {
    const icons = {
      applied: Clock,
      shortlisted: CheckCircle2,
      interview: MessageSquare,
      placed: CheckCircle2,
      rejected: AlertCircle,
    };
    return icons[status] || Clock;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's your placement overview.</p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-4">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Applied</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalApplied}</p>
              </div>
              <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Shortlisted</p>
                <p className="text-2xl font-bold text-gray-900">{stats.shortlisted}</p>
              </div>
              <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Interviews</p>
                <p className="text-2xl font-bold text-gray-900">{stats.interviews}</p>
              </div>
              <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Placed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.placed}</p>
              </div>
              <div className="h-10 w-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Recommended Jobs */}
          <div className="lg:col-span-2 space-y-8">
            {/* AI Recommended Jobs */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary-600" />
                  <h2 className="text-xl font-semibold text-gray-900">AI Recommended Jobs</h2>
                </div>
                <Link to="/jobs" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
                  View All <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
              
              <div className="space-y-4">
                {recommendedJobs.map((job) => (
                  <div key={job._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{job.title}</h3>
                        <p className="text-sm text-gray-600">{job.company} • {job.location}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span>₹{job.package} LPA</span>
                          <span>{job.type === 'internship' ? 'Internship' : 'Full-time'}</span>
                          <span>Deadline: {job.deadline}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm font-medium">
                          <Sparkles className="h-3 w-3" />
                          {job.matchPercentage}% Match
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-3">
                      <button className="btn-primary text-sm py-2 px-4">
                        Apply Now
                      </button>
                      <button className="btn-secondary text-sm py-2 px-4">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Applications */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Applications</h2>
                <Link to="/applications" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
                  View All <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
              
              <div className="space-y-3">
                {applications.map((app) => {
                  const StatusIcon = getStatusIcon(app.status);
                  return (
                    <div key={app._id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${getStatusColor(app.status)}`}>
                          <StatusIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{app.jobTitle}</h3>
                          <p className="text-sm text-gray-600">{app.company}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(app.status)}`}>
                          {app.status}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          Applied: {new Date(app.appliedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column - Quick Actions */}
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link to="/profile" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Edit Profile</p>
                    <p className="text-sm text-gray-500">Update your details</p>
                  </div>
                </Link>
                
                <Link to="/resume" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Upload className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Upload Resume</p>
                    <p className="text-sm text-gray-500">AI-powered parsing</p>
                  </div>
                </Link>
                
                <Link to="/mock-interview" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">AI Mock Interview</p>
                    <p className="text-sm text-gray-500">Practice with AI</p>
                  </div>
                </Link>
                
                <Link to="/notifications" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Bell className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Notifications</p>
                    <p className="text-sm text-gray-500">3 new alerts</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Placement Probability */}
            <div className="card bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200">
              <h3 className="font-semibold text-gray-900 mb-2">Placement Probability</h3>
              <div className="flex items-center gap-4">
                <div className="relative h-20 w-20">
                  <svg className="h-20 w-20 transform -rotate-90">
                    <circle
                      cx="40"
                      cy="40"
                      r="36"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-primary-200"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="36"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 36}`}
                      strokeDashoffset={`${2 * Math.PI * 36 * (1 - 0.78)}`}
                      className="text-primary-600"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-primary-700">78%</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Based on your profile</p>
                  <p className="text-sm text-primary-600 font-medium mt-1">
                    Learn React.js to boost to 92%
                  </p>
                </div>
              </div>
            </div>

            {/* Skill Gap */}
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-4">Skill Gap Analysis</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">JavaScript</span>
                    <span className="text-green-600 font-medium">Strong</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-green-500 rounded-full" style={{ width: '90%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">React.js</span>
                    <span className="text-yellow-600 font-medium">Moderate</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-yellow-500 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Docker</span>
                    <span className="text-red-600 font-medium">Weak</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-red-500 rounded-full" style={{ width: '20%' }}></div>
                  </div>
                </div>
              </div>
              <Link to="/skills" className="mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
                Improve Skills <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;