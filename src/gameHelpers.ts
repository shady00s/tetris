import { Player, StageType, CellData } from './types'; // Import necessary types

export const STAGE_WIDTH: number = 10;
export const STAGE_HEIGHT: number = 20;

// Add return type StageType
export const createStage = (): StageType =>
    Array.from(Array(STAGE_HEIGHT), () =>
        // Ensure the filled value matches CellData type
        new Array(STAGE_WIDTH).fill([0, 'clear'] as CellData)
    );

// Add types for parameters and return value
export const checkCollision = (
    player: Player,
    stage: StageType,
    { x: moveX, y: moveY }: { x: number; y: number }
): boolean => {
    // Use player.tetromino.shape
    for (let y = 0; y < player.tetromino.shape.length; y += 1) {
        for (let x = 0; x < player.tetromino.shape[y].length; x += 1) {
            // 1. Check that we're on an actual Tetromino cell
            if (player.tetromino.shape[y][x] !== 0) {
                // 2. Check that our move is inside the game areas height (y)
                // We shouldn't go through the bottom of the play area
                if (
                    !stage[y + player.pos.y + moveY] ||
                    // 3. Check that our move is inside the game areas width (x)
                    !stage[y + player.pos.y + moveY][x + player.pos.x + moveX] ||
                    // 4. Check that the cell we're moving to isn't set to clear
                    stage[y + player.pos.y + moveY][x + player.pos.x + moveX][1] !== 'clear'
                ) {
                    return true;
                }
            }
        }
    }
    // 5. If everything above is false
    return false;
};
