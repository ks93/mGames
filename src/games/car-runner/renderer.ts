import { GameState, GameRenderer } from './types';

export class CanvasRenderer implements GameRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private roadImage: HTMLImageElement;
  private carImage: HTMLImageElement;
  private obstacleImages: Record<string, HTMLImageElement>;
  private roadOffset: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) throw new Error('Could not get canvas context');
    this.ctx = ctx;

    // Set canvas size
    this.canvas.width = 360;  // 3 lanes * 120 width
    this.canvas.height = 600;

    // Load images with basePath
    const basePath = '/mGames';
    
    this.roadImage = new Image();
    this.roadImage.src = `${basePath}/games/car-runner/road.png`;

    this.carImage = new Image();
    this.carImage.src = `${basePath}/games/car-runner/car.png`;

    this.obstacleImages = {
      car: (() => {
        const img = new Image();
        img.src = `${basePath}/games/car-runner/obstacle-car.png`;
        return img;
      })(),
      rock: (() => {
        const img = new Image();
        img.src = `${basePath}/games/car-runner/rock.png`;
        return img;
      })(),
      tree: (() => {
        const img = new Image();
        img.src = `${basePath}/games/car-runner/tree.png`;
        return img;
      })(),
    };
  }

  private drawRoad(state: GameState) {
    // Only update road offset if game is running
    if (state.isRunning) {
      this.roadOffset = (this.roadOffset + 2) % this.canvas.height;
    }

    // Draw two copies of the road for seamless scrolling
    this.ctx.drawImage(
      this.roadImage,
      0,
      this.roadOffset - this.canvas.height,
      this.canvas.width,
      this.canvas.height
    );
    this.ctx.drawImage(
      this.roadImage,
      0,
      this.roadOffset,
      this.canvas.width,
      this.canvas.height
    );
  }

  private drawCar(state: GameState) {
    const { car } = state;
    this.ctx.drawImage(
      this.carImage,
      car.position.x - car.size.width / 2,
      car.position.y - car.size.height / 2,
      car.size.width,
      car.size.height
    );
  }

  private drawObstacles(state: GameState) {
    state.obstacles.forEach(obstacle => {
      const image = this.obstacleImages[obstacle.type];
      this.ctx.drawImage(
        image,
        obstacle.position.x - obstacle.size.width / 2,
        obstacle.position.y - obstacle.size.height / 2,
        obstacle.size.width,
        obstacle.size.height
      );
    });
  }

  private drawScore(state: GameState) {
    this.ctx.font = '20px Inter';
    this.ctx.fillStyle = 'white';
    this.ctx.textAlign = 'left';
    
    const distance = state.distance;
    const text = distance >= 1000
      ? `${(distance / 1000).toFixed(1)} km`
      : `${Math.floor(distance)} m`;
    
    this.ctx.fillText(text, 10, 30);
  }

  public render(state: GameState) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawRoad(state);
    this.drawObstacles(state);
    this.drawCar(state);
    this.drawScore(state);
  }

  public renderFinal(state: GameState) {
    // Don't clear, just draw on top
    this.drawRoad(state);
    this.drawObstacles(state);
    this.drawCar(state);
    this.drawScore(state);
  }

  public clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
} 