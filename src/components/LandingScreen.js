'use client';

import { useState, useEffect } from 'react';
import { Transition } from '@headlessui/react';
import { useWebGazer } from './webgazerProvider';

export default function LandingScreen({ children }) {
    const [showLanding, setShowLanding] = useState(true);
    const [minWaitingTime, setMinWaitingTime] = useState(false);
    const { isReady } = useWebGazer();

    useEffect(() => {

        const timer = setTimeout(() => {
            setMinWaitingTime(true);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        // Hide landing screen when both conditions are met
        if (minWaitingTime && isReady) {
            setShowLanding(false);
        }
    }, [minWaitingTime, isReady]);

    return (
        <>
            <Transition
                show={showLanding}
                leave="transition-opacity duration-500"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                className="fixed inset-0 bg-gray-950 flex items-center justify-center z-50"
            >
                <h1 className="text-6xl font-red-hat text-white">
                    Eyesite
                </h1>
            </Transition>
            
            {!showLanding && children}
        </>
    );
} 