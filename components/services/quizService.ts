import { supabase } from 'api/supabase';

// Re-use these types from profileService.ts in a real app, but define here for completeness
interface SupabaseUser {
  id: string;
  [key: string]: any;
}
export interface Question {
  id: number;
  question: string;
  options: string[];
}
interface SupabaseResponse<T> {
  data: T | null;
  error: {
    code?: string;
    message: string;
    [key: string]: any;
  } | null;
}

interface QuizResult {
  id: string;
  user_id: string;
  score: number;
  assessment: string;
  recommendation: string;
  answers: Record<string, any>;
  created_at: string;
  [key: string]: any; // Additional quiz fields
}

export const quizService = {
  // Save quiz results
  async saveQuizResult(
    score: number,
    assessment: string,
    recommendation: string,
    answers: Record<string, any>,
    quiz_type: string = 'relationship'
  ): Promise<QuizResult> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error('User not found');

    const { data, error } = await supabase
      .from('quizzes')
      .insert({
        user_id: user.id,
        score,
        assessment,
        recommendation,
        answers,
        quiz_type,
      })
      .select();

    if (error) throw error;

    if (!data || data.length === 0) {
      throw new Error('Failed to save quiz result');
    }

    return data[0] as unknown as QuizResult;
  },

  // Get quiz history
  async getQuizHistory(): Promise<QuizResult[]> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error('User not found');

    const { data, error } = await supabase
      .from('quizzes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []) as unknown as QuizResult[];
  },

  // Get latest quiz result
  async getLatestQuizResult(): Promise<QuizResult | null> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error('User not found');

    const { data, error } = await supabase
      .from('quizzes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 means no rows returned, which is fine
      throw error;
    }
    console.log('Latest quiz result:', data);
    return data ? (data as unknown as QuizResult) : null;
  },
  async getRelationshipAssessmentText(score: number): Promise<string> {
    if (score >= 70) {
      return 'Your relationship appears healthy and satisfying. Keep up the great communication and connection!';
    } else if (score >= 50) {
      return 'Your relationship is generally positive but has some areas needing attention. Consider discussing these with your partner.';
    } else if (score >= 30) {
      return 'Your relationship shows significant challenges. You may want to explore targeted strategies or professional guidance.';
    } else {
      return 'Your relationship is in a concerning place. It might be time to seek couples counseling or deeply reassess your needs.';
    }
  },
  async getStayOrLeaveAssessmentText(score: number): Promise<string> {
    if (score >= 75) {
      return 'Your responses suggest a strong, healthy relationship with few concerns. Most of your needs appear to be met.';
    } else if (score >= 50) {
      return 'Your relationship has positive aspects but also significant areas that need attention. Consider discussing these issues with your partner.';
    } else if (score >= 25) {
      return 'Your responses indicate serious concerns about your relationship. It may be helpful to seek professional guidance or counseling.';
    } else {
      return 'Your responses suggest your needs are not being met in this relationship. It might be time for some difficult decisions about your future.';
    }
  },
};
