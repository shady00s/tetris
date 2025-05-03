import { useState, useEffect, useCallback } from 'react';

// Points per line cleared
const linePoints = [40, 100, 300, 1200];

export const useGameStatus = rowsCleared => {
    const [score, setScore] = useState(0);
    const [rows, setRows] = useState(0);
    const [level, setLevel] = useState(0);

    const calcScore = useCallback(() => {
        // We have score
        if (rowsCleared > 0) {
            // This is how original Tetris score is calculated
            setScore(prev => prev + linePoints[rowsCleared - 1] * (level + 1));
            setRows(prev => prev + rowsCleared);
        }
    }, [level, rowsCleared]); // Removed linePoints dependency as it's constant

    useEffect(() => {
        calcScore();
    }, [calcScore, rowsCleared, score]); // Added calcScore dependency

    // Calculate level based on rows cleared
    useEffect(() => {
        // Simple level calculation: increase level every 10 rows
        if (rows > (level + 1) * 10) {
            setLevel(prev => prev + 1);
        }
    }, [rows, level]);


    return [score, setScore, rows, setRows, level, setLevel];
};
