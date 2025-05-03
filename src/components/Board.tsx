import React from 'react';
import Cell from './Cell'; // Will be Cell.tsx after rename
import { StageType } from '../types'; // Import type

// Define props type for the component
interface BoardProps {
    stage: StageType;
}

// Type the function parameters and return type
const boardStyle = (height: number, width: number): React.CSSProperties => ({
    display: 'grid',
    // Make rows relative to viewport height for better aspect ratio control
    gridTemplateRows: `repeat(${height}, calc(80vh / ${height}))`,
    gridTemplateColumns: `repeat(${width}, 1fr)`,
    gridGap: '1px',
    border: '2px solid #333',
    // Calculate width based on row height to maintain square cells
    width: `calc(80vh / ${height} * ${width})`,
    maxHeight: '80vh', // Limit height
    background: '#111',
    // margin: '0 auto' // Keep centered if needed, but flex layout in App handles it
});

// Use React.FC with props type
const Board: React.FC<BoardProps> = ({ stage }) => (
    <div style={boardStyle(stage.length, stage[0].length)}>
        {stage.map((row, y) => // Add key for row map
            row.map((cell, x) => <Cell key={`${y}-${x}`} type={cell[0]} />) // More robust key for cell
        )}
    </div>
);

export default Board;
