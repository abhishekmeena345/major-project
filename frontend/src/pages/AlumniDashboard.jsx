// import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { 
//   Users, 
//   Briefcase, 
//   CheckCircle2, 
//   XCircle, 
//   MessageSquare, 
//   GraduationCap,
//   TrendingUp,
//   Clock,
//   Star,
//   ChevronRight,
//   Bell,
//   User
// } from 'lucide-react';

// const AlumniDashboard = () => {
//   const [stats, setStats] = useState({
//     totalReferrals: 15,
//     acceptedReferrals: 8,
//     pendingReferrals: 5,
//     mentorshipSessions: 12,
//     studentsHelped: 23,
//   });
  
//   const [referralRequests, setReferralRequests] = useState([
//     {
//       _id: '1',
//       studentName: 'Rahul Sharma',
//       studentEmail: 'rahul@student.edu',
//       branch: 'CSE',
//       year: 4,
//       cgpa: 8.7,
//       skills: ['React', 'Node.js', 'Python'],
//       message: 'I am very interested in working at Google. I have completed 3 projects in MERN stack and have a strong foundation in DSA. Would be grateful for your referral.',
//       status: 'pending',
//       requestedAt: '2026-07-15',
//       jobRole: 'Software Engineer',
//     },
//     {
//       _id: '2',
//       studentName: 'Priya Patel',
//       studentEmail: 'priya@student.edu',
//       branch: 'IT',
//       year: 4,
//       cgpa: 9.1,
//       skills: ['Java', 'Spring Boot', 'AWS'],
//       message: 'I have been following your work and would love to get a referral for the SDE role at Microsoft. I have 2 internships experience.',
//       status: 'accepted',
//       requestedAt: '2026-07-10',
//       jobRole: 'SDE',
//       respondedAt: '2026-07-12',
//     },
//     {
//       _id: '3',
//       studentName: 'Amit Kumar',
//       studentEmail: 'amit@student.edu',
//       branch: 'CSE',
//       year: 3,
//       cgpa: 7.8,
//       skills: ['JavaScript', 'HTML', 'CSS'],
//       message: 'Looking for internship opportunity at your company. I am eager to learn and contribute.',
//       status: 'declined',
//       requestedAt: '2026-07-08',
//       jobRole: 'Frontend Intern',
//       respondedAt: '2026-07-09',
//     },
//   ]);
  
//   const [mentorshipRequests, setMentorshipRequests] = useState([
//     {
//       _id: '1',
//       studentName: 'Sneha Gupta',
//       studentEmail: 'sneha@student.edu',
//       branch: 'ECE',
//       year: 3,
//       topic: 'Career Guidance in Tech',
//       message: 'I am confused between pursuing higher studies or joining a job. Would love to get your guidance.',
//       status: 'pending',
//       requestedAt: '2026-07-14',
//       preferredDate: '2026-07-20',
//     },
//     {
//       _id: '2',
//       studentName: 'Vikram Singh',
//       studentEmail: 'vikram@student.edu',
//       branch: 'CSE',
//       year: 4,
//       topic: 'Interview Preparation',
//       message: 'I have an interview with Amazon next week. Can you help me prepare for system design questions?',
//       status: 'accepted',
//       requestedAt: '2026-07-10',
//       preferredDate: '2026-07-18',
//       scheduledAt: '2026-07-18T14:00:00',
//     },
//   ]);
  
//   const [activeTab, setActiveTab] = useState('referrals');
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     setTimeout(() => setLoading(false), 1000);
//   }, []);

//   const handleReferralAction = (id, action) => {
//     setReferralRequests(prev => prev.map(req => 
//       req._id === id ? { ...req, status: action, respondedAt: new Date().toISOString().split('T')[0] } : req
//     ));
//   };

//   const handleMentorshipAction = (id, action) => {
//     setMentorshipRequests(prev => prev.map(req => 
//       req._id === id ? { ...req, status: action } : req
//     ));
//   };

//   const getStatusColor = (status) => {
//     const colors = {
//       pending: 'bg-yellow-100 text-yellow-700',
//       accepted: 'bg-green-100 text-green-700',
//       declined: 'bg-red-100 text-red-700',
//       completed: 'bg-blue-100 text-blue-700',
//     };
//     return colors[status] || 'bg-gray-100 text-gray-700';
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
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">Alumni Dashboard</h1>
//             <p className="text-gray-600 mt-1">Help students grow through referrals and mentorship</p>
//           </div>
//           <div className="flex gap-3">
//             <Link to="/profile" className="btn-secondary flex items-center gap-2">
//               <User className="h-4 w-4" />
//               Edit Profile
//             </Link>
//           </div>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
//           <div className="card">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600">Total Referrals</p>
//                 <p className="text-2xl font-bold text-gray-900">{stats.totalReferrals}</p>
//               </div>
//               <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
//                 <Users className="h-5 w-5 text-blue-600" />
//               </div>
//             </div>
//           </div>
          
//           <div className="card">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600">Accepted</p>
//                 <p className="text-2xl font-bold text-gray-900">{stats.acceptedReferrals}</p>
//               </div>
//               <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
//                 <CheckCircle2 className="h-5 w-5 text-green-600" />
//               </div>
//             </div>
//           </div>
          
//           <div className="card">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600">Pending</p>
//                 <p className="text-2xl font-bold text-gray-900">{stats.pendingReferrals}</p>
//               </div>
//               <div className="h-10 w-10 bg-yellow-100 rounded-lg flex items-center justify-center">
//                 <Clock className="h-5 w-5 text-yellow-600" />
//               </div>
//             </div>
//           </div>
          
//           <div className="card">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600">Mentorships</p>
//                 <p className="text-2xl font-bold text-gray-900">{stats.mentorshipSessions}</p>
//               </div>
//               <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
//                 <GraduationCap className="h-5 w-5 text-purple-600" />
//               </div>
//             </div>
//           </div>
          
//           <div className="card">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600">Students Helped</p>
//                 <p className="text-2xl font-bold text-gray-900">{stats.studentsHelped}</p>
//               </div>
//               <div className="h-10 w-10 bg-teal-100 rounded-lg flex items-center justify-center">
//                 <TrendingUp className="h-5 w-5 text-teal-600" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
//           <div className="flex border-b border-gray-200">
//             <button
//               onClick={() => setActiveTab('referrals')}
//               className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
//                 activeTab === 'referrals'
//                   ? 'border-primary-600 text-primary-600'
//                   : 'border-transparent text-gray-500 hover:text-gray-700'
//               }`}
//             >
//               <div className="flex items-center gap-2">
//                 <Briefcase className="h-4 w-4" />
//                 Referral Requests
//                 <span className="inline-flex items-center justify-center h-5 w-5 bg-primary-100 text-primary-600 rounded-full text-xs font-bold">
//                   {referralRequests.filter(r => r.status === 'pending').length}
//                 </span>
//               </div>
//             </button>
//             <button
//               onClick={() => setActiveTab('mentorship')}
//               className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
//                 activeTab === 'mentorship'
//                   ? 'border-primary-600 text-primary-600'
//                   : 'border-transparent text-gray-500 hover:text-gray-700'
//               }`}
//             >
//               <div className="flex items-center gap-2">
//                 <GraduationCap className="h-4 w-4" />
//                 Mentorship Requests
//                 <span className="inline-flex items-center justify-center h-5 w-5 bg-primary-100 text-primary-600 rounded-full text-xs font-bold">
//                   {mentorshipRequests.filter(r => r.status === 'pending').length}
//                 </span>
//               </div>
//             </button>
//           </div>

//           {/* Tab Content */}
//           <div className="p-6">
//             {activeTab === 'referrals' && (
//               <div className="space-y-4">
//                 {referralRequests.length === 0 ? (
//                   <div className="text-center py-12">
//                     <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-4" />
//                     <p className="text-gray-500">No referral requests yet</p>
//                   </div>
//                 ) : (
//                   referralRequests.map((request) => (
//                     <div key={request._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
//                       <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
//                         <div className="flex-1">
//                           <div className="flex items-center gap-3 mb-3">
//                             <div className="h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center">
//                               <User className="h-6 w-6 text-primary-600" />
//                             </div>
//                             <div>
//                               <h3 className="font-semibold text-gray-900">{request.studentName}</h3>
//                               <p className="text-sm text-gray-500">{request.studentEmail}</p>
//                             </div>
//                             <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(request.status)}`}>
//                               {request.status}
//                             </span>
//                           </div>
                          
//                           <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
//                             <span className="inline-flex items-center gap-1">
//                               <GraduationCap className="h-4 w-4" />
//                               {request.branch} • Year {request.year}
//                             </span>
//                             <span className="inline-flex items-center gap-1">
//                               <Star className="h-4 w-4" />
//                               CGPA: {request.cgpa}
//                             </span>
//                             <span className="inline-flex items-center gap-1">
//                               <Briefcase className="h-4 w-4" />
//                               Role: {request.jobRole}
//                             </span>
//                             <span className="inline-flex items-center gap-1">
//                               <Clock className="h-4 w-4" />
//                               Requested: {request.requestedAt}
//                             </span>
//                           </div>
                          
//                           <div className="flex flex-wrap gap-2 mb-3">
//                             {request.skills.map((skill, idx) => (
//                               <span key={idx} className="inline-flex px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">
//                                 {skill}
//                               </span>
//                             ))}
//                           </div>
                          
//                           <div className="bg-gray-50 rounded-lg p-3">
//                             <p className="text-sm text-gray-700 italic">"{request.message}"</p>
//                           </div>
                          
//                           {request.respondedAt && (
//                             <p className="text-xs text-gray-500 mt-2">
//                               Responded on: {request.respondedAt}
//                             </p>
//                           )}
//                         </div>
                        
//                         {request.status === 'pending' && (
//                           <div className="flex lg:flex-col gap-2">
//                             <button
//                               onClick={() => handleReferralAction(request._id, 'accepted')}
//                               className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
//                             >
//                               <CheckCircle2 className="h-4 w-4" />
//                               Accept
//                             </button>
//                             <button
//                               onClick={() => handleReferralAction(request._id, 'declined')}
//                               className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
//                             >
//                               <XCircle className="h-4 w-4" />
//                               Decline
//                             </button>
//                           </div>
//                         )}
                        
//                         {request.status === 'accepted' && (
//                           <div className="flex lg:flex-col gap-2">
//                             <button className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors">
//                               <MessageSquare className="h-4 w-4" />
//                               Chat
//                             </button>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   ))
//                 )}
//               </div>
//             )}

//             {activeTab === 'mentorship' && (
//               <div className="space-y-4">
//                 {mentorshipRequests.length === 0 ? (
//                   <div className="text-center py-12">
//                     <GraduationCap className="h-12 w-12 text-gray-300 mx-auto mb-4" />
//                     <p className="text-gray-500">No mentorship requests yet</p>
//                   </div>
//                 ) : (
//                   mentorshipRequests.map((request) => (
//                     <div key={request._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
//                       <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
//                         <div className="flex-1">
//                           <div className="flex items-center gap-3 mb-3">
//                             <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
//                               <User className="h-6 w-6 text-purple-600" />
//                             </div>
//                             <div>
//                               <h3 className="font-semibold text-gray-900">{request.studentName}</h3>
//                               <p className="text-sm text-gray-500">{request.studentEmail}</p>
//                             </div>
//                             <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(request.status)}`}>
//                               {request.status}
//                             </span>
//                           </div>
                          
//                           <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
//                             <span className="inline-flex items-center gap-1">
//                               <GraduationCap className="h-4 w-4" />
//                               {request.branch} • Year {request.year}
//                             </span>
//                             <span className="inline-flex items-center gap-1">
//                               <Briefcase className="h-4 w-4" />
//                               Topic: {request.topic}
//                             </span>
//                             <span className="inline-flex items-center gap-1">
//                               <Clock className="h-4 w-4" />
//                               Preferred: {request.preferredDate}
//                             </span>
//                           </div>
                          
//                           <div className="bg-gray-50 rounded-lg p-3">
//                             <p className="text-sm text-gray-700 italic">"{request.message}"</p>
//                           </div>
                          
//                           {request.scheduledAt && (
//                             <p className="text-xs text-green-600 mt-2 font-medium">
//                               Scheduled for: {new Date(request.scheduledAt).toLocaleString()}
//                             </p>
//                           )}
//                         </div>
                        
//                         {request.status === 'pending' && (
//                           <div className="flex lg:flex-col gap-2">
//                             <button
//                               onClick={() => handleMentorshipAction(request._id, 'accepted')}
//                               className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
//                             >
//                               <CheckCircle2 className="h-4 w-4" />
//                               Accept
//                             </button>
//                             <button
//                               onClick={() => handleMentorshipAction(request._id, 'declined')}
//                               className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
//                             >
//                               <XCircle className="h-4 w-4" />
//                               Decline
//                             </button>
//                           </div>
//                         )}
                        
//                         {request.status === 'accepted' && (
//                           <div className="flex lg:flex-col gap-2">
//                             <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors">
//                               <Bell className="h-4 w-4" />
//                               Schedule
//                             </button>
//                             <button className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors">
//                               <MessageSquare className="h-4 w-4" />
//                               Chat
//                             </button>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   ))
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AlumniDashboard;
import { useState, useEffect } from 'react';
import { alumniAPI } from '../services/apiService';
import { 
  Briefcase, 
  User, 
  MessageSquare, 
  CheckCircle2, 
  XCircle,
  Loader2,
  Building2,
  GraduationCap,
  Mail
} from 'lucide-react';

const AlumniDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    batch: '',
    branch: '',
    willingToRefer: false,
    mentorshipAvailable: false
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profileRes, referralsRes] = await Promise.all([
        alumniAPI.getMyProfile(),
        alumniAPI.getReferrals()
      ]);
      setProfile(profileRes.data.data);
      setReferrals(referralsRes.data.data || []);
      setFormData({
        company: profileRes.data.data?.company || '',
        role: profileRes.data.data?.role || '',
        batch: profileRes.data.data?.batch || '',
        branch: profileRes.data.data?.branch || '',
        willingToRefer: profileRes.data.data?.willingToRefer || false,
        mentorshipAvailable: profileRes.data.data?.mentorshipAvailable || false
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await alumniAPI.updateMyProfile(formData);
      setEditing(false);
      fetchData();
    } catch (err) {
      alert('Failed to update profile');
    }
  };

  const handleRespond = async (referralId, status) => {
    try {
      await alumniAPI.respondToReferral(referralId, { status, response: '' });
      fetchData();
    } catch (err) {
      alert('Failed to respond');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Alumni Panel</h1>
        <p className="text-gray-600 mb-8">Manage your profile and referral requests</p>

        {/* Profile Section */}
        <div className="card mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <User className="h-5 w-5 text-primary-600" />
              My Profile
            </h2>
            <button
              onClick={() => setEditing(!editing)}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              {editing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {editing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="e.g., Google"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="e.g., SDE"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Batch</label>
                  <input
                    type="number"
                    value={formData.batch}
                    onChange={(e) => setFormData({...formData, batch: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="e.g., 2020"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                  <select
                    value={formData.branch}
                    onChange={(e) => setFormData({...formData, branch: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select</option>
                    {['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL', 'OTHER'].map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.willingToRefer}
                    onChange={(e) => setFormData({...formData, willingToRefer: e.target.checked})}
                  />
                  <span className="text-sm text-gray-700">Willing to Refer</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.mentorshipAvailable}
                    onChange={(e) => setFormData({...formData, mentorshipAvailable: e.target.checked})}
                  />
                  <span className="text-sm text-gray-700">Available for Mentorship</span>
                </label>
              </div>
              <button
                onClick={handleUpdateProfile}
                className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
              >
                Save Profile
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Company</p>
                  <p className="font-medium">{profile?.company || 'Not set'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Briefcase className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Role</p>
                  <p className="font-medium">{profile?.role || 'Not set'}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Batch</p>
                <p className="font-medium">{profile?.batch || 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Branch</p>
                <p className="font-medium">{profile?.branch || 'Not set'}</p>
              </div>
            </div>
          )}
        </div>

        {/* Referral Requests */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary-600" />
            Referral Requests
          </h2>
          
          {referrals.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No referral requests yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {referrals.map((ref) => (
                <div key={ref._id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Student Name + Email */}
                      <div className="flex items-center gap-2 mb-1">
                        <User className="h-4 w-4 text-primary-500" />
                        <p className="font-medium text-gray-900">
                          {ref.studentName || 'Student Request'}
                        </p>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {ref.studentEmail || 'No email'}
                        </span>
                      </div>
                      
                      {/* Branch + Year */}
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                        <GraduationCap className="h-3 w-3" />
                        <span>{ref.studentBranch || 'Unknown Branch'}</span>
                        {ref.studentYear && (
                          <>
                            <span>•</span>
                            <span>Year {ref.studentYear}</span>
                          </>
                        )}
                      </div>
                      
                      {/* Message */}
                      <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-3 rounded-lg">
                        "{ref.message}"
                      </p>
                      
                      {/* Date */}
                      <p className="text-xs text-gray-400 mt-2">
                        Received: {new Date(ref.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    
                    {/* Status Badge */}
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ml-4 flex-shrink-0 ${
                      ref.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      ref.status === 'accepted' ? 'bg-green-100 text-green-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {ref.status}
                    </span>
                  </div>
                  
                  {/* Accept/Reject Buttons */}
                  {ref.status === 'pending' && (
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => handleRespond(ref._id, 'accepted')}
                        className="flex items-center gap-1.5 bg-green-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Accept
                      </button>
                      <button
                        onClick={() => handleRespond(ref._id, 'rejected')}
                        className="flex items-center gap-1.5 bg-red-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors"
                      >
                        <XCircle className="h-4 w-4" />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlumniDashboard;