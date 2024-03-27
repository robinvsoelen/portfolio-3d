import React, { useState, useEffect, useRef } from 'react';
import './Radio.css'; // Path to your Radio CSS

const stations = [
    { frequency: 88.1, name: "Classic Rock", streamUrl: "assets/audio/jazz.mp3" },
    { frequency: 92.5, name: "Jazz & Blues", streamUrl: "assets/audio/jazz.mp3" },
    { frequency: 95.8, name: "Pop Hits", streamUrl: "assets/audio/jazz.mp3" },
    // Add more stations as needed, with their corresponding MP3 URLs
  ];

const Radio = () => {
  const [currentStationIndex, setCurrentStationIndex] = useState(0);
  const audioRef = useRef(new Audio());

  useEffect(() => {
    const currentStation = stations[currentStationIndex];
    audioRef.current.src = currentStation.streamUrl;
    audioRef.current.play()
      .catch(error => console.error("Playback failed", error));
  }, [currentStationIndex]);

  const tuneStation = (direction) => {
    setCurrentStationIndex(prevIndex => {
      let newIndex = prevIndex + direction;
      if (newIndex < 0) newIndex = stations.length - 1;
      if (newIndex >= stations.length) newIndex = 0;
      return newIndex;
    });
  };

  return (
    <div className="radio-container">
      <div className="station-display">
        Listening to: {stations[currentStationIndex].name} ({stations[currentStationIndex].frequency} MHz)
      </div>
      <div className="tuning-controls">
        <img onClick={() => tuneStation(-1)} className='radio-button back'  src="assets/img/next.svg"></img>
        <img src="assets/img/pause.svg" className='radio-button'></img>
        <img onClick={() => tuneStation(1)} className='radio-button' src="assets/img/next.svg"></img>
      </div>
    </div>
  );
};

export default Radio;