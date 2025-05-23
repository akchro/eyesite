'use client';

import { useRef } from 'react';
import { useGazeHover } from './useGazeHover';

const Square = () => {
    const squareRef = useRef(null);
    const isGazeHovered = useGazeHover(squareRef);

    return (
        <div
            ref={squareRef}
            className={`w-[500px] h-80 border-2 border-gray-400 transition-colors duration-300 ${
                isGazeHovered ? 'bg-red-500' : 'bg-blue-500'
            }`}
            style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
            }}
        >
            <div className="text-white text-center mt-10">
                {isGazeHovered ? 'Looking!' : 'Look at me'}
            </div>
        </div>
    );
};

export default Square; 