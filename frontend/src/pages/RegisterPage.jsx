// import { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { authAPI } from '../services/apiService';
// import { 
//   User, 
//   Mail, 
//   Lock, 
//   Phone, 
//   Upload,
//   FileText,
//   AlertCircle,
//   CheckCircle2,
//   Loader2,
//   X
// } from 'lucide-react';

// const RegisterPage = () => {
//   const navigate = useNavigate();
  
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//     role: 'student',
//     branch: '',
//     year: '',
//     rollNumber: '',
//     phone: '',
//     cgpa: '',
//     tenthPercentage: '',
//     twelfthPercentage: ''
//   });
  
//   const [resumeFile, setResumeFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleResumeChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (file.type !== 'application/pdf') {
//         setError('Only PDF files are allowed');
//         return;
//       }
//       if (file.size > 5 * 1024 * 1024) {
//         setError('File size must be less than 5MB');
//         return;
//       }
//       setResumeFile(file);
//       setError('');
//     }
//   };

//   const removeResume = () => {
//     setResumeFile(null);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setSuccess('');

//     if (formData.password !== formData.confirmPassword) {
//       setError('Passwords do not match');
//       return;
//     }

//     if (formData.password.length < 6) {
//       setError('Password must be at least 6 characters');
//       return;
//     }

//     setLoading(true);

//     try {
//       const data = new FormData();
//       data.append('name', formData.name);
//       data.append('email', formData.email);
//       data.append('password', formData.password);
//       data.append('role', formData.role);
      
//       if (formData.role === 'student') {
//         data.append('branch', formData.branch);
//         data.append('year', formData.year);
//         data.append('rollNumber', formData.rollNumber);
//         data.append('phone', formData.phone);
//         data.append('cgpa', formData.cgpa);
//         data.append('tenthPercentage', formData.tenthPercentage);
//         data.append('twelfthPercentage', formData.twelfthPercentage);
//       }

//       if (resumeFile) {
//         data.append('resume', resumeFile);
//       }

//       await authAPI.register(data);
      
//       // ✅ Auto login removed — show success and redirect to login
//       setSuccess('Registration successful! Please wait for TPO verification before logging in.');
      
//       // Form clear karo
//       setFormData({
//         name: '',
//         email: '',
//         password: '',
//         confirmPassword: '',
//         role: 'student',
//         branch: '',
//         year: '',
//         rollNumber: '',
//         phone: '',
//         cgpa: '',
//         tenthPercentage: '',
//         twelfthPercentage: ''
//       });
//       setResumeFile(null);
      
//       // 3 second baad login page pe redirect karo with message
//       setTimeout(() => {
//         navigate('/login?message=Account created! Please wait for TPO verification.');
//       }, 3000);
      
//     } catch (err) {
//       setError(err.response?.data?.message || 'Registration failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const branches = ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL', 'OTHER'];

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
//           <p className="text-gray-600 mt-2">Join Smart Placement Portal</p>
//         </div>

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

//         <form onSubmit={handleSubmit} className="card space-y-5">
//           {/* Role Selection */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Register As</label>
//             <div className="grid grid-cols-3 gap-3">
//               {['student', 'company', 'tpo'].map((r) => (
//                 <button
//                   key={r}
//                   type="button"
//                   onClick={() => setFormData({ ...formData, role: r })}
//                   className={`py-2 px-4 rounded-lg border-2 text-sm font-medium capitalize transition-all ${
//                     formData.role === r
//                       ? 'border-primary-500 bg-primary-50 text-primary-700'
//                       : 'border-gray-200 text-gray-600 hover:border-gray-300'
//                   }`}
//                 >
//                   {r}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Name */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
//             <div className="relative">
//               <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//               <input
//                 type="text"
//                 name="name"
//                 required
//                 value={formData.name}
//                 onChange={handleChange}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                 placeholder="Your full name"
//               />
//             </div>
//           </div>

//           {/* Email */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//             <div className="relative">
//               <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//               <input
//                 type="email"
//                 name="email"
//                 required
//                 value={formData.email}
//                 onChange={handleChange}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                 placeholder="your@email.com"
//               />
//             </div>
//           </div>

//           {/* Password */}
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//                 <input
//                   type="password"
//                   name="password"
//                   required
//                   value={formData.password}
//                   onChange={handleChange}
//                   className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                   placeholder="••••••"
//                 />
//               </div>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Confirm</label>
//               <input
//                 type="password"
//                 name="confirmPassword"
//                 required
//                 value={formData.confirmPassword}
//                 onChange={handleChange}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                 placeholder="••••••"
//               />
//             </div>
//           </div>

//           {/* Student Only Fields */}
//           {formData.role === 'student' && (
//             <>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
//                   <select
//                     name="branch"
//                     value={formData.branch}
//                     onChange={handleChange}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                   >
//                     <option value="">Select</option>
//                     {branches.map(b => (
//                       <option key={b} value={b}>{b}</option>
//                     ))}
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
//                   <select
//                     name="year"
//                     value={formData.year}
//                     onChange={handleChange}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                   >
//                     <option value="">Select</option>
//                     <option value="1">1st Year</option>
//                     <option value="2">2nd Year</option>
//                     <option value="3">3rd Year</option>
//                     <option value="4">4th Year</option>
//                   </select>
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Roll Number</label>
//                   <input
//                     type="text"
//                     name="rollNumber"
//                     value={formData.rollNumber}
//                     onChange={handleChange}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                     placeholder="e.g., 2021CSE001"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
//                   <div className="relative">
//                     <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//                     <input
//                       type="tel"
//                       name="phone"
//                       value={formData.phone}
//                       onChange={handleChange}
//                       className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                       placeholder="+91 98765 43210"
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* CGPA */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Current CGPA</label>
//                 <input
//                   type="number"
//                   step="0.01"
//                   min="0"
//                   max="10"
//                   name="cgpa"
//                   value={formData.cgpa}
//                   onChange={handleChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                   placeholder="e.g., 8.5"
//                 />
//               </div>

//               {/* 10th & 12th Percentage */}
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">10th Percentage</label>
//                   <input
//                     type="number"
//                     step="0.1"
//                     min="0"
//                     max="100"
//                     name="tenthPercentage"
//                     value={formData.tenthPercentage}
//                     onChange={handleChange}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                     placeholder="e.g., 85.5"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">12th Percentage</label>
//                   <input
//                     type="number"
//                     step="0.1"
//                     min="0"
//                     max="100"
//                     name="twelfthPercentage"
//                     value={formData.twelfthPercentage}
//                     onChange={handleChange}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
//                     placeholder="e.g., 87.0"
//                     required
//                   />
//                 </div>
//               </div>

//               {/* Resume Upload */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Upload Resume <span className="text-gray-400 font-normal">(Optional)</span>
//                 </label>
                
//                 {!resumeFile ? (
//                   <div className="relative">
//                     <input
//                       type="file"
//                       accept=".pdf,application/pdf"
//                       onChange={handleResumeChange}
//                       className="hidden"
//                       id="resume-upload"
//                     />
//                     <label
//                       htmlFor="resume-upload"
//                       className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-400 hover:bg-primary-50 cursor-pointer transition-colors"
//                     >
//                       <Upload className="h-5 w-5 text-gray-400" />
//                       <span className="text-sm text-gray-600">Click to upload PDF resume</span>
//                     </label>
//                     <p className="text-xs text-gray-400 mt-1">PDF only, max 5MB</p>
//                   </div>
//                 ) : (
//                   <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
//                     <div className="flex items-center gap-3">
//                       <FileText className="h-5 w-5 text-blue-600" />
//                       <div>
//                         <p className="text-sm font-medium text-gray-900">{resumeFile.name}</p>
//                         <p className="text-xs text-gray-500">{(resumeFile.size / 1024).toFixed(1)} KB</p>
//                       </div>
//                     </div>
//                     <button
//                       type="button"
//                       onClick={removeResume}
//                       className="h-8 w-8 bg-white hover:bg-red-50 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
//                     >
//                       <X className="h-4 w-4" />
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </>
//           )}

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full btn-primary py-3 flex items-center justify-center gap-2"
//           >
//             {loading ? (
//               <>
//                 <Loader2 className="h-4 w-4 animate-spin" />
//                 Creating Account...
//               </>
//             ) : (
//               'Create Account'
//             )}
//           </button>

//           <p className="text-center text-sm text-gray-600">
//             Already have an account?{' '}
//             <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
//               Login
//             </Link>
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default RegisterPage;
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/apiService';
import { 
  User, 
  Mail, 
  Lock, 
  Phone,
  AlertCircle,
  CheckCircle2,
  Loader2
} from 'lucide-react';

const RegisterPage = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    phone: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('password', formData.password);
      data.append('role', formData.role);
      data.append('phone', formData.phone);

      await authAPI.register(data);
      
      setSuccess('Registration successful! Please wait for Alumni verification before logging in.');
      
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'student',
        phone: ''
      });
      
      setTimeout(() => {
        navigate('/login?message=Account created! Please wait for Alumni verification.');
      }, 3000);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-600 mt-2">Join Smart Placement Portal</p>
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

        <form onSubmit={handleSubmit} className="card space-y-5">
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Register As</label>
            <div className="grid grid-cols-3 gap-3">
              {['student', 'company', 'alumni'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setFormData({ ...formData, role: r })}
                  className={`py-2 px-4 rounded-lg border-2 text-sm font-medium capitalize transition-all ${
                    formData.role === r
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Your full name"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="your@email.com"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="+91 98765 43210"
              />
            </div>
          </div>

          {/* Password */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="••••••"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm</label>
              <input
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;