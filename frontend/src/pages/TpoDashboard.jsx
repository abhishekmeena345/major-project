import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Building2, 
  Briefcase, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  Bell, 
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
  GraduationCap,
  Clock
} from 'lucide-react';

const TpoDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 450,
    totalCompanies: 32,
    activeJobs: 18,
    totalPlaced: 128,
    placementRate: 85,
    avgPackage: 8.5,
  });
  
  const [pendingVerifications, setPendingVerifications] = useState([
    {
      _id: '1',
      email: 'student1@college.edu',
      role: 'student',
      name: 'Rahul Sharma',
      branch: 'CSE',
      requestedAt: '2026-07-18',
    },
    {
      _id: '2',
      email: 'techcorp@gmail.com',
      role: 'company',
      name: 'TechCorp Solutions',
      requestedAt: '2026-07-17',
    },
    {
      _id: '3',
      email: 'alumni1@alumni.edu',
      role: 'alumni',
      name: 'Priya Patel',
      company: 'Google',
      requestedAt: '2026-07-16',
    },
  ]);
  
  const [recentPlacements, setRecentPlacements] = useState([
    {
      _id: '1',
      studentName: 'Amit Kumar',
      company: 'Microsoft',
      package: 12,
      branch: 'CSE',
      placedAt: '2026-07-15',
    },
    {
      _id: '2',
      studentName: 'Sneha Gupta',
      company: 'Amazon',
      package: 10,
      branch: 'IT',
      placedAt: '2026-07-14',
    },
    {
      _id: '3',
      studentName: 'Vikram Singh',
      company: 'Flipkart',
      package: 9,
      branch: 'ECE',
      placedAt: '2026-07-13',
    },
  ]);
  
  const [branchStats, setBranchStats] = useState([
    { branch: 'CSE', placed: 45, total: 120, percentage: 37.5 },
    { branch: 'IT', placed: 38, total: 100, percentage: 38 },
    { branch: 'ECE', placed: 25, total: 80, percentage: 31.25 },
    { branch: 'EEE', placed: 12, total: 60, percentage: 20 },
    { branch: 'MECH', placed: 8, total: 90, percentage: 8.9 },
  ]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const handleVerify = async (userId, action) => {
    // API call: await api.post(`/auth/verify/${userId}`);
    setPendingVerifications(prev => prev.filter(u => u._id !== userId));
  };

  const handleBroadcast = () => {
    // Open broadcast modal
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">TPO Dashboard</h1>
            <p className="text-gray-600 mt-1">Training & Placement Officer Control Panel</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handleBroadcast}
              className="btn-primary flex items-center gap-2"
            >
              <Bell className="h-4 w-4" />
              Broadcast
            </button>
            <Link to="/analytics" className="btn-secondary flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Detailed Analytics
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
              </div>
              <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Companies</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCompanies}</p>
              </div>
              <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Building2 className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeJobs}</p>
              </div>
              <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Placed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalPlaced}</p>
              </div>
              <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Placement Rate</p>
                <div className="flex items-center gap-1">
                  <p className="text-2xl font-bold text-gray-900">{stats.placementRate}%</p>
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                </div>
              </div>
              <div className="h-10 w-10 bg-teal-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-teal-600" />
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Package</p>
                <div className="flex items-center gap-1">
                  <p className="text-2xl font-bold text-gray-900">₹{stats.avgPackage}L</p>
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                </div>
              </div>
              <div className="h-10 w-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <PieChart className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-8">
            {/* Branch-wise Placement Stats */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Branch-wise Placement Statistics</h2>
              <div className="space-y-4">
                {branchStats.map((branch) => (
                  <div key={branch.branch}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-primary-100 rounded-lg flex items-center justify-center">
                          <GraduationCap className="h-4 w-4 text-primary-600" />
                        </div>
                        <span className="font-medium text-gray-900">{branch.branch}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold text-gray-900">{branch.placed}/{branch.total}</span>
                        <span className="text-sm text-gray-500 ml-2">({branch.percentage}%)</span>
                      </div>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary-500 rounded-full transition-all duration-500"
                        style={{ width: `${branch.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Placements */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Placements</h2>
                <Link to="/placements" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                  View All
                </Link>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Student</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Company</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Package</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Branch</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentPlacements.map((placement) => (
                      <tr key={placement._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            </div>
                            <span className="font-medium text-gray-900">{placement.studentName}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{placement.company}</td>
                        <td className="py-3 px-4">
                          <span className="font-medium text-green-600">₹{placement.package} LPA</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                            {placement.branch}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-500">
                          {new Date(placement.placedAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            {/* Pending Verifications */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Pending Verifications</h2>
                <span className="inline-flex items-center justify-center h-6 w-6 bg-red-100 text-red-600 rounded-full text-xs font-bold">
                  {pendingVerifications.length}
                </span>
              </div>
              
              <div className="space-y-4">
                {pendingVerifications.map((user) => (
                  <div key={user._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-medium text-gray-900">{user.name || user.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                            user.role === 'student' ? 'bg-blue-100 text-blue-700' :
                            user.role === 'company' ? 'bg-purple-100 text-purple-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {user.role}
                          </span>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {user.requestedAt}
                          </span>
                        </div>
                        {user.branch && (
                          <p className="text-sm text-gray-600 mt-1">Branch: {user.branch}</p>
                        )}
                        {user.company && (
                          <p className="text-sm text-gray-600 mt-1">Company: {user.company}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleVerify(user._id, 'approve')}
                        className="flex-1 flex items-center justify-center gap-1 bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 rounded-lg transition-colors"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleVerify(user._id, 'reject')}
                        className="flex-1 flex items-center justify-center gap-1 bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2 rounded-lg transition-colors"
                      >
                        <XCircle className="h-4 w-4" />
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {pendingVerifications.length === 0 && (
                <div className="text-center py-8">
                  <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
                  <p className="text-gray-600">All caught up! No pending verifications.</p>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link to="/students" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Manage Students</p>
                    <p className="text-sm text-gray-500">View and filter students</p>
                  </div>
                </Link>
                
                <Link to="/companies" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Manage Companies</p>
                    <p className="text-sm text-gray-500">Approve and manage companies</p>
                  </div>
                </Link>
                
                <Link to="/jobs/manage" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Briefcase className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Manage Jobs</p>
                    <p className="text-sm text-gray-500">Review active job postings</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TpoDashboard;