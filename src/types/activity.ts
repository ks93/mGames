export interface GameActivity {
  gameId: string;
  gameName: string;
  lastPlayed: string; // ISO date string
  score?: number;
  timeSpent?: number; // in seconds
}

export interface RecentActivity {
  activities: GameActivity[];
} 