import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Briefcase, 
  Users, 
  Building2, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  MessageSquare,
  Calendar,
  FileText
} from 'lucide-react';

const HomePage = () => {
  const { isAuthenticated, user } = useAuth();

  // Get dashboard link based on role
  const getDashboardLink = () => {
    if (!user) return '/login';
    const roleLinks = {
      student: '/student/dashboard',
      tpo: '/tpo/dashboard',
      company: '/company/dashboard',
      alumni: '/alumni/dashboard',
    };
    return roleLinks[user.role] || '/login';
  };

  // Features data
  const features = [
    {
      icon: Sparkles,
      title: 'AI Resume Parser',
      description: 'Upload your resume and let AI automatically extract skills, CGPA, and experience.',
      color: 'bg-purple-100 text-purple-600',
    },
    {
      icon: TrendingUp,
      title: 'Smart Job Matching',
      description: 'Get personalized job recommendations based on your skills and preferences.',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: MessageSquare,
      title: 'AI Mock Interview',
      description: 'Practice with AI-powered HR interviews and get instant feedback.',
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: Calendar,
      title: 'Interview Scheduler',
      description: 'Automated scheduling with calendar integration for seamless interviews.',
      color: 'bg-orange-100 text-orange-600',
    },
    {
      icon: FileText,
      title: 'Application Tracking',
      description: 'Real-time tracking from applied to placed with instant notifications.',
      color: 'bg-pink-100 text-pink-600',
    },
    {
      icon: Users,
      title: 'Alumni Network',
      description: 'Connect with placed alumni for referrals and mentorship opportunities.',
      color: 'bg-teal-100 text-teal-600',
    },
  ];

  // Stats data
  const stats = [
    { number: '500+', label: 'Students Placed' },
    { number: '100+', label: 'Companies' },
    { number: '50+', label: 'Job Openings' },
    { number: '95%', label: 'Success Rate' },
  ];

  // How it works steps
  const steps = [
    {
      step: '01',
      title: 'Create Profile',
      description: 'Sign up and build your profile with AI-powered resume parsing.',
    },
    {
      step: '02',
      title: 'Get Matched',
      description: 'Our AI matches you with relevant job opportunities instantly.',
    },
    {
      step: '03',
      title: 'Apply & Track',
      description: 'Apply with one click and track your application in real-time.',
    },
    {
      step: '04',
      title: 'Get Placed',
      description: 'Ace the interview with AI mock practice and land your dream job.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium">
                <Sparkles className="h-4 w-4" />
                AI-Powered Placement Platform
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Your Dream Career Starts{' '}
                <span className="text-primary-200">Here</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-primary-100 max-w-xl">
                Smart Placement Portal connects students with top companies using AI-driven matching, 
                real-time tracking, and seamless recruitment.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                {isAuthenticated ? (
                  <Link
                    to={getDashboardLink()}
                    className="inline-flex items-center justify-center gap-2 bg-white text-primary-700 font-semibold py-3 px-8 rounded-lg hover:bg-primary-50 transition-all duration-200 shadow-lg"
                  >
                    Go to Dashboard
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/register"
                      className="inline-flex items-center justify-center gap-2 bg-white text-primary-700 font-semibold py-3 px-8 rounded-lg hover:bg-primary-50 transition-all duration-200 shadow-lg"
                    >
                      Get Started
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                    <Link
                      to="/login"
                      className="inline-flex items-center justify-center gap-2 border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white/10 transition-all duration-200"
                    >
                      Sign In
                    </Link>
                  </>
                )}
              </div>
            </div>
            
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute -inset-4 bg-white/10 rounded-2xl blur-2xl"></div>
                <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 bg-white/20 rounded-lg p-4">
                      <div className="h-12 w-12 bg-green-400 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold">Application Submitted</p>
                        <p className="text-sm text-primary-200">Google - Software Engineer</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 bg-white/20 rounded-lg p-4">
                      <div className="h-12 w-12 bg-blue-400 rounded-full flex items-center justify-center">
                        <Briefcase className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold">New Job Alert</p>
                        <p className="text-sm text-primary-200">Microsoft - 15 LPA</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 bg-white/20 rounded-lg p-4">
                      <div className="h-12 w-12 bg-purple-400 rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold">Interview Scheduled</p>
                        <p className="text-sm text-primary-200">Amazon - Tomorrow 2:00 PM</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-12 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-3xl sm:text-4xl font-bold text-primary-600">{stat.number}</p>
                <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to streamline your placement process, powered by cutting-edge AI.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card hover:shadow-lg transition-all duration-300 group"
              >
                <div className={`inline-flex p-3 rounded-lg ${feature.color} mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Four simple steps to land your dream job.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative text-center">
                <div className="text-6xl font-bold text-primary-100 mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {step.description}
                </p>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 right-0 transform translate-x-1/2">
                    <ArrowRight className="h-6 w-6 text-primary-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-lg text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of students who have found their dream jobs through Smart Placement Portal.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 bg-white text-primary-700 font-semibold py-3 px-8 rounded-lg hover:bg-primary-50 transition-all duration-200 shadow-lg"
            >
              Get Started Now
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white/10 transition-all duration-200"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;