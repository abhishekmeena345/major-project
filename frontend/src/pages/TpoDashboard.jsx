import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tpoAPI, authAPI } from '../services/apiService';
import { 
  Users, 
  Building2, 
  Briefcase, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  Bell, 
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
  GraduationCap,
  Clock,
  Loader2,
  Search,
  Filter,
  Send,
  Mail,
  PieChart,
  DollarSign,
  MapPin
} from 'lucide-react';

const TpoDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCompanies: 0,
    activeJobs: 0,
    totalPlaced: 0,
    placementRate: 0,
    avgPackage: 0,
  });
  
  const [pendingVerifications, setPendingVerifications] = useState([]);
  const [recentPlacements, setRecentPlacements] = useState([]);
  const [branchStats, setBranchStats] = useState([]);
  const [companyStats, setCompanyStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState('overview');
  
  // Broadcast modal state
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastForm, setBroadcastForm] = useState({
    title: '',
    message: '',
    type: 'broadcast',
    targetBranches: '',
    targetYears: ''
  });
  const [broadcastLoading, setBroadcastLoading] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch analytics and pending verifications in parallel
      const [analyticsRes, pendingRes] = await Promise.all([
        tpoAPI.getAnalytics(),
        authAPI.getPendingVerifications()
      ]);

      const analytics = analyticsRes.data.data;
      
      setStats({
        totalStudents: analytics.overview?.totalStudents || 0,
        totalCompanies: analytics.overview?.totalCompanies || 0,
        activeJobs: analytics.overview?.activeJobs || 0,
        totalPlaced: analytics.overview?.placedStudents || 0,
        placementRate: analytics.overview?.placementRate || 0,
        avgPackage: analytics.overview?.avgPackage || 0,
      });

      setBranchStats(analytics.branchStats || []);
      setCompanyStats(analytics.companyStats || []);
      setPendingVerifications(pendingRes.data.data || []);
      
      // Fetch recent placements
      const placementsRes = await tpoAPI.getPlacements();
      setRecentPlacements(placementsRes.data.data || []);
      
      setError('');
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (userId, action) => {
    setActionLoading(userId);
    try {
      if (action === 'approve') {
        await authAPI.verifyUser(userId);
      }
      // Remove from pending list
      setPendingVerifications(prev => prev.filter(u => u._id !== userId));
    } catch (err) {
      console.error('Verification failed:', err);
      setError(err.response?.data?.message || 'Failed to verify user');
    } finally {
      setActionLoading(null);
    }
  };

  const handleBroadcast = async (e) => {
    e.preventDefault();
    setBroadcastLoading(true);
    try {
      await tpoAPI.broadcast(broadcastForm);
      setShowBroadcastModal(false);
      setBroadcastForm({
        title: '',
        message: '',
        type: 'broadcast',
        targetBranches: '',
        targetYears: ''
      });
      alert('Broadcast sent successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send broadcast');
    } finally {
      setBroadcastLoading(false);
    }
  };

  const getRoleColor = (role) => {
    const colors = {
      student: 'bg-blue-100 text-blue-700',
      company: 'bg-purple-100 text-purple-700',
      alumni: 'bg-green-100 text-green-700',
      tpo: 'bg-red-100 text-red-700'
    };
    return colors[role] || 'bg-gray-100 text-gray-700';
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
              onClick={() => setShowBroadcastModal(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              Broadcast
            </button>
            <button 
              onClick={() => setActiveSection(activeSection === 'overview' ? 'analytics' : 'overview')}
              className="btn-secondary flex items-center gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              {activeSection === 'overview' ? 'Analytics' : 'Overview'}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-4">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

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
                <DollarSign className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {activeSection === 'overview' ? (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - 2/3 width */}
            <div className="lg:col-span-2 space-y-8">
              {/* Branch-wise Placement Stats */}
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Branch-wise Placement Statistics</h2>
                {branchStats.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <GraduationCap className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>No branch data available</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {branchStats.map((branch) => {
                      const percentage = branch.total > 0 ? ((branch.placed || 0) / branch.total * 100).toFixed(1) : 0;
                      return (
                        <div key={branch._id}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 bg-primary-100 rounded-lg flex items-center justify-center">
                                <GraduationCap className="h-4 w-4 text-primary-600" />
                              </div>
                              <span className="font-medium text-gray-900">{branch._id}</span>
                            </div>
                            <div className="text-right">
                              <span className="font-semibold text-gray-900">{branch.placed || 0}/{branch.total}</span>
                              <span className="text-sm text-gray-500 ml-2">({percentage}%)</span>
                            </div>
                          </div>
                          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary-500 rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>Avg CGPA: {(branch.avgCgpa || 0).toFixed(2)}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Recent Placements */}
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Recent Placements</h2>
                  <Link to="/placements" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                    View All
                  </Link>
                </div>
                
                {recentPlacements.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle2 className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>No placements yet</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Student</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Company</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Package</th>
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
                                <span className="font-medium text-gray-900">
                                  {placement.studentId?.personalInfo?.name || 'Unknown'}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-gray-600">
                              {placement.jobId?.companyId?.name || 'Unknown'}
                            </td>
                            <td className="py-3 px-4">
                              <span className="font-medium text-green-600">₹{placement.jobId?.package || 0} LPA</span>
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-500">
                              {new Date(placement.updatedAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Company-wise Hiring Stats */}
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Company-wise Hiring</h2>
                {companyStats.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Building2 className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>No company hiring data yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {companyStats.map((company) => (
                      <div key={company._id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Building2 className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{company._id}</p>
                            <p className="text-sm text-gray-500">Avg Package: ₹{(company.avgPackage || 0).toFixed(1)} LPA</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary-600">{company.totalHired}</p>
                          <p className="text-xs text-gray-500">Students Hired</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
                  {pendingVerifications.length === 0 ? (
                    <div className="text-center py-8">
                      <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
                      <p className="text-gray-600">All caught up! No pending verifications.</p>
                    </div>
                  ) : (
                    pendingVerifications.map((user) => (
                      <div key={user._id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-medium text-gray-900">{user.email}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium capitalize ${getRoleColor(user.role)}`}>
                                {user.role}
                              </span>
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {new Date(user.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleVerify(user._id, 'approve')}
                            disabled={actionLoading === user._id}
                            className="flex-1 flex items-center justify-center gap-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white text-sm font-medium py-2 rounded-lg transition-colors"
                          >
                            {actionLoading === user._id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <CheckCircle2 className="h-4 w-4" />
                            )}
                            {actionLoading === user._id ? 'Processing...' : 'Approve'}
                          </button>
                          <button
                            onClick={() => handleVerify(user._id, 'reject')}
                            disabled={actionLoading === user._id}
                            className="flex-1 flex items-center justify-center gap-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white text-sm font-medium py-2 rounded-lg transition-colors"
                          >
                            <XCircle className="h-4 w-4" />
                            Reject
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
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
        ) : (
          /* Analytics Section */
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Detailed Analytics</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-4">Placement Overview</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                    <span className="text-blue-700 font-medium">Total Students</span>
                    <span className="text-2xl font-bold text-blue-900">{stats.totalStudents}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                    <span className="text-green-700 font-medium">Placed Students</span>
                    <span className="text-2xl font-bold text-green-900">{stats.totalPlaced}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
                    <span className="text-purple-700 font-medium">Placement Rate</span>
                    <span className="text-2xl font-bold text-purple-900">{stats.placementRate}%</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-yellow-50 rounded-lg">
                    <span className="text-yellow-700 font-medium">Average Package</span>
                    <span className="text-2xl font-bold text-yellow-900">₹{stats.avgPackage} LPA</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-4">Company Statistics</h3>
                {companyStats.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No data available</p>
                ) : (
                  <div className="space-y-3">
                    {companyStats.map((company) => (
                      <div key={company._id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <span className="font-medium text-gray-700">{company._id}</span>
                        <div className="text-right">
                          <span className="text-lg font-bold text-primary-600">{company.totalHired}</span>
                          <span className="text-sm text-gray-500 ml-2">hired</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Broadcast Modal */}
        {showBroadcastModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Broadcast Notification</h2>
                <p className="text-sm text-gray-600 mt-1">Send notification to students</p>
              </div>
              
              <form onSubmit={handleBroadcast} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={broadcastForm.title}
                    onChange={(e) => setBroadcastForm({...broadcastForm, title: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., New Job Alert!"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                  <textarea
                    required
                    rows={4}
                    value={broadcastForm.message}
                    onChange={(e) => setBroadcastForm({...broadcastForm, message: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                    placeholder="Enter your message..."
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Target Branches</label>
                    <input
                      type="text"
                      value={broadcastForm.targetBranches}
                      onChange={(e) => setBroadcastForm({...broadcastForm, targetBranches: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g., CSE, IT"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Target Years</label>
                    <input
                      type="text"
                      value={broadcastForm.targetYears}
                      onChange={(e) => setBroadcastForm({...broadcastForm, targetYears: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g., 3, 4"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowBroadcastModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={broadcastLoading}
                    className="flex-1 btn-primary flex items-center justify-center gap-2"
                  >
                    {broadcastLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    {broadcastLoading ? 'Sending...' : 'Send Broadcast'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TpoDashboard;