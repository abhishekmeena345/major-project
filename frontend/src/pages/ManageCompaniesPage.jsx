import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tpoAPI } from '../services/apiService';
import {
  Building2,
  Search,
  ChevronLeft,
  Loader2,
  AlertCircle,
  Filter,
  X,
  Globe,
  Mail,
  Calendar
} from 'lucide-react';

const ManageCompaniesPage = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ search: '' });

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const res = await tpoAPI.getCompanies(filters);
      setCompanies(res.data.data || []);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => fetchCompanies();
  const handleClear = () => {
    setFilters({ search: '' });
    setTimeout(fetchCompanies, 0);
  };

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
            <div className="h-10 w-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <Building2 className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manage Companies</h1>
              <p className="text-gray-600">View and manage registered companies</p>
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
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search companies..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <button onClick={handleFilter} className="btn-primary text-sm py-2 px-4 flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Search
            </button>
            <button onClick={handleClear} className="btn-secondary text-sm py-2 px-4 flex items-center gap-2">
              <X className="h-4 w-4" />
              Clear
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.length === 0 ? (
            <div className="md:col-span-2 lg:col-span-3 card text-center py-12">
              <Building2 className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="text-gray-500">No companies found</p>
            </div>
          ) : (
            companies.map((company) => (
              <div key={company._id} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-purple-600" />
                  </div>
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                    company.userId?.isVerified 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {company.userId?.isVerified ? 'Verified' : 'Pending'}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{company.name}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4">{company.description || 'No description'}</p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span>{company.userId?.email || 'N/A'}</span>
                  </div>
                  {company.website && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Globe className="h-4 w-4" />
                      <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                        Website
                      </a>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>Joined: {new Date(company.userId?.createdAt || company.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageCompaniesPage;