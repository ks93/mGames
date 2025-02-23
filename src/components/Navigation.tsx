'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

const games = {
  'car-runner': 'Car runner',
};

export function Navigation() {
  const pathname = usePathname();
  const gameId = pathname?.split('/').filter(Boolean).slice(-1)[0];
  const gameTitle = gameId && games[gameId as keyof typeof games];

  return (
    <nav className="bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
            <Link href="/" className="flex items-center shrink-0">
              <span className="text-xl sm:text-2xl font-bold text-white">mGames</span>
            </Link>
            {gameTitle && (
              <>
                <span className="text-gray-400 shrink-0">/</span>
                <span className="text-gray-300 text-base sm:text-lg truncate">{gameTitle}</span>
              </>
            )}
          </div>
          <Link href="/games" className="text-gray-300 hover:text-white px-2 sm:px-3 py-2 rounded-md text-sm font-medium">
            Games
          </Link>
        </div>
      </div>
    </nav>
  );
} 