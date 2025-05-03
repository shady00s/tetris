import React, { useState, useRef, useEffect } from 'react';
import Board from './components/Board';
import NextPiecePreview from './components/NextPiecePreview'; // Import the new component
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
    const [isPaused, setIsPaused] = useState(false); // Add paused state

    // Get nextTetromino from usePlayer hook
    const [player, nextTetromino, updatePlayerPos, resetPlayer, playerRotate] = usePlayer();
    const [stage, setStage, rowsCleared] = useStage(player, resetPlayer);
    const [score, setScore, rows, setRows, level, setLevel] = useGameStatus(rowsCleared);

    const audioRef = useRef(null); // Ref to hold the audio element

    console.log('re-render'); // Helps debugging

    // Effect for audio cleanup on unmount
    useEffect(() => {
        // Initialize audio element on mount if it doesn't exist
        if (!audioRef.current) {
             // Use the path relative to the public folder
            audioRef.current = new Audio('/tetris-theme.mp3');
            audioRef.current.loop = true; // Loop the music
        }
        // Cleanup function to pause audio when component unmounts
        return () => {
            audioRef.current?.pause();
        };
    }, []); // Empty dependency array ensures this runs only once on mount and cleanup on unmount


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
        setIsPaused(false); // Ensure game isn't paused when starting

        // Start playing music
        if (audioRef.current) {
            audioRef.current.currentTime = 0; // Reset playback to the beginning
            audioRef.current.play().catch(error => console.error("Audio play failed:", error));
        }
    };

    const togglePause = () => {
        if (!gameOver) {
            if (isPaused) {
                // Resume
                setDropTime(1000 / (level + 1) + 200); // Restore drop time based on level
                setIsPaused(false);
                audioRef.current?.play().catch(error => console.error("Audio resume failed:", error)); // Resume music
            } else {
                // Pause
                setDropTime(null); // Stop the drop interval
                setIsPaused(true);
                audioRef.current?.pause(); // Pause music
            }
        }
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
            // Game Over!
            if (player.pos.y < 1) {
                console.log("GAME OVER!!!");
                setGameOver(true);
                setDropTime(null);
                audioRef.current?.pause(); // Pause music on game over
            }
            updatePlayerPos({ x: 0, y: 0, collided: true });
        }
    };

    const keyUp = ({ keyCode }) => {
        // Ignore keyup if paused or game over
        if (!gameOver && !isPaused) {
            // Activate the interval again when user releases down arrow.
            if (keyCode === 40) { // Down arrow
                setDropTime(1000 / (level + 1) + 200); // Restore drop time
            }
        }
    };


    const dropPlayer = () => {
        // We don't need to run the interval when we use the arrow down to move the tetromino downwards. So deactivate it for a moment.
        setDropTime(null);
        drop();
    };

    const move = (e) => {
        // Ignore moves if paused or game over
        if (!gameOver && !isPaused) {
            const { keyCode } = e;
            if (keyCode === 37) { // Left arrow
                e.preventDefault();
                movePlayer(-1);
            } else if (keyCode === 39) { // Right arrow
                e.preventDefault();
                movePlayer(1);
            } else if (keyCode === 40) { // Down arrow
                e.preventDefault();
                dropPlayer();
            } else if (keyCode === 38 || keyCode === 32) { // Up arrow or Spacebar (rotate)
                e.preventDefault();
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
                     {/* Render the NextPiecePreview component */}
                    {!gameOver && nextTetromino && <NextPiecePreview tetromino={nextTetromino} />}
                    {gameOver ? (
                        <div style={displayStyle}>Game Over</div>
                    ) : (
                        <div>
                           <div style={displayStyle}>Score: {score}</div>
                            <div style={displayStyle}>Rows: {rows}</div>
                            <div style={displayStyle}>Level: {level}</div>
                        </div>
                    )}
                    {/* Start Button */}
                    <button onClick={startGame} style={{ display: 'block', width: '100%', padding: '10px', marginBottom: '10px', fontSize: '1rem', cursor: 'pointer' }}>Start Game</button>
                    {/* Pause Button */}
                    <button
                        onClick={togglePause}
                        style={{ display: 'block', width: '100%', padding: '10px', fontSize: '1rem', cursor: 'pointer' }}
                        disabled={gameOver || dropTime === null && !isPaused} // Disable if game over or not started
                    >
                        {isPaused ? 'Resume' : 'Pause'}
                    </button>
                </aside>
            </div>
        </div>
    );
}

export default App;
