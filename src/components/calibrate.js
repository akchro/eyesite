'use client';

import { useWebGazer } from "@/components/webgazerProvider";
import { useState } from 'react';
import Gaze from './gaze';

export default function Calibrate({calibrationComplete, setCalibrationComplete, calibrationPoints, setCalibrationPoints}) {
    const { calibrateAt, isReady } = useWebGazer();

    const handleClick = (e) => {
        const pointId = e.target.id;
        const rect = e.target.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        // Mark this point as calibrated
        setCalibrationPoints(prev => {
            const newPoints = {
                ...prev,
                [pointId]: true
            };

            // Check if all points are calibrated
            if (Object.keys(newPoints).length === 9) {
                setCalibrationComplete(true);
            }

            return newPoints;
        });
        
        // Call the calibration function
        calibrateAt(x, y);
    };



    if (!isReady) return <p className="text-center mt-10 text-xl">Loading eye tracker...</p>;

    return (
        <div className="relative w-full h-screen">
            {/* Calibration points */}
            <button 
                id="Pt1" 
                onClick={handleClick} 
                className={`absolute top-[70px] left-[2vw] w-8 h-8 rounded-full z-10 ${
                    calibrationPoints.Pt1 ? 'bg-green-600 calibrated' : 'bg-blue-600 calibration-point'
                }`} 
            />
            <button 
                id="Pt2" 
                onClick={handleClick} 
                className={`absolute top-[70px] left-1/2 ml-[-20px] w-8 h-8 rounded-full ${
                    calibrationPoints.Pt2 ? 'bg-green-600 calibrated' : 'bg-blue-600 calibration-point'
                }`} 
            />
            <button 
                id="Pt3" 
                onClick={handleClick} 
                className={`absolute top-[70px] right-[2vw] w-8 h-8 rounded-full ${
                    calibrationPoints.Pt3 ? 'bg-green-600 calibrated' : 'bg-blue-600 calibration-point'
                }`} 
            />
            
            <button 
                id="Pt4" 
                onClick={handleClick} 
                className={`absolute top-1/2 left-[2vw] mt-[-16px] w-8 h-8 rounded-full ${
                    calibrationPoints.Pt4 ? 'bg-green-600 calibrated' : 'bg-blue-600 calibration-point'
                }`} 
            />
            <button 
                id="Pt5" 
                onClick={handleClick} 
                className={`absolute top-1/2 left-1/2 mt-[-16px] ml-[-16px] w-8 h-8 rounded-full ${
                    calibrationPoints.Pt5 ? 'bg-green-600 calibrated' : 'bg-blue-600 calibration-point'
                }`} 
            />
            <button 
                id="Pt6" 
                onClick={handleClick} 
                className={`absolute top-1/2 right-[2vw] mt-[-16px] w-8 h-8 rounded-full ${
                    calibrationPoints.Pt6 ? 'bg-green-600 calibrated' : 'bg-blue-600 calibration-point'
                }`} 
            />
            
            <button 
                id="Pt7" 
                onClick={handleClick} 
                className={`absolute bottom-[2vw] left-[2vw] w-8 h-8 rounded-full ${
                    calibrationPoints.Pt7 ? 'bg-green-600 calibrated' : 'bg-blue-600 calibration-point'
                }`} 
            />
            <button 
                id="Pt8" 
                onClick={handleClick} 
                className={`absolute bottom-[2vw] left-1/2 ml-[-16px] w-8 h-8 rounded-full ${
                    calibrationPoints.Pt8 ? 'bg-green-600 calibrated' : 'bg-blue-600 calibration-point'
                }`} 
            />
            <button 
                id="Pt9" 
                onClick={handleClick} 
                className={`absolute bottom-[2vw] right-[2vw] w-8 h-8 rounded-full ${
                    calibrationPoints.Pt9 ? 'bg-green-600 calibrated' : 'bg-blue-600 calibration-point'
                }`} 
            />
            


        </div>
    );
}
