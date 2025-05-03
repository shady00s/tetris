import { useState, useCallback } from 'react';

import { TETROMINOES, randomTetromino } from '../tetrominoes';
import { STAGE_WIDTH, checkCollision } from '../gameHelpers';

export const usePlayer = () => {
    const [player, setPlayer] = useState({
        pos: { x: STAGE_WIDTH / 2 - 1, y: 0 }, // Start centered
        tetromino: TETROMINOES[0], // Use the whole object including color
        collided: false,
    });

    const [nextTetromino, setNextTetromino] = useState(randomTetromino());

    const rotate = (matrix, dir) => {
        // Make the rows to become cols (transpose)
        const rotatedTetro = matrix.map((_, index) =>
            matrix.map(col => col[index]),
        );
        // Reverse each row to get a rotated matrix
        if (dir > 0) return rotatedTetro.map(row => row.reverse());
        return rotatedTetro.reverse();
    };

    const playerRotate = (stage, dir) => {
        const clonedPlayer = JSON.parse(JSON.stringify(player));
        // Rotate the shape, not the whole tetromino object
        clonedPlayer.tetromino.shape = rotate(clonedPlayer.tetromino.shape, dir);

        const pos = clonedPlayer.pos.x;
        let offset = 1;
        while (checkCollision(clonedPlayer, stage, { x: 0, y: 0 })) {
            clonedPlayer.pos.x += offset;
            offset = -(offset + (offset > 0 ? 1 : -1));
             // Check offset against the rotated shape's width
            if (offset > clonedPlayer.tetromino.shape[0].length) {
                // Rotate the shape back if collision check fails
                clonedPlayer.tetromino.shape = rotate(clonedPlayer.tetromino.shape, -dir);
                clonedPlayer.pos.x = pos;
                return;
            }
        }

        // Update player state with the rotated shape and new position
        setPlayer(prev => ({
            ...prev,
            tetromino: { ...prev.tetromino, shape: clonedPlayer.tetromino.shape },
            pos: { x: clonedPlayer.pos.x, y: clonedPlayer.pos.y }
        }));
    };

    const updatePlayerPos = ({ x, y, collided }) => {
        setPlayer(prev => ({
            ...prev,
            pos: { x: (prev.pos.x + x), y: (prev.pos.y + y) },
            collided,
        }));
    };

    const resetPlayer = useCallback(() => {
        setPlayer({
            pos: { x: STAGE_WIDTH / 2 - 1, y: 0 }, // Center horizontally
            tetromino: nextTetromino, // Use the previously stored next piece
            collided: false,
        });
        setNextTetromino(randomTetromino()); // Generate a new next piece
    }, [nextTetromino]); // Dependency on nextTetromino

    // Return player, nextTetromino, and the functions
    return [player, nextTetromino, updatePlayerPos, resetPlayer, playerRotate];
};
