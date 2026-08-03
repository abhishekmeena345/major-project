import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { aiAPI } from '../services/apiService';
import { 
  Upload, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  TrendingUp,
  GraduationCap,
  Briefcase,
  Code,
  Save,
  RotateCcw,
  FileUp,
  X,
  Eye
} from 'lucide-react';

const ResumeParserPage = () => {
  const [resumeText, setResumeText] = useState('');
  const [parsedData, setParsedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [savedData, setSavedData] = useState(null);
  const [loadingSaved, setLoadingSaved] = useState(true);
  
  // PDF Upload states
  const [uploadMode, setUploadMode] = useState('text'); // 'text' or 'pdf'
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchSavedData();
  }, []);

  const fetchSavedData = async () => {
    try {
      const res = await aiAPI.getResumeData();
      setSavedData(res.data.data);
    } catch (err) {
      console.log('No previous resume data');
    } finally {
      setLoadingSaved(false);
    }
  };

  const handleParse = async (e) => {
    e.preventDefault();
    if (!resumeText.trim() || resumeText.trim().length < 50) {
      setError('Please paste at least 50 characters of resume text');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    setParsedData(null);

    try {
      const res = await aiAPI.parseResume({ resumeText });
      setParsedData(res.data.data);
      setSuccess('Resume parsed successfully! Profile updated with extracted data.');
      fetchSavedData();
    } catch (err) {
      console.error('Parse error:', err);
      setError(err.response?.data?.message || 'Failed to parse resume');
    } finally {
      setLoading(false);
    }
  };

  // PDF Upload Handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file) => {
    if (file.type !== 'application/pdf') {
      setError('Only PDF files are allowed');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }
    setSelectedFile(file);
    setError('');
  };

  const handlePDFUpload = async () => {
    if (!selectedFile) {
      setError('Please select a PDF file first');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    setParsedData(null);

    const formData = new FormData();
    formData.append('resume', selectedFile);

    try {
      const res = await aiAPI.parseResumePDF(formData);
      setParsedData(res.data.data);
      setSuccess(`"${selectedFile.name}" parsed successfully! Profile updated.`);
      setSelectedFile(null);
      fetchSavedData();
    } catch (err) {
      console.error('PDF parse error:', err);
      setError(err.response?.data?.message || 'Failed to parse PDF resume');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setResumeText('');
    setSelectedFile(null);
    setParsedData(null);
    setError('');
    setSuccess('');
  };

  const getSkillColor = (index) => {
    const colors = ['bg-blue-100 text-blue-700', 'bg-green-100 text-green-700', 'bg-purple-100 text-purple-700', 
                    'bg-orange-100 text-orange-700', 'bg-pink-100 text-pink-700', 'bg-teal-100 text-teal-700'];
    return colors[index % colors.length];
  };

  if (loadingSaved) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 bg-primary-100 rounded-xl flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-primary-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">AI Resume Parser</h1>
          </div>
          <p className="text-gray-600">Upload your PDF resume or paste text — AI will extract skills, CGPA, projects, and experience.</p>
        </div>

        {/* Alerts */}
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

        {/* Mode Toggle */}
        <div className="flex gap-2 mb-6 bg-white p-1 rounded-xl border border-gray-200 w-fit">
          <button
            onClick={() => { setUploadMode('text'); setSelectedFile(null); setError(''); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              uploadMode === 'text' 
                ? 'bg-primary-600 text-white shadow-sm' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FileText className="h-4 w-4 inline mr-1" />
            Paste Text
          </button>
          <button
            onClick={() => { setUploadMode('pdf'); setResumeText(''); setError(''); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              uploadMode === 'pdf' 
                ? 'bg-primary-600 text-white shadow-sm' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FileUp className="h-4 w-4 inline mr-1" />
            Upload PDF
          </button>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left: Input Section */}
          <div className="lg:col-span-3 space-y-6">
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  {uploadMode === 'pdf' ? (
                    <>
                      <FileUp className="h-5 w-5 text-primary-600" />
                      Upload Resume PDF
                    </>
                  ) : (
                    <>
                      <FileText className="h-5 w-5 text-primary-600" />
                      Paste Resume Text
                    </>
                  )}
                </h2>
                {(resumeText || selectedFile) && (
                  <button onClick={handleClear} className="text-sm text-gray-500 hover:text-red-600 flex items-center gap-1">
                    <RotateCcw className="h-4 w-4" />
                    Clear
                  </button>
                )}
              </div>

              {/* TEXT INPUT */}
              {uploadMode === 'text' && (
                <form onSubmit={handleParse}>
                  <textarea
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Paste your resume content here...&#10;&#10;Example:&#10;Name: John Doe&#10;Education: B.Tech CSE, CGPA: 8.5&#10;Skills: React, Node.js, Python, MongoDB&#10;Projects: Built a chat app using Socket.io&#10;Experience: Intern at Google..."
                    rows={16}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none font-mono text-sm"
                  />
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-xs text-gray-500">
                      {resumeText.length} characters {resumeText.length < 50 && '(min 50 required)'}
                    </p>
                    <button
                      type="submit"
                      disabled={loading || resumeText.length < 50}
                      className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Parsing with AI...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" />
                          Parse Resume
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* PDF UPLOAD */}
              {uploadMode === 'pdf' && (
                <div className="space-y-4">
                  {/* Dropzone */}
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                      dragActive 
                        ? 'border-primary-500 bg-primary-50' 
                        : 'border-gray-300 hover:border-gray-400 bg-gray-50'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <FileUp className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      {dragActive ? 'Drop PDF here' : 'Click or drag & drop PDF here'}
                    </p>
                    <p className="text-xs text-gray-500">PDF only, max 5MB</p>
                  </div>

                  {/* Selected File Preview */}
                  {selectedFile && (
                    <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                          <p className="text-xs text-gray-500">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedFile(null)}
                        className="h-8 w-8 bg-white hover:bg-red-50 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  {/* Upload Button */}
                  <button
                    onClick={handlePDFUpload}
                    disabled={loading || !selectedFile}
                    className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed py-3"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Extracting & Parsing PDF...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4" />
                        Upload & Parse PDF
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Previously Parsed Data */}
            {savedData?.parsedAt && (
              <div className="card bg-blue-50 border-blue-200">
                <h3 className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Last Parsed
                </h3>
                <p className="text-sm text-blue-700">
                  {new Date(savedData.parsedAt).toLocaleString()}
                </p>
                {savedData.cgpa && (
                  <p className="text-sm text-blue-700 mt-1">
                    CGPA: <span className="font-semibold">{savedData.cgpa}</span>
                  </p>
                )}
                <p className="text-sm text-blue-700 mt-1">
                  Total Skills: <span className="font-semibold">{savedData.skills?.length || 0}</span>
                </p>
              </div>
            )}
          </div>

          {/* Right: Results Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Parsed Results */}
            {parsedData && (
              <div className="space-y-6 animate-fade-in">
                {/* File Info (if PDF) */}
                {parsedData.fileName && (
                  <div className="card bg-purple-50 border-purple-200">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="text-sm font-medium text-purple-900">{parsedData.fileName}</p>
                        <p className="text-xs text-purple-700">PDF parsed successfully</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Skills */}
                {parsedData.extracted?.skills?.length > 0 && (
                  <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Code className="h-5 w-5 text-primary-600" />
                      Extracted Skills ({parsedData.extracted.skills.length})
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {parsedData.extracted.skills.map((skill, idx) => (
                        <span key={idx} className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getSkillColor(idx)}`}>
                          {skill}
                        </span>
                      ))}
                    </div>
                    {parsedData.updatedSkills?.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-sm text-green-600 font-medium flex items-center gap-1">
                          <CheckCircle2 className="h-4 w-4" />
                          {parsedData.updatedSkills.length} new skills added to profile
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* CGPA */}
                {parsedData.extracted?.cgpa && (
                  <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-primary-600" />
                      CGPA Detected
                    </h3>
                    <div className="flex items-center gap-4">
                      <div className="relative h-16 w-16">
                        <svg className="h-16 w-16 transform -rotate-90">
                          <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-gray-200" />
                          <circle 
                            cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent"
                            strokeDasharray={`${2 * Math.PI * 28}`}
                            strokeDashoffset={`${2 * Math.PI * 28 * (1 - parsedData.extracted.cgpa / 10)}`}
                            className="text-primary-600"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-sm font-bold text-primary-700">{parsedData.extracted.cgpa}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Out of 10</p>
                        {parsedData.cgpa && (
                          <p className="text-sm text-green-600 font-medium">Updated in profile</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Projects */}
                {parsedData.extracted?.projects?.length > 0 && (
                  <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-primary-600" />
                      Projects ({parsedData.extracted.projects.length})
                    </h3>
                    <div className="space-y-3">
                      {parsedData.extracted.projects.map((proj, idx) => (
                        <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                          <p className="font-medium text-gray-900 text-sm">{proj.title}</p>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{proj.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Experience */}
                {parsedData.extracted?.experience?.length > 0 && (
                  <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary-600" />
                      Experience ({parsedData.extracted.experience.length})
                    </h3>
                    <div className="space-y-3">
                      {parsedData.extracted.experience.map((exp, idx) => (
                        <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                          <p className="font-medium text-gray-900 text-sm">{exp.role}</p>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education */}
                {parsedData.extracted?.education?.length > 0 && (
                  <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-primary-600" />
                      Education
                    </h3>
                    <div className="space-y-2">
                      {parsedData.extracted.education.map((edu, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-gray-900">{edu.degree}</p>
                            {edu.institution && <p className="text-gray-500 text-xs">{edu.institution}</p>}
                            {edu.year && <p className="text-gray-400 text-xs">{edu.year}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Text Preview (PDF only) */}
                {parsedData.textPreview && (
                  <div className="card bg-gray-50 border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Extracted Text Preview
                    </h3>
                    <p className="text-xs text-gray-500 font-mono whitespace-pre-wrap">{parsedData.textPreview}</p>
                  </div>
                )}
              </div>
            )}

            {/* Empty State */}
            {!parsedData && !loading && (
              <div className="card text-center py-12">
                <Sparkles className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Parse</h3>
                <p className="text-gray-500 text-sm">
                  {uploadMode === 'pdf' 
                    ? 'Upload your PDF resume to see AI magic!' 
                    : 'Paste your resume text on the left and click "Parse Resume" to see AI magic!'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-8">
          <Link to="/student/dashboard" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResumeParserPage;