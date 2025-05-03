import React from 'react';
import Cell from './Cell';

const boardStyle = (height, width) => ({
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


const Board = ({ stage }) => (
    <div style={boardStyle(stage.length, stage[0].length)}>
        {stage.map(row => row.map((cell, x) => <Cell key={x} type={cell[0]} />))}
    </div>
);

export default Board;
