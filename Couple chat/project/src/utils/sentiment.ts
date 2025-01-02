interface SentimentResult {
  score: number;
  mood: string;
}

export async function analyzeText(text: string): Promise<SentimentResult> {
  // Simple sentiment analysis for demo
  // In production, use a proper NLP service
  const happyWords = ['love', 'happy', 'joy', 'excited', '❤️'];
  const sadWords = ['miss', 'sad', 'sorry', 'worried'];
  
  const words = text.toLowerCase().split(' ');
  let score = 0;

  words.forEach(word => {
    if (happyWords.includes(word)) score += 1;
    if (sadWords.includes(word)) score -= 1;
  });

  return {
    score,
    mood: score > 0 ? 'happy' : score < 0 ? 'sad' : 'neutral'
  };
}