import Link from 'next/link';
import Image from 'next/image';

interface GameCard {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

const games: GameCard[] = [
  {
    id: 'car-runner',
    title: 'Car Runner',
    description: 'Drive as far as you can while avoiding obstacles. Use arrow keys or touch controls to move left and right.',
    imageUrl: '/games/car-runner/preview.png',
  },
];

export default function GamesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Games</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <Link
            key={game.id}
            href={`/games/${game.id}`}
            className="block bg-gray-800 rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-200"
          >
            <div className="aspect-video bg-gray-700 relative w-full overflow-hidden">
              {game.imageUrl ? (
                <Image
                  src={game.imageUrl}
                  alt={`${game.title} preview`}
                  fill
                  priority
                  unoptimized
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <span className="text-gray-400">Game Preview</span>
                </div>
              )}
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white mb-2">{game.title}</h3>
              <p className="text-gray-400">{game.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 