import { Question } from '../types/interview';

export const mockQuestions: Record<string, Question[]> = {
  'software-engineer-technical': [
    {
      id: 'se-tech-1',
      text: 'Explain the difference between a stack and a queue. When would you use each data structure?',
      type: 'technical',
      category: 'Data Structures',
      difficulty: 'medium',
      expectedAnswerPoints: [
        'Stack follows LIFO (Last In First Out) principle',
        'Queue follows FIFO (First In First Out) principle',
        'Stack use cases: function calls, undo operations, expression evaluation',
        'Queue use cases: task scheduling, breadth-first search, buffering'
      ]
    },
    {
      id: 'se-tech-2',
      text: 'Design a simple URL shortener like bit.ly. What are the key components and how would you handle scale?',
      type: 'technical',
      category: 'System Design',
      difficulty: 'hard',
      expectedAnswerPoints: [
        'URL encoding/decoding service',
        'Database design with mapping table',
        'Caching layer for popular URLs',
        'Load balancing and horizontal scaling',
        'Analytics and rate limiting'
      ]
    },
    {
      id: 'se-tech-3',
      text: 'Write a function to find the longest palindromic substring in a given string.',
      type: 'technical',
      category: 'Algorithms',
      difficulty: 'medium',
      expectedAnswerPoints: [
        'Consider dynamic programming approach',
        'Expand around centers method',
        'Handle edge cases (empty string, single character)',
        'Time complexity analysis',
        'Space optimization considerations'
      ]
    }
  ],
  'software-engineer-behavioral': [
    {
      id: 'se-beh-1',
      text: 'Tell me about a time when you had to work with a difficult team member. How did you handle the situation?',
      type: 'behavioral',
      category: 'Teamwork',
      difficulty: 'medium',
      expectedAnswerPoints: [
        'Clear situation description',
        'Specific actions taken',
        'Focus on communication and conflict resolution',
        'Measurable positive outcome',
        'Learning or growth from experience'
      ]
    },
    {
      id: 'se-beh-2',
      text: 'Describe a project where you had to learn a new technology quickly. What was your approach?',
      type: 'behavioral',
      category: 'Learning & Adaptability',
      difficulty: 'medium',
      expectedAnswerPoints: [
        'Specific technology and context',
        'Structured learning approach',
        'Resource utilization',
        'Application of new knowledge',
        'Impact on project success'
      ]
    }
  ],
  'product-manager-technical': [
    {
      id: 'pm-tech-1',
      text: 'How would you prioritize features for a new mobile app? Walk me through your framework.',
      type: 'technical',
      category: 'Product Strategy',
      difficulty: 'medium',
      expectedAnswerPoints: [
        'User impact and business value assessment',
        'Resource requirement evaluation',
        'Risk analysis and dependencies',
        'Data-driven decision making',
        'Stakeholder alignment process'
      ]
    }
  ],
  'product-manager-behavioral': [
    {
      id: 'pm-beh-1',
      text: 'Tell me about a time when you had to make a difficult product decision with limited data.',
      type: 'behavioral',
      category: 'Decision Making',
      difficulty: 'hard',
      expectedAnswerPoints: [
        'Clear context and constraints',
        'Decision-making process',
        'Stakeholder management',
        'Outcome measurement',
        'Lessons learned'
      ]
    }
  ]
};

export const roles = [
  { value: 'software-engineer', label: 'Software Engineer', domains: ['frontend', 'backend', 'fullstack', 'mobile', 'devops'] },
  { value: 'product-manager', label: 'Product Manager', domains: ['growth', 'platform', 'consumer', 'b2b'] },
  { value: 'data-analyst', label: 'Data Analyst', domains: ['business-intelligence', 'marketing', 'finance', 'operations'] },
  { value: 'data-scientist', label: 'Data Scientist', domains: ['machine-learning', 'nlp', 'computer-vision', 'recommendations'] },
  { value: 'ui-ux-designer', label: 'UI/UX Designer', domains: ['web', 'mobile', 'enterprise', 'consumer'] }
];

export function getQuestions(role: string, mode: 'technical' | 'behavioral', count: number = 3): Question[] {
  const key = `${role}-${mode}`;
  const available = mockQuestions[key] || [];
  return available.slice(0, count);
}