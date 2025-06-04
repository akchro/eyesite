'use client';

import { useRef, useState } from 'react';
import { useGazeClick } from '../useGazeClick';

const BlogButton = ({ debugMode, onBlogClick }) => {
    const seeableTextRef = useRef(null);
    const [isActive, setIsActive] = useState(false);

    const handleGazeClick = ({ gazeX, gazeY }) => {
        // Flash effect
        setIsActive(true);
        setTimeout(() => {
            setIsActive(false);
        }, 1000);

        // Call the blog click handler if provided
        if (onBlogClick) {
            onBlogClick();
        }
    };

    const { isGazeHovered, isClicked } = useGazeClick(seeableTextRef, handleGazeClick);

    const getTextGlow = () => {
        if (isGazeHovered) {
            return {
                textShadow: '0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(255, 255, 255, 0.4), 0 0 60px rgba(255, 255, 255, 0.2)'
            };
        }
        return {};
    };

    return (
        <div
            ref={seeableTextRef}
            className={`w-[550px] h-[400px] ${debugMode ? 'border-2' : ''}`}
            style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
            }}
        >
            <div className={`text-white text-center h-full flex justify-center 
            items-center mt-10 space-y-2 transition-all duration-500 ${isGazeHovered ? 'scale-110' : 'scale-100'}`}>
                <div
                    className="text-8xl font-cor-gar transition-all duration-300"
                    style={getTextGlow()}
                >
                    {isActive ? 'Opening...' : 'Blog'}
                </div>
            </div>
        </div>
    );
};

export default BlogButton;