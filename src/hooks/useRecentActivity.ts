import { useState, useEffect } from 'react';
import type { GameActivity, RecentActivity } from '@/types/activity';

const STORAGE_KEY = 'mGames_recent_activity';
const MAX_ACTIVITIES = 3;

export function useRecentActivity() {
  const [recentActivity, setRecentActivity] = useState<RecentActivity>({ activities: [] });

  useEffect(() => {
    // Load activities from localStorage on mount
    const storedActivity = localStorage.getItem(STORAGE_KEY);
    if (storedActivity) {
      try {
        setRecentActivity(JSON.parse(storedActivity));
      } catch (e) {
        console.error('Failed to parse stored activity:', e);
      }
    }
  }, []);

  const addActivity = (activity: GameActivity) => {
    setRecentActivity(prev => {
      // Remove any existing activity for the same game
      const filteredActivities = prev.activities.filter(a => a.gameId !== activity.gameId);
      
      // Add new activity at the start and limit to MAX_ACTIVITIES
      const newActivities = [activity, ...filteredActivities].slice(0, MAX_ACTIVITIES);
      
      const newActivity = { activities: newActivities };
      
      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newActivity));
      
      return newActivity;
    });
  };

  const formatTimeSpent = (seconds?: number): string => {
    if (!seconds) return '';
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min${minutes !== 1 ? 's' : ''}`;
  };

  const formatLastPlayed = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInHours / 24);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
  };

  return {
    recentActivity,
    addActivity,
    formatTimeSpent,
    formatLastPlayed,
  };
} 