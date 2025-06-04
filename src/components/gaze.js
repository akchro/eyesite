'use client';

import {useCallback, useEffect, useState} from 'react';
import { Transition } from '@headlessui/react';
import {useWebGazer} from './webgazerProvider';
import Calibrate from "@/components/calibrate";
import LookAndClick from "@/components/seeableTexts/lookAndClick";
import PlayAGame from "@/components/seeableTexts/playAGame";
import BlogButton from "@/components/seeableTexts/blogButton";
import Blog from "@/components/Blog";
import ScreenTooSmallWindow from "@/components/screenTooSmallWindow";

const Gaze = () => {
    const [calibrationComplete, setCalibrationComplete] = useState(false);
    const [calibrationPoints, setCalibrationPoints] = useState({});
    const [debugMode, setDebugMode] = useState(false);
    const [introShown, setIntroShown] = useState(false);
    const { currentGaze, isReady, setVideoVisible, setPredictionPointsVisible } = useWebGazer();

    // Game state management
    const [gameActive, setGameActive] = useState(false);
    const [gameProgress, setGameProgress] = useState(0);

    // Blog state management
    const [isReadingBlog, setIsReadingBlog] = useState(false);

    // Screen size validation
    const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });
    const [isScreenSizeValid, setIsScreenSizeValid] = useState(true);

    const MIN_WIDTH = 1200;
    const MIN_HEIGHT = 728;

    // Check screen size
    const checkScreenSize = useCallback(() => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        setScreenSize({ width, height });
        setIsScreenSizeValid(width >= MIN_WIDTH && height >= MIN_HEIGHT);
    }, []);

    // Handle screen resize
    useEffect(() => {
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, [checkScreenSize]);

    // Handle debug mode toggle and recalibration
    const handleKeyPress = useCallback((event) => {
        if (event.code === 'KeyD') {
            setDebugMode(prev => !prev);
        }
        // Only handle R for recalibration when calibration is complete and not reading blog
        // During calibration, the Calibrate component handles R key
        // During blog reading, spacebar is handled by Blog component for exit
        if (event.code === 'KeyR' && !event.metaKey && !event.ctrlKey && !event.altKey && !event.shiftKey && calibrationComplete && !isReadingBlog) {
            handleRecalibrate();
        }
    }, [calibrationComplete, isReadingBlog]);

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
            setVideoVisible(debugMode);
        }
        if (setPredictionPointsVisible) {
            setPredictionPointsVisible(debugMode)
        }
    }, [calibrationComplete, debugMode, setVideoVisible, setPredictionPointsVisible]);

    const handleRecalibrate = () => {
        if (window.webgazer) {
            window.webgazer.clearData();
            setCalibrationPoints({});
            setCalibrationComplete(false);
            // Keep introShown as true so intro doesn't replay
            // Video visibility will be handled by the useEffect above
        }
    };

    const toggleDebugMode = () => {
        setDebugMode(prev => !prev);
    };

    // Game handlers
    const handleGameStart = () => {
        setGameActive(true);
        setGameProgress(0);
    };

    const handleGameEnd = () => {
        setGameActive(false);
        setGameProgress(0);
    };

    const handleGameProgress = (progress) => {
        setGameProgress(progress);
    };

    // Blog handlers
    const handleBlogOpen = () => {
        setIsReadingBlog(true);
    };

    const handleBlogClose = () => {
        setIsReadingBlog(false);
    };

    // Show screen size warning if dimensions are too small
    if (!isScreenSizeValid) {
        return (
            <ScreenTooSmallWindow screenSize={screenSize} min_width={MIN_WIDTH} min_height={MIN_HEIGHT}/>
        )
    }

    return (
        <main className={debugMode ? '' : 'cursor-none'}>
            {/* Debug camera overlay */}
            {debugMode && calibrationComplete && (
                <div className="debug-camera-overlay">
                    DEBUG CAM
                </div>
            )}

            {/* Calibration Screen with Transition */}
            <Transition
                show={!calibrationComplete}
                enter="transition-all duration-1000 ease-out"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-all duration-1000 ease-out"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                as="div"
            >
                <Calibrate 
                    calibrationComplete={calibrationComplete}
                    setCalibrationComplete={setCalibrationComplete}
                    calibrationPoints={calibrationPoints}
                    setCalibrationPoints={setCalibrationPoints}
                    introShown={introShown}
                    setIntroShown={setIntroShown}
                />
            </Transition>

            {/* Blog Screen with Transition */}
            <Transition
                show={calibrationComplete && isReadingBlog}
                enter="transition-all duration-500 ease-out"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-all duration-500 ease-out"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                as="div"
            >
                <Blog
                    debugMode={debugMode}
                    onExit={handleBlogClose}
                />
            </Transition>

            {/* Main Screen with Transition */}
            <Transition
                show={calibrationComplete && !isReadingBlog}
                enter="transition-all duration-1000 ease-out delay-500"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="transition-all duration-500 ease-out"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
                as="div"
            >
                <div className="w-full h-screen relative bg-gray-950">
                    {/* PlayAGame component - always visible */}
                    <PlayAGame 
                        debugMode={debugMode}
                        gameActive={gameActive}
                        onGameStart={handleGameStart}
                        onGameEnd={handleGameEnd}
                        onGameProgress={handleGameProgress}
                    />

                    {/* Other interactive components - hidden during game */}
                    <Transition
                        show={!gameActive}
                        enter="transition-opacity duration-500"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity duration-500"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div style={{ position: 'absolute', top: '20%', left: '18%' }}>
                            <BlogButton 
                                debugMode={debugMode} 
                                onBlogClick={handleBlogOpen}
                            />
                        </div>
                    </Transition>
                    
                    <Transition
                        show={!gameActive}
                        enter="transition-opacity duration-500"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity duration-500"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div style={{ position: 'absolute', top: '20%', right: '20%' }}>
                            <LookAndClick debugMode={debugMode}/>
                        </div>
                    </Transition>
                    
                    {/* Instructions */}
                    <Transition
                        show={!gameActive}
                        enter="transition-opacity duration-500"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity duration-500"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="absolute bottom-20 right-10 p-4 rounded shadow max-w-lg flex flex-col">
                            <h3 className="font-bold font-red-hat mb-2 text-center text-white">Gaze Interaction Demo</h3>
                            <p className="text-s font-red-hat text-gray-200 mt-2 text-center">
                                Use your eyes to control, press Spacebar to click.
                            </p>
                            <p className="text-s font-red-hat text-gray-200 mt-1 text-center font-medium">
                                Press D to toggle debug mode
                            </p>
                            <p className="text-s font-red-hat text-gray-200 mt-1 text-center font-medium">
                                Press R to recalibrate
                            </p>
                            {debugMode && (
                                <p className="text-xs text-yellow-600 mt-1 text-center font-bold">
                                    🔧 Debug Mode Active - Camera {calibrationComplete ? 'Visible' : 'Hidden'}
                                </p>
                            )}
                        </div>
                    </Transition>
                </div>
            </Transition>
        </main>
    );
};

export default Gaze;