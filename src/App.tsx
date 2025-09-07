import React, { useState } from 'react';
import { InterviewSetup } from './components/InterviewSetup';
import { InterviewChat } from './components/InterviewChat';
import { InterviewSummary } from './components/InterviewSummary';
import { InterviewSession, InterviewConfig } from './types/interview';
import { getQuestions } from './data/mockQuestions';

function App() {
  const [session, setSession] = useState<InterviewSession | null>(null);

  const handleStartInterview = (config: InterviewConfig & { userName: string }) => {
    const questions = getQuestions(config.role, config.mode, config.questionCount);
    
    const newSession: InterviewSession = {
      id: Date.now().toString(),
      user: {
        name: config.userName,
        role: config.role,
        domain: config.domain
      },
      config: {
        role: config.role,
        domain: config.domain,
        mode: config.mode,
        questionCount: config.questionCount
      },
      questions,
      answers: [],
      currentQuestionIndex: 0,
      status: 'in-progress',
      startTime: Date.now()
    };

    setSession(newSession);
  };

  const handleUpdateSession = (updatedSession: InterviewSession) => {
    setSession(updatedSession);
  };

  const handleRestart = () => {
    setSession(null);
  };

  if (!session) {
    return <InterviewSetup onStart={handleStartInterview} />;
  }

  if (session.status === 'completed') {
    return <InterviewSummary session={session} onRestart={handleRestart} />;
  }

  return (
    <InterviewChat 
      session={session} 
      onUpdateSession={handleUpdateSession}
    />
  );
}

export default App;