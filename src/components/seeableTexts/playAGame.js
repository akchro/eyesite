'use client';

import { useRef, useState, useEffect } from 'react';
import { useGazeClick } from '../useGazeClick';

const PlayAGame = ({ debugMode, gameActive, onGameStart, onGameEnd, onGameProgress }) => {
    const seeableTextRef = useRef(null);
    const [isActive, setIsActive] = useState(false);
    const [clickCount, setClickCount] = useState(0);
    const [position, setPosition] = useState({ top: '50%', left: '10px' });
    const [isMoving, setIsMoving] = useState(false);

    const handleGazeClick = ({ gazeX, gazeY }) => {
        if (!gameActive) {
            // Start the game
            onGameStart();
            moveToRandomPosition();
            return;
        }

        // Flash effect
        setIsActive(true);
        setTimeout(() => {
            setIsActive(false);
        }, 500);

        const newClickCount = clickCount + 1;
        setClickCount(newClickCount);
        onGameProgress(newClickCount);

        if (newClickCount >= 3) {
            // Game finished, return to center
            setTimeout(() => {
                setIsMoving(true);
                setPosition({ top: '50%', left: '10px' });
                setTimeout(() => {
                    setIsMoving(false);
                    setClickCount(0);
                    onGameEnd();
                }, 1000);
            }, 500);
        } else {
            // Move to next random position
            setTimeout(() => {
                moveToRandomPosition();
            }, 500);
        }
    };

    const { isGazeHovered, isClicked } = useGazeClick(seeableTextRef, handleGazeClick);

    const moveToRandomPosition = () => {
        setIsMoving(true);
        
        // Calculate safe bounds to ensure component stays in viewable area
        // Component is 550px wide, 400px tall
        const margin = 50;
        const minTop = margin;
        const maxTop = window.innerHeight - 400 - margin;
        const minLeft = margin;
        const maxLeft = window.innerWidth - 550 - margin;
        
        const randomTop = Math.random() * (maxTop - minTop) + minTop;
        const randomLeft = Math.random() * (maxLeft - minLeft) + minLeft;
        
        setPosition({ 
            top: `${randomTop}px`, 
            left: `${randomLeft}px` 
        });
        
        setTimeout(() => {
            setIsMoving(false);
        }, 1000);
    };

    const getTextGlow = () => {
        if (isGazeHovered) {
            return {
                textShadow: '0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(255, 255, 255, 0.4), 0 0 60px rgba(255, 255, 255, 0.2)'
            };
        }
        return {};
    };

    const getText = () => {
        if (!gameActive) {
            return "Let's play a game";
        }
        if (isActive) {
            return 'Good!';
        }
        if (clickCount === 0) {
            return 'Click me!';
        }
        if (clickCount === 3) {
            return "Incredible."
        }
        return `${3 - clickCount} more!`;
    };

    return (
        <div
            ref={seeableTextRef}
            className={`w-[550px] h-[400px] ${debugMode ? 'border-2' : ''} transition-all duration-1000 ease-in-out ${
                isMoving ? 'scale-95' : 'scale-100'
            }`}
            style={{
                position: 'absolute',
                top: position.top,
                left: position.left,

                zIndex: gameActive ? 60 : 10,
            }}
        >
            <div className={`text-white text-center h-full flex justify-center 
            items-center mt-10 space-y-2 transition-all duration-500 ${isGazeHovered ? 'scale-110' : 'scale-100'}`}>
                <div
                    className="text-8xl font-cor-gar transition-all duration-300"
                    style={getTextGlow()}
                >
                    {getText()}
                </div>
            </div>
        </div>
    );
};

export default PlayAGame;