const SubmissionResult = ({ submission }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Accepted': return 'text-success-600 bg-success-50 border-success-200';
      case 'Wrong Answer': return 'text-error-600 bg-error-50 border-error-200';
      case 'Time Limit Exceeded': return 'text-warning-600 bg-warning-50 border-warning-200';
      case 'Memory Limit Exceeded': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Runtime Error': return 'text-error-600 bg-error-50 border-error-200';
      case 'Compilation Error': return 'text-error-600 bg-error-50 border-error-200';
      case 'Pending': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Accepted':
        return (
          <svg className="w-5 h-5 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'Wrong Answer':
        return (
          <svg className="w-5 h-5 text-error-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'Runtime Error':
      case 'Compilation Error':
        return (
          <svg className="w-5 h-5 text-error-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'Time Limit Exceeded':
        return (
          <svg className="w-5 h-5 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'Pending':
        return (
          <svg className="w-5 h-5 text-blue-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-card p-6 border border-gray-100">
      <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
        <svg className="w-6 h-6 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 712 2" />
        </svg>
        Submission Result
      </h3>

      <div className="space-y-6">
        {/* Status */}
        <div className="flex items-center justify-between p-4 rounded-lg border bg-gray-50">
          <div className="flex items-center space-x-3">
            {getStatusIcon(submission.status)}
            <div>
              <span className={`px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(submission.status)}`}>
                {submission.status}
              </span>
              {submission.verdict && (
                <p className="text-sm text-gray-600 mt-1">{submission.verdict}</p>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Submission Time</p>
            <p className="text-sm font-semibold text-gray-900">
              {new Date(submission.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium text-blue-800">Execution Time</span>
            </div>
            <p className="text-xl font-bold text-blue-900 mt-1">{submission.executionTime}ms</p>
          </div>

          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium text-green-800">Test Cases</span>
            </div>
            <p className="text-xl font-bold text-green-900 mt-1">
              {submission.testCasesPassed}/{submission.totalTestCases}
            </p>
          </div>

          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
              <span className="text-sm font-medium text-purple-800">Language</span>
            </div>
            <p className="text-xl font-bold text-purple-900 mt-1">{submission.language.toUpperCase()}</p>
          </div>
        </div>

        {/* Output */}
        {submission.output && (
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Output
            </h4>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm font-mono overflow-x-auto border">
              {submission.output}
            </pre>
          </div>
        )}

        {/* Error Message */}
        {submission.errorMessage && (
          <div>
            <h4 className="text-lg font-semibold text-error-700 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2 text-error-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Error Details
            </h4>
            <pre className="bg-error-50 text-error-800 p-4 rounded-lg text-sm font-mono overflow-x-auto border border-error-200">
              {submission.errorMessage}
            </pre>
          </div>
        )}

        {/* Success Message */}
        {submission.status === 'Accepted' && (
          <div className="bg-gradient-to-r from-success-50 to-green-50 border border-success-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <svg className="w-8 h-8 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-success-800">Congratulations!</h4>
                <p className="text-success-700">Your solution has been accepted. Great job!</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmissionResult;
