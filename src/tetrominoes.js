import { Tetromino, TetrominoType } from './types'; // Import types

// Define the type for the TETROMINOES constant
// Keys are TetrominoType (letters) or 0, but represented as strings/numbers in JS object keys
// Values are Tetromino objects
export const TETROMINOES: { [key: string]: Tetromino } = {
    '0': { shape: [[0]], color: '0, 0, 0' }, // Represents an empty cell
    I: {
        shape: [
            [0, 'I', 0, 0],
            [0, 'I', 0, 0],
            [0, 'I', 0, 0],
            [0, 'I', 0, 0]
        ],
        color: '80, 227, 230',
    },
    J: {
        shape: [
            [0, 'J', 0],
            [0, 'J', 0],
            ['J', 'J', 0]
        ],
        color: '36, 95, 223',
    },
    L: {
        shape: [
            [0, 'L', 0],
            [0, 'L', 0],
            [0, 'L', 'L']
        ],
        color: '223, 173, 36',
    },
    O: {
        shape: [
            ['O', 'O'],
            ['O', 'O']
        ],
        color: '223, 217, 36',
    },
    S: {
        shape: [
            [0, 'S', 'S'],
            ['S', 'S', 0],
            [0, 0, 0]
        ],
        color: '48, 211, 56',
    },
    T: {
        shape: [
            [0, 0, 0],
            ['T', 'T', 'T'],
            [0, 'T', 0]
        ],
        color: '132, 61, 198',
    },
    Z: {
        shape: [
            ['Z', 'Z', 0],
            [0, 'Z', 'Z'],
            [0, 0, 0]
        ],
        color: '227, 78, 78',
    },
};

// Define the return type as Tetromino
export const randomTetromino = (): Tetromino => {
    const tetrominoes = 'IJLOSTZ';
    const randTetrominoKey =
        tetrominoes[Math.floor(Math.random() * tetrominoes.length)];
    // Ensure the key exists before accessing
    return TETROMINOES[randTetrominoKey];
};
