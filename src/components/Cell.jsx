import React from 'react';
import { TETROMINOES } from '../tetrominoes';

const cellStyle = (type) => {
    const color = TETROMINOES[type].color;
    const borderSize = type === 0 ? '0px' : '1px'; // Smaller border for preview

    return {
        width: 'auto',
        // Use rgba for transparency if needed, adjust border for visibility
        background: `rgba(${color}, 0.8)`,
        border: `${borderSize} solid`,
        borderBottomColor: `rgba(${color}, 0.1)`,
        borderRightColor: `rgba(${color}, 1)`,
        borderTopColor: `rgba(${color}, 1)`,
        borderLeftColor: `rgba(${color}, 0.3)`,
    };
};
    borderTopColor: `rgba(${TETROMINOES[type].color}, 1)`,
    borderLeftColor: `rgba(${TETROMINOES[type].color}, 0.3)`,
});


const Cell = ({ type }) => (
    <div style={cellStyle(type)}></div>
);

// Use React.memo to avoid unnecessary re-renders of cells that haven't changed
export default React.memo(Cell);
