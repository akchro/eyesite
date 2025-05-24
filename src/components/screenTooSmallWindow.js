import React from 'react';

const ScreenTooSmallWindow = ({screenSize, min_width, min_height}) => {


    return (
        <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-50">
            <div className="text-center p-8 bg-gray-800 rounded-lg shadow-2xl max-w-md mx-4">
                <div className="text-red-500 text-6xl mb-4">⚠️</div>
                <h1 className="text-2xl font-bold text-white mb-4">Screen Too Small</h1>
                <p className="text-gray-300 mb-4">
                    This application requires a minimum screen size to function properly.
                </p>
                <div className="text-sm text-gray-400 mb-4">
                    <p><strong>Minimum Required:</strong></p>
                    <p>Width: {min_width}px | Height: {min_height}px</p>
                </div>
                <div className="text-sm text-gray-500">
                    <p><strong>Current Screen:</strong></p>
                    <p>Width: {screenSize.width}px | Height: {screenSize.height}px</p>
                </div>
                <p className="text-yellow-400 text-sm mt-4">
                    Please resize your window or use a larger screen.
                </p>
            </div>
        </div>
    );
};

export default ScreenTooSmallWindow;