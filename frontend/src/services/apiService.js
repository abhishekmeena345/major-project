// import api from '../api/axios';

// // ============================================
// // Auth APIs
// // ============================================
// export const authAPI = {
//   login: (email, password) => api.post('/auth/login', { email, password }),
//   register: (data) => {
//     const isFormData = data instanceof FormData;
//     return api.post('/auth/register', data, isFormData ? {
//       headers: { 'Content-Type': 'multipart/form-data' }
//     } : {});
//   },
//   getMe: () => api.get('/auth/me'),
//   getPendingVerifications: () => api.get('/auth/pending-verifications'),
//   verifyUser: (userId) => api.post(`/auth/verify/${userId}`),
// };

// // ============================================
// // Job APIs
// // ============================================
// export const jobAPI = {
//   getAllJobs: (params) => api.get('/jobs', { params }),
//   getJobById: (id) => api.get(`/jobs/${id}`),
//   getMyJobs: () => api.get('/jobs/my-jobs'),
//   createJob: (data) => api.post('/jobs', data),
//   updateJob: (id, data) => api.put(`/jobs/${id}`, data),
//   deleteJob: (id) => api.delete(`/jobs/${id}`),
//   getApplicants: (id) => api.get(`/jobs/${id}/applicants`),
// };

// // ============================================
// // Student APIs
// // ============================================
// export const studentAPI = {
//   getProfile: () => api.get('/students/profile'),
//   updateProfile: (data) => {
//     const isFormData = data instanceof FormData;
//     return api.put('/students/profile', data, isFormData ? {
//       headers: { 'Content-Type': 'multipart/form-data' }
//     } : {});
//   },
//   getRecommendedJobs: () => api.get('/students/recommended-jobs'),
//   getApplications: () => api.get('/students/applications'),
//   applyForJob: (jobId) => api.post(`/students/apply/${jobId}`),
//   getPlacementProbability: () => api.get('/students/placement-probability'),
// };

// // ============================================
// // Company APIs
// // ============================================
// export const companyAPI = {
//   getProfile: () => api.get('/companies/profile'),
//   updateProfile: (data) => api.put('/companies/profile', data),
//   getDashboardStats: () => api.get('/companies/dashboard-stats'),
//   getJobApplicants: (jobId) => api.get(`/companies/jobs/${jobId}/applicants`),
//   updateApplicationStatus: (applicationId, data) => api.put(`/companies/applications/${applicationId}/status`, data),
//   scheduleInterview: (applicationId, data) => api.post(`/companies/applications/${applicationId}/schedule`, data),
// };

// // ============================================
// // TPO APIs
// // ============================================
// export const tpoAPI = {
//   getProfile: () => api.get('/tpo/profile'),
//   updateProfile: (data) => api.put('/tpo/profile', data),
//   getAnalytics: () => api.get('/tpo/analytics'),
//   getStudents: (params) => api.get('/tpo/students', { params }),
//   getCompanies: (params) => api.get('/tpo/companies', { params }),
//   broadcast: (data) => api.post('/tpo/broadcast', data),
//   getPlacements: () => api.get('/tpo/placements'),
// };

// // ============================================
// // Application APIs
// // ============================================
// export const applicationAPI = {
//   getMyApplications: () => api.get('/applications/my'),
//   updateStatus: (id, status) => api.put(`/applications/${id}/status`, { status }),
// };

// // ============================================
// // Interview APIs
// // ============================================
// export const interviewAPI = {
//   startInterview: (data) => api.post('/interviews/start', data),
//   submitAnswer: (data) => api.post('/interviews/submit-answer', data),
//   completeInterview: (data) => api.post('/interviews/complete', data),
//   getHistory: () => api.get('/interviews/history'),
// };

// // ============================================
// // Notification APIs
// // ============================================
// export const notificationAPI = {
//   getNotifications: () => api.get('/notifications'),
//   markAsRead: (id) => api.put(`/notifications/${id}/read`),
//   markAllAsRead: () => api.put('/notifications/read-all'),
//   deleteNotification: (id) => api.delete(`/notifications/${id}`),
// };

// // ============================================
// // AI APIs
// // ============================================
// export const aiAPI = {
//   parseResume: (data) => api.post('/ai/parse-resume', data),
//   parseResumePDF: (formData) => api.post('/ai/parse-resume-pdf', formData, {
//     headers: {
//       'Content-Type': 'multipart/form-data'
//     }
//   }),
//   getResumeData: () => api.get('/ai/resume-data'),
// };

// // Default export
// export default {
//   auth: authAPI,
//   job: jobAPI,
//   student: studentAPI,
//   company: companyAPI,
//   tpo: tpoAPI,
//   application: applicationAPI,
//   ai: aiAPI,
//   interview: interviewAPI,
//   notification: notificationAPI
// };
// import api from '../api/axios';

// // ============================================
// // Auth APIs
// // ============================================
// export const authAPI = {
//   login: (email, password) => api.post('/auth/login', { email, password }),
//   register: (data) => {
//     const isFormData = data instanceof FormData;
//     return api.post('/auth/register', data, isFormData ? {
//       headers: { 'Content-Type': 'multipart/form-data' }
//     } : {});
//   },
//   getMe: () => api.get('/auth/me'),
//   getPendingVerifications: () => api.get('/auth/pending-verifications'),
//   verifyUser: (userId) => api.post(`/auth/verify/${userId}`),
// };

// // ============================================
// // Job APIs
// // ============================================
// export const jobAPI = {
//   getAllJobs: (params) => api.get('/jobs', { params }),
//   getJobById: (id) => api.get(`/jobs/${id}`),
//   getMyJobs: () => api.get('/jobs/my-jobs'),
//   createJob: (data) => api.post('/jobs', data),
//   updateJob: (id, data) => api.put(`/jobs/${id}`, data),
//   deleteJob: (id) => api.delete(`/jobs/${id}`),
//   getApplicants: (id) => api.get(`/jobs/${id}/applicants`),
// };

// // ============================================
// // Student APIs
// // ============================================
// export const studentAPI = {
//   getProfile: () => api.get('/students/profile'),
//   updateProfile: (data) => {
//     const isFormData = data instanceof FormData;
//     return api.put('/students/profile', data, isFormData ? {
//       headers: { 'Content-Type': 'multipart/form-data' }
//     } : {});
//   },
//   getRecommendedJobs: () => api.get('/students/recommended-jobs'),
//   getApplications: () => api.get('/students/applications'),
//   applyForJob: (jobId) => api.post(`/students/apply/${jobId}`),
//   getPlacementProbability: () => api.get('/students/placement-probability'),
// };

// // ============================================
// // Company APIs
// // ============================================
// export const companyAPI = {
//   getProfile: () => api.get('/companies/profile'),
//   updateProfile: (data) => api.put('/companies/profile', data),
//   getDashboardStats: () => api.get('/companies/dashboard-stats'),
//   getJobApplicants: (jobId) => api.get(`/companies/jobs/${jobId}/applicants`),
//   updateApplicationStatus: (applicationId, data) => api.put(`/companies/applications/${applicationId}/status`, data),
//   scheduleInterview: (applicationId, data) => api.post(`/companies/applications/${applicationId}/schedule`, data),
// };

// // ============================================
// // Alumni APIs — NEWLY ADDED
// // ============================================
// export const alumniAPI = {
//   getDashboardStats: () => api.get('/alumni/dashboard-stats'),
//   getStudents: (params) => api.get('/alumni/students', { params }),
//   getCompanies: () => api.get('/alumni/companies'),
//   getPendingVerifications: () => api.get('/alumni/pending-verifications'),
//   verifyUser: (userId) => api.post(`/alumni/verify/${userId}`),
//   rejectUser: (userId) => api.delete(`/alumni/reject/${userId}`),
//   broadcast: (data) => api.post('/alumni/broadcast', data),
//   getAnalytics: () => api.get('/alumni/analytics'),
// };

// // ============================================
// // TPO APIs
// // ============================================
// export const tpoAPI = {
//   getProfile: () => api.get('/tpo/profile'),
//   updateProfile: (data) => api.put('/tpo/profile', data),
//   getAnalytics: () => api.get('/tpo/analytics'),
//   getStudents: (params) => api.get('/tpo/students', { params }),
//   getCompanies: (params) => api.get('/tpo/companies', { params }),
//   broadcast: (data) => api.post('/tpo/broadcast', data),
//   getPlacements: () => api.get('/tpo/placements'),
// };

// // ============================================
// // Application APIs
// // ============================================
// export const applicationAPI = {
//   getMyApplications: () => api.get('/applications/my'),
//   updateStatus: (id, status) => api.put(`/applications/${id}/status`, { status }),
// };

// // ============================================
// // Interview APIs
// // ============================================
// export const interviewAPI = {
//   startInterview: (data) => api.post('/interviews/start', data),
//   submitAnswer: (data) => api.post('/interviews/submit-answer', data),
//   completeInterview: (data) => api.post('/interviews/complete', data),
//   getHistory: () => api.get('/interviews/history'),
// };

// // ============================================
// // Notification APIs
// // ============================================
// export const notificationAPI = {
//   getNotifications: () => api.get('/notifications'),
//   markAsRead: (id) => api.put(`/notifications/${id}/read`),
//   markAllAsRead: () => api.put('/notifications/read-all'),
//   deleteNotification: (id) => api.delete(`/notifications/${id}`),
// };

// // ============================================
// // AI APIs
// // ============================================
// export const aiAPI = {
//   parseResume: (data) => api.post('/ai/parse-resume', data),
//   parseResumePDF: (formData) => api.post('/ai/parse-resume-pdf', formData, {
//     headers: {
//       'Content-Type': 'multipart/form-data'
//     }
//   }),
//   getResumeData: () => api.get('/ai/resume-data'),
// };

// // Default export
// export default {
//   auth: authAPI,
//   job: jobAPI,
//   student: studentAPI,
//   company: companyAPI,
//   alumni: alumniAPI,      // ← ADDED
//   tpo: tpoAPI,
//   application: applicationAPI,
//   ai: aiAPI,
//   interview: interviewAPI,
//   notification: notificationAPI
// };

import api from '../api/axios';

// ============================================
// Auth APIs
// ============================================
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (data) => {
    const isFormData = data instanceof FormData;
    return api.post('/auth/register', data, isFormData ? {
      headers: { 'Content-Type': 'multipart/form-data' }
    } : {});
  },
  getMe: () => api.get('/auth/me'),
  getPendingVerifications: () => api.get('/auth/pending-verifications'),
  verifyUser: (userId) => api.post(`/auth/verify/${userId}`),
};

// ============================================
// Job APIs
// ============================================
export const jobAPI = {
  getAllJobs: (params) => api.get('/jobs', { params }),
  getJobById: (id) => api.get(`/jobs/${id}`),
  getMyJobs: () => api.get('/jobs/my-jobs'),
  createJob: (data) => api.post('/jobs', data),
  updateJob: (id, data) => api.put(`/jobs/${id}`, data),
  deleteJob: (id) => api.delete(`/jobs/${id}`),
  getApplicants: (id) => api.get(`/jobs/${id}/applicants`),
};

// ============================================
// Student APIs
// ============================================
export const studentAPI = {
  getProfile: () => api.get('/students/profile'),
  updateProfile: (data) => {
    const isFormData = data instanceof FormData;
    return api.put('/students/profile', data, isFormData ? {
      headers: { 'Content-Type': 'multipart/form-data' }
    } : {});
  },
  getProfileStatus: () => api.get('/students/profile-status'),
  getRecommendedJobs: () => api.get('/students/recommended-jobs'),
  getApplications: () => api.get('/students/applications'),
  applyForJob: (jobId) => api.post(`/students/apply/${jobId}`),
  getPlacementProbability: () => api.get('/students/placement-probability'),
  // NEW: Alumni & Referral APIs
  getAlumniList: () => api.get('/students/alumni'),
  requestReferral: (alumniId, data) => api.post(`/students/referral/${alumniId}`, data),
  getMyReferrals: () => api.get('/students/my-referrals'),
};

// ============================================
// Company APIs
// ============================================
export const companyAPI = {
  getProfile: () => api.get('/companies/profile'),
  updateProfile: (data) => api.put('/companies/profile', data),
  getDashboardStats: () => api.get('/companies/dashboard-stats'),
  getJobApplicants: (jobId) => api.get(`/companies/jobs/${jobId}/applicants`),
  updateApplicationStatus: (applicationId, data) => api.put(`/companies/applications/${applicationId}/status`, data),
  scheduleInterview: (applicationId, data) => api.post(`/companies/applications/${applicationId}/schedule`, data),
};

// ============================================
// Alumni APIs — LIMITED ACCESS
// ============================================
export const alumniAPI = {
  getMyProfile: () => api.get('/alumni/profile'),
  updateMyProfile: (data) => api.put('/alumni/profile', data),
  getReferrals: () => api.get('/alumni/referrals'),
  respondToReferral: (referralId, data) => api.put(`/alumni/referrals/${referralId}`, data),
};

// ============================================
// TPO APIs — FULL CONTROL
// ============================================
export const tpoAPI = {
  getDashboardStats: () => api.get('/tpo/dashboard-stats'),
  getPendingVerifications: () => api.get('/tpo/pending-verifications'),
  verifyUser: (userId) => api.post(`/tpo/verify/${userId}`),
  rejectUser: (userId) => api.delete(`/tpo/reject/${userId}`),
  getProfile: () => api.get('/tpo/profile'),
  updateProfile: (data) => api.put('/tpo/profile', data),
  getAnalytics: () => api.get('/tpo/analytics'),
  getStudents: (params) => api.get('/tpo/students', { params }),
  getCompanies: (params) => api.get('/tpo/companies', { params }),
  getJobs: (params) => api.get('/tpo/jobs', { params }),
  broadcast: (data) => api.post('/tpo/broadcast', data),
  getPlacements: () => api.get('/tpo/placements'),
};

// ============================================
// Application APIs
// ============================================
export const applicationAPI = {
  getMyApplications: () => api.get('/applications/my'),
  updateStatus: (id, status) => api.put(`/applications/${id}/status`, { status }),
};

// ============================================
// Interview APIs
// ============================================
export const interviewAPI = {
  startInterview: (data) => api.post('/interviews/start', data),
  submitAnswer: (data) => api.post('/interviews/submit-answer', data),
  completeInterview: (data) => api.post('/interviews/complete', data),
  getHistory: () => api.get('/interviews/history'),
};

// ============================================
// Notification APIs
// ============================================
export const notificationAPI = {
  getNotifications: () => api.get('/notifications'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  deleteNotification: (id) => api.delete(`/notifications/${id}`),
};

// ============================================
// AI APIs
// ============================================
// ============================================
// AI APIs — NEW (Chat + Interview)
// ============================================
export const aiAPI = {
  parseResume: (data) => api.post('/ai/parse-resume', data),
  parseResumePDF: (formData) => api.post('/ai/parse-resume-pdf', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getResumeData: () => api.get('/ai/resume-data'),
  // NEW: AI Chat
  chat: (message, history = []) => api.post('/ai/chat', { message, history }),
  // NEW: Generate Interview Questions
  generateInterviewQuestions: (role, difficulty, count) => 
    api.post('/ai/generate-interview', { role, difficulty, count }),
  // NEW: Evaluate Answer
  evaluateAnswer: (question, answer, role, difficulty) => 
    api.post('/ai/evaluate-answer', { question, answer, role, difficulty }),
};

// ============================================
// Default export
// ============================================
export default {
  auth: authAPI,
  job: jobAPI,
  student: studentAPI,
  company: companyAPI,
  alumni: alumniAPI,
  tpo: tpoAPI,
  application: applicationAPI,
  interview: interviewAPI,
  notification: notificationAPI,
  ai: aiAPI
};