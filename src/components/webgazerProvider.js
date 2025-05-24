'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';

const WebGazerContext = createContext(null);

export function WebgazerProvider({ children }) {
    const webgazerRef = useRef(null);
    const [isReady, setIsReady] = useState(false);
    const [currentGaze, setCurrentGaze] = useState({ x: 0, y: 0 });
    const gazeListenersRef = useRef(new Set());

    useEffect(() => {
        let instance;
        (async () => {
            try {
                const webgazerMod = await import('webgazer');
                // assign globally for any internals that expect window.webgazer:
                window.webgazer = webgazerMod.default;
                instance = webgazerMod.default;
                
                // Configure WebGazer
                instance
                    .setGazeListener((data) => { 
                        if (data) {
                            setCurrentGaze({ x: data.x, y: data.y });
                            // Call all registered listeners
                            gazeListenersRef.current.forEach(listener => {
                                try {
                                    listener(data);
                                } catch (error) {
                                    console.error('Error in gaze listener:', error);
                                }
                            });
                        }
                    })
                    .begin();
                
                // Set WebGazer options
                instance.showVideo(false); // Hide video initially
                instance.showPredictionPoints(false); // Hide prediction points
                instance.showFaceOverlay(false) // Hide face overlay initially
                instance.showFaceFeedbackBox(false) // Hide boundary box initially
                
                // Store the instance
                webgazerRef.current = instance;
                setIsReady(true);
                
                console.log("WebGazer initialized successfully");
            } catch (error) {
                console.error("Error initializing WebGazer:", error);
            }
        })();

        return () => {
            if (instance) {
                try {
                    instance.end();
                } catch (error) {
                    console.error("Error ending WebGazer:", error);
                }
            }
        };
    }, []);

    // Function to add gaze listeners
    const addGazeListener = (listener) => {
        gazeListenersRef.current.add(listener);
        return () => {
            gazeListenersRef.current.delete(listener);
        };
    };

    // Function to control video display
    const setVideoVisible = (visible) => {
        if (webgazerRef.current) {
            try {
                webgazerRef.current.showVideo(visible);
                webgazerRef.current.showFaceOverlay(visible)
                webgazerRef.current.showFaceFeedbackBox(visible)
                console.log(`Video display set to: ${visible}`);
            } catch (error) {
                console.error("Error controlling video display:", error);
            }
        }
    };

    // Function to control prediction points
    const setPredictionPointsVisible = (visible) => {
        if (webgazerRef.current) {
            try {
                webgazerRef.current.showPredictionPoints(visible);
                console.log(`Prediction points set to: ${visible}`);
            } catch (error) {
                console.error("Error controlling prediction points:", error);
            }
        }
    };

    // Function to apply/remove Kalman filter
    const setKalmanFilter = (enabled) => {
        if (webgazerRef.current) {
            try {
                webgazerRef.current.applyKalmanFilter(enabled);
                console.log(`Kalman filter set to: ${enabled}`);
            } catch (error) {
                console.error("Error controlling Kalman filter:", error);
            }
        }
    };

    // Expose whatever helpers you need, e.g. calibration dots:
    const calibrateAt = (x, y) => {
        if (!webgazerRef.current) {
            console.warn("WebGazer not initialized yet");
            return;
        }
        
        try {
            // Add data point for calibration
            webgazerRef.current.recordScreenPosition(x, y, 'click');
            console.log(`Calibration point added at: ${x}, ${y}`);
        } catch (error) {
            console.error("Error during calibration:", error);
        }
    };

    return (
        <WebGazerContext.Provider value={{ 
            calibrateAt, 
            instance: webgazerRef.current,
            isReady,
            currentGaze,
            addGazeListener,
            setVideoVisible,
            setPredictionPointsVisible,
            setKalmanFilter
        }}>
            {children}
        </WebGazerContext.Provider>
    );
}

// custom hook for convenience
export const useWebGazer = () => {
    const ctx = useContext(WebGazerContext);
    if (!ctx) throw new Error("useWebGazer must be inside WebGazerProvider");
    return ctx;
};
