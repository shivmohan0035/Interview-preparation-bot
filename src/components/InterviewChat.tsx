import React, { useState } from 'react';
import { Send, RotateCcw, SkipForward, Clock, MessageSquare } from 'lucide-react';
import { InterviewSession, Answer } from '../types/interview';
import { InterviewService } from '../services/interviewService';

interface InterviewChatProps {
  session: InterviewSession;
  onUpdateSession: (session: InterviewSession) => void;
}

export function InterviewChat({ session, onUpdateSession }: InterviewChatProps) {
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = session.questions[session.currentQuestionIndex];
  const currentQuestionAnswer = session.answers.find(a => a.questionId === currentQuestion?.id);
  const progress = ((session.currentQuestionIndex + 1) / session.questions.length) * 100;

  const handleSubmitAnswer = async () => {
    if (!currentAnswer.trim() || !currentQuestion) return;

    setIsSubmitting(true);

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const evaluation = InterviewService.evaluateAnswer(currentQuestion, currentAnswer);
    
    const newAnswer: Answer = {
      questionId: currentQuestion.id,
      text: currentAnswer,
      score: evaluation.score,
      feedback: {
        strengths: evaluation.strengths,
        improvements: evaluation.improvements,
        suggestions: evaluation.suggestions
      },
      timestamp: Date.now()
    };

    const updatedAnswers = session.answers.filter(a => a.questionId !== currentQuestion.id);
    updatedAnswers.push(newAnswer);

    const updatedSession: InterviewSession = {
      ...session,
      answers: updatedAnswers
    };

    onUpdateSession(updatedSession);
    setCurrentAnswer('');
    setIsSubmitting(false);
  };

  const handleNextQuestion = () => {
    if (session.currentQuestionIndex < session.questions.length - 1) {
      onUpdateSession({
        ...session,
        currentQuestionIndex: session.currentQuestionIndex + 1
      });
    } else {
      // Complete interview
      const summary = InterviewService.generateFinalSummary(session.answers);
      const finalScore = Math.round(session.answers.reduce((sum, a) => sum + a.score, 0) / session.answers.length);
      
      onUpdateSession({
        ...session,
        status: 'completed',
        endTime: Date.now(),
        finalScore,
        summary
      });
    }
  };

  const handleRetry = () => {
    const updatedAnswers = session.answers.filter(a => a.questionId !== currentQuestion.id);
    onUpdateSession({
      ...session,
      answers: updatedAnswers
    });
    setCurrentAnswer('');
  };

  if (!currentQuestion) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {session.config.role.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} Interview
              </h1>
              <p className="text-sm text-gray-600">
                Question {session.currentQuestionIndex + 1} of {session.questions.length} • {session.config.mode} mode
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                <Clock className="inline w-4 h-4 mr-1" />
                {Math.floor((Date.now() - session.startTime) / 60000)} min
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-6 py-8">
        <div className="space-y-8">
          {/* Question */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-sm font-medium text-blue-600">Interviewer</span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {currentQuestion.category} • {currentQuestion.difficulty}
                  </span>
                </div>
                <p className="text-gray-900 text-lg leading-relaxed">{currentQuestion.text}</p>
              </div>
            </div>
          </div>

          {/* Answer Input or Feedback */}
          {!currentQuestionAnswer ? (
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Your Answer</label>
                <textarea
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  placeholder="Type your answer here... Be specific and provide examples when possible."
                  className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-colors"
                  disabled={isSubmitting}
                />
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    {currentAnswer.length} characters
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleNextQuestion()}
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <SkipForward className="w-4 h-4 mr-2 inline" />
                      Skip
                    </button>
                    <button
                      onClick={handleSubmitAnswer}
                      disabled={!currentAnswer.trim() || isSubmitting}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                          Evaluating...
                        </div>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2 inline" />
                          Submit Answer
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* User Answer */}
              <div className="bg-blue-50 rounded-xl border border-blue-100 p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {session.user?.name?.[0] || 'U'}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm font-medium text-blue-800">Your Answer</span>
                      <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">
                        Score: {currentQuestionAnswer.score}/10
                      </span>
                    </div>
                    <p className="text-blue-900 leading-relaxed">{currentQuestionAnswer.text}</p>
                  </div>
                </div>
              </div>

              {/* Feedback */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Feedback & Analysis</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {currentQuestionAnswer.feedback.strengths.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-green-800 mb-2">Strengths</h4>
                      <ul className="space-y-1">
                        {currentQuestionAnswer.feedback.strengths.map((strength, index) => (
                          <li key={index} className="text-sm text-green-700 flex items-start">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {currentQuestionAnswer.feedback.improvements.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-orange-800 mb-2">Areas for Improvement</h4>
                      <ul className="space-y-1">
                        {currentQuestionAnswer.feedback.improvements.map((improvement, index) => (
                          <li key={index} className="text-sm text-orange-700 flex items-start">
                            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                            {improvement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {currentQuestionAnswer.feedback.suggestions.length > 0 && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="text-sm font-semibold text-blue-800 mb-2">Suggestions for Next Time</h4>
                    <ul className="space-y-1">
                      {currentQuestionAnswer.feedback.suggestions.map((suggestion, index) => (
                        <li key={index} className="text-sm text-blue-700 flex items-start">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex justify-between mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleRetry}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4 mr-2 inline" />
                    Retry Question
                  </button>
                  <button
                    onClick={handleNextQuestion}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {session.currentQuestionIndex < session.questions.length - 1 ? 'Next Question' : 'Complete Interview'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}