import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, candidatesRes, analyticsRes] = await Promise.all([
          axios.get('http://localhost:8084/api/jobs/'),
          axios.get('http://localhost:8084/api/candidates/'),
          axios.get('http://localhost:8084/api/analytics/')
        ]);
        setJobs(jobsRes.data);
        setCandidates(candidatesRes.data.filter(c => c.shortlisted));
        setAnalytics(analyticsRes.data);
      } catch (err) {
        console.error('Failed to load dashboard ', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Analytics Header */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="metric-card">
          <p className="text-sm text-gray-600">Total Applications</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{analytics?.total_candidates || 0}</p>
        </div>
        <div className="metric-card">
          <p className="text-sm text-gray-600">Shortlisted</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{analytics?.shortlisted || 0}</p>
        </div>
        <div className="metric-card">
          <p className="text-sm text-gray-600">Avg Match Score</p>
          <p className="text-2xl font-bold text-primary-600 mt-1">{analytics?.avg_score?.toFixed(1) || 0}%</p>
        </div>
        <div className="metric-card">
          <p className="text-sm text-gray-600">Active Jobs</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{jobs.length}</p>
        </div>
      </div>

      {/* Jobs Section */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Active Job Postings</h2>
          <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
            {jobs.length} positions
          </span>
        </div>
        
        {jobs.length === 0 ? (
          <div className="text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Jobs Available</h3>
            <p className="text-gray-600">Check back later for new opportunities at Hibret Bank.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map(job => (
              <div key={job.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition">
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                    <p className="text-primary-600 font-medium">{job.department}</p>
                  </div>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    Apply Now
                  </span>
                </div>
                <p className="text-gray-600 mt-3 line-clamp-2">{job.description}</p>
                <div className="mt-4">
                  <p className="font-medium text-gray-900 mb-2">Requirements:</p>
                  <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded">{job.requirements}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Candidates Section */}
      {candidates.length > 0 && (
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Shortlisted Candidates</h2>
          <div className="space-y-4">
            {candidates.map(candidate => (
              <div key={candidate.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition">
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{candidate.name}</h3>
                    <p className="text-gray-600">{candidate.email}</p>
                    <p className="text-sm text-gray-500 mt-1">Applied for: {candidate.job__title}</p>
                  </div>
                  <div className="text-right">
                    <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-medium">
                      {candidate.match_score.toFixed(1)}% Match
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      {Array.isArray(candidate.skills) ? candidate.skills.slice(0, 3).join(', ') : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}