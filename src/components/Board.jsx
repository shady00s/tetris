import React from 'react';
import Cell from './Cell';

const boardStyle = (height, width) => ({
    display: 'grid',
    gridTemplateRows: `repeat(${height}, calc(25vw / ${width}))`,
    gridTemplateColumns: `repeat(${width}, 1fr)`,
    gridGap: '1px',
    border: '2px solid #333',
    width: '100%',
    maxWidth: '25vw', // Adjust based on desired size relative to viewport width
    background: '#111',
    margin: '0 auto' // Center the board
});


const Board = ({ stage }) => (
    <div style={boardStyle(stage.length, stage[0].length)}>
        {stage.map(row => row.map((cell, x) => <Cell key={x} type={cell[0]} />))}
    </div>
);

export default Board;
