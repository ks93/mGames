import {
  GameState,
  GameConfig,
  GameControls,
  GameRenderer,
  CollisionDetector,
  GameEventHandlers,
  Obstacle,
} from './types';

const DEFAULT_CONFIG: GameConfig = {
  lanes: 3,
  laneWidth: 120,
  carSpeed: 300,
  obstacleSpawnRate: 2000,
  minObstacleSpacing: 200,
};

export class CarRunnerEngine {
  private state: GameState;
  private config: GameConfig;
  private renderer: GameRenderer;
  private collisionDetector: CollisionDetector;
  private eventHandlers: GameEventHandlers;
  private lastFrameTime: number = 0;
  private animationFrameId: number | null = null;

  constructor(
    renderer: GameRenderer,
    collisionDetector: CollisionDetector,
    config: Partial<GameConfig> = {},
    eventHandlers: GameEventHandlers = {}
  ) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.renderer = renderer;
    this.collisionDetector = collisionDetector;
    this.eventHandlers = eventHandlers;
    this.state = this.getInitialState();
  }

  private getLaneCenter(lane: number): number {
    return (lane * this.config.laneWidth) + (this.config.laneWidth / 2);
  }

  private getInitialState(): GameState {
    const middleLane = 1; // Lane 1 is the middle lane (0-based index)
    return {
      isRunning: false,
      distance: 0,
      car: {
        position: { x: this.getLaneCenter(middleLane), y: 400 },
        size: { width: 60, height: 100 },
        lane: middleLane,
        isMoving: false,
        moveDirection: null,
      },
      obstacles: [],
      lastObstacleSpawn: 0,
    };
  }

  public getControls(): GameControls {
    return {
      moveLeft: () => {
        if (this.state.car.lane > 0) {
          this.state.car.isMoving = true;
          this.state.car.moveDirection = 'left';
        }
      },
      moveRight: () => {
        if (this.state.car.lane < this.config.lanes - 1) {
          this.state.car.isMoving = true;
          this.state.car.moveDirection = 'right';
        }
      },
      stopMoving: () => {
        this.state.car.isMoving = false;
        this.state.car.moveDirection = null;
      },
    };
  }

  private updateCarPosition(deltaTime: number) {
    const car = this.state.car;

    if (car.isMoving) {
      const moveSpeed = this.config.carSpeed * deltaTime;
      if (car.moveDirection === 'left' && car.lane > 0) {
        const targetX = this.getLaneCenter(car.lane - 1);
        car.position.x = Math.max(targetX, car.position.x - moveSpeed);
        if (car.position.x <= targetX) {
          car.lane = Math.max(0, car.lane - 1);
          car.position.x = targetX;
          car.isMoving = false;
          car.moveDirection = null;
        }
      } else if (car.moveDirection === 'right' && car.lane < this.config.lanes - 1) {
        const targetX = this.getLaneCenter(car.lane + 1);
        car.position.x = Math.min(targetX, car.position.x + moveSpeed);
        if (car.position.x >= targetX) {
          car.lane = Math.min(this.config.lanes - 1, car.lane + 1);
          car.position.x = targetX;
          car.isMoving = false;
          car.moveDirection = null;
        }
      }
    }
  }

  private spawnObstacle() {
    const now = Date.now();
    if (now - this.state.lastObstacleSpawn >= this.config.obstacleSpawnRate) {
      // Ensure there's always a clear path
      const occupiedLanes = new Set(this.state.obstacles.map(o => o.lane));
      const availableLanes = Array.from(
        { length: this.config.lanes },
        (_, i) => i
      ).filter(lane => !occupiedLanes.has(lane));

      if (availableLanes.length > 0) {
        const lane = availableLanes[Math.floor(Math.random() * availableLanes.length)];
        const obstacleTypes: Obstacle['type'][] = ['car', 'rock', 'tree'];
        const type = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];

        this.state.obstacles.push({
          type,
          lane,
          position: { x: this.getLaneCenter(lane), y: -100 },
          size: { width: 60, height: 100 },
        });
        this.state.lastObstacleSpawn = now;
      }
    }
  }

  private updateObstacles(deltaTime: number) {
    const speed = this.config.carSpeed;
    this.state.obstacles = this.state.obstacles.filter(obstacle => {
      obstacle.position.y += speed * deltaTime;
      return obstacle.position.y < 600; // Remove obstacles that are off screen
    });
  }

  private checkCollisions() {
    return this.state.obstacles.some(obstacle =>
      this.collisionDetector.checkCollision(this.state.car, obstacle)
    );
  }

  private updateScore(deltaTime: number) {
    if (!this.state.isRunning) return;
    
    // Convert pixels traveled to meters (arbitrary scale)
    const metersPerPixel = 0.1;
    const distanceIncrement = this.config.carSpeed * deltaTime * metersPerPixel;
    this.state.distance += distanceIncrement;

    if (this.eventHandlers.onScoreUpdate) {
      this.eventHandlers.onScoreUpdate(Math.floor(this.state.distance));
    }
  }

  private gameLoop(timestamp: number) {
    // Cancel any existing animation frame to prevent race conditions
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    if (!this.state.isRunning) {
      // Even when not running, we should still render the current state
      this.renderer.render(this.state);
      return;
    }

    const deltaTime = (timestamp - this.lastFrameTime) / 1000;
    this.lastFrameTime = timestamp;

    // Check for collisions first, before any updates
    const hasCollision = this.checkCollisions();
    
    if (hasCollision) {
      this.state.isRunning = false;
      this.renderer.render(this.state);
      if (this.eventHandlers.onGameOver) {
        this.eventHandlers.onGameOver(Math.floor(this.state.distance));
      }
      return;
    }

    // Only update game state if we haven't collided
    this.updateCarPosition(deltaTime);
    this.updateObstacles(deltaTime);
    this.spawnObstacle();
    this.updateScore(deltaTime);
    
    this.renderer.render(this.state);

    // Only request next frame if we're still running
    if (this.state.isRunning) {
      this.animationFrameId = requestAnimationFrame(this.gameLoop.bind(this));
    }
  }

  public start() {
    if (!this.state.isRunning) {
      this.state.isRunning = true;
      this.lastFrameTime = performance.now();
      this.gameLoop(this.lastFrameTime);
    }
  }

  public pause() {
    if (this.state.isRunning) {
      this.state.isRunning = false;
      if (this.animationFrameId !== null) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
      }
      // Render one more time to ensure the paused state is visible
      this.renderer.render(this.state);
    }
  }

  public resume() {
    if (!this.state.isRunning) {
      this.state.isRunning = true;
      this.lastFrameTime = performance.now();
      this.gameLoop(this.lastFrameTime);
    }
  }

  public restart() {
    // Cancel any existing animation frame
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    // Reset to initial state
    this.state = this.getInitialState();
    
    // Start the game
    this.start();
  }

  public destroy() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.state.isRunning = false;
  }

  public getState(): GameState {
    return this.state;
  }
} 