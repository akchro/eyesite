'use client';

import { useState, useEffect } from 'react';
import { useWebGazer } from './webgazerProvider';

export const useGazeHover = (elementRef, threshold = 20) => {
    const [isHovered, setIsHovered] = useState(false);
    const { isReady, addGazeListener } = useWebGazer();

    useEffect(() => {
        if (!isReady || !elementRef.current || !addGazeListener) return;

        const checkGazePosition = (data) => {
            if (!data || !elementRef.current) return;

            const rect = elementRef.current.getBoundingClientRect();
            const { x, y } = data;

            // Check if gaze is within the element bounds with a threshold
            const isWithinBounds = 
                x >= rect.left - threshold &&
                x <= rect.right + threshold &&
                y >= rect.top - threshold &&
                y <= rect.bottom + threshold;

            setIsHovered(isWithinBounds);
        };

        // Add this component's gaze listener
        const removeListener = addGazeListener(checkGazePosition);

        return () => {
            // Clean up this listener
            removeListener();
        };
    }, [isReady, elementRef, threshold, addGazeListener]);

    return isHovered;
}; 