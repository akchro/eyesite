'use client';

import { useState, useEffect, useCallback } from 'react';
import { useWebGazer } from './webgazerProvider';
import Calibrate from "@/components/calibrate";
import Square from './square';
import WrappedSquare from './WrappedSquare';
import ClickableSquare from './ClickableSquare';
import WrappedClickableSquare from './WrappedClickableSquare';

const Gaze = () => {
    const [calibrationComplete, setCalibrationComplete] = useState(false);
    const [calibrationPoints, setCalibrationPoints] = useState({});
    const [debugMode, setDebugMode] = useState(false);
    const { currentGaze, isReady, setVideoVisible } = useWebGazer();

    // Handle debug mode toggle
    const handleKeyPress = useCallback((event) => {
        if (event.code === 'KeyD') {
            setDebugMode(prev => !prev);
        }
    }, []);

    // Set up keyboard listener for debug mode
    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [handleKeyPress]);

    // Control video visibility based on calibration and debug mode
    useEffect(() => {
        if (setVideoVisible) {
            const shouldShowVideo = calibrationComplete && debugMode;
            setVideoVisible(shouldShowVideo);
        }
    }, [calibrationComplete, debugMode, setVideoVisible]);

    const handleRecalibrate = () => {
        if (window.webgazer) {
            window.webgazer.clearData();
            setCalibrationPoints({});
            setCalibrationComplete(false);
            // Video visibility will be handled by the useEffect above
        }
    };

    const toggleDebugMode = () => {
        setDebugMode(prev => !prev);
    };

    return (
        <>
            {/* Status display */}
            <div className="fixed top-0 left-0 right-0 bg-gray-800 text-white p-2 flex justify-between z-50">
                <div className="flex items-center gap-4">
                    <span>
                        {calibrationComplete ? 'Calibration Complete! Look at squares and press SPACEBAR to click!' : 'Click on each point to calibrate'}
                    </span>
                    {debugMode && (
                        <span className="px-2 py-1 bg-yellow-600 rounded text-xs font-bold animate-pulse">
                            DEBUG MODE
                        </span>
                    )}
                </div>
                <div className="flex gap-2">
                    {isReady && (
                        <div className="px-2 py-1 bg-blue-600 rounded text-sm">
                            Gaze: ({Math.round(currentGaze.x)}, {Math.round(currentGaze.y)})
                        </div>
                    )}
                    {calibrationComplete && (
                        <button
                            onClick={toggleDebugMode}
                            className={`px-2 py-1 rounded text-sm ${
                                debugMode ? 'bg-yellow-600' : 'bg-gray-600'
                            }`}
                        >
                            {debugMode ? 'Debug: ON' : 'Debug: OFF'}
                        </button>
                    )}
                    <button
                        onClick={handleRecalibrate}
                        className="px-2 py-1 bg-red-500 rounded"
                    >
                        Recalibrate
                    </button>
                </div>
            </div>

            {/* Debug camera overlay */}
            {debugMode && calibrationComplete && (
                <div className="debug-camera-overlay">
                    DEBUG CAM
                </div>
            )}

            {calibrationComplete ? (
                <div className="w-full h-screen relative bg-gray-100">
                    {/* Show the different types of interactive squares */}
                    <div style={{ position: 'absolute', top: '20%', left: '10%' }}>
                        <Square />
                    </div>
                    
                    <div style={{ position: 'absolute', top: '20%', right: '10%' }}>
                        <WrappedSquare />
                    </div>
                    
                    <div style={{ position: 'absolute', bottom: '20%', left: '10%' }}>
                        <ClickableSquare />
                    </div>
                    
                    <div style={{ position: 'absolute', bottom: '20%', right: '10%' }}>
                        <WrappedClickableSquare />
                    </div>
                    
                    {/* Instructions */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded shadow max-w-lg">
                        <h3 className="font-bold mb-2 text-center">Gaze Interaction Demo</h3>
                        <div className="grid grid-cols-2 gap-4 text-xs">
                            <div>
                                <strong>Top Left:</strong> Hover only (useGazeHover)
                            </div>
                            <div>
                                <strong>Top Right:</strong> Hover only (GazeWrapper)
                            </div>
                            <div>
                                <strong>Bottom Left:</strong> Gaze + SPACEBAR click (useGazeClick)
                            </div>
                            <div>
                                <strong>Bottom Right:</strong> Gaze + SPACEBAR click (GazeClickWrapper)
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2 text-center">
                            Look at squares to highlight them. Press SPACEBAR while looking at bottom squares to click!
                        </p>
                        <p className="text-xs text-blue-600 mt-1 text-center font-medium">
                            Press 'D' key to toggle debug mode and show/hide camera
                        </p>
                        {debugMode && (
                            <p className="text-xs text-yellow-600 mt-1 text-center font-bold">
                                🔧 Debug Mode Active - Camera {calibrationComplete ? 'Visible' : 'Hidden'}
                            </p>
                        )}
                    </div>
                </div>
            ) : (
                <Calibrate 
                    calibrationComplete={calibrationComplete}
                    setCalibrationComplete={setCalibrationComplete}
                    calibrationPoints={calibrationPoints}
                    setCalibrationPoints={setCalibrationPoints}
                />
            )}
        </>
    );
};

export default Gaze;