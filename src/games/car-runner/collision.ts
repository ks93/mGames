import { Car, Obstacle, CollisionDetector } from './types';

export class AABBCollisionDetector implements CollisionDetector {
  public checkCollision(car: Car, obstacle: Obstacle): boolean {
    // Use smaller collision bounds (70% of actual size) for more forgiving gameplay
    const collisionScale = 0.7;
    
    const carHalfWidth = (car.size.width * collisionScale) / 2;
    const carHalfHeight = (car.size.height * collisionScale) / 2;
    const obstacleHalfWidth = (obstacle.size.width * collisionScale) / 2;
    const obstacleHalfHeight = (obstacle.size.height * collisionScale) / 2;

    // Calculate the bounds for both objects with reduced size
    const carBounds = {
      left: car.position.x - carHalfWidth,
      right: car.position.x + carHalfWidth,
      top: car.position.y - carHalfHeight,
      bottom: car.position.y + carHalfHeight,
    };

    const obstacleBounds = {
      left: obstacle.position.x - obstacleHalfWidth,
      right: obstacle.position.x + obstacleHalfWidth,
      top: obstacle.position.y - obstacleHalfHeight,
      bottom: obstacle.position.y + obstacleHalfHeight,
    };

    // Check for overlap in both x and y axes
    return !(
      carBounds.right < obstacleBounds.left ||
      carBounds.left > obstacleBounds.right ||
      carBounds.bottom < obstacleBounds.top ||
      carBounds.top > obstacleBounds.bottom
    );
  }
} 