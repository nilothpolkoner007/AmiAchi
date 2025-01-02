import { supabase } from '../supabase';
import { analyzeText } from '../../utils/sentiment';
import type { MoodAnalysis } from '../../types/mood';

export class MoodService {
  async analyzeChatMood(userId: string, text: string): Promise<MoodAnalysis> {
    const sentiment = await analyzeText(text);
    
    const { error } = await supabase
      .from('mood_analysis')
      .insert({
        user_id: userId,
        text_sample: text,
        sentiment_score: sentiment.score,
        mood: sentiment.mood,
        created_at: new Date().toISOString()
      });

    if (error) throw error;
    return sentiment;
  }

  async suggestTheme(userId: string): Promise<string> {
    const { data } = await supabase
      .from('mood_analysis')
      .select('mood')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    const recentMoods = data?.map(d => d.mood) || [];
    return this.getThemeForMoods(recentMoods);
  }

  private getThemeForMoods(moods: string[]): string {
    const moodCount = moods.reduce((acc, mood) => {
      acc[mood] = (acc[mood] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const dominantMood = Object.entries(moodCount)
      .sort(([, a], [, b]) => b - a)[0]?.[0];

    const themeMap: Record<string, string> = {
      happy: 'cheerful',
      romantic: 'love',
      calm: 'serene',
      excited: 'energetic',
      sad: 'comforting'
    };

    return themeMap[dominantMood] || 'default';
  }
}