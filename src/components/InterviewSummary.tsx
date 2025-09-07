import React from 'react';
import { InterviewSession } from '../types/interview';
import { Trophy, Target, BookOpen, BarChart3, Clock, User, Download } from 'lucide-react';

interface InterviewSummaryProps {
  session: InterviewSession;
  onRestart: () => void;
}

export function InterviewSummary({ session, onRestart }: InterviewSummaryProps) {
  const duration = session.endTime ? Math.floor((session.endTime - session.startTime) / 60000) : 0;
  const averageScore = session.finalScore || 0;
  
  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600 bg-green-100';
    if (score >= 6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 8) return 'Excellent';
    if (score >= 6) return 'Good';
    if (score >= 4) return 'Fair';
    return 'Needs Improvement';
  };

  const exportSummary = () => {
    const summaryData = {
      candidate: session.user?.name,
      role: session.config.role,
      mode: session.config.mode,
      duration: `${duration} minutes`,
      finalScore: `${averageScore}/10`,
      questions: session.questions.length,
      completed: new Date().toLocaleDateString(),
      summary: session.summary
    };

    const dataStr = JSON.stringify(summaryData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `interview-summary-${session.id}.json`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg mb-4">
            <Trophy className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Interview Complete!</h1>
          <p className="text-gray-600">Here's your comprehensive performance analysis</p>
        </div>

        {/* Overview Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border p-6 text-center">
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${getScoreColor(averageScore)} mb-3`}>
              <BarChart3 className="w-6 h-6" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{averageScore}/10</div>
            <div className="text-sm text-gray-600">Overall Score</div>
            <div className={`text-xs mt-1 px-2 py-1 rounded ${getScoreColor(averageScore)}`}>
              {getScoreLabel(averageScore)}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-3">
              <User className="w-6 h-6" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{session.questions.length}</div>
            <div className="text-sm text-gray-600">Questions</div>
            <div className="text-xs text-blue-600 mt-1">{session.config.mode} interview</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 mb-3">
              <Clock className="w-6 h-6" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{duration}</div>
            <div className="text-sm text-gray-600">Minutes</div>
            <div className="text-xs text-indigo-600 mt-1">Total duration</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 mb-3">
              <Target className="w-6 h-6" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{session.answers.length}</div>
            <div className="text-sm text-gray-600">Completed</div>
            <div className="text-xs text-green-600 mt-1">Answers submitted</div>
          </div>
        </div>

        {/* Main Summary */}
        <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Performance Summary</h2>
          
          <div className="prose max-w-none">
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              {session.summary?.overallFeedback}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {session.summary?.strengths && session.summary.strengths.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3" />
                  Key Strengths
                </h3>
                <ul className="space-y-3">
                  {session.summary.strengths.map((strength, index) => (
                    <li key={index} className="text-gray-700 flex items-start">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2.5 mr-3 flex-shrink-0" />
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {session.summary?.improvements && session.summary.improvements.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-orange-800 mb-4 flex items-center">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-3" />
                  Areas for Growth
                </h3>
                <ul className="space-y-3">
                  {session.summary.improvements.map((improvement, index) => (
                    <li key={index} className="text-gray-700 flex items-start">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2.5 mr-3 flex-shrink-0" />
                      {improvement}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Recommendations */}
        {session.summary?.recommendations && session.summary.recommendations.length > 0 && (
          <div className="bg-blue-50 rounded-xl border border-blue-100 p-8 mb-8">
            <h3 className="text-xl font-semibold text-blue-900 mb-4 flex items-center">
              <BookOpen className="w-5 h-5 mr-2" />
              Recommended Next Steps
            </h3>
            <ul className="space-y-3">
              {session.summary.recommendations.map((recommendation, index) => (
                <li key={index} className="text-blue-800 flex items-start">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2.5 mr-3 flex-shrink-0" />
                  {recommendation}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Detailed Question Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Question-by-Question Analysis</h3>
          <div className="space-y-6">
            {session.questions.map((question, index) => {
              const answer = session.answers.find(a => a.questionId === question.id);
              return (
                <div key={question.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm font-medium text-gray-600">Question {index + 1}</span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {question.category}
                        </span>
                      </div>
                      <p className="text-gray-900 font-medium">{question.text}</p>
                    </div>
                    {answer && (
                      <div className={`ml-4 px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(answer.score)}`}>
                        {answer.score}/10
                      </div>
                    )}
                  </div>
                  {answer && answer.feedback.strengths.length > 0 && (
                    <div className="text-sm text-green-700">
                      <strong>Strength:</strong> {answer.feedback.strengths[0]}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={exportSummary}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Summary
          </button>
          <button
            onClick={onRestart}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors flex items-center justify-center"
          >
            Start New Interview
          </button>
        </div>
      </div>
    </div>
  );
}