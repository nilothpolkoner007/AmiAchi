export interface MoodAnalysis {
  score: number;
  mood: string;
}

export interface MoodEntry {
  id: string;
  user_id: string;
  text_sample: string;
  sentiment_score: number;
  mood: string;
  created_at: string;
}