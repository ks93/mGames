export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface GameObject {
  position: Position;
  size: Size;
  sprite?: HTMLImageElement;
}

export interface Car extends GameObject {
  lane: number;  // Current lane index (0, 1, 2)
  isMoving: boolean;
  moveDirection: 'left' | 'right' | null;
}

export interface Obstacle extends GameObject {
  type: 'car' | 'rock' | 'tree';  // Expandable for future obstacle types
  lane: number;
}

export interface GameState {
  isRunning: boolean;
  distance: number;  // In meters
  car: Car;
  obstacles: Obstacle[];
  lastObstacleSpawn: number;  // Timestamp
}

export interface GameConfig {
  lanes: number;  // Number of lanes
  laneWidth: number;
  carSpeed: number;  // Pixels per second
  obstacleSpawnRate: number;  // Milliseconds
  minObstacleSpacing: number;  // Minimum distance between obstacles
}

export interface GameControls {
  moveLeft: () => void;
  moveRight: () => void;
  stopMoving: () => void;
}

export interface GameRenderer {
  render: (state: GameState) => void;
  renderFinal: (state: GameState) => void;
  clear: () => void;
}

export interface CollisionDetector {
  checkCollision: (car: Car, obstacle: Obstacle) => boolean;
}

export interface GameEventHandlers {
  onGameOver?: (distance: number) => void;
  onScoreUpdate?: (distance: number) => void;
} 