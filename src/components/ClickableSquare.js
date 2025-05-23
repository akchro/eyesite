'use client';

import { useRef, useState } from 'react';
import { useGazeClick } from './useGazeClick';

const ClickableSquare = () => {
    const squareRef = useRef(null);
    const [clickCount, setClickCount] = useState(0);
    const [isFlashing, setIsFlashing] = useState(false);

    const handleGazeClick = ({ gazeX, gazeY }) => {
        console.log(`Gaze click at: ${gazeX}, ${gazeY}`);
        setClickCount(prev => prev + 1);
        
        // Flash effect
        setIsFlashing(true);
        setTimeout(() => {
            setIsFlashing(false);
        }, 300);
    };

    const { isGazeHovered, isClicked } = useGazeClick(squareRef, handleGazeClick);

    const getSquareColor = () => {
        if (isClicked || isFlashing) return 'bg-yellow-400'; // Flash yellow when clicked
        if (isGazeHovered) return 'bg-red-500'; // Red when hovered
        return 'bg-blue-500'; // Default blue
    };

    const getSquareScale = () => {
        if (isClicked) return 'scale-110'; // Slightly larger when clicked
        if (isGazeHovered) return 'scale-105'; // Slightly larger when hovered
        return 'scale-100'; // Normal size
    };

    return (
        <div
            ref={squareRef}
            className={`w-[700px] h-80 border-2 border-gray-400 transition-all duration-200 ${getSquareColor()} ${getSquareScale()}`}
            style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
            }}
        >
            <div className="text-white text-center mt-10 space-y-2">
                <div className="text-lg font-bold">
                    {isClicked ? 'CLICKED!' : isGazeHovered ? 'Press SPACE to click!' : 'Look at me'}
                </div>
                <div className="text-sm">
                    Clicks: {clickCount}
                </div>
                {isGazeHovered && (
                    <div className="text-xs animate-pulse">
                        Press SPACEBAR to click
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClickableSquare; 