'use client';

import { useWebGazer } from "@/components/webgazerProvider";
import { useState, useEffect, useCallback } from 'react';

export default function Calibrate({calibrationComplete, setCalibrationComplete, calibrationPoints, setCalibrationPoints}) {
    const { calibrateAt, isReady } = useWebGazer();
    
    // Calibration state
    const [currentPointIndex, setCurrentPointIndex] = useState(0);
    const [pressCount, setPressCount] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    
    // Introduction sequence state
    const [introStep, setIntroStep] = useState(0);
    const [showCalibration, setShowCalibration] = useState(false);
    const [encouragementMessage, setEncouragementMessage] = useState('');
    const [showEncouragement, setShowEncouragement] = useState(false);
    const [usedEncouragements, setUsedEncouragements] = useState([]);
    const [introFadingOut, setIntroFadingOut] = useState(false);
    const [calibrationFadingIn, setCalibrationFadingIn] = useState(false);
    const [calibrationFadingOut, setCalibrationFadingOut] = useState(false);

    // Introduction messages
    const introMessages = [
        "Hello",
        "Let's calibrate",
        "Try not to blink",
        "Look at the point. Press spacebar to calibrate"
    ];

    // Encouraging messages
    const encouragingWords = [
        "Amazing.", "Incredible.", "Wonderful.", "Perfect.", "Excellent.", 
        "Outstanding.", "Brilliant.", "Fantastic.", "Superb.", "Magnificent."
    ];

    // Define calibration points in order
    const calibrationSequence = [
        { id: 'Pt1', position: { top: '70px', left: '2vw' } },
        { id: 'Pt2', position: { top: '70px', left: '50%', transform: 'translateX(-50%)' } },
        { id: 'Pt3', position: { top: '70px', right: '2vw' } },
        { id: 'Pt4', position: { top: '50%', left: '2vw', transform: 'translateY(-50%)' } },
        { id: 'Pt6', position: { top: '50%', right: '2vw', transform: 'translateY(-50%)' } },
        { id: 'Pt7', position: { bottom: '2vw', left: '2vw' } },
        { id: 'Pt8', position: { bottom: '2vw', left: '50%', transform: 'translateX(-50%)' } },
        { id: 'Pt9', position: { bottom: '2vw', right: '2vw' } },
        { id: 'Pt5', position: { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' } }, // Center point last
    ];

    const currentPoint = calibrationSequence[currentPointIndex];

    // Introduction sequence effect
    useEffect(() => {
        if (!isReady) return;

        const timeouts = [];
        
        // Step through introduction messages
        introMessages.forEach((message, index) => {
            const timeout = setTimeout(() => {
                setIntroStep(index);
            }, index * 2500); // 2 seconds between each message
            timeouts.push(timeout);
        });

        // Start fade out of final message
        const fadeOutTimeout = setTimeout(() => {
            setIntroFadingOut(true);
        }, (introMessages.length * 2500) - 500); // Start fade 500ms before showing calibration
        timeouts.push(fadeOutTimeout);

        // Show calibration after intro
        const finalTimeout = setTimeout(() => {
            setShowCalibration(true);
            // Start fade-in animation for calibration elements
            setTimeout(() => {
                setCalibrationFadingIn(true);
            }, 50); // Small delay to ensure showCalibration state is set
        }, introMessages.length * 2500);
        timeouts.push(finalTimeout);

        return () => timeouts.forEach(clearTimeout);
    }, [isReady]);

    // Show encouragement after each point
    const showEncouragementMessage = () => {
        // Get available words (not used yet)
        let availableWords = encouragingWords.filter(word => !usedEncouragements.includes(word));
        
        // If all words used, reset the list
        if (availableWords.length === 0) {
            availableWords = [...encouragingWords];
            setUsedEncouragements([]);
        }
        
        const randomMessage = availableWords[Math.floor(Math.random() * availableWords.length)];
        setEncouragementMessage(randomMessage);
        
        // Add to used list
        setUsedEncouragements(prev => [...prev, randomMessage]);
        
        // Fade in
        setShowEncouragement(true);

        // Fade out after 1 second
        setTimeout(() => {
            setShowEncouragement(false);
        }, 1000);
    };

    // Handle spacebar press
    const handleSpacePress = useCallback((event) => {
        if (event.code === 'Space' && !isTransitioning && showCalibration) {
            event.preventDefault();
            
            if (currentPoint) {
                // Calculate point position for calibration - CALIBRATE ON EVERY PRESS
                const pointElement = document.getElementById(currentPoint.id);
                if (pointElement) {
                    const rect = pointElement.getBoundingClientRect();
                    const x = rect.left + rect.width / 2;
                    const y = rect.top + rect.height / 2;
                    calibrateAt(x, y); // Call calibrateAt for every press
                }

                const newPressCount = pressCount + 1;
                setPressCount(newPressCount);

                // Move to next point after 5 presses
                if (newPressCount >= 5) {
                    // Mark current point as calibrated
                    setCalibrationPoints(prev => ({
                        ...prev,
                        [currentPoint.id]: true
                    }));

                    // Show encouragement message
                    showEncouragementMessage();

                    // Move to next point or complete calibration
                    if (currentPointIndex < calibrationSequence.length - 1) {
                        setIsTransitioning(true);
                        
                        // Smooth transition with fade out and fade in
                        setTimeout(() => {
                            setCurrentPointIndex(prev => prev + 1);
                            setPressCount(0);
                            setIsTransitioning(false);
                        }, 1500); // Reduced wait time for encouragement message
                    } else {
                        // Calibration complete - start fade out
                        setIsTransitioning(true);
                        setCalibrationFadingOut(true);
                        setTimeout(() => {
                            setCalibrationComplete(true);
                        }, 1500); // Wait for fade out animation
                    }
                }
            }
        }
    }, [currentPoint, pressCount, currentPointIndex, isTransitioning, showCalibration, calibrateAt, setCalibrationPoints, setCalibrationComplete]);

    // Set up spacebar listener
    useEffect(() => {
        window.addEventListener('keydown', handleSpacePress);
        return () => window.removeEventListener('keydown', handleSpacePress);
    }, [handleSpacePress]);

    if (!isReady) return <p className="text-center mt-10 text-xl">Loading eye tracker...</p>;

    // Calculate opacity based on press count - but maintain minimum visibility to prevent jumping
    const pointOpacity = Math.max(0.6, Math.min((pressCount + 1) * 0.08 + 0.6, 1));

    return (
        <div className="relative w-full h-screen bg-gray-950 overflow-hidden">
            {/* Introduction Sequence */}
            {!showCalibration && (
                <div className="absolute inset-0 flex items-center justify-center z-30">
                    <div className="text-center">
                        {introMessages.map((message, index) => {
                            const isCurrentStep = introStep === index;
                            const isPastStep = introStep > index;
                            const isFinalMessage = index === introMessages.length - 1;
                            const shouldFadeOut = isFinalMessage && introFadingOut;
                            
                            return (
                                <div
                                    key={index}
                                    className={`absolute left-1/2 top-[45%] transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ease-out ${
                                        shouldFadeOut
                                            ? 'opacity-0 scale-95'
                                            : isCurrentStep
                                                ? 'opacity-100 scale-100 translate-y-0'
                                                : isPastStep
                                                    ? 'opacity-0 scale-95 -translate-y-8'
                                                    : 'opacity-0 scale-105 translate-y-8'
                                    }`}
                                    style={{
                                        fontSize: index === 0 ? '4rem' : index === 1 ? '3rem' : '2rem',
                                        fontWeight: index === 0 ? '300' : index === 1 ? '400' : '500',
                                        letterSpacing: index === 0 ? '0.1em' : index === 1 ? '0.05em' : '0.02em',
                                        color: index === 2 ? '#fbbf24' : '#ffffff'
                                    }}
                                >
                                    {message}
                                    {index === 0 && <span className="animate-pulse">.</span>}
                                    {index === 2 && <span className="text-2xl ml-2">⚠️</span>}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Encouragement Message */}
            <div className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none">
                <div 
                    className={`text-center transition-all duration-500 ease-in-out ${
                        showEncouragement ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-4'
                    }`}
                    style={{
                        fontSize: '3rem',
                        fontWeight: '300',
                        letterSpacing: '0.1em',
                        color: '#10b981',
                        textShadow: '0 0 30px rgba(16, 185, 129, 0.5)'
                    }}
                >
                    {encouragementMessage}
                </div>
            </div>

            {/* Progress Indicator */}
            {showCalibration && (
                <div className={`absolute top-4 left-1/2 transform -translate-x-1/2 z-20 transition-all duration-1000 ease-out ${
                    calibrationFadingOut ? 'opacity-0 translate-y-4' : 
                    calibrationFadingIn ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
                }`}>
                    <div className="bg-gray-800 px-4 py-2 rounded-lg">
                        <div className="text-white text-sm">
                            Point {currentPointIndex + 1} of {calibrationSequence.length} | Press {pressCount}/5
                        </div>
                    </div>
                </div>
            )}

            {/* Current calibration point */}
            {currentPoint && showCalibration && (
                <div
                    id={currentPoint.id}
                    className={`absolute w-12 h-12 rounded-full bg-blue-600 border-4 border-blue-400 transition-all duration-1000 ease-in-out shadow-lg ${
                        calibrationFadingOut ? 'opacity-0 scale-75 translate-y-4' :
                        isTransitioning ? 'opacity-0 scale-75' : 
                        calibrationFadingIn ? 'opacity-100 scale-100' : 'opacity-0 scale-75 -translate-y-4'
                    }`}
                    style={{
                        ...currentPoint.position,
                        opacity: calibrationFadingOut ? 0 : (isTransitioning ? 0 : (calibrationFadingIn ? pointOpacity : 0)),
                        transform: currentPoint.position.transform 
                            ? `${currentPoint.position.transform} ${
                                calibrationFadingOut ? 'scale(0.75) translateY(1rem)' :
                                isTransitioning ? 'scale(0.75)' : 
                                calibrationFadingIn ? 'scale(1)' : 'scale(0.75) translateY(-1rem)'
                              }`
                            : calibrationFadingOut ? 'scale(0.75) translateY(1rem)' :
                              isTransitioning ? 'scale(0.75)' : 
                              calibrationFadingIn ? 'scale(1)' : 'scale(0.75) translateY(-1rem)',
                        boxShadow: `0 0 ${20 + pressCount * 8}px rgba(59, 130, 246, 0.8)`,
                        zIndex: 10
                    }}
                >
                    {/* Inner progress indicator */}
                    <div 
                        className="absolute inset-2 rounded-full bg-blue-300 transition-all duration-200"
                        style={{ opacity: pressCount * 0.15 + 0.1 }}
                    />
                    
                    {/* Progress ring */}
                    <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 48 48">
                        <circle
                            cx="24"
                            cy="24"
                            r="20"
                            stroke="rgba(59, 130, 246, 0.3)"
                            strokeWidth="2"
                            fill="transparent"
                        />
                        <circle
                            cx="24"
                            cy="24"
                            r="20"
                            stroke="rgb(147, 197, 253)"
                            strokeWidth="2"
                            fill="transparent"
                            strokeDasharray={`${(pressCount / 5) * 125.6} 125.6`}
                            className="transition-all duration-200 ease-out"
                        />
                    </svg>
                    
                    {/* Completion flash effect */}
                    {pressCount === 5 && (
                        <div className="absolute inset-0 rounded-full bg-green-400 opacity-60 animate-ping" />
                    )}
                </div>
            )}

            {/* Completed points (fade out) */}
            {showCalibration && calibrationSequence.slice(0, currentPointIndex).map((point, index) => (
                <div
                    key={point.id}
                    className={`absolute w-6 h-6 rounded-full bg-green-600 border-2 border-green-400 transition-all duration-1000 ${
                        calibrationFadingOut ? 'opacity-0 translate-y-4' : 'opacity-40'
                    }`}
                    style={{
                        ...point.position,
                        transform: point.position.transform 
                            ? `${point.position.transform} translate(-50%, -50%)`
                            : 'translate(-50%, -50%)',
                        zIndex: 8
                    }}
                />
            ))}

            <style jsx>{`
                @keyframes ping {
                    75%, 100% {
                        transform: scale(2);
                        opacity: 0;
                    }
                }
            `}</style>
        </div>
    );
}
