import { supabase } from '../supabase';
import type { SuggestedReply } from '../../types/chat';

export class AssistantService {
  async suggestReply(userId: string, context: string): Promise<SuggestedReply[]> {
    // Get user's chat history for context
    const { data: history } = await supabase
      .from('chat_messages')
      .select('content')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    const suggestions = this.generateSuggestions(context, history ?? []);
    return suggestions;
  }

  async checkSpecialDates(userId: string): Promise<string[]> {
    const { data: dates } = await supabase
      .from('special_dates')
      .select('*')
      .eq('user_id', userId);

    const today = new Date();
    return this.findUpcomingEvents(dates ?? [], today);
  }

  private generateSuggestions(
    context: string,
    history: { content: string }[] = []
  ): SuggestedReply[] {
    // Simple rule-based suggestions for demo
    const suggestions: SuggestedReply[] = [];
    
    if (context.includes('miss you')) {
      suggestions.push({
        text: 'I miss you too! ❤️',
        type: 'emotional'
      });
    }

    if (context.includes('dinner')) {
      suggestions.push({
        text: 'Sure, what time works for you?',
        type: 'planning'
      });
    }

    return suggestions;
  }

  private findUpcomingEvents(dates: any[], today: Date): string[] {
    const reminders: string[] = [];
    const oneWeek = 7 * 24 * 60 * 60 * 1000;

    dates?.forEach(date => {
      const eventDate = new Date(date.date);
      const timeDiff = eventDate.getTime() - today.getTime();

      if (timeDiff > 0 && timeDiff <= oneWeek) {
        reminders.push(
          `Upcoming ${date.type}: ${date.description} on ${eventDate.toLocaleDateString()}`
        );
      }
    });

    return reminders;
  }
}