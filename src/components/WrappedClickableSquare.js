'use client';

import { useState } from 'react';
import GazeClickWrapper from './GazeClickWrapper';

const WrappedClickableSquare = () => {
    const [clickCount, setClickCount] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    const handleGazeClick = ({ gazeX, gazeY }) => {
        console.log(`Wrapped gaze click at: ${gazeX}, ${gazeY}`);
        setClickCount(prev => prev + 1);
    };

    return (
        <GazeClickWrapper
            onGazeClick={handleGazeClick}
            onGazeHover={() => setIsHovered(true)}
            onGazeLeave={() => setIsHovered(false)}
            style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
            }}
        >
            <div
                className={`w-[500px] h-80 border-2 border-gray-400 transition-all duration-300 ${
                    isHovered ? 'bg-red-500' : 'bg-blue-500'
                }`}
            >
                <div className="text-white text-center mt-10 space-y-2">
                    <div className="text-lg font-bold">
                        {isHovered ? 'Press SPACE to click!' : 'Look at me'}
                    </div>
                    <div className="text-sm">
                        Wrapper Clicks: {clickCount}
                    </div>
                    {isHovered && (
                        <div className="spacebar-instruction">
                            SPACEBAR to click
                        </div>
                    )}
                </div>
            </div>
        </GazeClickWrapper>
    );
};

export default WrappedClickableSquare; 