import React, { useRef, useEffect, useState } from 'react';
import './artwork.css';
import UploadArtwork from './UploadArtwork';
import '../MainContentBrowser.css'
import { isMobile } from 'react-device-detect';

const CreateArtwork = () => {
    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    // Removed color and lineWidth from useEffect dependencies
    const [color, setColor] = useState('black');
    const [lineWidth, setLineWidth] = useState(5);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        // Make canvas responsive
        const scale = window.innerWidth < 512 ? window.innerWidth / 520 : 1;
        const width = 512 * scale;
        const height = 512 * scale;

        canvas.width = width * 2; // for internal canvas resolution
        canvas.height = height * 2; // Adjust height similarly to maintain aspect ratio
        canvas.style.width = `${width}px`; // Adjust CSS width to scale down on smaller screens
        canvas.style.height = `${height}px`;

        context.scale(2, 2); // Adjust scale for high DPI displays
        context.lineCap = 'round';
        context.strokeStyle = color;
        context.lineWidth = lineWidth;
        context.fillStyle = 'white';
        context.fillRect(0, 0, canvas.width / 2, canvas.height / 2); // Fill the canvas with white background
        contextRef.current = context;

        const preventTouchScroll = (event) => event.preventDefault();

        canvas.addEventListener('touchstart', preventTouchScroll, { passive: false });
        canvas.addEventListener('touchmove', preventTouchScroll, { passive: false });
    
        // Cleanup function to remove the event listeners
        return () => {
            canvas.removeEventListener('touchstart', preventTouchScroll);
            canvas.removeEventListener('touchmove', preventTouchScroll);
        };
    }, []); // Dependencies to reinitialize canvas on changes

    // Update the context properties when color or lineWidth changes
    useEffect(() => {
        if (contextRef.current) {
            contextRef.current.strokeStyle = color;
            contextRef.current.lineWidth = lineWidth;
        }
    }, [color, lineWidth]);

    const startDrawing = ({ nativeEvent }) => {
        const { offsetX, offsetY } = getCoordinates(nativeEvent);
        contextRef.current.beginPath();
        contextRef.current.moveTo(offsetX, offsetY);
        setIsDrawing(true);
    };

    const draw = ({ nativeEvent }) => {
        if (!isDrawing) {
            return;
        }
        const { offsetX, offsetY } = getCoordinates(nativeEvent);
        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.stroke();
    };

    const finishDrawing = () => {
        contextRef.current.closePath();
        setIsDrawing(false);
    };

    // Helper function to get correct coordinates for both mouse and touch events
    const getCoordinates = (nativeEvent) => {
        if (nativeEvent.touches) {
            // For touch events
            const canvas = canvasRef.current;
            const rect = canvas.getBoundingClientRect(); // Get canvas position and size
            return {
                offsetX: nativeEvent.touches[0].clientX - rect.left - window.scrollX,
                offsetY: nativeEvent.touches[0].clientY - rect.top - window.scrollY
            };
        } else {
            // For mouse events
            return {
                offsetX: nativeEvent.offsetX,
                offsetY: nativeEvent.offsetY
            };
        }
    };

    // Handlers for changing pencil size
    const changePencilSize = (size) => {
        setLineWidth(size);
    };

    const changeColor = (newColor) => {
        setColor(newColor);
    };

    return (
            <div className='artworkContainer' >
                <div className='createArtworkContainer'>

                    <div className='controls'>
                        {/* Color buttons */}
                        <button className={`colorButton ${color === 'red' ? 'active' : ''}`} onClick={() => changeColor('red')}>
                            <div className="colorIndicator" style={{ backgroundColor: 'red' }}></div>
                        </button>
                        <button className={`colorButton ${color === 'green' ? 'active' : ''}`} onClick={() => changeColor('green')}>
                            <div className="colorIndicator" style={{ backgroundColor: 'green' }}></div>
                        </button>
                        <button className={`colorButton ${color === 'blue' ? 'active' : ''}`} onClick={() => changeColor('blue')}>
                            <div className="colorIndicator" style={{ backgroundColor: 'blue' }}></div>
                        </button>

                        {/* Size buttons - Use the sizeIndicator class with dynamic styles for different sizes */}
                        <button className={`sizeButton ${lineWidth === 2 ? 'active' : ''}`} onClick={() => changePencilSize(2)}>
                            <div className="sizeIndicator" style={{ width: '10px', height: '10px' }}></div> {/* Smaller circle for thin */}
                        </button>
                        <button className={`sizeButton ${lineWidth === 5 ? 'active' : ''}`} onClick={() => changePencilSize(5)}>
                            <div className="sizeIndicator"></div> {/* Default size */}
                        </button>
                        <button className={`sizeButton ${lineWidth === 10 ? 'active' : ''}`} onClick={() => changePencilSize(10)}>
                            <div className="sizeIndicator" style={{ width: '30px', height: '30px' }}></div> {/* Larger circle for thick */}
                        </button>
                    </div>
                    <canvas className='drawingCanvas'
                        onMouseDown={startDrawing}
                        onMouseUp={finishDrawing}
                        onMouseMove={draw}
                        onMouseOut={finishDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={finishDrawing}
                        ref={canvasRef}
                    />
                </div>

                <h1 style={{marginBottom: '-15px'}}>↓ Upload for eternal fame ↓</h1>
                <UploadArtwork canvasRef={canvasRef} />

            </div>
    );
};

export default CreateArtwork;
