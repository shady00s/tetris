import React from 'react';
import { TETROMINOES } from '../tetrominoes';

const cellStyle = (type) => ({
    width: 'auto',
    // Use rgba for transparency if needed, adjust border for visibility
    background: `rgba(${TETROMINOES[type].color}, 0.8)`,
    border: type === 0 ? '0px solid' : '4px solid',
    borderBottomColor: `rgba(${TETROMINOES[type].color}, 0.1)`,
    borderRightColor: `rgba(${TETROMINOES[type].color}, 1)`,
    borderTopColor: `rgba(${TETROMINOES[type].color}, 1)`,
    borderLeftColor: `rgba(${TETROMINOES[type].color}, 0.3)`,
});


const Cell = ({ type }) => (
    <div style={cellStyle(type)}></div>
);

// Use React.memo to avoid unnecessary re-renders of cells that haven't changed
export default React.memo(Cell);
