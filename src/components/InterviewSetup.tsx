import React, { useState } from 'react';
import { User, Settings, Briefcase, Brain, Clock } from 'lucide-react';
import { InterviewConfig } from '../types/interview';
import { roles } from '../data/mockQuestions';

interface InterviewSetupProps {
  onStart: (config: InterviewConfig & { userName: string }) => void;
}

export function InterviewSetup({ onStart }: InterviewSetupProps) {
  const [userName, setUserName] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('');
  const [mode, setMode] = useState<'technical' | 'behavioral'>('technical');
  const [questionCount, setQuestionCount] = useState(3);

  const selectedRoleData = roles.find(r => r.value === selectedRole);

  const handleStart = () => {
    if (!userName || !selectedRole) return;
    
    onStart({
      userName,
      role: selectedRole,
      domain: selectedDomain,
      mode,
      questionCount
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Briefcase className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Interview Simulator</h1>
          <p className="text-gray-600">Practice technical and behavioral interviews with AI-powered feedback</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <User className="inline w-4 h-4 mr-1" />
              Your Name
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Briefcase className="inline w-4 h-4 mr-1" />
              Target Role
            </label>
            <select
              value={selectedRole}
              onChange={(e) => {
                setSelectedRole(e.target.value);
                setSelectedDomain('');
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
              <option value="">Select a role</option>
              {roles.map(role => (
                <option key={role.value} value={role.value}>{role.label}</option>
              ))}
            </select>
          </div>

          {selectedRoleData && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Settings className="inline w-4 h-4 mr-1" />
                Domain (Optional)
              </label>
              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value="">Select a domain</option>
                {selectedRoleData.domains.map(domain => (
                  <option key={domain} value={domain}>
                    {domain.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <Brain className="inline w-4 h-4 mr-1" />
              Interview Type
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setMode('technical')}
                className={`p-4 border-2 rounded-lg transition-colors ${
                  mode === 'technical'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold">Technical</div>
                <div className="text-sm text-gray-600 mt-1">Algorithms, system design, coding</div>
              </button>
              <button
                onClick={() => setMode('behavioral')}
                className={`p-4 border-2 rounded-lg transition-colors ${
                  mode === 'behavioral'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold">Behavioral</div>
                <div className="text-sm text-gray-600 mt-1">STAR format, leadership, teamwork</div>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Clock className="inline w-4 h-4 mr-1" />
              Number of Questions
            </label>
            <select
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
              <option value={3}>3 Questions (15-20 min)</option>
              <option value={5}>5 Questions (25-30 min)</option>
              <option value={7}>7 Questions (35-45 min)</option>
            </select>
          </div>

          <button
            onClick={handleStart}
            disabled={!userName || !selectedRole}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Start Interview
          </button>
        </div>
      </div>
    </div>
  );
}