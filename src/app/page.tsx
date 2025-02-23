'use client';

import { useRecentActivity } from '@/hooks/useRecentActivity';
import Link from 'next/link';

export default function Home() {
  const { recentActivity, formatLastPlayed, formatTimeSpent } = useRecentActivity();

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-16 px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
          Welcome to <span className="text-blue-400">mGames</span>
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
          Your destination for fun and engaging browser-based games. 
          Challenge yourself, beat high scores, and have fun!
        </p>
        <Link 
          href="/games" 
          className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          Browse Games
        </Link>
      </section>

      {/* Recent Activity Section */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-6">Recent Activity</h2>
        {recentActivity.activities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentActivity.activities.map((activity) => (
              <div key={activity.gameId} className="bg-gray-800 rounded-lg p-6 transform hover:scale-105 transition-transform duration-200">
                <h3 className="text-xl font-semibold text-white mb-3">{activity.gameName}</h3>
                <div className="space-y-2 text-gray-400">
                  <p>Last played: {formatLastPlayed(activity.lastPlayed)}</p>
                  {activity.score !== undefined && (
                    <p>Score: {activity.score}</p>
                  )}
                  {activity.timeSpent !== undefined && (
                    <p>Time spent: {formatTimeSpent(activity.timeSpent)}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <p className="text-gray-400 mb-4">No recent game activity</p>
            <Link 
              href="/games" 
              className="text-blue-400 hover:text-blue-300 font-medium"
            >
              Start playing games →
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
