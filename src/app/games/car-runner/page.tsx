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
            gameName: 'Car runner',
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
    const handleTouchStart = (e: TouchEvent) => {
      if (!engine.getState().isRunning) return;
      e.preventDefault();
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!engine.getState().isRunning) return;
      e.preventDefault();
      
      const touch = e.touches[0];
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      // Get touch position relative to canvas
      const rect = canvas.getBoundingClientRect();
      const touchX = touch.clientX - rect.left;
      
      // Scale touch position to match canvas coordinates
      const scaleX = canvas.width / rect.width;
      const canvasX = touchX * scaleX;
      
      // Get current car position
      const car = engine.getState().car;
      const targetX = Math.max(30, Math.min(canvas.width - 30, canvasX));
      
      // Determine direction based on target position
      if (targetX < car.position.x - 5) {
        controls.moveLeft();
      } else if (targetX > car.position.x + 5) {
        controls.moveRight();
      } else {
        controls.stopMoving();
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
    <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 12rem)' }}>
      {/* Game Section */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="bg-gray-900 rounded-lg shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          style={{ touchAction: 'none' }}
          tabIndex={0}
        />
        
        {isGameOver && (
          <div className="absolute inset-0 bg-black/70 rounded-lg flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold text-white mb-4">Game over</h2>
            <p className="text-xl text-gray-300 mb-6">
              Distance: {formatDistance(finalScore)}
            </p>
            <button
              onClick={handleRestart}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              Play again
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 