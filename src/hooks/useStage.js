import { useState, useEffect } from 'react';
import { createStage } from '../gameHelpers';

export const useStage = (player, resetPlayer) => {
    const [stage, setStage] = useState(createStage());
    const [rowsCleared, setRowsCleared] = useState(0);

    useEffect(() => {
        setRowsCleared(0);

        const sweepRows = newStage =>
            newStage.reduce((ack, row) => {
                // Check if the row is full (doesn't contain any 'clear' cells)
                if (row.findIndex(cell => cell[0] === 0) === -1) {
                    setRowsCleared(prev => prev + 1);
                    // Create a new empty row at the top of the stage
                    ack.unshift(new Array(newStage[0].length).fill([0, 'clear']));
                    return ack;
                }
                ack.push(row);
                return ack;
            }, []);


        const updateStage = prevStage => {
            // First flush the stage
            const newStage = prevStage.map(row =>
                row.map(cell => (cell[1] === 'clear' ? [0, 'clear'] : cell)),
            );

            // Then draw the tetromino
            player.tetromino.shape.forEach((row, y) => { // Iterate over shape
                row.forEach((value, x) => {
                    if (value !== 0) {
                        // Check bounds before accessing newStage
                        const targetY = y + player.pos.y;
                        const targetX = x + player.pos.x;
                        if (newStage[targetY] && newStage[targetY][targetX]) {
                            newStage[targetY][targetX] = [
                                player.tetromino.shape[y][x], // Use the actual type from the player's tetromino
                                `${player.collided ? 'merged' : 'clear'}`,
                            ];
                        }
                    }
                });
            });

            // Then check if we collided
            if (player.collided) {
                resetPlayer();
                return sweepRows(newStage);
            }

            return newStage;
        };

        setStage(prev => updateStage(prev));

    // More specific dependencies
    }, [player.collided, player.pos.x, player.pos.y, player.tetromino, resetPlayer]);

    return [stage, setStage, rowsCleared];
};
