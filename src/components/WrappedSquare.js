'use client';

import { useState } from 'react';
import GazeWrapper from './GazeWrapper';

const WrappedSquare = () => {
    const [isGazed, setIsGazed] = useState(false);

    return (
        <GazeWrapper
            onGazeEnter={() => setIsGazed(true)}
            onGazeLeave={() => setIsGazed(false)}
            style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
            }}
        >
            <div
                className={`w-[500px] h-80 border-2 border-gray-400 transition-colors duration-300 ${
                    isGazed ? 'bg-red-500' : 'bg-blue-500'
                }`}
            >
                <div className="text-white text-center mt-10">
                    {isGazed ? 'Looking!' : 'Look at me'}
                </div>
            </div>
        </GazeWrapper>
    );
};

export default WrappedSquare; 