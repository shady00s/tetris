// Represents the type of a tetromino cell (letter or 0 for empty)
export type TetrominoType = 'I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z' | 0;

// Represents the state of a cell on the stage
export type CellState = 'clear' | 'merged' | 'preview';

// Represents the data stored in each cell of the stage grid
export type CellData = [TetrominoType, CellState];

// Represents the game stage grid
export type StageType = CellData[][];

// Represents a Tetromino piece, including its shape and color
export interface Tetromino {
    shape: (TetrominoType | 0)[][]; // Shape can contain 0 or a letter
    color: string;
}

// Represents the player's state
export interface Player {
    pos: { x: number; y: number };
    tetromino: Tetromino;
    collided: boolean;
}
