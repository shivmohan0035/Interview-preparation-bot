export interface User {
  name: string;
  role: string;
  domain?: string;
}

export interface InterviewConfig {
  role: string;
  domain?: string;
  mode: 'technical' | 'behavioral';
  questionCount: number;
}

export interface Question {
  id: string;
  text: string;
  type: 'technical' | 'behavioral';
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  expectedAnswerPoints: string[];
}

export interface Answer {
  questionId: string;
  text: string;
  score: number;
  feedback: {
    strengths: string[];
    improvements: string[];
    suggestions: string[];
  };
  timestamp: number;
}

export interface InterviewSession {
  id: string;
  user: User;
  config: InterviewConfig;
  questions: Question[];
  answers: Answer[];
  currentQuestionIndex: number;
  status: 'setup' | 'in-progress' | 'completed';
  startTime: number;
  endTime?: number;
  finalScore?: number;
  summary?: {
    strengths: string[];
    improvements: string[];
    recommendations: string[];
    overallFeedback: string;
  };
}