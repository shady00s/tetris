import React, { useState } from 'react';

import Board from './components/Board';
// import Display from './components/Display'; // Placeholder for score/level display
// import StartButton from './components/StartButton'; // Placeholder for start button

// Custom Hooks
import { usePlayer } from './hooks/usePlayer';
import { useStage } from './hooks/useStage';
import { useInterval } from './hooks/useInterval';
import { useGameStatus } from './hooks/useGameStatus';

// Helpers
import { createStage, checkCollision } from './gameHelpers';

// Styles
// Consider creating a styled components file or using CSS modules
const appStyle = {
    fontFamily: 'Arial, sans-serif',
    color: '#fff',
    textAlign: 'center', // Center align text elements
};

const gameAreaStyle = {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center', // Center game area content
    padding: '40px',
    margin: '0 auto',
    maxWidth: '900px', // Max width for the game area
};

const asideStyle = {
    width: '200px',
    display: 'block',
    padding: '0 20px',
    color: '#999', // Lighter color for stats
    fontSize: '0.8rem',
};

const displayStyle = {
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    margin: '0 0 20px 0',
    padding: '20px',
    border: '4px solid #333',
    minHeight: '30px',
    width: '100%',
    borderRadius: '20px',
    color: '#999',
    background: '#000',
    fontFamily: 'Pixel, Arial, Helvetica, sans-serif',
    fontSize: '0.8rem',
};


function App() {
    const [dropTime, setDropTime] = useState(null);
    const [gameOver, setGameOver] = useState(false);

    const [player, updatePlayerPos, resetPlayer, playerRotate] = usePlayer();
    const [stage, setStage, rowsCleared] = useStage(player, resetPlayer);
    const [score, setScore, rows, setRows, level, setLevel] = useGameStatus(rowsCleared);


    console.log('re-render'); // Helps debugging

    const movePlayer = dir => {
        if (!checkCollision(player, stage, { x: dir, y: 0 })) {
            updatePlayerPos({ x: dir, y: 0 });
        }
    };

    const startGame = () => {
        console.log("test")
        // Reset everything
        setStage(createStage());
        setDropTime(1000); // Initial drop time
        resetPlayer();
        setScore(0);
        setRows(0);
        setLevel(0);
        setGameOver(false);
    };

    const drop = () => {
        // Increase level when player has cleared 10 rows
        if (rows > (level + 1) * 10) {
            setLevel(prev => prev + 1);
            // Also increase speed
            setDropTime(1000 / (level + 1) + 200);
        }

        if (!checkCollision(player, stage, { x: 0, y: 1 })) {
            updatePlayerPos({ x: 0, y: 1, collided: false });
        } else {
            // Game Over!
            if (player.pos.y < 1) {
                console.log("GAME OVER!!!");
                setGameOver(true);
                setDropTime(null);
            }
            updatePlayerPos({ x: 0, y: 0, collided: true });
        }
    };

    const keyUp = ({ keyCode }) => {
        if (!gameOver) {
            // Activate the interval again when user releases down arrow.
            if (keyCode === 40) { // Down arrow
                setDropTime(1000 / (level + 1) + 200);
            }
        }
    };


    const dropPlayer = () => {
        // We don't need to run the interval when we use the arrow down to move the tetromino downwards. So deactivate it for a moment.
        setDropTime(null);
        drop();
    };

    const move = ({ keyCode }) => {
        if (!gameOver) {
            if (keyCode === 37) { // Left arrow
                movePlayer(-1);
            } else if (keyCode === 39) { // Right arrow
                movePlayer(1);
            } else if (keyCode === 40) { // Down arrow
                dropPlayer();
            } else if (keyCode === 38) { // Up arrow (rotate)
                playerRotate(stage, 1);
            }
        }
    };

    useInterval(() => {
        drop();
    }, dropTime);


    return (
        // Add role="button" and tabIndex="0" to make the div focusable and accessible for keyboard events
        <div style={appStyle} role="button" tabIndex="0" onKeyDown={e => move(e)} onKeyUp={keyUp}>
            <div style={gameAreaStyle}>
                <Board stage={stage} />
                <aside style={asideStyle}>
                    {gameOver ? (
                        <div style={displayStyle}>Game Over</div>
                    ) : (
                        <div>
                            <div style={displayStyle}>Score: {score}</div>
                            <div style={displayStyle}>Rows: {rows}</div>
                            <div style={displayStyle}>Level: {level}</div>
                        </div>
                    )}
                    {/* Placeholder for StartButton component */}
                    <button onClick={startGame} style={{ padding: '10px', fontSize: '1rem', cursor: 'pointer' }}>Start Game</button>
                </aside>
            </div>
        </div>
    );
}

export default App;
