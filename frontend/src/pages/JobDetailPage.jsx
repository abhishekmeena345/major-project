import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { jobAPI, studentAPI } from '../services/apiService';
import {
  Briefcase,
  Building2,
  MapPin,
  DollarSign,
  Clock,
  GraduationCap,
  Code,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronLeft,
  Calendar,
  Sparkles,
  BookmarkCheck,
  Share2,
  ExternalLink
} from 'lucide-react';

const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [myApplications, setMyApplications] = useState([]);

  useEffect(() => {
    fetchJobDetail();
    if (isAuthenticated && user?.role === 'student') {
      fetchMyApplications();
    }
  }, [id, isAuthenticated, user]);

  const fetchJobDetail = async () => {
    try {
      setLoading(true);
      const res = await jobAPI.getJobById(id);
      setJob(res.data.data);
      setError('');
    } catch (err) {
      console.error('Failed to fetch job:', err);
      setError(err.response?.data?.message || 'Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyApplications = async () => {
    try {
      const res = await studentAPI.getApplications();
      const apps = res.data.data || [];
      setMyApplications(apps);
      setApplied(apps.some(app => app.jobId?._id === id || app.jobId === id));
    } catch (err) {
      console.error('Failed to fetch applications:', err);
    }
  };

  const handleApply = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (user?.role !== 'student') {
      setError('Only students can apply for jobs');
      return;
    }

    setApplying(true);
    try {
      await studentAPI.applyForJob(id);
      setApplied(true);
      setError('');
      alert('Application submitted successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to apply for job');
    } finally {
      setApplying(false);
    }
  };

  const getDaysLeft = (deadline) => {
    const days = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
    return days > 0 ? `${days} days left` : 'Deadline passed';
  };

  const getMatchPercentage = () => {
    if (!user || user.role !== 'student') return null;
    // Placeholder - ideally comes from backend
    return Math.floor(Math.random() * 25) + 75;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-12 w-12 animate-spin text-primary-600" />
      </div>
    );
  }

  if (error && !job) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4">
          <div className="card text-center py-12">
            <AlertCircle className="h-16 w-16 mx-auto mb-4 text-red-400" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Job Not Found</h2>
            <p className="text-gray-500 mb-6">{error}</p>
            <Link to="/jobs" className="btn-primary inline-flex items-center gap-2">
              <ChevronLeft className="h-4 w-4" />
              Back to Jobs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!job) return null;

  const matchPercentage = getMatchPercentage();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link to="/jobs" className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-primary-600 mb-6 transition-colors">
          <ChevronLeft className="h-4 w-4" />
          Back to Job Board
        </Link>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-4">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Main Card */}
        <div className="card mb-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
            <div className="flex items-start gap-4">
              <div className="h-16 w-16 bg-primary-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Building2 className="h-8 w-8 text-primary-600" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                  {matchPercentage && (
                    <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium">
                      <Sparkles className="h-3 w-3" />
                      {matchPercentage}% Match
                    </span>
                  )}
                </div>
                <p className="text-lg text-gray-600 font-medium">{job.companyId?.name || 'Unknown Company'}</p>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    ₹{job.package} LPA
                  </span>
                  <span className="capitalize flex items-center gap-1">
                    <Briefcase className="h-4 w-4" />
                    {job.type}
                  </span>
                </div>
              </div>
            </div>

            {/* Apply Button */}
            <div className="flex flex-col gap-3 md:text-right">
              {applied ? (
                <button disabled className="btn-secondary opacity-60 cursor-not-allowed flex items-center justify-center gap-2">
                  <BookmarkCheck className="h-4 w-4" />
                  Already Applied
                </button>
              ) : (
                <button
                  onClick={handleApply}
                  disabled={applying}
                  className="btn-primary flex items-center justify-center gap-2"
                >
                  {applying ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Briefcase className="h-4 w-4" />
                  )}
                  {applying ? 'Applying...' : 'Apply Now'}
                </button>
              )}
              
              <div className="flex items-center gap-2 text-sm text-gray-500 justify-end">
                <Clock className="h-4 w-4" />
                <span className={new Date(job.deadline) < new Date() ? 'text-red-500' : ''}>
                  {getDaysLeft(job.deadline)}
                </span>
                <span>•</span>
                <span>{new Date(job.deadline).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">About the Role</h3>
            <p className="text-gray-600 whitespace-pre-line leading-relaxed">
              {job.description}
            </p>
          </div>

          {/* Eligibility */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-primary-600" />
                Eligibility Criteria
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Minimum CGPA</span>
                  <span className="font-semibold text-gray-900">{job.eligibility?.minCgpa || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Maximum Backlogs</span>
                  <span className="font-semibold text-gray-900">{job.eligibility?.maxBacklogs ?? 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Job Type</span>
                  <span className="font-semibold text-gray-900 capitalize">{job.type}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Package</span>
                  <span className="font-semibold text-green-600">₹{job.package} LPA</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Code className="h-4 w-4 text-primary-600" />
                Required Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {job.eligibility?.requiredSkills?.length > 0 ? (
                  job.eligibility.requiredSkills.map((skill, idx) => (
                    <span key={idx} className="inline-flex px-3 py-1 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium">
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No specific skills mentioned</p>
                )}
              </div>

              <h3 className="text-sm font-semibold text-gray-900 mt-6 mb-3 flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-primary-600" />
                Eligible Branches
              </h3>
              <div className="flex flex-wrap gap-2">
                {job.eligibility?.branches?.length > 0 ? (
                  job.eligibility.branches.map((branch, idx) => (
                    <span key={idx} className="inline-flex px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                      {branch}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">All branches eligible</p>
                )}
              </div>
            </div>
          </div>

          {/* Company Info */}
          {job.companyId?.description && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">About the Company</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {job.companyId.description}
              </p>
              {job.companyId?.website && (
                <a
                  href={job.companyId.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 mt-3 font-medium"
                >
                  <ExternalLink className="h-4 w-4" />
                  Visit Website
                </a>
              )}
            </div>
          )}
        </div>

        {/* Application Tips */}
        <div className="card bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary-600" />
            Tips to Stand Out
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              Tailor your resume to highlight relevant skills: {job.eligibility?.requiredSkills?.slice(0, 3).join(', ') || 'technical skills'}
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              Research {job.companyId?.name || 'the company'} thoroughly before the interview
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              Practice mock interviews for {job.title} role in the AI Mock Interview section
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              Prepare a portfolio or GitHub showcasing projects related to this role
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default JobDetailPage;