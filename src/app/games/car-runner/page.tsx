'use client';

import { useEffect, useRef, useState } from 'react';
import { useRecentActivity } from '@/hooks/useRecentActivity';
import { CarRunnerEngine } from '@/games/car-runner/engine';
import { CanvasRenderer } from '@/games/car-runner/renderer';
import { AABBCollisionDetector } from '@/games/car-runner/collision';

export default function CarRunnerPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<CarRunnerEngine | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const { addActivity } = useRecentActivity();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Initialize game
    const renderer = new CanvasRenderer(canvas);
    const collisionDetector = new AABBCollisionDetector();
    
    const engine = new CarRunnerEngine(
      renderer,
      collisionDetector,
      undefined,
      {
        onGameOver: (distance) => {
          setIsGameOver(true);
          setFinalScore(distance);
          addActivity({
            gameId: 'car-runner',
            gameName: 'Car Runner',
            lastPlayed: new Date().toISOString(),
            score: Math.floor(distance),
          });
        },
      }
    );

    engineRef.current = engine;

    // Set up controls
    const controls = engine.getControls();
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!engine.getState().isRunning) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          controls.moveLeft();
          break;
        case 'ArrowRight':
          e.preventDefault();
          controls.moveRight();
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (!engine.getState().isRunning) return;
      
      switch (e.key) {
        case 'ArrowLeft':
        case 'ArrowRight':
          e.preventDefault();
          controls.stopMoving();
          break;
      }
    };

    // Touch controls
    let touchStartX = 0;
    const handleTouchStart = (e: TouchEvent) => {
      if (!engine.getState().isRunning) return;
      e.preventDefault();
      touchStartX = e.touches[0].clientX;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!engine.getState().isRunning) return;
      e.preventDefault();
      
      const touchX = e.touches[0].clientX;
      const diff = touchX - touchStartX;
      
      if (Math.abs(diff) > 30) {
        if (diff > 0) {
          controls.moveRight();
        } else {
          controls.moveLeft();
        }
        touchStartX = touchX;
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!engine.getState().isRunning) return;
      e.preventDefault();
      controls.stopMoving();
    };

    // Add event listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', handleTouchEnd);

    // Focus canvas on mount and click
    canvas.focus();
    canvas.addEventListener('click', () => canvas.focus());

    // Start game
    engine.start();

    // Cleanup only when component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
      engine.destroy();
    };
  }, []); // Only run once on mount

  const handleRestart = () => {
    if (!isGameOver) return;
    setIsGameOver(false);
    setFinalScore(0);
    engineRef.current?.restart();
  };

  const formatDistance = (distance: number) => {
    return distance >= 1000
      ? `${(distance / 1000).toFixed(1)} km`
      : `${Math.floor(distance)} m`;
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex items-center justify-center gap-8 overflow-hidden" style={{ touchAction: 'none' }}>
      {/* Game Section */}
      <div className="relative">
        <h1 className="absolute -top-12 left-0 right-0 text-3xl font-bold text-white text-center">
          Car Runner
        </h1>
        <canvas
          ref={canvasRef}
          className="bg-gray-900 rounded-lg shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          style={{ touchAction: 'none' }}
          tabIndex={0}
        />
        
        {isGameOver && (
          <div className="absolute inset-0 bg-black/70 rounded-lg flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold text-white mb-4">Game Over!</h2>
            <p className="text-xl text-gray-300 mb-6">
              Distance: {formatDistance(finalScore)}
            </p>
            <button
              onClick={handleRestart}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              Play Again
            </button>
          </div>
        )}
      </div>

      {/* Instructions Panel */}
      <div className="bg-gray-800/50 rounded-lg p-6 max-w-xs">
        <h2 className="text-xl font-semibold text-white mb-4">How to Play</h2>
        <div className="space-y-4 text-gray-300">
          <p>
            <span className="font-semibold">Controls:</span><br />
            • Left Arrow: Move left<br />
            • Right Arrow: Move right
          </p>
          <p>
            <span className="font-semibold">Mobile:</span><br />
            Swipe left or right to move
          </p>
          <p>
            <span className="font-semibold">Goal:</span><br />
            Drive as far as you can while avoiding obstacles. Your score is based on the distance traveled.
          </p>
        </div>
      </div>
    </div>
  );
} 