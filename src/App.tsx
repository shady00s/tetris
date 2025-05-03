import React, { useState, useRef, useEffect } from 'react';
// Update imports to usx/.ts extensions (though Vite might handle this)
import Board from './components/Board.tsx';
import NextPiecePreview from './components/NextPiecePreview.tsx';

// Custom Hooks
import { usePlayer } from './hooks/usePlayer';
import { useStage } from './hooks/useStage';
import { useInterval } from './hooks/useInterval';
import { useGameStatus } from './hooks/useGameStatus';

// Helpers
import { createStage, checkCollision } from './gameHelpers.ts'; // Ensure this points to .ts
import { StageType } from './types'; // Import StageType if needed elsewhere

// Styles - Add type React.CSSProperties
const appStyle: React.CSSProperties = {
    fontFamily: 'Arial, sans-serif',
    color: '#fff',
    textAlign: 'center', // Center align text elements
};

const gameAreaStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center', // Center game area content
    padding: '40px',
    margin: '0 auto',
    maxWidth: '900px', // Max width for the game area
};

const asideStyle: React.CSSProperties = {
    width: '200px',
    display: 'block',
    padding: '0 20px',
    color: '#999', // Lighter color for stats
    fontSize: '0.8rem',
};

const displayStyle: React.CSSProperties = {
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


// Define the main App component as a React Functional Component
const App: React.FC = () => {
    // Add types to useState hooks
    const [dropTime, setDropTime] = useState<number | null>(null);
    const [gameOver, setGameOver] = useState<boolean>(false);
    const [isPaused, setIsPaused] = useState<boolean>(false); // Add paused state

    // Types are inferred from the custom hooks' return types
    const [player, nextTetromino, updatePlayerPos, resetPlayer, playerRotate] = usePlayer();
    const [stage, setStage, rowsCleared] = useStage(player, resetPlayer);
    const [score, setScore, rows, setRows, level, setLevel] = useGameStatus(rowsCleared);

    // Add type to useRef
    const audioRef = useRef<HTMLAudioElement | null>(null);

    console.log('re-render'); // Helps debugging

    // Effect for audio cleanup on unmount
    useEffect(() => {
        // Store the ref in a variable to use in the cleanup function
        const audio = audioRef.current;
        // Cleanup function to pause audio when component unmounts
        return () => {
            audio?.pause();
        };
    }, []); // Empty dependency array ensures this runs only for mount and unmount

    // Add type for the direction parameter
    const movePlayer = (dir: number): void => {
        // checkCollision needs player and stage types defined or imported
        if (!checkCollision(player, stage, { x: dir, y: 0 })) {
            updatePlayerPos({ x: dir, y: 0, collided: false }); // Ensure collided is passed
        }
    };

    const startGame = (): void => {
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

        // Initialize and start playing music
        if (!audioRef.current) {
            // Initialize on first start if not already done
            audioRef.current = new Audio('/tetris-theme.mp3');
            audioRef.current.loop = true;
        }
        // Reset playback to the beginning and play
        audioRef.current.currentTime = 0;
        // Type assertion for safety, though check is already present
        (audioRef.current as HTMLAudioElement).play().catch(error => console.error("Audio play failed:", error));
    };

    const togglePause = (): void => {
        if (!gameOver) {
            if (isPaused) {
                // Resume
                setDropTime(1000 / (level + 1) + 200); // Restore drop time based on level
                setIsPaused(false);
                // Type assertion for safety
                (audioRef.current as HTMLAudioElement)?.play().catch(error => console.error("Audio resume failed:", error)); // Resume music
            } else {
                // Pause
                setDropTime(null); // Stop the drop interval
                setIsPaused(true);
                audioRef.current?.pause(); // Pause music
            }
        }
    };


    const drop = (): void => {
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

    // Type the event parameter
    const keyUp = (event: React.KeyboardEvent<HTMLDivElement>): void => {
        const { keyCode } = event;
        // Ignore keyup if paused or game over
        if (!gameOver && !isPaused) {
            // Activate the interval again when user releases down arrow.
            if (keyCode === 40) { // Down arrow
                setDropTime(1000 / (level + 1) + 200); // Restore drop time
            }
        }
    };


    const dropPlayer = (): void => {
        // We don't need to run the interval when we use the arrow down to move the tetromino downwards. So deactivate it for a moment.
        setDropTime(null);
        drop();
    };

    // Type the event parameter
    const move = (event: React.KeyboardEvent<HTMLDivElement>): void => {
        // Ignore moves if paused or game over
        if (!gameOver && !isPaused) {
            const { keyCode } = event;
            if (keyCode === 37) { // Left arrow
                event.preventDefault();
                movePlayer(-1);
            } else if (keyCode === 39) { // Right arrow
                event.preventDefault();
                movePlayer(1);
            } else if (keyCode === 40) { // Down arrow
                event.preventDefault();
                dropPlayer();
            } else if (keyCode === 38 || keyCode === 32) { // Up arrow or Spacebar (rotate)
                event.preventDefault();
                // playerRotate expects StageType
                playerRotate(stage, 1);
            }
        }
    };
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
        // Pass typed event handlers
        <div style={appStyle} role="button" tabIndex={0} onKeyDown={move} onKeyUp={keyUp}>
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
