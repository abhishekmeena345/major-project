

// import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { studentAPI, jobAPI } from '../services/apiService';
// import { 
//   Briefcase, 
//   FileText, 
//   TrendingUp, 
//   MessageSquare, 
//   Bell, 
//   User, 
//   Upload,
//   Sparkles,
//   ChevronRight,
//   AlertCircle,
//   CheckCircle2,
//   Clock,
//   Loader2,
//   MapPin,
//   Building2
// } from 'lucide-react';

// const StudentDashboard = () => {
//   const [stats, setStats] = useState({
//     totalApplied: 0,
//     shortlisted: 0,
//     interviews: 0,
//     placed: 0,
//   });
//   const [recommendedJobs, setRecommendedJobs] = useState([]);
//   const [applications, setApplications] = useState([]);
//   const [placementProbability, setPlacementProbability] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [applyingJob, setApplyingJob] = useState(null);

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);
      
//       const [applicationsRes, jobsRes, probabilityRes] = await Promise.all([
//         studentAPI.getApplications(),
//         studentAPI.getRecommendedJobs(),
//         studentAPI.getPlacementProbability()
//       ]);

//       const apps = applicationsRes.data.data || [];
//       setApplications(apps);
      
//       setStats({
//         totalApplied: apps.length,
//         shortlisted: apps.filter(a => a.status === 'shortlisted').length,
//         interviews: apps.filter(a => a.status === 'interview').length,
//         placed: apps.filter(a => a.status === 'placed').length,
//       });

//       setRecommendedJobs(jobsRes.data.data || []);
//       setPlacementProbability(probabilityRes.data.data);
      
//       setError('');
//     } catch (err) {
//       console.error('Failed to fetch dashboard data:', err);
//       setError(err.response?.data?.message || 'Failed to load dashboard data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleApply = async (jobId) => {
//     setApplyingJob(jobId);
//     try {
//       await studentAPI.applyForJob(jobId);
//       const appsRes = await studentAPI.getApplications();
//       const apps = appsRes.data.data || [];
//       setApplications(apps);
//       setStats({
//         totalApplied: apps.length,
//         shortlisted: apps.filter(a => a.status === 'shortlisted').length,
//         interviews: apps.filter(a => a.status === 'interview').length,
//         placed: apps.filter(a => a.status === 'placed').length,
//       });
//       const jobsRes = await studentAPI.getRecommendedJobs();
//       setRecommendedJobs(jobsRes.data.data || []);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to apply for job');
//     } finally {
//       setApplyingJob(null);
//     }
//   };

//   const getStatusColor = (status) => {
//     const colors = {
//       applied: 'bg-yellow-100 text-yellow-700',
//       shortlisted: 'bg-blue-100 text-blue-700',
//       interview: 'bg-purple-100 text-purple-700',
//       placed: 'bg-green-100 text-green-700',
//       rejected: 'bg-red-100 text-red-700',
//     };
//     return colors[status] || 'bg-gray-100 text-gray-700';
//   };

//   const getStatusIcon = (status) => {
//     const icons = {
//       applied: Clock,
//       shortlisted: CheckCircle2,
//       interview: MessageSquare,
//       placed: CheckCircle2,
//       rejected: AlertCircle,
//     };
//     return icons[status] || Clock;
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
//           <p className="text-gray-600 mt-1">Welcome back! Here's your placement overview.</p>
//         </div>

//         {/* Error */}
//         {error && (
//           <div className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-4">
//             <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
//             <p className="text-sm text-red-700">{error}</p>
//           </div>
//         )}

//         {/* Stats Cards */}
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//           <div className="card">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600">Total Applied</p>
//                 <p className="text-2xl font-bold text-gray-900">{stats.totalApplied}</p>
//               </div>
//               <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
//                 <Briefcase className="h-5 w-5 text-blue-600" />
//               </div>
//             </div>
//           </div>
          
//           <div className="card">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600">Shortlisted</p>
//                 <p className="text-2xl font-bold text-gray-900">{stats.shortlisted}</p>
//               </div>
//               <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
//                 <CheckCircle2 className="h-5 w-5 text-green-600" />
//               </div>
//             </div>
//           </div>
          
//           <div className="card">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600">Interviews</p>
//                 <p className="text-2xl font-bold text-gray-900">{stats.interviews}</p>
//               </div>
//               <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
//                 <MessageSquare className="h-5 w-5 text-purple-600" />
//               </div>
//             </div>
//           </div>
          
//           <div className="card">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600">Placed</p>
//                 <p className="text-2xl font-bold text-gray-900">{stats.placed}</p>
//               </div>
//               <div className="h-10 w-10 bg-yellow-100 rounded-lg flex items-center justify-center">
//                 <TrendingUp className="h-5 w-5 text-yellow-600" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Main Content Grid */}
//         <div className="grid lg:grid-cols-3 gap-8">
//           {/* Left Column - 2/3 width */}
//           <div className="lg:col-span-2 space-y-8">
//             {/* AI Recommended Jobs */}
//             <div className="card">
//               <div className="flex items-center justify-between mb-6">
//                 <div className="flex items-center gap-2">
//                   <Sparkles className="h-5 w-5 text-primary-600" />
//                   <h2 className="text-xl font-semibold text-gray-900">AI Recommended Jobs</h2>
//                 </div>
//                 <Link to="/jobs" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
//                   View All <ChevronRight className="h-4 w-4" />
//                 </Link>
//               </div>
              
//               <div className="space-y-4">
//                 {recommendedJobs.length === 0 ? (
//                   <div className="text-center py-8 text-gray-500">
//                     <Briefcase className="h-12 w-12 mx-auto mb-3 text-gray-300" />
//                     <p>No recommended jobs found</p>
//                   </div>
//                 ) : (
//                   recommendedJobs.map((job) => (
//                     <div key={job._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
//                       <div className="flex items-start justify-between">
//                         <div className="flex-1">
//                           <div className="flex items-center gap-2 mb-1">
//                             <h3 className="font-semibold text-gray-900">{job.title}</h3>
//                             {job.hasApplied && (
//                               <span className="inline-flex px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
//                                 Applied
//                               </span>
//                             )}
//                           </div>
//                           <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
//                             <Building2 className="h-4 w-4" />
//                             <span>{job.companyId?.name || 'Unknown Company'}</span>
//                             <span className="mx-1">•</span>
//                             <MapPin className="h-4 w-4" />
//                             <span>{job.location}</span>
//                           </div>
//                           <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
//                             <span>₹{job.package} LPA</span>
//                             <span className="capitalize">{job.type}</span>
//                             <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
//                           </div>
//                           <div className="flex flex-wrap gap-2 mt-2">
//                             {job.eligibility?.requiredSkills?.map((skill, idx) => (
//                               <span key={idx} className="inline-flex px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
//                                 {skill}
//                               </span>
//                             ))}
//                           </div>
//                         </div>
//                         <div className="text-right ml-4">
//                           <div className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm font-medium">
//                             <Sparkles className="h-3 w-3" />
//                             {job.matchPercentage}% Match
//                           </div>
//                         </div>
//                       </div>
//                       <div className="mt-4 flex gap-3">
//                         {job.hasApplied ? (
//                           <button disabled className="btn-secondary text-sm py-2 px-4 opacity-50 cursor-not-allowed">
//                             Already Applied
//                           </button>
//                         ) : (
//                           <button 
//                             onClick={() => handleApply(job._id)}
//                             disabled={applyingJob === job._id}
//                             className="btn-primary text-sm py-2 px-4 flex items-center gap-2"
//                           >
//                             {applyingJob === job._id ? (
//                               <Loader2 className="h-4 w-4 animate-spin" />
//                             ) : (
//                               <Briefcase className="h-4 w-4" />
//                             )}
//                             {applyingJob === job._id ? 'Applying...' : 'Apply Now'}
//                           </button>
//                         )}
//                         <Link 
//                           to={`/jobs/${job._id?.toString()}`} 
//                           className="btn-secondary text-sm py-2 px-4 inline-flex items-center"
//                         >
//                           View Details
//                         </Link>
//                       </div>
//                     </div>
//                   ))
//                 )}
//               </div>
//             </div>

//             {/* Recent Applications */}
//             <div className="card">
//               <div className="flex items-center justify-between mb-6">
//                 <h2 className="text-xl font-semibold text-gray-900">Recent Applications</h2>
//                 <Link to="/applications" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
//                   View All <ChevronRight className="h-4 w-4" />
//                 </Link>
//               </div>
              
//               <div className="space-y-3">
//                 {applications.length === 0 ? (
//                   <div className="text-center py-8 text-gray-500">
//                     <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
//                     <p>No applications yet. Start applying!</p>
//                   </div>
//                 ) : (
//                   applications.map((app) => {
//                     const StatusIcon = getStatusIcon(app.status);
//                     return (
//                       <div key={app._id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
//                         <div className="flex items-center gap-4">
//                           <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${getStatusColor(app.status)}`}>
//                             <StatusIcon className="h-5 w-5" />
//                           </div>
//                           <div>
//                             <h3 className="font-medium text-gray-900">{app.jobId?.title || 'Unknown Job'}</h3>
//                             <p className="text-sm text-gray-600">{app.jobId?.companyId?.name || 'Unknown Company'}</p>
//                           </div>
//                         </div>
//                         <div className="text-right">
//                           <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(app.status)}`}>
//                             {app.status}
//                           </span>
//                           <p className="text-xs text-gray-500 mt-1">
//                             Applied: {new Date(app.appliedAt).toLocaleDateString()}
//                           </p>
//                           {app.matchPercentage > 0 && (
//                             <p className="text-xs text-primary-600 mt-1 font-medium">
//                               {app.matchPercentage}% Match
//                             </p>
//                           )}
//                         </div>
//                       </div>
//                     );
//                   })
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Right Column - 1/3 width */}
//           <div className="space-y-6">
//             {/* Profile Card */}
//             <div className="card">
//               <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
//               <div className="space-y-3">
//                 <Link to="/profile" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
//                   <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
//                     <User className="h-5 w-5 text-blue-600" />
//                   </div>
//                   <div>
//                     <p className="font-medium text-gray-900">Edit Profile</p>
//                     <p className="text-sm text-gray-500">Update your details</p>
//                   </div>
//                 </Link>
                
//                 <Link to="/resume" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
//                   <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
//                     <Upload className="h-5 w-5 text-purple-600" />
//                   </div>
//                   <div>
//                     <p className="font-medium text-gray-900">Upload Resume</p>
//                     <p className="text-sm text-gray-500">AI-powered parsing</p>
//                   </div>
//                 </Link>
                
//                 <Link to="/mock-interview" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
//                   <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
//                     <MessageSquare className="h-5 w-5 text-green-600" />
//                   </div>
//                   <div>
//                     <p className="font-medium text-gray-900">AI Mock Interview</p>
//                     <p className="text-sm text-gray-500">Practice with AI</p>
//                   </div>
//                 </Link>
                
//                 <Link to="/notifications" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
//                   <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center">
//                     <Bell className="h-5 w-5 text-orange-600" />
//                   </div>
//                   <div>
//                     <p className="font-medium text-gray-900">Notifications</p>
//                     <p className="text-sm text-gray-500">Check updates</p>
//                   </div>
//                 </Link>
//               </div>
//             </div>

//             {/* Placement Probability */}
//             {placementProbability && (
//               <div className="card bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200">
//                 <h3 className="font-semibold text-gray-900 mb-2">Placement Probability</h3>
//                 <div className="flex items-center gap-4">
//                   <div className="relative h-20 w-20">
//                     <svg className="h-20 w-20 transform -rotate-90">
//                       <circle
//                         cx="40"
//                         cy="40"
//                         r="36"
//                         stroke="currentColor"
//                         strokeWidth="8"
//                         fill="transparent"
//                         className="text-primary-200"
//                       />
//                       <circle
//                         cx="40"
//                         cy="40"
//                         r="36"
//                         stroke="currentColor"
//                         strokeWidth="8"
//                         fill="transparent"
//                         strokeDasharray={`${2 * Math.PI * 36}`}
//                         strokeDashoffset={`${2 * Math.PI * 36 * (1 - placementProbability.probability / 100)}`}
//                         className="text-primary-600"
//                       />
//                     </svg>
//                     <div className="absolute inset-0 flex items-center justify-center">
//                       <span className="text-lg font-bold text-primary-700">{placementProbability.probability}%</span>
//                     </div>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-600">Based on your profile</p>
//                     <p className="text-sm text-primary-600 font-medium mt-1">
//                       Score: {placementProbability.score}/{placementProbability.maxScore}
//                     </p>
//                   </div>
//                 </div>
//                 {placementProbability.suggestions?.length > 0 && (
//                   <div className="mt-4 space-y-2">
//                     <p className="text-sm font-medium text-gray-700">Improvements:</p>
//                     {placementProbability.suggestions.map((suggestion, idx) => (
//                       <div key={idx} className="flex items-start gap-2 text-sm text-gray-600">
//                         <TrendingUp className="h-4 w-4 text-primary-500 mt-0.5 flex-shrink-0" />
//                         <span>{suggestion}</span>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Skill Gap Analysis */}
//             <div className="card">
//               <h3 className="font-semibold text-gray-900 mb-4">Skill Gap Analysis</h3>
//               <div className="space-y-3">
//                 <div>
//                   <div className="flex justify-between text-sm mb-1">
//                     <span className="text-gray-600">JavaScript</span>
//                     <span className="text-green-600 font-medium">Strong</span>
//                   </div>
//                   <div className="h-2 bg-gray-200 rounded-full">
//                     <div className="h-2 bg-green-500 rounded-full" style={{ width: '90%' }}></div>
//                   </div>
//                 </div>
//                 <div>
//                   <div className="flex justify-between text-sm mb-1">
//                     <span className="text-gray-600">React.js</span>
//                     <span className="text-yellow-600 font-medium">Moderate</span>
//                   </div>
//                   <div className="h-2 bg-gray-200 rounded-full">
//                     <div className="h-2 bg-yellow-500 rounded-full" style={{ width: '65%' }}></div>
//                   </div>
//                 </div>
//                 <div>
//                   <div className="flex justify-between text-sm mb-1">
//                     <span className="text-gray-600">Docker</span>
//                     <span className="text-red-600 font-medium">Weak</span>
//                   </div>
//                   <div className="h-2 bg-gray-200 rounded-full">
//                     <div className="h-2 bg-red-500 rounded-full" style={{ width: '20%' }}></div>
//                   </div>
//                 </div>
//               </div>
//               <Link to="/skills" className="mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
//                 Improve Skills <ChevronRight className="h-4 w-4" />
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StudentDashboard;
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { studentAPI } from '../services/apiService';
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
  Clock,
  Loader2,
  MapPin,
  Building2,
  AlertTriangle,
  Pencil,
  GraduationCap,
  Send,
  UserCheck
} from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalApplied: 0,
    shortlisted: 0,
    interviews: 0,
    placed: 0,
  });
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [placementProbability, setPlacementProbability] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applyingJob, setApplyingJob] = useState(null);

  // ==================== Alumni & Referral State ====================
  const [alumniList, setAlumniList] = useState([]);
  const [showAlumniModal, setShowAlumniModal] = useState(false);
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [referralMessage, setReferralMessage] = useState('');
  const [sendingReferral, setSendingReferral] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    fetchAlumni();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const [applicationsRes, jobsRes, probabilityRes, profileRes] = await Promise.all([
        studentAPI.getApplications(),
        studentAPI.getRecommendedJobs(),
        studentAPI.getPlacementProbability(),
        studentAPI.getProfile().catch(() => ({ data: { data: null } }))
      ]);

      const apps = applicationsRes.data.data || [];
      setApplications(apps);
      
      setStats({
        totalApplied: apps.length,
        shortlisted: apps.filter(a => a.status === 'shortlisted').length,
        interviews: apps.filter(a => a.status === 'interview').length,
        placed: apps.filter(a => a.status === 'placed').length,
      });

      setRecommendedJobs(jobsRes.data.data || []);
      setPlacementProbability(probabilityRes.data.data);
      setProfile(profileRes.data.data);
      
      setError('');
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchAlumni = async () => {
    try {
      const res = await studentAPI.getAlumniList();
      setAlumniList(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch alumni:', err);
    }
  };

  const handleRequestReferral = async () => {
    if (!referralMessage.trim()) return;
    setSendingReferral(true);
    try {
      await studentAPI.requestReferral(selectedAlumni.userId._id, { message: referralMessage });
      setReferralMessage('');
      setSelectedAlumni(null);
      setShowAlumniModal(false);
      alert('Referral request sent!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send request');
    } finally {
      setSendingReferral(false);
    }
  };

  const handleApply = async (jobId) => {
    if (!profile?.profileCompleted) {
      setError('Please complete your profile before applying. Go to Edit Profile.');
      return;
    }

    setApplyingJob(jobId);
    try {
      await studentAPI.applyForJob(jobId);
      const appsRes = await studentAPI.getApplications();
      const apps = appsRes.data.data || [];
      setApplications(apps);
      setStats({
        totalApplied: apps.length,
        shortlisted: apps.filter(a => a.status === 'shortlisted').length,
        interviews: apps.filter(a => a.status === 'interview').length,
        placed: apps.filter(a => a.status === 'placed').length,
      });
      const jobsRes = await studentAPI.getRecommendedJobs();
      setRecommendedJobs(jobsRes.data.data || []);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to apply for job');
    } finally {
      setApplyingJob(null);
    }
  };

  const isProfileComplete = profile?.profileCompleted === true;

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

        {/* Complete Profile Banner */}
        {!isProfileComplete && (
          <div className="mb-6 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-5">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Complete Your Profile</h3>
                <p className="text-gray-600 mb-3">
                  Your profile is incomplete. Add your academic details (10th/12th %, CGPA, Branch, etc.) to apply for jobs and get AI recommendations.
                </p>
                <Link 
                  to="/profile" 
                  className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
                >
                  <User className="h-4 w-4" />
                  Complete Profile Now
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
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
          {/* Left Column - 2/3 width */}
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
                {recommendedJobs.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Briefcase className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>No recommended jobs found</p>
                  </div>
                ) : (
                  recommendedJobs.map((job) => (
                    <div key={job._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{job.title}</h3>
                            {job.hasApplied && (
                              <span className="inline-flex px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                Applied
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                            <Building2 className="h-4 w-4" />
                            <span>{job.companyId?.name || 'Unknown Company'}</span>
                            <span className="mx-1">•</span>
                            <MapPin className="h-4 w-4" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                            <span>₹{job.package} LPA</span>
                            <span className="capitalize">{job.type}</span>
                            <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {job.eligibility?.requiredSkills?.map((skill, idx) => (
                              <span key={idx} className="inline-flex px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm font-medium">
                            <Sparkles className="h-3 w-3" />
                            {job.matchPercentage}% Match
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex gap-3">
                        {job.hasApplied ? (
                          <button disabled className="btn-secondary text-sm py-2 px-4 opacity-50 cursor-not-allowed">
                            Already Applied
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleApply(job._id)}
                            disabled={applyingJob === job._id}
                            className="btn-primary text-sm py-2 px-4 flex items-center gap-2 disabled:opacity-50"
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
                          to={`/jobs/${job._id?.toString()}`} 
                          className="btn-secondary text-sm py-2 px-4 inline-flex items-center"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))
                )}
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
                {applications.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>No applications yet. Start applying!</p>
                  </div>
                ) : (
                  applications.map((app) => {
                    const StatusIcon = getStatusIcon(app.status);
                    return (
                      <div key={app._id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${getStatusColor(app.status)}`}>
                            <StatusIcon className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{app.jobId?.title || 'Unknown Job'}</h3>
                            <p className="text-sm text-gray-600">{app.jobId?.companyId?.name || 'Unknown Company'}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(app.status)}`}>
                            {app.status}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            Applied: {new Date(app.appliedAt).toLocaleDateString()}
                          </p>
                          {app.matchPercentage > 0 && (
                            <p className="text-xs text-primary-600 mt-1 font-medium">
                              {app.matchPercentage}% Match
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link to="/profile" className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  !isProfileComplete ? 'bg-orange-50 hover:bg-orange-100' : 'hover:bg-gray-50'
                }`}>
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                    !isProfileComplete ? 'bg-orange-200' : 'bg-blue-100'
                  }`}>
                    {!isProfileComplete ? (
                      <User className="h-5 w-5 text-orange-600" />
                    ) : (
                      <Pencil className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {!isProfileComplete ? 'Complete Profile' : 'Edit Profile'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {!isProfileComplete ? 'Required to apply' : 'Update your details'}
                    </p>
                  </div>
                  {!isProfileComplete && (
                    <span className="ml-auto text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full">!</span>
                  )}
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

                {/* ==================== NEW: Ask AI ==================== */}
                <Link to="/ai-chat" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Ask AI</p>
                    <p className="text-sm text-gray-500">Get instant answers</p>
                  </div>
                </Link>
                
                <Link to="/notifications" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Bell className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Notifications</p>
                    <p className="text-sm text-gray-500">Check updates</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Placement Probability */}
            {placementProbability && (
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
                        strokeDashoffset={`${2 * Math.PI * 36 * (1 - placementProbability.probability / 100)}`}
                        className="text-primary-600"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold text-primary-700">{placementProbability.probability}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Based on your profile</p>
                    <p className="text-sm text-primary-600 font-medium mt-1">
                      Score: {placementProbability.score}/{placementProbability.maxScore}
                    </p>
                  </div>
                </div>
                {placementProbability.suggestions?.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium text-gray-700">Improvements:</p>
                    {placementProbability.suggestions.map((suggestion, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                        <TrendingUp className="h-4 w-4 text-primary-500 mt-0.5 flex-shrink-0" />
                        <span>{suggestion}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Skill Gap Analysis */}
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

            {/* ==================== Connect with Alumni ==================== */}
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary-600" />
                Connect with Alumni
              </h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {alumniList.length === 0 ? (
                  <p className="text-sm text-gray-500">No alumni available</p>
                ) : (
                  alumniList.map((alumni) => (
                    <div key={alumni._id} className="p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                      <p className="font-medium text-gray-900">{alumni.name || 'Alumni'}</p>
                      <p className="text-xs text-gray-500">{alumni.company} • {alumni.role}</p>
                      <p className="text-xs text-gray-400">Batch: {alumni.batch} | {alumni.branch}</p>
                      <button
                        onClick={() => { setSelectedAlumni(alumni); setShowAlumniModal(true); }}
                        className="mt-2 text-xs bg-primary-600 text-white px-3 py-1.5 rounded-lg hover:bg-primary-700"
                      >
                        Request Referral
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ==================== Referral Request Modal ==================== */}
        {showAlumniModal && selectedAlumni && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold mb-2">Request Referral</h3>
              <p className="text-sm text-gray-600 mb-4">
                To: <strong>{selectedAlumni.name}</strong> at {selectedAlumni.company}
              </p>
              <textarea
                value={referralMessage}
                onChange={(e) => setReferralMessage(e.target.value)}
                placeholder="Write your message..."
                rows={4}
                className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              />
              <div className="flex gap-3">
                <button
                  onClick={handleRequestReferral}
                  disabled={sendingReferral}
                  className="flex-1 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50"
                >
                  {sendingReferral ? 'Sending...' : 'Send Request'}
                </button>
                <button
                  onClick={() => setShowAlumniModal(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;