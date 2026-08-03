// import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { studentAPI } from '../services/apiService';
// import {
//   User,
//   GraduationCap,
//   Code,
//   Mail,
//   Phone,
//   MapPin,
//   Save,
//   Loader2,
//   AlertCircle,
//   CheckCircle2,
//   ChevronLeft,
//   BookOpen,
//   Calendar,
//   Award,
//   Pencil,
//   FileText,
//   Download,
//   Upload
// } from 'lucide-react';

// const ProfilePage = () => {
//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [editMode, setEditMode] = useState(false);

//   const [formData, setFormData] = useState({
//     personalInfo: {
//       name: '',
//       email: '',
//       phone: '',
//       branch: '',
//       year: '',
//       rollNumber: ''
//     },
//     academics: {
//       cgpa: '',
//       tenthPercentage: '',
//       twelfthPercentage: '',
//       backlogs: 0
//     },
//     skills: [],
//     newSkill: '',
//     resumeFile: null
//   });

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   const fetchProfile = async () => {
//     try {
//       setLoading(true);
//       const res = await studentAPI.getProfile();
//       const data = res.data.data;
//       setProfile(data);
      
//       setFormData({
//         personalInfo: {
//           name: data.personalInfo?.name || '',
//           email: data.personalInfo?.email || '',
//           phone: data.personalInfo?.phone || '',
//           branch: data.personalInfo?.branch || '',
//           year: data.personalInfo?.year || '',
//           rollNumber: data.personalInfo?.rollNumber || ''
//         },
//         academics: {
//           cgpa: data.academics?.cgpa || '',
//           tenthPercentage: data.academics?.tenthPercentage || '',
//           twelfthPercentage: data.academics?.twelfthPercentage || '',
//           backlogs: data.academics?.backlogs || 0
//         },
//         skills: data.skills || [],
//         newSkill: '',
//         resumeFile: null
//       });
      
//       setError('');
//     } catch (err) {
//       console.error('Failed to fetch profile:', err);
//       setError(err.response?.data?.message || 'Failed to load profile');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (section, field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [section]: {
//         ...prev[section],
//         [field]: value
//       }
//     }));
//   };

//   const handleAddSkill = () => {
//     if (formData.newSkill.trim() && !formData.skills.includes(formData.newSkill.trim())) {
//       setFormData(prev => ({
//         ...prev,
//         skills: [...prev.skills, prev.newSkill.trim()],
//         newSkill: ''
//       }));
//     }
//   };

//   const handleRemoveSkill = (skillToRemove) => {
//     setFormData(prev => ({
//       ...prev,
//       skills: prev.skills.filter(s => s !== skillToRemove)
//     }));
//   };

//   const handleSave = async () => {
//     setSaving(true);
//     setError('');
//     setSuccess('');

//     try {
//       let updateData;
      
//       // If resume file selected, use FormData
//       if (formData.resumeFile) {
//         updateData = new FormData();
//         updateData.append('personalInfo', JSON.stringify(formData.personalInfo));
//         updateData.append('academics', JSON.stringify({
//           cgpa: parseFloat(formData.academics.cgpa) || 0,
//           tenthPercentage: parseFloat(formData.academics.tenthPercentage) || 0,
//           twelfthPercentage: parseFloat(formData.academics.twelfthPercentage) || 0,
//           backlogs: parseInt(formData.academics.backlogs) || 0
//         }));
//         updateData.append('skills', JSON.stringify(formData.skills));
//         updateData.append('resume', formData.resumeFile);
//       } else {
//         // Regular JSON update
//         updateData = {
//           personalInfo: formData.personalInfo,
//           academics: {
//             cgpa: parseFloat(formData.academics.cgpa) || 0,
//             tenthPercentage: parseFloat(formData.academics.tenthPercentage) || 0,
//             twelfthPercentage: parseFloat(formData.academics.twelfthPercentage) || 0,
//             backlogs: parseInt(formData.academics.backlogs) || 0
//           },
//           skills: formData.skills
//         };
//       }

//       await studentAPI.updateProfile(updateData);
//       setSuccess('Profile updated successfully!');
//       setEditMode(false);
//       setFormData(prev => ({ ...prev, resumeFile: null }));
//       fetchProfile();
//     } catch (err) {
//       console.error('Update error:', err);
//       setError(err.response?.data?.message || 'Failed to update profile');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const branches = ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL', 'OTHER'];
//   const years = ['1', '2', '3', '4'];

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <Loader2 className="h-12 w-12 animate-spin text-primary-600" />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="mb-8">
//           <Link to="/student/dashboard" className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-primary-600 mb-4 transition-colors">
//             <ChevronLeft className="h-4 w-4" />
//             Back to Dashboard
//           </Link>
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="h-12 w-12 bg-primary-100 rounded-xl flex items-center justify-center">
//                 <User className="h-6 w-6 text-primary-600" />
//               </div>
//               <div>
//                 <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
//                 <p className="text-gray-600">Manage your personal and academic information</p>
//               </div>
//             </div>
//             <button
//               onClick={() => setEditMode(!editMode)}
//               className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
//                 editMode 
//                   ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
//                   : 'bg-primary-600 text-white hover:bg-primary-700'
//               }`}
//             >
//               {editMode ? (
//                 <>Cancel</>
//               ) : (
//                 <>
//                   <Pencil className="h-4 w-4" />
//                   Edit Profile
//                 </>
//               )}
//             </button>
//           </div>
//         </div>

//         {/* Alerts */}
//         {error && (
//           <div className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-4">
//             <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
//             <p className="text-sm text-red-700">{error}</p>
//           </div>
//         )}

//         {success && (
//           <div className="mb-6 flex items-start gap-3 bg-green-50 border border-green-200 rounded-lg p-4">
//             <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
//             <p className="text-sm text-green-700">{success}</p>
//           </div>
//         )}

//         <div className="space-y-6">
//           {/* Personal Information */}
//           <div className="card">
//             <div className="flex items-center gap-2 mb-6">
//               <User className="h-5 w-5 text-primary-600" />
//               <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
//             </div>

//             <div className="grid sm:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
//                 {editMode ? (
//                   <input
//                     type="text"
//                     value={formData.personalInfo.name}
//                     onChange={(e) => handleChange('personalInfo', 'name', e.target.value)}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                     placeholder="Your full name"
//                   />
//                 ) : (
//                   <p className="text-gray-900 font-medium">{profile?.personalInfo?.name || 'Not set'}</p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//                 <div className="flex items-center gap-2">
//                   <Mail className="h-4 w-4 text-gray-400" />
//                   {editMode ? (
//                     <input
//                       type="email"
//                       value={formData.personalInfo.email}
//                       onChange={(e) => handleChange('personalInfo', 'email', e.target.value)}
//                       className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                       placeholder="your@email.com"
//                     />
//                   ) : (
//                     <p className="text-gray-900">{profile?.personalInfo?.email || 'Not set'}</p>
//                   )}
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
//                 <div className="flex items-center gap-2">
//                   <Phone className="h-4 w-4 text-gray-400" />
//                   {editMode ? (
//                     <input
//                       type="tel"
//                       value={formData.personalInfo.phone}
//                       onChange={(e) => handleChange('personalInfo', 'phone', e.target.value)}
//                       className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                       placeholder="+91 98765 43210"
//                     />
//                   ) : (
//                     <p className="text-gray-900">{profile?.personalInfo?.phone || 'Not set'}</p>
//                   )}
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Roll Number</label>
//                 {editMode ? (
//                   <input
//                     type="text"
//                     value={formData.personalInfo.rollNumber}
//                     onChange={(e) => handleChange('personalInfo', 'rollNumber', e.target.value)}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                     placeholder="e.g., 2021CSE001"
//                   />
//                 ) : (
//                   <p className="text-gray-900">{profile?.personalInfo?.rollNumber || 'Not set'}</p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
//                 <div className="flex items-center gap-2">
//                   <MapPin className="h-4 w-4 text-gray-400" />
//                   {editMode ? (
//                     <select
//                       value={formData.personalInfo.branch}
//                       onChange={(e) => handleChange('personalInfo', 'branch', e.target.value)}
//                       className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                     >
//                       <option value="">Select Branch</option>
//                       {branches.map(b => (
//                         <option key={b} value={b}>{b}</option>
//                       ))}
//                     </select>
//                   ) : (
//                     <p className="text-gray-900">{profile?.personalInfo?.branch || 'Not set'}</p>
//                   )}
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
//                 <div className="flex items-center gap-2">
//                   <Calendar className="h-4 w-4 text-gray-400" />
//                   {editMode ? (
//                     <select
//                       value={formData.personalInfo.year}
//                       onChange={(e) => handleChange('personalInfo', 'year', e.target.value)}
//                       className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                     >
//                       <option value="">Select Year</option>
//                       {years.map(y => (
//                         <option key={y} value={y}>Year {y}</option>
//                       ))}
//                     </select>
//                   ) : (
//                     <p className="text-gray-900">{profile?.personalInfo?.year ? `Year ${profile.personalInfo.year}` : 'Not set'}</p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Academic Information */}
//           <div className="card">
//             <div className="flex items-center gap-2 mb-6">
//               <GraduationCap className="h-5 w-5 text-primary-600" />
//               <h2 className="text-xl font-semibold text-gray-900">Academic Information</h2>
//             </div>

//             <div className="grid sm:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Current CGPA</label>
//                 <div className="flex items-center gap-2">
//                   <Award className="h-4 w-4 text-gray-400" />
//                   {editMode ? (
//                     <input
//                       type="number"
//                       step="0.01"
//                       min="0"
//                       max="10"
//                       value={formData.academics.cgpa}
//                       onChange={(e) => handleChange('academics', 'cgpa', e.target.value)}
//                       className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                       placeholder="e.g., 8.5"
//                     />
//                   ) : (
//                     <p className="text-gray-900 font-semibold">{profile?.academics?.cgpa || 'Not set'}</p>
//                   )}
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Active Backlogs</label>
//                 {editMode ? (
//                   <input
//                     type="number"
//                     min="0"
//                     value={formData.academics.backlogs}
//                     onChange={(e) => handleChange('academics', 'backlogs', e.target.value)}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                     placeholder="0"
//                   />
//                 ) : (
//                   <p className="text-gray-900">{profile?.academics?.backlogs ?? 0}</p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">10th Percentage</label>
//                 {editMode ? (
//                   <input
//                     type="number"
//                     step="0.1"
//                     min="0"
//                     max="100"
//                     value={formData.academics.tenthPercentage}
//                     onChange={(e) => handleChange('academics', 'tenthPercentage', e.target.value)}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                     placeholder="e.g., 85.5"
//                   />
//                 ) : (
//                   <p className="text-gray-900">{profile?.academics?.tenthPercentage ? `${profile.academics.tenthPercentage}%` : 'Not set'}</p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">12th Percentage</label>
//                 {editMode ? (
//                   <input
//                     type="number"
//                     step="0.1"
//                     min="0"
//                     max="100"
//                     value={formData.academics.twelfthPercentage}
//                     onChange={(e) => handleChange('academics', 'twelfthPercentage', e.target.value)}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                     placeholder="e.g., 87.0"
//                   />
//                 ) : (
//                   <p className="text-gray-900">{profile?.academics?.twelfthPercentage ? `${profile.academics.twelfthPercentage}%` : 'Not set'}</p>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Skills */}
//           <div className="card">
//             <div className="flex items-center gap-2 mb-6">
//               <Code className="h-5 w-5 text-primary-600" />
//               <h2 className="text-xl font-semibold text-gray-900">Skills</h2>
//             </div>

//             {editMode && (
//               <div className="flex gap-2 mb-4">
//                 <input
//                   type="text"
//                   value={formData.newSkill}
//                   onChange={(e) => setFormData(prev => ({ ...prev, newSkill: e.target.value }))}
//                   onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
//                   className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                   placeholder="Add a skill (e.g., React, Python)"
//                 />
//                 <button
//                   onClick={handleAddSkill}
//                   className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
//                 >
//                   Add
//                 </button>
//               </div>
//             )}

//             <div className="flex flex-wrap gap-2">
//               {formData.skills.length > 0 ? (
//                 formData.skills.map((skill, idx) => (
//                   <span
//                     key={idx}
//                     className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium ${
//                       editMode ? 'bg-primary-100 text-primary-700 pr-2' : 'bg-gray-100 text-gray-700'
//                     }`}
//                   >
//                     {skill}
//                     {editMode && (
//                       <button
//                         onClick={() => handleRemoveSkill(skill)}
//                         className="ml-1 h-4 w-4 rounded-full bg-primary-200 text-primary-700 flex items-center justify-center text-xs hover:bg-primary-300"
//                       >
//                         ×
//                       </button>
//                     )}
//                   </span>
//                 ))
//               ) : (
//                 <p className="text-gray-500 text-sm">No skills added yet. {editMode && 'Add skills to improve your profile!'}</p>
//               )}
//             </div>

//             {!editMode && (
//               <Link
//                 to="/resume"
//                 className="mt-4 inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
//               >
//                 <BookOpen className="h-4 w-4" />
//                 Use AI Resume Parser to auto-detect skills
//               </Link>
//             )}
//           </div>

//           {/* Resume Upload Section */}
//           <div className="card">
//             <div className="flex items-center gap-2 mb-6">
//               <FileText className="h-5 w-5 text-primary-600" />
//               <h2 className="text-xl font-semibold text-gray-900">Resume</h2>
//             </div>

//             {/* Current Resume */}
//             {profile?.resumeUrl && !editMode && (
//               <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-3">
//                     <FileText className="h-8 w-8 text-blue-600" />
//                     <div>
//                       <p className="text-sm font-medium text-gray-900">Resume Uploaded</p>
//                       <p className="text-xs text-gray-500">{profile.resumeFileName || 'resume.pdf'}</p>
//                     </div>
//                   </div>
//                   <a
//                     href={`http://localhost:5555${profile.resumeUrl}`}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="inline-flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
//                   >
//                     <Download className="h-4 w-4" />
//                     View
//                   </a>
//                 </div>
//               </div>
//             )}

//             {/* Edit Mode - Upload New Resume */}
//             {editMode && (
//               <div className="space-y-3">
//                 {profile?.resumeUrl && (
//                   <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                     <div className="flex items-center gap-2">
//                       <FileText className="h-5 w-5 text-gray-400" />
//                       <span className="text-sm text-gray-600">Current resume saved</span>
//                     </div>
//                     <a
//                       href={`http://localhost:5555${profile.resumeUrl}`}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-sm text-primary-600 hover:underline"
//                     >
//                       View Current
//                     </a>
//                   </div>
//                 )}

//                 <div className="relative">
//                   <input
//                     type="file"
//                     accept=".pdf,application/pdf"
//                     onChange={(e) => {
//                       const file = e.target.files[0];
//                       if (file) {
//                         if (file.type !== 'application/pdf') {
//                           setError('Only PDF files are allowed');
//                           return;
//                         }
//                         if (file.size > 5 * 1024 * 1024) {
//                           setError('File size must be less than 5MB');
//                           return;
//                         }
//                         setFormData(prev => ({ ...prev, resumeFile: file }));
//                         setError('');
//                       }
//                     }}
//                     className="hidden"
//                     id="profile-resume-upload"
//                   />
//                   <label
//                     htmlFor="profile-resume-upload"
//                     className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-400 hover:bg-primary-50 cursor-pointer transition-colors"
//                   >
//                     <Upload className="h-5 w-5 text-gray-400" />
//                     <span className="text-sm text-gray-600">
//                       {formData.resumeFile ? formData.resumeFile.name : 'Click to upload new PDF resume'}
//                     </span>
//                   </label>
//                   {formData.resumeFile && (
//                     <p className="text-xs text-gray-500 mt-1">
//                       {(formData.resumeFile.size / 1024).toFixed(1)} KB — Will replace current resume on save
//                     </p>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Save Button */}
//           {editMode && (
//             <div className="flex gap-4">
//               <button
//                 onClick={() => setEditMode(false)}
//                 className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSave}
//                 disabled={saving}
//                 className="flex-1 btn-primary py-3 flex items-center justify-center gap-2"
//               >
//                 {saving ? (
//                   <>
//                     <Loader2 className="h-4 w-4 animate-spin" />
//                     Saving...
//                   </>
//                 ) : (
//                   <>
//                     <Save className="h-4 w-4" />
//                     Save Changes
//                   </>
//                 )}
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { studentAPI } from '../services/apiService';
import { 
  User, 
  GraduationCap, 
  Phone, 
  Upload,
  FileText,
  AlertCircle,
  CheckCircle2,
  Loader2,
  X,
  Save,
  ArrowLeft
} from 'lucide-react';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    branch: '',
    year: '',
    rollNumber: '',
    cgpa: '',
    tenthPercentage: '',
    twelfthPercentage: '',
    skills: ''
  });
  
  const [resumeFile, setResumeFile] = useState(null);
  const [existingResume, setExistingResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const branches = ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL', 'OTHER'];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await studentAPI.getProfile();
      const profile = res.data.data;
      
      if (profile) {
        setFormData({
          name: profile.personalInfo?.name || '',
          phone: profile.personalInfo?.phone || '',
          branch: profile.personalInfo?.branch || '',
          year: profile.personalInfo?.year || '',
          rollNumber: profile.personalInfo?.rollNumber || '',
          cgpa: profile.academics?.cgpa || '',
          tenthPercentage: profile.academics?.tenthPercent || '',
          twelfthPercentage: profile.academics?.twelfthPercent || '',
          skills: profile.skills?.join(', ') || ''
        });
        
        if (profile.resumeUrl) {
          setExistingResume({
            url: profile.resumeUrl,
            name: profile.resumeFileName || 'Resume.pdf'
          });
        }
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setError('Only PDF files are allowed');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      setResumeFile(file);
      setError('');
    }
  };

  const removeResume = () => {
    setResumeFile(null);
    setExistingResume(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.branch || !formData.year || !formData.rollNumber) {
      setError('Please fill all required fields');
      return;
    }

    if (!formData.cgpa || !formData.tenthPercentage || !formData.twelfthPercentage) {
      setError('Please fill all academic details');
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('phone', formData.phone);
      data.append('branch', formData.branch);
      data.append('year', formData.year);
      data.append('rollNumber', formData.rollNumber);
      data.append('cgpa', formData.cgpa);
      data.append('tenthPercentage', formData.tenthPercentage);
      data.append('twelfthPercentage', formData.twelfthPercentage);
      data.append('skills', formData.skills);
      data.append('profileCompleted', 'true');

      if (resumeFile) {
        data.append('resume', resumeFile);
      }

      await studentAPI.updateProfile(data);
      
      setSuccess('Profile updated successfully!');
      setTimeout(() => {
        navigate('/student/dashboard');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <button 
          onClick={() => navigate('/student/dashboard')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </button>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Complete Your Profile</h1>
          <p className="text-gray-600 mt-2">Fill in your academic details to apply for jobs</p>
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-4">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 flex items-start gap-3 bg-green-50 border border-green-200 rounded-lg p-4">
            <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-green-700">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="card space-y-6">
          {/* Personal Info Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-primary-600" />
              Personal Information
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>
          </div>

          {/* Academic Info Section */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary-600" />
              Academic Details
            </h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Branch *</label>
                <select
                  name="branch"
                  required
                  value={formData.branch}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select Branch</option>
                  {branches.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year *</label>
                <select
                  name="year"
                  required
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select Year</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Roll Number *</label>
              <input
                type="text"
                name="rollNumber"
                required
                value={formData.rollNumber}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g., 2021CSE001"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CGPA *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  name="cgpa"
                  required
                  value={formData.cgpa}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., 8.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">10th % *</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  name="tenthPercentage"
                  required
                  value={formData.tenthPercentage}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., 85.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">12th % *</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  name="twelfthPercentage"
                  required
                  value={formData.twelfthPercentage}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., 87.0"
                />
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="border-t border-gray-200 pt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma separated)</label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="e.g., JavaScript, React, Node.js"
            />
          </div>

          {/* Resume Upload */}
          <div className="border-t border-gray-200 pt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Resume <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            
            {!resumeFile && !existingResume ? (
              <div className="relative">
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleResumeChange}
                  className="hidden"
                  id="resume-upload"
                />
                <label
                  htmlFor="resume-upload"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-400 hover:bg-primary-50 cursor-pointer transition-colors"
                >
                  <Upload className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-600">Click to upload PDF resume</span>
                </label>
                <p className="text-xs text-gray-400 mt-1">PDF only, max 5MB</p>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {resumeFile ? resumeFile.name : existingResume?.name}
                    </p>
                    {resumeFile && (
                      <p className="text-xs text-gray-500">{(resumeFile.size / 1024).toFixed(1)} KB</p>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeResume}
                  className="h-8 w-8 bg-white hover:bg-red-50 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Profile
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;