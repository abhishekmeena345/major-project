
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobAPI, companyAPI } from '../services/apiService';
import { 
  Briefcase, 
  Users, 
  TrendingUp, 
  Plus, 
  Search, 
  Filter,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Clock,
  MessageSquare,
  Eye,
  Star,
  Loader2,
  AlertCircle,
  Calendar,
  MapPin,
  DollarSign,
  GraduationCap,
  Code,
  Mail,
  FileText,
  User,
  ArrowLeft,
  X,
  Download
} from 'lucide-react';

const CompanyDashboard = () => {
  const [activeTab, setActiveTab] = useState('jobs');
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    shortlisted: 0,
    hired: 0,
    interviews: 0,
    avgPackage: 0
  });
  
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Applicant Detail Modal State
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [showApplicantModal, setShowApplicantModal] = useState(false);
  const [schedulingInterview, setSchedulingInterview] = useState(false);
  const [interviewForm, setInterviewForm] = useState({
    date: '',
    time: '',
    meetLink: ''
  });

  // Create job form state
  const [jobForm, setJobForm] = useState({
    title: '',
    description: '',
    package: '',
    location: '',
    type: 'full-time',
    minCgpa: 7.0,
    maxBacklogs: 0,
    requiredSkills: '',
    branches: 'CSE,IT',
    deadline: ''
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, jobsRes] = await Promise.all([
        companyAPI.getDashboardStats(),
        jobAPI.getMyJobs()
      ]);

      setStats(statsRes.data.data);
      setJobs(jobsRes.data.data || []);
      setError('');
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchApplicants = async (jobId) => {
    try {
      setLoading(true);
      const res = await companyAPI.getJobApplicants(jobId);
      setApplicants(res.data.data || []);
      setSelectedJob(jobId);
      setActiveTab('applicants');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load applicants');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      const jobData = {
        ...jobForm,
        package: parseFloat(jobForm.package),
        eligibility: {
          minCgpa: parseFloat(jobForm.minCgpa),
          maxBacklogs: parseInt(jobForm.maxBacklogs),
          requiredSkills: jobForm.requiredSkills.split(',').map(s => s.trim()).filter(s => s),
          branches: jobForm.branches.split(',').map(s => s.trim()).filter(s => s)
        },
        deadline: new Date(jobForm.deadline).toISOString()
      };

      await jobAPI.createJob(jobData);
      setShowCreateModal(false);
      fetchDashboardData();
      setJobForm({
        title: '',
        description: '',
        package: '',
        location: '',
        type: 'full-time',
        minCgpa: 7.0,
        maxBacklogs: 0,
        requiredSkills: '',
        branches: 'CSE,IT',
        deadline: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create job');
    }
  };

  const handleStatusUpdate = async (applicationId, status) => {
    setUpdatingStatus(applicationId);
    try {
      await companyAPI.updateApplicationStatus(applicationId, { status });
      if (selectedJob) {
        fetchApplicants(selectedJob);
      }
      const statsRes = await companyAPI.getDashboardStats();
      setStats(statsRes.data.data);
      // Update modal if open
      if (selectedApplicant && selectedApplicant._id === applicationId) {
        setSelectedApplicant(prev => ({ ...prev, status }));
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleScheduleInterview = async (applicationId) => {
    if (!interviewForm.date || !interviewForm.time) {
      setError('Please provide date and time for the interview');
      return;
    }
    try {
      await companyAPI.scheduleInterview(applicationId, {
        date: interviewForm.date,
        time: interviewForm.time,
        meetLink: interviewForm.meetLink
      });
      setSchedulingInterview(false);
      setInterviewForm({ date: '', time: '', meetLink: '' });
      if (selectedJob) {
        fetchApplicants(selectedJob);
      }
      if (selectedApplicant) {
        setSelectedApplicant(prev => ({ ...prev, status: 'interview' }));
      }
      const statsRes = await companyAPI.getDashboardStats();
      setStats(statsRes.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to schedule interview');
    }
  };

  const openApplicantModal = (applicant) => {
    setSelectedApplicant(applicant);
    setShowApplicantModal(true);
    setSchedulingInterview(false);
    setInterviewForm({ date: '', time: '', meetLink: '' });
  };

  const closeApplicantModal = () => {
    setShowApplicantModal(false);
    setSelectedApplicant(null);
    setSchedulingInterview(false);
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
      rejected: XCircle,
    };
    return icons[status] || Clock;
  };

  const getAIRankColor = (color) => {
    const colors = {
      green: 'bg-green-100 text-green-700 border-green-200',
      blue: 'bg-blue-100 text-blue-700 border-blue-200',
      teal: 'bg-teal-100 text-teal-700 border-teal-200',
      yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      red: 'bg-red-100 text-red-700 border-red-200',
    };
    return colors[color] || 'bg-gray-100 text-gray-700';
  };

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && !jobs.length && !applicants.length) {
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
            <h1 className="text-3xl font-bold text-gray-900">Company Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage jobs and track candidates</p>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Post New Job
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-4">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalJobs}</p>
              </div>
              <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeJobs}</p>
              </div>
              <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Applications</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalApplications}</p>
              </div>
              <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Shortlisted</p>
                <p className="text-2xl font-bold text-gray-900">{stats.shortlisted}</p>
              </div>
              <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Star className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Interviews</p>
                <p className="text-2xl font-bold text-gray-900">{stats.interviews}</p>
              </div>
              <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Hired</p>
                <p className="text-2xl font-bold text-gray-900">{stats.hired}</p>
              </div>
              <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`pb-3 px-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'jobs' 
                ? 'border-primary-600 text-primary-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            My Jobs
          </button>
          {selectedJob && (
            <button
              onClick={() => setActiveTab('applicants')}
              className={`pb-3 px-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'applicants' 
                  ? 'border-primary-600 text-primary-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Applicants
            </button>
          )}
        </div>

        {/* My Jobs Tab */}
        {activeTab === 'jobs' && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="space-y-4">
              {filteredJobs.length === 0 ? (
                <div className="card text-center py-12">
                  <Briefcase className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-gray-500">No jobs posted yet</p>
                  <button 
                    onClick={() => setShowCreateModal(true)}
                    className="btn-primary mt-4"
                  >
                    Post Your First Job
                  </button>
                </div>
              ) : (
                filteredJobs.map((job) => (
                  <div key={job._id} className="card hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                            job.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {job.status}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {job.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            ₹{job.package} LPA
                          </span>
                          <span className="capitalize">{job.type}</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Deadline: {new Date(job.deadline).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => fetchApplicants(job._id)}
                          className="btn-primary text-sm py-2 px-4 flex items-center gap-2"
                        >
                          <Eye className="h-4 w-4" />
                          View Applicants
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Applicants Tab */}
        {activeTab === 'applicants' && selectedJob && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setActiveTab('jobs')}
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-primary-600"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Jobs
              </button>
            </div>

            <div className="card overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Rank</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Candidate</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Branch</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">CGPA</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Match %</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applicants.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-12 text-gray-500">
                        <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p>No applicants yet</p>
                      </td>
                    </tr>
                  ) : (
                    applicants.map((applicant, idx) => {
                      const StatusIcon = getStatusIcon(applicant.status);
                      return (
                        <tr key={applicant._id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-700">
                              {idx + 1}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div>
                              <p className="font-medium text-gray-900">{applicant.name}</p>
                              <p className="text-sm text-gray-500">{applicant.email}</p>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-600">{applicant.branch}</td>
                          <td className="py-4 px-4">
                            <span className="font-semibold text-gray-900">{applicant.cgpa}</span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-16 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-primary-500 rounded-full"
                                  style={{ width: `${applicant.matchPercentage}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium text-primary-600">{applicant.matchPercentage}%</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(applicant.status)}`}>
                              <StatusIcon className="h-3 w-3" />
                              {applicant.status}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openApplicantModal(applicant)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-lg text-sm font-medium hover:bg-primary-100 transition-colors"
                              >
                                <Eye className="h-4 w-4" />
                                View Info
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================== APPLICANT DETAIL MODAL ==================== */}
        {showApplicantModal && selectedApplicant && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={closeApplicantModal}
            ></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl animate-fade-in">
              {/* Header */}
              <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-6 sm:p-8">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                      <User className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{selectedApplicant.name}</h2>
                      <div className="flex flex-wrap items-center gap-3 mt-1 text-primary-100 text-sm">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3.5 w-3.5" />
                          {selectedApplicant.email}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <GraduationCap className="h-3.5 w-3.5" />
                          {selectedApplicant.branch}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="inline-flex flex-col items-center bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                      <span className="text-3xl font-bold">{selectedApplicant.matchPercentage}%</span>
                      <span className="text-xs text-primary-100">AI Match</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={closeApplicantModal}
                  className="absolute top-4 right-4 h-8 w-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 sm:p-8">
                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-gray-900">{selectedApplicant.cgpa}</div>
                    <div className="text-xs text-gray-500 mt-1">CGPA</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {selectedApplicant.skills?.length || 0}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Skills</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {new Date(selectedApplicant.appliedAt).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Applied On</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(selectedApplicant.status)}`}>
                      {selectedApplicant.status}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Current Status</div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div className="space-y-6">
                    {/* Skills */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Code className="h-5 w-5 text-primary-600" />
                        Skills
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedApplicant.skills?.length > 0 ? (
                          selectedApplicant.skills.map((skill, idx) => (
                            <span 
                              key={idx} 
                              className="inline-flex px-3 py-1.5 bg-primary-50 text-primary-700 rounded-lg text-sm font-medium border border-primary-100"
                            >
                              {skill}
                            </span>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500">No skills listed</p>
                        )}
                      </div>
                    </div>

                    {/* AI Rank */}
                    {selectedApplicant.aiRank && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Star className="h-5 w-5 text-primary-600" />
                          AI Assessment
                        </h3>
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border ${getAIRankColor(selectedApplicant.aiRank.color)}`}>
                          <span className="text-lg font-bold">{selectedApplicant.aiRank.score}</span>
                          <span className="text-sm font-medium">{selectedApplicant.aiRank.label}</span>
                        </div>
                      </div>
                    )}

                    {/* Resume */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary-600" />
                        Resume
                      </h3>
                      {selectedApplicant.resumeUrl ? (
                        <a
                          href={selectedApplicant.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 transition-colors"
                        >
                          <Download className="h-4 w-4" />
                          View / Download Resume
                        </a>
                      ) : (
                        <div className="px-4 py-3 bg-gray-50 border border-dashed border-gray-300 rounded-xl text-sm text-gray-500">
                          No resume uploaded
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column - Actions */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary-600" />
                      Take Action
                    </h3>

                    {/* Status Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => handleStatusUpdate(selectedApplicant._id, 'shortlisted')}
                        disabled={updatingStatus === selectedApplicant._id || selectedApplicant.status === 'shortlisted'}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl font-medium transition-colors disabled:opacity-50"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Shortlist
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(selectedApplicant._id, 'rejected')}
                        disabled={updatingStatus === selectedApplicant._id || selectedApplicant.status === 'rejected'}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl font-medium transition-colors disabled:opacity-50"
                      >
                        <XCircle className="h-4 w-4" />
                        Reject
                      </button>
                      <button
                        onClick={() => setSchedulingInterview(!schedulingInterview)}
                        disabled={selectedApplicant.status === 'interview'}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl font-medium transition-colors disabled:opacity-50 col-span-2"
                      >
                        <Calendar className="h-4 w-4" />
                        {schedulingInterview ? 'Cancel Scheduling' : 'Schedule Interview'}
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(selectedApplicant._id, 'placed')}
                        disabled={updatingStatus === selectedApplicant._id || selectedApplicant.status === 'placed'}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl font-medium transition-colors disabled:opacity-50 col-span-2"
                      >
                        <TrendingUp className="h-4 w-4" />
                        Mark as Hired
                      </button>
                    </div>

                    {/* Interview Schedule Form */}
                    {schedulingInterview && (
                      <div className="bg-gray-50 rounded-xl p-4 space-y-3 border border-gray-200">
                        <h4 className="font-medium text-gray-900 text-sm">Interview Details</h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Date</label>
                            <input
                              type="date"
                              value={interviewForm.date}
                              onChange={(e) => setInterviewForm({...interviewForm, date: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Time</label>
                            <input
                              type="time"
                              value={interviewForm.time}
                              onChange={(e) => setInterviewForm({...interviewForm, time: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Meet Link (Optional)</label>
                          <input
                            type="url"
                            placeholder="https://meet.google.com/..."
                            value={interviewForm.meetLink}
                            onChange={(e) => setInterviewForm({...interviewForm, meetLink: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                        </div>
                        <button
                          onClick={() => handleScheduleInterview(selectedApplicant._id)}
                          className="w-full btn-primary py-2 text-sm"
                        >
                          Confirm Interview
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== CREATE JOB MODAL ==================== */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowCreateModal(false)}
            ></div>
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Post New Job</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="h-8 w-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreateJob} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                  <input
                    type="text"
                    required
                    value={jobForm.title}
                    onChange={(e) => setJobForm({...jobForm, title: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., Software Engineer Intern"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    required
                    rows={4}
                    value={jobForm.description}
                    onChange={(e) => setJobForm({...jobForm, description: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Job responsibilities, requirements..."
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Package (LPA)</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={jobForm.package}
                      onChange={(e) => setJobForm({...jobForm, package: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g., 12"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      required
                      value={jobForm.location}
                      onChange={(e) => setJobForm({...jobForm, location: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g., Bangalore"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                      value={jobForm.type}
                      onChange={(e) => setJobForm({...jobForm, type: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="full-time">Full-time</option>
                      <option value="internship">Internship</option>
                      <option value="contract">Contract</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Min CGPA</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={jobForm.minCgpa}
                      onChange={(e) => setJobForm({...jobForm, minCgpa: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Backlogs</label>
                    <input
                      type="number"
                      min="0"
                      value={jobForm.maxBacklogs}
                      onChange={(e) => setJobForm({...jobForm, maxBacklogs: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Required Skills (comma separated)</label>
                  <input
                    type="text"
                    value={jobForm.requiredSkills}
                    onChange={(e) => setJobForm({...jobForm, requiredSkills: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="React, Node.js, MongoDB"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Eligible Branches (comma separated)</label>
                  <input
                    type="text"
                    value={jobForm.branches}
                    onChange={(e) => setJobForm({...jobForm, branches: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="CSE, IT, ECE"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Application Deadline</label>
                  <input
                    type="date"
                    required
                    value={jobForm.deadline}
                    onChange={(e) => setJobForm({...jobForm, deadline: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div className="flex gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 btn-primary py-3"
                  >
                    Post Job
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

export default CompanyDashboard;