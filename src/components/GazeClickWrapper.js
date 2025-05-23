'use client';

import React, { useRef, cloneElement, useEffect, useState } from 'react';
import { useGazeClick } from './useGazeClick';

const GazeClickWrapper = ({ 
    children, 
    onGazeClick, 
    onGazeHover,
    onGazeLeave,
    threshold = 20,
    className = '',
    style = {},
    showClickEffect = true,
    clickEffectDuration = 200,
    ...props 
}) => {
    const elementRef = useRef(null);
    const [isFlashing, setIsFlashing] = useState(false);

    const handleGazeClick = (clickData) => {
        if (showClickEffect) {
            setIsFlashing(true);
            setTimeout(() => {
                setIsFlashing(false);
            }, clickEffectDuration);
        }

        if (onGazeClick) {
            onGazeClick(clickData);
        }
    };

    const { isGazeHovered, isClicked } = useGazeClick(elementRef, handleGazeClick, threshold);

    // Handle gaze hover events
    useEffect(() => {
        if (isGazeHovered && onGazeHover) {
            onGazeHover();
        } else if (!isGazeHovered && onGazeLeave) {
            onGazeLeave();
        }
    }, [isGazeHovered, onGazeHover, onGazeLeave]);

    const getAdditionalProps = () => {
        const additionalProps = {
            'data-gaze-hovered': isGazeHovered,
            'data-gaze-clicked': isClicked,
            'data-gaze-flashing': isFlashing,
        };

        if (showClickEffect) {
            additionalProps.className = `${className} ${isFlashing ? 'gaze-click-flash' : ''}`;
        }

        return additionalProps;
    };

    // If children is a single React element, clone it with the ref and additional props
    if (React.isValidElement(children)) {
        return cloneElement(children, {
            ref: elementRef,
            className: `${children.props.className || ''} ${className} ${isFlashing ? 'gaze-click-flash' : ''}`,
            style: { ...children.props.style, ...style },
            ...getAdditionalProps(),
            ...props
        });
    }

    // Otherwise, wrap in a div
    return (
        <div
            ref={elementRef}
            className={`${className} ${isFlashing ? 'gaze-click-flash' : ''}`}
            style={style}
            {...getAdditionalProps()}
            {...props}
        >
            {children}
        </div>
    );
};

export default GazeClickWrapper; 