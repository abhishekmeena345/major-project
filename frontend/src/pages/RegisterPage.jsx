import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import InputField from '../components/common/InputField';
import Button from '../components/common/Button';
import { 
  Mail, 
  Lock, 
  User, 
  GraduationCap, 
  Building2, 
  ArrowRight, 
  AlertCircle,
  CheckCircle2,
  Briefcase
} from 'lucide-react';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1); // 1 = Account, 2 = Profile
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Step 1: Account Data
  const [accountData, setAccountData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Step 2: Profile Data
  const [profileData, setProfileData] = useState({
    // Student fields
    personalInfo: {
      name: '',
      branch: '',
      year: '',
      rollNumber: '',
    },
    academics: {
      cgpa: '',
      tenthPercent: '',
      twelfthPercent: '',
      backlogs: '0',
    },
    skills: [],
    preferences: {
      domains: [],
      expectedPackage: '',
    },
    // Company fields
    name: '',
    description: '',
    website: '',
    // Alumni fields
    company: '',
    role: '',
    batch: '',
    branch: '',
    willingToRefer: false,
    mentorshipAvailable: false,
  });

  const handleAccountChange = (e) => {
    setAccountData({
      ...accountData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    
    // Nested object handling
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setProfileData({
        ...profileData,
        [parent]: {
          ...profileData[parent],
          [child]: value,
        },
      });
    } else {
      setProfileData({
        ...profileData,
        [name]: value,
      });
    }
    setError('');
  };

  const handleSkillsChange = (e) => {
    const skills = e.target.value.split(',').map(s => s.trim()).filter(s => s);
    setProfileData({
      ...profileData,
      skills,
    });
  };

  const validateStep1 = () => {
    if (!accountData.email || !accountData.password) {
      setError('Please fill all required fields');
      return false;
    }
    if (accountData.password !== accountData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (accountData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (!role) {
      setError('Please select a role');
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Prepare profile data based on role
    let finalProfileData = {};
    
    if (role === 'student') {
      finalProfileData = {
        personalInfo: profileData.personalInfo,
        academics: {
          ...profileData.academics,
          cgpa: parseFloat(profileData.academics.cgpa),
          tenthPercent: parseFloat(profileData.academics.tenthPercent),
          twelfthPercent: parseFloat(profileData.academics.twelfthPercent),
          backlogs: parseInt(profileData.academics.backlogs),
        },
        skills: profileData.skills,
        preferences: {
          domains: profileData.preferences.domains,
          expectedPackage: profileData.preferences.expectedPackage ? parseInt(profileData.preferences.expectedPackage) : null,
        },
      };
    } else if (role === 'company') {
      finalProfileData = {
        name: profileData.name,
        description: profileData.description,
        website: profileData.website,
      };
    } else if (role === 'alumni') {
      finalProfileData = {
        company: profileData.company,
        role: profileData.role,
        batch: parseInt(profileData.batch),
        branch: profileData.branch,
        willingToRefer: profileData.willingToRefer,
        mentorshipAvailable: profileData.mentorshipAvailable,
      };
    }

    try {
      await register({
        email: accountData.email,
        password: accountData.password,
        role: role,
        profileData: finalProfileData,
      });
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Role selection cards
  const roles = [
    {
      id: 'student',
      label: 'Student',
      icon: GraduationCap,
      description: 'Looking for job opportunities',
      color: 'bg-blue-50 border-blue-200 hover:border-blue-400',
      iconColor: 'text-blue-600',
    },
    {
      id: 'company',
      label: 'Company',
      icon: Building2,
      description: 'Hiring talented students',
      color: 'bg-purple-50 border-purple-200 hover:border-purple-400',
      iconColor: 'text-purple-600',
    },
    {
      id: 'alumni',
      label: 'Alumni',
      icon: Briefcase,
      description: 'Refer and mentor students',
      color: 'bg-green-50 border-green-200 hover:border-green-400',
      iconColor: 'text-green-600',
    },
  ];

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-50 py-12 px-4">
        <div className="w-full max-w-md text-center">
          <div className="inline-flex items-center justify-center h-20 w-20 bg-green-100 rounded-full mb-6">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Registration Successful!</h2>
          <p className="text-gray-600 mb-8">
            Your account has been created. Please wait for TPO verification before logging in.
          </p>
          <p className="text-sm text-gray-500">
            Redirecting to login page...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 bg-primary-600 rounded-2xl mb-4 shadow-lg">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Create Account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Step {step} of 2: {step === 1 ? 'Account Setup' : 'Profile Details'}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center gap-4">
            <div className={`flex-1 h-2 rounded-full ${step >= 1 ? 'bg-primary-600' : 'bg-gray-200'}`}></div>
            <div className={`flex-1 h-2 rounded-full ${step >= 2 ? 'bg-primary-600' : 'bg-gray-200'}`}></div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-4">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Step 1: Account Information */}
        {step === 1 && (
          <div className="card shadow-lg space-y-6">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Your Role <span className="text-red-500">*</span>
              </label>
              <div className="grid sm:grid-cols-3 gap-4">
                {roles.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                      role === r.id 
                        ? 'border-primary-600 bg-primary-50 ring-2 ring-primary-200' 
                        : r.color
                    }`}
                  >
                    <r.icon className={`h-8 w-8 mb-2 ${role === r.id ? 'text-primary-600' : r.iconColor}`} />
                    <p className="font-semibold text-gray-900">{r.label}</p>
                    <p className="text-xs text-gray-500 mt-1">{r.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Email */}
            <InputField
              label="Email Address"
              type="email"
              name="email"
              value={accountData.email}
              onChange={handleAccountChange}
              placeholder="Enter your email"
              required={true}
              icon={Mail}
            />

            {/* Password */}
            <InputField
              label="Password"
              type="password"
              name="password"
              value={accountData.password}
              onChange={handleAccountChange}
              placeholder="Create a password"
              required={true}
              icon={Lock}
            />

            {/* Confirm Password */}
            <InputField
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={accountData.confirmPassword}
              onChange={handleAccountChange}
              placeholder="Confirm your password"
              required={true}
              icon={Lock}
            />

            <Button
              type="button"
              variant="primary"
              fullWidth={true}
              onClick={handleNextStep}
              icon={ArrowRight}
            >
              Continue
            </Button>
          </div>
        )}

        {/* Step 2: Profile Details */}
        {step === 2 && (
          <div className="card shadow-lg space-y-6">
            {/* Student Profile */}
            {role === 'student' && (
              <>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <InputField
                    label="Full Name"
                    name="personalInfo.name"
                    value={profileData.personalInfo.name}
                    onChange={handleProfileChange}
                    placeholder="Enter your full name"
                    required={true}
                    icon={User}
                  />
                  <InputField
                    label="Roll Number"
                    name="personalInfo.rollNumber"
                    value={profileData.personalInfo.rollNumber}
                    onChange={handleProfileChange}
                    placeholder="e.g., CSE2022001"
                    required={true}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <InputField
                    label="Branch"
                    type="select"
                    name="personalInfo.branch"
                    value={profileData.personalInfo.branch}
                    onChange={handleProfileChange}
                    required={true}
                    options={[
                      { value: 'CSE', label: 'Computer Science' },
                      { value: 'IT', label: 'Information Technology' },
                      { value: 'ECE', label: 'Electronics & Communication' },
                      { value: 'EEE', label: 'Electrical & Electronics' },
                      { value: 'MECH', label: 'Mechanical' },
                      { value: 'CIVIL', label: 'Civil' },
                      { value: 'OTHER', label: 'Other' },
                    ]}
                  />
                  <InputField
                    label="Year"
                    type="select"
                    name="personalInfo.year"
                    value={profileData.personalInfo.year}
                    onChange={handleProfileChange}
                    required={true}
                    options={[
                      { value: '1', label: '1st Year' },
                      { value: '2', label: '2nd Year' },
                      { value: '3', label: '3rd Year' },
                      { value: '4', label: '4th Year' },
                    ]}
                  />
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-4 mt-6">Academic Details</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <InputField
                    label="CGPA"
                    type="number"
                    name="academics.cgpa"
                    value={profileData.academics.cgpa}
                    onChange={handleProfileChange}
                    placeholder="e.g., 8.5"
                    required={true}
                  />
                  <InputField
                    label="Active Backlogs"
                    type="number"
                    name="academics.backlogs"
                    value={profileData.academics.backlogs}
                    onChange={handleProfileChange}
                    placeholder="e.g., 0"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <InputField
                    label="10th Percentage"
                    type="number"
                    name="academics.tenthPercent"
                    value={profileData.academics.tenthPercent}
                    onChange={handleProfileChange}
                    placeholder="e.g., 85"
                    required={true}
                  />
                  <InputField
                    label="12th Percentage"
                    type="number"
                    name="academics.twelfthPercent"
                    value={profileData.academics.twelfthPercent}
                    onChange={handleProfileChange}
                    placeholder="e.g., 82"
                    required={true}
                  />
                </div>

                <InputField
                  label="Skills (comma separated)"
                  name="skills"
                  value={profileData.skills.join(', ')}
                  onChange={handleSkillsChange}
                  placeholder="e.g., JavaScript, React, Node.js, Python"
                />

                <InputField
                  label="Expected Package (LPA)"
                  type="number"
                  name="preferences.expectedPackage"
                  value={profileData.preferences.expectedPackage}
                  onChange={handleProfileChange}
                  placeholder="e.g., 8"
                />
              </>
            )}

            {/* Company Profile */}
            {role === 'company' && (
              <>
                <InputField
                  label="Company Name"
                  name="name"
                  value={profileData.name}
                  onChange={handleProfileChange}
                  placeholder="Enter company name"
                  required={true}
                  icon={Building2}
                />
                <InputField
                  label="Description"
                  type="textarea"
                  name="description"
                  value={profileData.description}
                  onChange={handleProfileChange}
                  placeholder="Brief description about your company"
                />
                <InputField
                  label="Website"
                  name="website"
                  value={profileData.website}
                  onChange={handleProfileChange}
                  placeholder="https://yourcompany.com"
                />
              </>
            )}

            {/* Alumni Profile */}
            {role === 'alumni' && (
              <>
                <div className="grid sm:grid-cols-2 gap-4">
                  <InputField
                    label="Current Company"
                    name="company"
                    value={profileData.company}
                    onChange={handleProfileChange}
                    placeholder="Where do you work?"
                    required={true}
                    icon={Building2}
                  />
                  <InputField
                    label="Current Role"
                    name="role"
                    value={profileData.role}
                    onChange={handleProfileChange}
                    placeholder="e.g., Software Engineer"
                    required={true}
                    icon={Briefcase}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <InputField
                    label="Graduation Batch"
                    type="number"
                    name="batch"
                    value={profileData.batch}
                    onChange={handleProfileChange}
                    placeholder="e.g., 2022"
                    required={true}
                  />
                  <InputField
                    label="Branch"
                    type="select"
                    name="branch"
                    value={profileData.branch}
                    onChange={handleProfileChange}
                    required={true}
                    options={[
                      { value: 'CSE', label: 'Computer Science' },
                      { value: 'IT', label: 'Information Technology' },
                      { value: 'ECE', label: 'Electronics & Communication' },
                      { value: 'EEE', label: 'Electrical & Electronics' },
                      { value: 'MECH', label: 'Mechanical' },
                      { value: 'CIVIL', label: 'Civil' },
                      { value: 'OTHER', label: 'Other' },
                    ]}
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                  <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={profileData.willingToRefer}
                      onChange={(e) => setProfileData({...profileData, willingToRefer: e.target.checked})}
                      className="h-5 w-5 text-primary-600 rounded"
                    />
                    <div>
                      <p className="font-medium text-gray-900">Willing to Refer</p>
                      <p className="text-sm text-gray-500">Help juniors get opportunities</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={profileData.mentorshipAvailable}
                      onChange={(e) => setProfileData({...profileData, mentorshipAvailable: e.target.checked})}
                      className="h-5 w-5 text-primary-600 rounded"
                    />
                    <div>
                      <p className="font-medium text-gray-900">Available for Mentorship</p>
                      <p className="text-sm text-gray-500">Guide students in their career</p>
                    </div>
                  </label>
                </div>
              </>
            )}

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                fullWidth={true}
                onClick={() => setStep(1)}
              >
                Back
              </Button>
              <Button
                type="submit"
                variant="primary"
                fullWidth={true}
                isLoading={isLoading}
                onClick={handleSubmit}
                icon={ArrowRight}
              >
                Complete Registration
              </Button>
            </div>
          </div>
        )}

        {/* Login Link */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;