import { Answer, Question } from '../types/interview';

export class InterviewService {
  static evaluateAnswer(question: Question, answerText: string): Answer['feedback'] & { score: number } {
    // Simulate LLM evaluation logic
    const words = answerText.toLowerCase().split(/\s+/);
    const expectedPoints = question.expectedAnswerPoints;
    
    let score = 0;
    const strengths: string[] = [];
    const improvements: string[] = [];
    const suggestions: string[] = [];

    // Basic scoring logic (in real implementation, this would use LLM)
    expectedPoints.forEach((point, index) => {
      const pointWords = point.toLowerCase().split(/\s+/);
      const hasRelatedContent = pointWords.some(word => 
        words.some(answerWord => answerWord.includes(word) || word.includes(answerWord))
      );
      
      if (hasRelatedContent) {
        score += 2;
        if (index < 2) {
          strengths.push(`Good understanding of ${point.split(' ').slice(0, 3).join(' ')}`);
        }
      } else {
        improvements.push(`Consider elaborating on ${point.split(' ').slice(0, 3).join(' ')}`);
      }
    });

    // Length and structure bonus
    if (answerText.length > 100) score += 1;
    if (answerText.length > 300) score += 1;
    
    // Cap score at 10
    score = Math.min(score, 10);

    // Generate suggestions based on question type
    if (question.type === 'technical') {
      if (score < 6) {
        suggestions.push('Review fundamental concepts in this area');
        suggestions.push('Practice explaining technical concepts clearly');
      }
      if (!answerText.includes('example') && !answerText.includes('for instance')) {
        suggestions.push('Include concrete examples to illustrate your points');
      }
    } else {
      if (!answerText.includes('situation') && !answerText.includes('context')) {
        suggestions.push('Use the STAR method: Situation, Task, Action, Result');
      }
      if (score < 6) {
        suggestions.push('Provide more specific details about your actions and outcomes');
      }
    }

    return { score, strengths, improvements, suggestions };
  }

  static generateFinalSummary(answers: Answer[]): {
    strengths: string[];
    improvements: string[];
    recommendations: string[];
    overallFeedback: string;
  } {
    const allStrengths = answers.flatMap(a => a.feedback.strengths);
    const allImprovements = answers.flatMap(a => a.feedback.improvements);
    const avgScore = answers.reduce((sum, a) => sum + a.score, 0) / answers.length;
    
    const uniqueStrengths = [...new Set(allStrengths)].slice(0, 4);
    const uniqueImprovements = [...new Set(allImprovements)].slice(0, 4);
    
    const recommendations = [];
    if (avgScore < 6) {
      recommendations.push('Practice more technical fundamentals');
      recommendations.push('Work on communication and explanation skills');
    }
    if (avgScore >= 6 && avgScore < 8) {
      recommendations.push('Focus on providing more detailed examples');
      recommendations.push('Practice system design and architecture questions');
    }
    if (avgScore >= 8) {
      recommendations.push('Continue practicing advanced topics');
      recommendations.push('Consider mentoring others to reinforce your knowledge');
    }

    let overallFeedback = '';
    if (avgScore >= 8) {
      overallFeedback = 'Excellent performance! You demonstrate strong technical knowledge and communication skills.';
    } else if (avgScore >= 6) {
      overallFeedback = 'Good performance with room for improvement. Focus on the areas highlighted below.';
    } else {
      overallFeedback = 'There\'s significant room for improvement. Consider additional preparation in the fundamental areas.';
    }

    return {
      strengths: uniqueStrengths,
      improvements: uniqueImprovements,
      recommendations,
      overallFeedback
    };
  }
}