import React from 'react';
import Cell from './Cell';

// Styles for the preview grid container
const previewStyle = {
    display: 'grid',
    // Dynamically set grid size based on tetromino shape (max 4x4 assumed)
    gridTemplateRows: `repeat(4, calc(5vw / 4))`, // Smaller cells relative to viewport width
    gridTemplateColumns: `repeat(4, calc(5vw / 4))`,
    gridGap: '1px',
    border: '2px solid #333',
    width: '5vw', // Smaller overall width
    maxWidth: '80px', // Max width to prevent excessive scaling
    maxHeight: '80px',
    background: '#111',
    marginBottom: '20px', // Space below the preview
};

// Styles for the wrapper div containing the label and preview
const wrapperStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center', // Center the preview grid horizontally
    color: '#999',
    fontSize: '0.8rem',
    marginBottom: '20px',
};


const NextPiecePreview = ({ tetromino }) => {
    // Create a 4x4 grid representation for the preview
    const previewGrid = Array.from(Array(4), () => Array(4).fill([0, 'clear']));

    // Overlay the tetromino shape onto the grid
    // Center the piece within the 4x4 grid if possible
    const shape = tetromino.shape;
    const yOffset = Math.floor((4 - shape.length) / 2);
    const xOffset = Math.floor((4 - shape[0].length) / 2);

    shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                const gridY = y + yOffset;
                const gridX = x + xOffset;
                if (gridY >= 0 && gridY < 4 && gridX >= 0 && gridX < 4) {
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
