import React from 'react';
import Cell from './Cell'; // Will be Cell.tsx after rename
import { Tetromino, CellData } from '../types'; // Import types

// Define props type for the component
interface NextPiecePreviewProps {
    tetromino: Tetromino;
}

// Type the style objects
const previewStyle: React.CSSProperties = {
    display: 'grid',
    // Increase grid size to 5x5
    gridTemplateRows: `repeat(5, calc(6vw / 5))`, // Adjust cell size calculation
    gridTemplateColumns: `repeat(5, calc(6vw / 5))`,
    gridGap: '1px',
    border: '2px solid #333',
    width: '6vw', // Adjust overall width
    maxWidth: '100px', // Increase max width
    maxHeight: '100px', // Increase max height
    background: '#111',
    marginBottom: '20px', // Space below the preview
};

// Type the style objects
const wrapperStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center', // Center the preview grid horizontally
    color: '#999',
    fontSize: '0.8rem',
    marginBottom: '20px',
};


const NextPiecePreview = ({ tetromino }) => {
    // Create a 5x5 grid representation for the preview
    const previewGrid = Array.from(Array(5), () => Array(5).fill([0, 'clear']));

    // Overlay the tetromino shape onto the grid
    // Center the piece within the 5x5 grid
    const shape = tetromino.shape;
    const yOffset = Math.floor((5 - shape.length) / 2); // Center in 5 rows
    const xOffset = Math.floor((5 - shape[0].length) / 2); // Center in 5 columns

    shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                const gridY = y + yOffset;
                const gridX = x + xOffset;
                // Check bounds against the 5x5 grid
                if (gridY >= 0 && gridY < 5 && gridX >= 0 && gridX < 5) {
                     previewGrid[gridY][gridX] = [value, 'preview']; // Use 'preview' state? Or just value
                }
            }
        });
    });


    return (
        <div style={wrapperStyle}>
            <span>Next:</span>
            <div style={previewStyle}>
                {previewGrid.map((row, y) =>
                    row.map((cell, x) => <Cell key={`${y}-${x}`} type={cell[0]} />)
                )}
            </div>
        </div>
    );
};

export default React.memo(NextPiecePreview); // Memoize if tetromino prop doesn't change often unnecessarily
