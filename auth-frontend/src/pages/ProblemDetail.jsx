import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { problemAPI, submissionAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import CodeEditor from '../components/CodeEditor';
import SubmissionResult from '../components/SubmissionResult';
import toast from 'react-hot-toast';

const ProblemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('cpp');
  const [submitting, setSubmitting] = useState(false);
  const [testing, setTesting] = useState(false);
  const [submission, setSubmission] = useState(null);
  const [testResult, setTestResult] = useState(null);
  const [customInput, setCustomInput] = useState('');

  // Default code templates
  const codeTemplates = {
    cpp: `#include <iostream>
#include <vector>
#include <string>
using namespace std;

int main() {
    // Your code here
    
    return 0;
}`,
    java: `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        
        // Your code here
        
        scanner.close();
    }
}`,
    python: `# Your code here
`
  };

  useEffect(() => {
    fetchProblem();
  }, [id]);

  useEffect(() => {
    // Set default code template when language changes
    setCode(codeTemplates[language]);
  }, [language]);

  const fetchProblem = async () => {
    try {
      setLoading(true);
      const response = await problemAPI.getProblem(id);
      setProblem(response.data);
      setCode(codeTemplates[language]);
      // Set default input to sample input
      if (response.data.sampleInput) {
        setCustomInput(response.data.sampleInput);
      }
    } catch (error) {
      toast.error('Failed to fetch problem');
      console.error('Error fetching problem:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error('Please login to submit solutions');
      navigate('/login');
      return;
    }

    if (!code.trim()) {
      toast.error('Please enter your code');
      return;
    }

    try {
      setSubmitting(true);
      const response = await submissionAPI.submitSolution({
        problemId: id,
        code,
        language
      });

      toast.success('Solution submitted! Processing...');
      
      // Poll for submission result
      pollSubmissionResult(response.data.submissionId);
    } catch (error) {
      toast.error('Failed to submit solution');
      console.error('Error submitting solution:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const pollSubmissionResult = async (submissionId) => {
    const maxAttempts = 30; // 30 seconds max
    let attempts = 0;

    const poll = async () => {
      try {
        const response = await submissionAPI.getSubmission(submissionId);
        const submissionData = response.data;

        if (submissionData.status !== 'Pending') {
          setSubmission(submissionData);
          return;
        }

        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 1000); // Poll every second
        } else {
          toast.error('Submission is taking too long. Please check back later.');
        }
      } catch (error) {
        console.error('Error polling submission:', error);
      }
    };

    poll();
  };

  const handleTest = async () => {
    if (!code.trim()) {
      toast.error('Please enter your code');
      return;
    }

    try {
      setTesting(true);
      const response = await submissionAPI.testCode({
        code,
        language,
        input: customInput
      });

      setTestResult(response.data);
    } catch (error) {
      toast.error('Failed to test code');
      console.error('Error testing code:', error);
    } finally {
      setTesting(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-success-600 bg-success-50 border-success-200';
      case 'Medium': return 'text-warning-600 bg-warning-50 border-warning-200';
      case 'Hard': return 'text-error-600 bg-error-50 border-error-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getDifficultyIcon = (difficulty) => {
    const baseClass = "w-4 h-4";
    switch (difficulty) {
      case 'Easy': 
        return <svg className={`${baseClass} text-success-600`} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>;
      case 'Medium':
        return <svg className={`${baseClass} text-warning-600`} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>;
      case 'Hard':
        return <svg className={`${baseClass} text-error-600`} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>;
      default:
        return <svg className={`${baseClass} text-gray-600`} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Accepted': return 'text-success-600 bg-success-50 border-success-200';
      case 'Wrong Answer': return 'text-error-600 bg-error-50 border-error-200';
      case 'Time Limit Exceeded': return 'text-warning-600 bg-warning-50 border-warning-200';
      case 'Runtime Error': return 'text-error-600 bg-error-50 border-error-200';
      case 'Compilation Error': return 'text-error-600 bg-error-50 border-error-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600 mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-gray-600">Loading problem...</p>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Problem not found</h1>
          <p className="text-gray-600">The problem you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/problems')}
            className="mt-6 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Back to Problems
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Problem Description */}
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-card p-6 border border-gray-100">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{problem.title}</h1>
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full border ${getDifficultyColor(problem.difficulty)}`}>
                      {getDifficultyIcon(problem.difficulty)}
                      <span className="ml-2">{problem.difficulty}</span>
                    </span>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      {problem.totalSubmissions > 0
                        ? `${Math.round((problem.acceptedSubmissions / problem.totalSubmissions) * 100)}% accepted`
                        : 'No submissions yet'
                      }
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {problem.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-sm bg-primary-50 text-primary-700 rounded-full border border-primary-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Stats */}
              <div className="flex items-center space-x-6 text-sm text-gray-600 pt-4 border-t border-gray-100">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {problem.acceptedSubmissions} accepted
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 712 2" />
                  </svg>
                  {problem.totalSubmissions} submissions
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl shadow-card p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Problem Description
              </h2>
              <div className="prose max-w-none text-gray-700">
                <pre className="whitespace-pre-wrap font-sans leading-relaxed">{problem.description}</pre>
              </div>
            </div>

            {/* Sample Input/Output */}
            <div className="bg-white rounded-xl shadow-card p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                Sample Input/Output
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">Input:</h3>
                  <pre className="bg-gray-50 border border-gray-200 p-4 rounded-lg text-sm font-mono text-gray-800">{problem.sampleInput}</pre>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">Output:</h3>
                  <pre className="bg-gray-50 border border-gray-200 p-4 rounded-lg text-sm font-mono text-gray-800">{problem.sampleOutput}</pre>
                </div>
              </div>
            </div>

            {/* Constraints */}
            {problem.constraints && (
              <div className="bg-white rounded-xl shadow-card p-6 border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Constraints
                </h2>
                <pre className="whitespace-pre-wrap font-mono text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200">{problem.constraints}</pre>
              </div>
            )}
          </div>

          {/* Code Editor and Submission */}
          <div className="space-y-6">
            {/* Language Selection */}
            <div className="bg-white rounded-xl shadow-card p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  Code Editor
                </h2>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
                  >
                    <option value="cpp">C++</option>
                    <option value="java">Java</option>
                    <option value="python">Python</option>
                  </select>
                </div>
              </div>

              {/* Code Editor */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <CodeEditor
                  value={code}
                  onChange={setCode}
                  language={language}
                  height="400px"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 mt-6">
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center"
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Submit Solution
                    </>
                  )}
                </button>
                <button
                  onClick={handleTest}
                  disabled={testing}
                  className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-gray-700 hover:to-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center"
                >
                  {testing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Testing...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                      Test Code
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Custom Input for Testing */}
            <div className="bg-white rounded-xl shadow-card p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Custom Test Input
              </h3>
              <textarea
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Enter your test input here..."
                className="w-full h-32 border border-gray-300 rounded-lg px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none bg-gray-50"
              />
            </div>

            {/* Test Result */}
            {testResult && (
              <div className="bg-white rounded-xl shadow-card p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Test Result
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg border bg-gray-50">
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(testResult.status)}`}>
                      {testResult.status}
                    </span>
                    <span className="text-sm text-gray-600 font-medium">
                      Execution Time: {testResult.executionTime}ms
                    </span>
                  </div>
                  
                  {testResult.output && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">Output:</h4>
                      <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm font-mono overflow-x-auto">{testResult.output}</pre>
                    </div>
                  )}
                  
                  {testResult.error && (
                    <div>
                      <h4 className="text-sm font-semibold text-error-700 mb-2 uppercase tracking-wider">Error:</h4>
                      <pre className="bg-error-50 p-4 rounded-lg text-sm font-mono text-error-700 border border-error-200 overflow-x-auto">{testResult.error}</pre>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Submission Result */}
            {submission && (
              <SubmissionResult submission={submission} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemDetail;
