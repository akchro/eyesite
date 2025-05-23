'use client';

import { useState, useEffect } from 'react';
import { useWebGazer } from './webgazerProvider';

export default function LandingScreen({ children }) {
    const [showContent, setShowContent] = useState(false);
    const [twoSecondsElapsed, setTwoSecondsElapsed] = useState(false);
    const { isReady } = useWebGazer();

    useEffect(() => {
        // Set timer for 2 seconds
        const timer = setTimeout(() => {
            setTwoSecondsElapsed(true);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        // Show content only when both conditions are met
        if (twoSecondsElapsed && isReady) {
            setShowContent(true);
        }
    }, [twoSecondsElapsed, isReady]);

    if (!showContent) {
        return (
            <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
                <h1 className="text-6xl font-bold text-gray-800 animate-pulse">
                    Eyesite
                </h1>
            </div>
        );
    }

    return children;
} 