export interface HighScore {
  score: number;
  date: string;
}

export interface GameHighScores {
  [gameId: string]: HighScore[];
}

const HIGH_SCORES_KEY = 'maxwellGamesHighScores';

export function getHighScores(gameId: string, limit: number = 1): HighScore[] {
  try {
    const storedScores = localStorage.getItem(HIGH_SCORES_KEY);
    if (!storedScores) return [];

    const allScores: GameHighScores = JSON.parse(storedScores);
    return (allScores[gameId] || []).slice(0, limit);
  } catch (error) {
    console.error('Error reading high scores:', error);
    return [];
  }
}

export function updateHighScores(gameId: string, newScore: number, limit: number = 1): boolean {
  try {
    const storedScores = localStorage.getItem(HIGH_SCORES_KEY);
    const allScores: GameHighScores = storedScores ? JSON.parse(storedScores) : {};
    
    // Initialize game scores if they don't exist
    if (!allScores[gameId]) {
      allScores[gameId] = [];
    }

    const scores = allScores[gameId];
    const newHighScore: HighScore = {
      score: newScore,
      date: new Date().toISOString()
    };

    // Check if the new score is a high score
    const isHighScore = scores.length < limit || 
      scores.some(score => newScore > score.score);

    if (isHighScore) {
      // Add new score and sort
      scores.push(newHighScore);
      scores.sort((a, b) => b.score - a.score);
      
      // Keep only the top scores
      allScores[gameId] = scores.slice(0, limit);
      
      // Save back to localStorage
      localStorage.setItem(HIGH_SCORES_KEY, JSON.stringify(allScores));
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error updating high scores:', error);
    return false;
  }
} 