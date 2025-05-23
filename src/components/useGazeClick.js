'use client';

import { useState, useEffect, useCallback } from 'react';
import { useWebGazer } from './webgazerProvider';

export const useGazeClick = (elementRef, onGazeClick, threshold = 20) => {
    const [isGazeHovered, setIsGazeHovered] = useState(false);
    const [isClicked, setIsClicked] = useState(false);
    const { isReady, addGazeListener, currentGaze } = useWebGazer();

    // Check if gaze is within element bounds
    const checkGazePosition = useCallback((data) => {
        if (!data || !elementRef.current) return;

        const rect = elementRef.current.getBoundingClientRect();
        const { x, y } = data;

        const isWithinBounds = 
            x >= rect.left - threshold &&
            x <= rect.right + threshold &&
            y >= rect.top - threshold &&
            y <= rect.bottom + threshold;

        setIsGazeHovered(isWithinBounds);
    }, [elementRef, threshold]);

    // Handle spacebar press for gaze clicking
    const handleKeyPress = useCallback((event) => {
        if (event.code === 'Space' && isGazeHovered && onGazeClick) {
            event.preventDefault(); // Prevent page scroll
            
            // Simulate click effect
            setIsClicked(true);
            
            // Call the click handler
            onGazeClick({
                gazeX: currentGaze.x,
                gazeY: currentGaze.y,
                element: elementRef.current
            });

            // Reset click state after animation
            setTimeout(() => {
                setIsClicked(false);
            }, 200);
        }
    }, [isGazeHovered, onGazeClick, currentGaze, elementRef]);

    // Set up gaze listener
    useEffect(() => {
        if (!isReady || !elementRef.current || !addGazeListener) return;

        const removeListener = addGazeListener(checkGazePosition);
        return removeListener;
    }, [isReady, elementRef, addGazeListener, checkGazePosition]);

    // Set up keyboard listener
    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [handleKeyPress]);

    return {
        isGazeHovered,
        isClicked
    };
}; 