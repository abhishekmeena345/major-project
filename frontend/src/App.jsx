import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import JobBoardPage from './pages/JobBoardPage';
import JobDetailPage from './pages/JobDetailPage';
import StudentDashboard from './pages/StudentDashboard';
import TpoDashboard from './pages/TpoDashboard';
import CompanyDashboard from './pages/CompanyDashboard';
import ProfilePage from './pages/ProfilePage';
import ResumeParserPage from './pages/ResumeParserPage';
import MockInterviewPage from './pages/MockInterviewPage';
import NotificationsPage from './pages/NotificationsPage';
import ManageStudentsPage from './pages/ManageStudentsPage';
import ManageCompaniesPage from './pages/ManageCompaniesPage';
import ManageJobsPage from './pages/ManageJobsPage';
import ProtectedRoute from './components/common/ProtectedRoute';
import AlumniDashboard from './pages/AlumniDashboard';
import AIChat from './pages/AIChat';
import MockInterview from './pages/MockInterview';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/jobs" element={<JobBoardPage />} />
            <Route path="/jobs/:id" element={<JobDetailPage />} />

            {/* Protected Routes - Student */}
            <Route 
              path="/student/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/resume" 
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <ResumeParserPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/mock-interview" 
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <MockInterviewPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/notifications" 
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <NotificationsPage />
                </ProtectedRoute>
              } 
            />

            {/* Protected Routes - Company */}
            <Route 
              path="/company/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['company']}>
                  <CompanyDashboard />
                </ProtectedRoute>
              } 
            />

            {/* Protected Routes - TPO */}
            <Route 
              path="/tpo/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['tpo']}>
                  <TpoDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/students" 
              element={
                <ProtectedRoute allowedRoles={['tpo']}>
                  <ManageStudentsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/companies" 
              element={
                <ProtectedRoute allowedRoles={['tpo']}>
                  <ManageCompaniesPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/jobs/manage" 
              element={
                <ProtectedRoute allowedRoles={['tpo']}>
                  <ManageJobsPage />
                </ProtectedRoute>
              } 
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
            <Route 
  path="/alumni/dashboard" 
  element={
    <ProtectedRoute allowedRoles={['alumni']}>
      <AlumniDashboard />
    </ProtectedRoute>
  } 
/>
<Route path="/ai-chat" element={<AIChat />} />
<Route path="/mock-interview" element={<MockInterview />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;