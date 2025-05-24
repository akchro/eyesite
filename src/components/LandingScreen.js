'use client';

import { useState, useEffect } from 'react';
import { Transition } from '@headlessui/react';
import { useWebGazer } from './webgazerProvider';

export default function LandingScreen({ children }) {
    const [showLanding, setShowLanding] = useState(true);
    const [minWaitingTime, setMinWaitingTime] = useState(false);
    const [cameraPermission, setCameraPermission] = useState('checking'); // 'checking', 'granted', 'denied', 'prompt'
    const [cameraError, setCameraError] = useState(null);
    const { isReady } = useWebGazer();

    useEffect(() => {
        const timer = setTimeout(() => {
            setMinWaitingTime(true);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        // Check camera permission on mount
        checkCameraPermission();
    }, []);

    const checkCameraPermission = async () => {
        try {
            if (navigator.permissions) {
                const permission = await navigator.permissions.query({ name: 'camera' });
                setCameraPermission(permission.state);
                
                // Listen for permission changes
                permission.onchange = () => {
                    setCameraPermission(permission.state);
                };
            } else {
                // Fallback: try to access camera directly
                setCameraPermission('prompt');
            }
        } catch (error) {
            console.error('Error checking camera permission:', error);
            setCameraPermission('prompt');
        }
    };

    const requestCameraAccess = async () => {
        try {
            setCameraError(null);
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            
            // Stop the stream immediately - we just needed to request permission
            stream.getTracks().forEach(track => track.stop());
            
            setCameraPermission('granted');
        } catch (error) {
            console.error('Camera access denied:', error);
            setCameraError(error.message || 'Camera access was denied');
            setCameraPermission('denied');
        }
    };

    useEffect(() => {
        // Hide landing screen when all conditions are met
        if (minWaitingTime && isReady && cameraPermission === 'granted') {
            setShowLanding(false);
        }
    }, [minWaitingTime, isReady, cameraPermission]);

    const renderCameraStatus = () => {
        switch (cameraPermission) {
            case 'checking':
                return (
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
                        <p className="text-xl text-gray-300">Checking camera access...</p>
                    </div>
                );
            
            case 'prompt':
            case 'denied':
                return (
                    <div className="text-center max-w-md">
                        <div className="mb-6">
                            <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-semibold text-white mb-4">Camera Access Required</h2>
                        <p className="text-gray-300 mb-6">
                            Eyesite needs access to your camera to track your eye movements for calibration and gaze detection.
                        </p>
                        {cameraError && (
                            <div className="bg-red-900/50 border border-red-700 rounded-lg p-3 mb-4">
                                <p className="text-red-200 text-sm">{cameraError}</p>
                            </div>
                        )}
                        <button
                            onClick={requestCameraAccess}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                        >
                            Enable Camera
                        </button>
                        <p className="text-sm text-gray-400 mt-4">
                            You may need to click "Allow" in your browser's permission dialog
                        </p>
                    </div>
                );
            
            case 'granted':
                if (!minWaitingTime || !isReady) {
                    return (
                        <div className="text-center">
                            <h2 className="text-7xl font-red-hat text-white mb-4">Eyesite</h2>
                            <p className="text-gray-300 mb-4">Initializing eye tracking...</p>
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
                        </div>
                    );
                }
                break;
            
            default:
                return null;
        }
    };

    return (
        <>
            <Transition
                show={showLanding}
                as="div"
                leave="transition-opacity duration-500"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                className="fixed inset-0 bg-gray-950 flex flex-col items-center justify-center z-50 p-8"
            >

                {renderCameraStatus()}
            </Transition>

            {!showLanding && children}
        </>
    );
} 