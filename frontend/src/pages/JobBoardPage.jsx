import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { jobAPI, studentAPI } from '../services/apiService';
import { 
  Briefcase, 
  Search, 
  Filter,
  MapPin,
  DollarSign,
  Clock,
  Building2,
  Sparkles,
  ChevronRight,
  AlertCircle,
  Loader2,
  GraduationCap,
  Bookmark,
  BookmarkCheck,
  X
} from 'lucide-react';

const JobBoardPage = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applyingJob, setApplyingJob] = useState(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    branch: '',
    minPackage: '',
    maxBacklogs: '',
    skills: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  
  // My applications (for students)
  const [myApplications, setMyApplications] = useState([]);

  useEffect(() => {
    fetchJobs();
    if (isAuthenticated && user?.role === 'student') {
      fetchMyApplications();
    }
  }, [isAuthenticated, user]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.type) params.type = filters.type;
      if (filters.branch) params.branch = filters.branch;
      if (searchTerm) params.search = searchTerm;
      
      const res = await jobAPI.getAllJobs(params);
      const allJobs = res.data.data || [];
      setJobs(allJobs);
      applyClientFilters(allJobs);
      setError('');
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
      setError(err.response?.data?.message || 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyApplications = async () => {
    try {
      const res = await studentAPI.getApplications();
      setMyApplications(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch applications:', err);
    }
  };

  const applyClientFilters = (jobList) => {
    let result = [...jobList];
    
    // Filter by minimum package
    if (filters.minPackage) {
      result = result.filter(job => job.package >= parseFloat(filters.minPackage));
    }
    
    // Filter by skills
    if (filters.skills) {
      const searchSkills = filters.skills.toLowerCase().split(',').map(s => s.trim());
      result = result.filter(job => {
        const jobSkills = job.eligibility?.requiredSkills || [];
        return searchSkills.some(skill => 
          jobSkills.some(js => js.toLowerCase().includes(skill))
        );
      });
    }
    
    setFilteredJobs(result);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleApplyFilter = () => {
    applyClientFilters(jobs);
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    setFilters({
      type: '',
      branch: '',
      minPackage: '',
      maxBacklogs: '',
      skills: ''
    });
    setFilteredJobs(jobs);
  };

  const hasApplied = (jobId) => {
    return myApplications.some(app => app.jobId?._id === jobId || app.jobId === jobId);
  };

  const handleApply = async (jobId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (user?.role !== 'student') {
      setError('Only students can apply for jobs');
      return;
    }

    setApplyingJob(jobId);
    try {
      await studentAPI.applyForJob(jobId);
      await fetchMyApplications();
      setError('');
      alert('Application submitted successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to apply for job');
    } finally {
      setApplyingJob(null);
    }
  };

  const getMatchPercentage = (job) => {
    // Simple match calculation for display
    if (!user || user.role !== 'student') return null;
    // This would ideally come from backend
    return Math.floor(Math.random() * 30) + 70; // Placeholder
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Job Board</h1>
          <p className="text-gray-600 mt-1">Find your dream job from top companies</p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-4">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Search & Filter Bar */}
        <div className="card mb-6">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search jobs by title, company, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <button
              type="submit"
              className="btn-primary flex items-center justify-center gap-2"
            >
              <Search className="h-4 w-4" />
              Search
            </button>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary flex items-center justify-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
            </button>
          </form>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                  <select
                    value={filters.type}
                    onChange={(e) => setFilters({...filters, type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">All Types</option>
                    <option value="full-time">Full-time</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                  <select
                    value={filters.branch}
                    onChange={(e) => setFilters({...filters, branch: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">All Branches</option>
                    <option value="CSE">CSE</option>
                    <option value="IT">IT</option>
                    <option value="ECE">ECE</option>
                    <option value="EEE">EEE</option>
                    <option value="MECH">MECH</option>
                    <option value="CIVIL">CIVIL</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Package (LPA)</label>
                  <input
                    type="number"
                    value={filters.minPackage}
                    onChange={(e) => setFilters({...filters, minPackage: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., 5"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
                  <input
                    type="text"
                    value={filters.skills}
                    onChange={(e) => setFilters({...filters, skills: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., React, Python"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleApplyFilter}
                  className="btn-primary text-sm py-2 px-4"
                >
                  Apply Filters
                </button>
                <button
                  onClick={handleClearFilters}
                  className="btn-secondary text-sm py-2 px-4"
                >
                  Clear All
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredJobs.length}</span> jobs
          </p>
          {isAuthenticated && user?.role === 'student' && (
            <Link to="/student/dashboard" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              View My Applications →
            </Link>
          )}
        </div>

        {/* Jobs Grid */}
        <div className="grid gap-4">
          {filteredJobs.length === 0 ? (
            <div className="card text-center py-12">
              <Briefcase className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No jobs found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          ) : (
            filteredJobs.map((job) => {
              const matchPercentage = getMatchPercentage(job);
              const alreadyApplied = hasApplied(job._id);
              
              return (
                <div key={job._id} className="card hover:shadow-lg transition-shadow">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    {/* Left: Job Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        {/* Company Logo Placeholder */}
                        <div className="h-14 w-14 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Building2 className="h-7 w-7 text-primary-600" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-3 mb-1">
                            <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                            {matchPercentage && (
                              <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium">
                                <Sparkles className="h-3 w-3" />
                                {matchPercentage}% Match
                              </span>
                            )}
                            {alreadyApplied && (
                              <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">
                                <BookmarkCheck className="h-3 w-3" />
                                Applied
                              </span>
                            )}
                          </div>
                          
                          <p className="text-gray-600 font-medium">{job.companyId?.name || 'Unknown Company'}</p>
                          
                          <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              ₹{job.package} LPA
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {job.location}
                            </span>
                            <span className="capitalize">{job.type}</span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              Deadline: {new Date(job.deadline).toLocaleDateString()}
                            </span>
                          </div>
                          
                          {/* Skills */}
                          <div className="flex flex-wrap gap-2 mt-3">
                            {job.eligibility?.requiredSkills?.map((skill, idx) => (
                              <span key={idx} className="inline-flex px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium">
                                {skill}
                              </span>
                            ))}
                            {job.eligibility?.branches?.map((branch, idx) => (
                              <span key={`b-${idx}`} className="inline-flex px-2 py-1 bg-blue-50 text-blue-600 rounded-md text-xs font-medium">
                                <GraduationCap className="h-3 w-3 mr-1" />
                                {branch}
                              </span>
                            ))}
                          </div>
                          
                          {/* Eligibility Info */}
                          <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-500">
                            <span>Min CGPA: {job.eligibility?.minCgpa || 'N/A'}</span>
                            <span>Max Backlogs: {job.eligibility?.maxBacklogs || '0'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Right: Actions */}
                    <div className="flex flex-col gap-3 lg:items-end">
                      {alreadyApplied ? (
                        <button
                          disabled
                          className="btn-secondary text-sm py-2 px-4 opacity-50 cursor-not-allowed flex items-center gap-2"
                        >
                          <BookmarkCheck className="h-4 w-4" />
                          Applied
                        </button>
                      ) : (
                        <button
                          onClick={() => handleApply(job._id)}
                          disabled={applyingJob === job._id}
                          className="btn-primary text-sm py-2 px-4 flex items-center gap-2"
                        >
                          {applyingJob === job._id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Briefcase className="h-4 w-4" />
                          )}
                          {applyingJob === job._id ? 'Applying...' : 'Apply Now'}
                        </button>
                      )}
                      
                      <Link
                        to={`/jobs/${job._id}`}
                        className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                      >
                        View Details <ChevronRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default JobBoardPage;