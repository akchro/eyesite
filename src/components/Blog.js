'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { useWebGazer } from './webgazerProvider';

const Blog = ({ debugMode, onExit }) => {
    const blogContentRef = useRef(null);
    const { currentGaze, isReady, addGazeListener } = useWebGazer();
    const [scrollSpeed, setScrollSpeed] = useState(0);
    const [scrollProgress, setScrollProgress] = useState(0);
    const scrollIntervalRef = useRef(null);

    // Handle gaze-based scrolling
    const checkGazePosition = useCallback((data) => {
        if (!data || !blogContentRef.current) {
            setScrollSpeed(0);
            return;
        }

        const { y } = data;
        const windowHeight = window.innerHeight;
        const bottomThreshold = windowHeight * 0.75; // Bottom 25% of screen
        const topThreshold = windowHeight * 0.15; // Top 15% of screen

        if (y >= bottomThreshold) {
            // Looking at bottom - scroll down
            setScrollSpeed(10);
        } else if (y <= topThreshold) {
            // Looking at top - scroll up
            setScrollSpeed(-10);
        } else {
            // Looking at middle - stop scrolling
            setScrollSpeed(0);
        }
    }, []);

    // Handle scroll progress tracking
    const handleScroll = useCallback(() => {
        if (!blogContentRef.current) return;

        const { scrollTop, scrollHeight, clientHeight } = blogContentRef.current;
        const maxScroll = scrollHeight - clientHeight;
        const progress = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
        setScrollProgress(Math.min(100, Math.max(0, progress)));
    }, []);

    // Handle spacebar press for exit
    const handleKeyPress = useCallback((event) => {
        if (event.code === 'Space') {
            event.preventDefault();
            onExit();
        }
    }, [onExit]);

    // Set up gaze listener
    useEffect(() => {
        if (!isReady || !addGazeListener) return;

        const removeListener = addGazeListener(checkGazePosition);
        return removeListener;
    }, [isReady, addGazeListener, checkGazePosition]);

    // Set up keyboard listener
    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [handleKeyPress]);

    // Set up scroll listener
    useEffect(() => {
        const blogElement = blogContentRef.current;
        if (!blogElement) return;

        blogElement.addEventListener('scroll', handleScroll);
        // Initial calculation
        handleScroll();

        return () => {
            blogElement.removeEventListener('scroll', handleScroll);
        };
    }, [handleScroll]);

    // Handle continuous scrolling
    useEffect(() => {
        if (scrollSpeed !== 0) {
            scrollIntervalRef.current = setInterval(() => {
                if (blogContentRef.current) {
                    blogContentRef.current.scrollTop += scrollSpeed;
                }
            }, 16); // ~60fps
        } else {
            if (scrollIntervalRef.current) {
                clearInterval(scrollIntervalRef.current);
                scrollIntervalRef.current = null;
            }
        }

        return () => {
            if (scrollIntervalRef.current) {
                clearInterval(scrollIntervalRef.current);
            }
        };
    }, [scrollSpeed]);

    return (
        <div className="fixed inset-0 bg-gray-950 z-50 flex flex-col">
            {/* Custom Scroll Progress Bar */}
            <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-10">
                <div className="relative">
                    {/* Background track */}
                    <div className="w-1 h-80 bg-gray-700/50 rounded-full"></div>
                    {/* Progress fill */}
                    <div 
                        className="absolute top-0 left-0 w-1 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full transition-all duration-200 ease-out"
                        style={{ height: `${(scrollProgress / 100) * 320}px` }}
                    ></div>
                    {/* Progress indicator dot */}
                    <div 
                        className="absolute left-1/2 transform -translate-x-1/2 w-3 h-3 bg-blue-400 rounded-full border-2 border-gray-950 transition-all duration-200 ease-out"
                        style={{ 
                            top: `${(scrollProgress / 100) * 308}px`, // 320px - 12px for dot size
                            opacity: scrollProgress > 0 ? 1 : 0.5
                        }}
                    ></div>
                </div>
            </div>

            {/* Blog Content */}
            <hr className={`border absolute top-[15%] w-screen ${debugMode ? '' : 'hidden'}`} />
            <hr className={`border absolute bottom-1/4 w-screen ${debugMode ? '' : 'hidden'}`} />
            <div
                ref={blogContentRef}
                className="flex-1 overflow-y-auto px-8 py-12 max-w-4xl mx-auto"
                style={{ scrollBehavior: 'auto' }}
            >
                <div className="text-white space-y-8">
                    <h1 className="text-6xl font-cor-gar text-center mb-12">Blog</h1>
                    
                    {/* Real Blog Content */}
                    <article className="space-y-6">
                        <p className="text-lg font-red-hat leading-relaxed">
                            I wanted Apple Vision Pros, but I don't have $3,500 in my back pocket. So I made Apple Vision Pros at home.
                        </p>
                        
                        <p className="text-lg font-red-hat leading-relaxed">
                            I was interested in making a project that combined computer vision with web design—a website that users could <em>physically</em> interact with. This inspired me to make{' '}
                            <a href="https://eyesite.andykhau.com/" className="text-blue-400 hover:text-blue-300 underline">
                                Eyesite
                            </a>, because who needs a mouse when you have your eyes?
                        </p>

                        <h2 className="text-4xl font-cor-gar mt-12 mb-6">Eye tracking</h2>
                        
                        <p className="text-lg font-red-hat leading-relaxed">
                            Luckily, there is already a Javascript library for eye tracking called{' '}
                            <a href="https://webgazer.cs.brown.edu/" className="text-blue-400 hover:text-blue-300 underline">
                                WebGazer.js
                            </a>. We can achieve decent eye tracking through calibration:
                        </p>
                        
                        <ol className="text-lg font-red-hat leading-relaxed ml-6 space-y-2">
                            <li>1. Make the user look at a point and click. This maps the current gaze to a point on the screen.</li>
                            <li>2. Feed the gaze/coordinate mapping into WebGazer to calibrate.</li>
                            <li>3. Repeat 9x times on the corners, sides, and center to get good mapping data.</li>
                        </ol>
                        
                        <p className="text-lg font-red-hat leading-relaxed">
                            I found that it was best to get 5 mappings per point for better eye tracking accuracy.
                        </p>

                        <div className="my-8">
                            <img 
                                src="/calibration.jpg" 
                                alt="Calibration screen in debug mode" 
                                className="w-full max-w-2xl mx-auto rounded-lg shadow-lg"
                            />
                            <p className="text-sm font-red-hat text-gray-400 text-center mt-2 italic">
                                Calibration in debug mode. The top right shows how WebGazer tracks your eyes and face. The red dot is where it thinks I'm looking.
                            </p>
                        </div>

                        <h2 className="text-4xl font-cor-gar mt-12 mb-6">Website Interaction</h2>
                        
                        <p className="text-lg font-red-hat leading-relaxed">
                            Now that we have eye tracking, we can make some cool things with it! I decided to use the user's gaze as a mouse and have them click with spacebar—kind of like how Apple Vision Pros have you look and pinch. Although I had the main functionality, it was far from finished. There were many considerations with making the experience as smooth and immersive as possible.
                        </p>

                        <div className="my-8">
                            <img 
                                src="/gazepage.jpg" 
                                alt="Main page" 
                                className="w-full max-w-2xl mx-auto rounded-lg shadow-lg"
                            />
                        </div>

                        <h2 className="text-4xl font-cor-gar mt-12 mb-6">The "Invisible" Mouse</h2>
                        
                        <p className="text-lg font-red-hat leading-relaxed">
                            Initially, the user could see "where" they were looking at through a red dot.
                        </p>

                        <div className="my-8">
                            <img 
                                src="/gazedebug.jpg" 
                                alt="Gaze page in debug mode" 
                                className="w-full max-w-2xl mx-auto rounded-lg shadow-lg"
                            />
                            <p className="text-sm font-red-hat text-gray-400 text-center mt-2 italic">
                                Main page in debug mode.
                            </p>
                        </div>
                        
                        <p className="text-lg font-red-hat leading-relaxed">
                            This created some problems. First, the red dot was distracting, and users would unconsciously look at it instead of my buttons. Second, the red dot revealed how inaccurate the eye tracking was, which ruined the immersion.
                        </p>
                        
                        <p className="text-lg font-red-hat leading-relaxed">
                            Ultimately, I decided to remove the "eye cursor" and also make the user's mouse invisible. It made you really feel like you were controlling the website with your eyes rather than moving a mouse around. You can turn on debug mode to see your eye cursor and mouse.
                        </p>

                        <h2 className="text-4xl font-cor-gar mt-12 mb-6">User feedback</h2>
                        
                        <p className="text-lg font-red-hat leading-relaxed">
                            Since we don't have a mouse, we need some way for the user to know they are looking at something. To do this… we track the user's gaze (how surprising). We hid the eye cursor, but we still have the x and y coordinates of the user's gaze. Each button component has checks to see if that gaze is within its borders. When the component detects the user is looking at it, it responds with a slight glow and pop.
                        </p>

                        <div className="my-8">
                            <img 
                                src="/inandout.gif" 
                                alt="Eye cursor going in and out" 
                                className="w-full max-w-2xl mx-auto rounded-lg shadow-lg"
                            />
                        </div>

                        <h2 className="text-4xl font-cor-gar mt-12 mb-6">Large UI</h2>
                        
                        <p className="text-lg font-red-hat leading-relaxed">
                            Admittedly, the eye tracking is not the best. You can really see how jittery it is with debug mode on. So I decided to make the UI huge. I also added a screen size restriction so the site is only usable on displays that meet a minimum size threshold (Sorry mobile users! It wouldn't work on your phone anyway).
                        </p>

                        <div className="my-8">
                            <img 
                                src="/jitter.gif" 
                                alt="Eye cursor jittering" 
                                className="w-full max-w-2xl mx-auto rounded-lg shadow-lg"
                            />
                            <p className="text-sm font-red-hat text-gray-400 text-center mt-2 italic">
                                The large size of the button accounts for the jitteriness of the eye tracking.
                            </p>
                        </div>

                        <h2 className="text-4xl font-cor-gar mt-12 mb-6">Conclusion</h2>
                        
                        <p className="text-lg font-red-hat leading-relaxed">
                            Those were a few details about Eyesite. If you are interested, you can see the source code. Small warning: this project was just a small demo and isn't a shining example of clean code or best practices.
                        </p>
                        
                        <p className="text-lg font-red-hat leading-relaxed">
                            This was a really fun project to make, and super cool to use too. If you want to make your own computer vision project or improve this one, I encourage you to do so! You can find the project at{' '}
                            <a href="https://github.com/akchro/eyesite" className="text-blue-400 hover:text-blue-300 underline">
                                https://github.com/akchro/eyesite
                            </a>.
                        </p>
                        
                        <div className="h-32"></div> {/* Extra space for scrolling demonstration */}
                    </article>
                </div>
            </div>

            {/* Scroll Instructions at Bottom */}
            <div className="relative">
                {/* Base gradient - always present */}
                <div className={`absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-600/20 to-transparent pointer-events-none ${debugMode ? 'border-2' : ''}`} />

                {/* Overlay gradient - fades in when scrolling */}
                <div
                    className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-600/40 to-transparent pointer-events-none transition-opacity duration-300"
                    style={{
                        opacity: scrollSpeed !== 0 ? 1 : 0
                    }}
                />

                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    <p className="text-white text-3xl font-red-hat text-center bg-black/50 px-4 py-2 rounded">
                        Look to Scroll
                    </p>
                </div>
            </div>

            {/* Exit Instructions */}
            <div className="absolute top-6 right-6">
                <p className="text-white text-sm font-red-hat bg-black/50 px-4 py-2 rounded">
                    Press Spacebar to Exit
                </p>
            </div>

        </div>
    );
};

export default Blog;