'use client';

import React, { useRef, cloneElement, useEffect } from 'react';
import { useGazeHover } from './useGazeHover';

const GazeWrapper = ({ 
    children, 
    onGazeEnter, 
    onGazeLeave, 
    threshold = 20,
    className = '',
    style = {},
    ...props 
}) => {
    const elementRef = useRef(null);
    const isGazeHovered = useGazeHover(elementRef, threshold);

    // Handle gaze enter/leave events
    useEffect(() => {
        if (isGazeHovered && onGazeEnter) {
            onGazeEnter();
        } else if (!isGazeHovered && onGazeLeave) {
            onGazeLeave();
        }
    }, [isGazeHovered, onGazeEnter, onGazeLeave]);

    // If children is a single React element, clone it with the ref
    if (React.isValidElement(children)) {
        return cloneElement(children, {
            ref: elementRef,
            className: `${children.props.className || ''} ${className}`,
            style: { ...children.props.style, ...style },
            'data-gaze-hovered': isGazeHovered,
            ...props
        });
    }

    // Otherwise, wrap in a div
    return (
        <div
            ref={elementRef}
            className={className}
            style={style}
            data-gaze-hovered={isGazeHovered}
            {...props}
        >
            {children}
        </div>
    );
};

export default GazeWrapper; 