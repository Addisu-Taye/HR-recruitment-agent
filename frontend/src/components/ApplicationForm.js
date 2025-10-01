import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ApplicationForm() {
  const [resumeFile, setResumeFile] = useState(null);
  const [selectedJob, setSelectedJob] = useState('');
  const [jobs, setJobs] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8084/api/jobs/')
      .then(response => setJobs(response.data))
      .catch(err => {
        console.error('Failed to load jobs:', err);
        setError('Failed to load job listings. Please ensure the backend is running.');
      });
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResumeFile(file);
      setFileName(file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resumeFile || !selectedJob) {
      setError('Please select a job and upload a resume');
      return;
    }

    setLoading(true);
    setError('');
    const formData = new FormData();
    formData.append('resume', resumeFile);
    formData.append('job_id', selectedJob);
    formData.append('name', 'Test Candidate');
    formData.append('email', 'test@example.com');

    try {
      const response = await axios.post('http://localhost:8084/api/process-application/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(response.data);
    } catch (err) {
      console.error('Application failed:', err);
      setError('Application processing failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Join Hibret Bank</h2>
        <p className="text-gray-600">Apply for open positions and start your banking career</p>
      </div>

      <div className="card">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Job Selection */}
          <div>
            <label className="form-label">Available Positions</label>
            <select 
              value={selectedJob}
              onChange={(e) => setSelectedJob(e.target.value)}
              className="form-input"
              required
            >
              <option value="">Select a position to apply for</option>
              {jobs.map(job => (
                <option key={job.id} value={job.id}>
                  {job.title} • {job.department} • {job.requirements.substring(0, 50)}...
                </option>
              ))}
            </select>
          </div>

          {/* Resume Upload */}
          <div>
            <label className="form-label">Upload Resume</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-400 transition">
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileChange}
                className="hidden"
                id="resume-upload"
                required
              />
              <label htmlFor="resume-upload" className="cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-lg font-medium text-gray-700 mb-1">
                  {fileName || 'Click to upload your resume'}
                </p>
                <p className="text-sm text-gray-500">PDF, DOC, DOCX, or TXT (Max 5MB)</p>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            disabled={loading}
            className="btn-primary flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing Application...
              </>
            ) : (
              'Submit Application'
            )}
          </button>
        </form>

        {/* Results Display */}
        {result && (
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Application Results</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="metric-card">
                <p className="text-sm text-gray-600">Match Score</p>
                <p className="text-3xl font-bold text-primary-600 mt-1">{result.match_score.toFixed(1)}%</p>
              </div>
              <div className="metric-card">
                <p className="text-sm text-gray-600">Status</p>
                <p className={`text-xl font-bold mt-1 ${result.shortlisted ? 'text-green-600' : 'text-red-600'}`}>
                  {result.shortlisted ? 'Shortlisted' : 'Not Selected'}
                </p>
              </div>
              <div className="metric-card">
                <p className="text-sm text-gray-600">Next Steps</p>
                <p className="text-lg font-medium mt-1">
                  {result.shortlisted ? 'Interview Scheduled' : 'Review Feedback'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card">
                <h4 className="font-bold text-lg text-gray-900 mb-3">Strengths</h4>
                <div className="flex flex-wrap gap-2">
                  {result.strengths.map((skill, index) => (
                    <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="card">
                <h4 className="font-bold text-lg text-gray-900 mb-3">
                  {result.missing_skills.length > 0 ? 'Recommended Skills' : 'Perfect Match!'}
                </h4>
                {result.missing_skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {result.missing_skills.map((skill, index) => (
                      <span key={index} className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-green-600">Your profile matches all requirements!</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}