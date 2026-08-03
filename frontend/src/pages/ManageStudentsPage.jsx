import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tpoAPI } from '../services/apiService';
import {
  Users,
  Search,
  GraduationCap,
  Award,
  ChevronLeft,
  Loader2,
  AlertCircle,
  Filter,
  X
} from 'lucide-react';

const ManageStudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    branch: '',
    minCgpa: '',
    placementStatus: ''
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await tpoAPI.getStudents(filters);
      setStudents(res.data.data || []);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    fetchStudents();
  };

  const handleClear = () => {
    setFilters({ search: '', branch: '', minCgpa: '', placementStatus: '' });
    setTimeout(fetchStudents, 0);
  };

  const branches = ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL'];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-12 w-12 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/tpo/dashboard" className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-primary-600 mb-4">
          <ChevronLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manage Students</h1>
              <p className="text-gray-600">View and filter all registered students</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-4">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Filters */}
        <div className="card mb-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, roll number..."
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            <select
              value={filters.branch}
              onChange={(e) => setFilters({...filters, branch: e.target.value})}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Branches</option>
              {branches.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
            <input
              type="number"
              step="0.1"
              min="0"
              max="10"
              placeholder="Min CGPA"
              value={filters.minCgpa}
              onChange={(e) => setFilters({...filters, minCgpa: e.target.value})}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <select
              value={filters.placementStatus}
              onChange={(e) => setFilters({...filters, placementStatus: e.target.value})}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Status</option>
              <option value="placed">Placed</option>
              <option value="unplaced">Unplaced</option>
            </select>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleFilter} className="btn-primary text-sm py-2 px-4 flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Apply Filters
            </button>
            <button onClick={handleClear} className="btn-secondary text-sm py-2 px-4 flex items-center gap-2">
              <X className="h-4 w-4" />
              Clear
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Student</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Roll No</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Branch</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Year</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">CGPA</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Skills</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-gray-500">
                    <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>No students found</p>
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{student.personalInfo?.name || 'N/A'}</p>
                        <p className="text-sm text-gray-500">{student.userId?.email || student.personalInfo?.email || 'N/A'}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">{student.personalInfo?.rollNumber || 'N/A'}</td>
                    <td className="py-4 px-4">
                      <span className="inline-flex px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        {student.personalInfo?.branch || 'N/A'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">Year {student.personalInfo?.year || 'N/A'}</td>
                    <td className="py-4 px-4">
                      <span className="font-semibold text-gray-900">{student.academics?.cgpa || 'N/A'}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        student.placementStatus === 'placed' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {student.placementStatus === 'placed' ? 'Placed' : 'Unplaced'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1">
                        {student.skills?.slice(0, 3).map((skill, idx) => (
                          <span key={idx} className="inline-flex px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                            {skill}
                          </span>
                        ))}
                        {student.skills?.length > 3 && (
                          <span className="text-xs text-gray-500">+{student.skills.length - 3}</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageStudentsPage;