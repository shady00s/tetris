import React from 'react';
import { TETROMINOES } from '../tetrominoes.ts'; // Update extension
import { TetrominoType } from '../types'; // Import type

// Define props type for the component
interface CellProps {
    type: TetrominoType;
}

// Type the function parameter and return type (React.CSSProperties)
const cellStyle = (type: TetrominoType): React.CSSProperties => {
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

// Use React.FC (Functional Component) with props type
const Cell: React.FC<CellProps> = ({ type }) => (
    <div style={cellStyle(type)}></div>
);

// Use React.memo to avoid unnecessary re-renders of cells that haven't changed
export default React.memo(Cell);
