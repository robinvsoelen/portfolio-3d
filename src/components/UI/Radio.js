import React, { useState, useEffect, useRef } from 'react';
import './Radio.css'; 

const stations = [
    { frequency: 88.1, name: "robovs classics", streamUrl: "assets/audio/robovs classics.mp3" },
    { frequency: 92.5, name: "robovs unreleased", streamUrl: "assets/audio/robovs unreleased.mp3" },
    { frequency: 95.8, name: "acoustic guitar noodling FM", streamUrl: "assets/audio/jazz.mp3" },
  ];

const Radio = () => {
  const [currentStationIndex, setCurrentStationIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const audioRef = useRef(new Audio());
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const currentStation = stations[currentStationIndex];
    const audio = audioRef.current;
    audio.src = currentStation.streamUrl;
    audio.volume = 0.5;
    audio.loop = true;

    const playRandomPosition = () => {
        if (audio.duration > 0) {
            const randomTime = Math.random() * audio.duration;
            audio.currentTime = randomTime;
            audio.play()
                .catch(error => console.error("Playback failed", error));
        }
    };

    audio.addEventListener('loadedmetadata', playRandomPosition);
    
    setHasLoaded(true);

    return () => {
        audio.removeEventListener('loadedmetadata', playRandomPosition);
    };
}, [currentStationIndex]);

  const tuneStation = (direction) => {
    setCurrentStationIndex(prevIndex => {
      let newIndex = prevIndex + direction;
      if (newIndex < 0) newIndex = stations.length - 1;
      if (newIndex >= stations.length) newIndex = 0;
      return newIndex;
    });
  };

  useEffect(() => {
    if (hasLoaded) {
        if (isPlaying) audioRef.current.play();
        else  audioRef.current.pause();
    }
  }, [isPlaying])

  return (
    <div className="radio-container">
      <div className="station-display">
        Listening to: {stations[currentStationIndex].name} ({stations[currentStationIndex].frequency} MHz)
      </div>
      <div className="tuning-controls">
        <img onClick={() => tuneStation(-1)} className='radio-button back'  src="assets/img/next.svg"></img>
        {isPlaying && <img onClick={() => setIsPlaying(!isPlaying)} src="assets/img/pause.svg" className='radio-button'></img>}
        {!isPlaying && <img onClick={() => setIsPlaying(!isPlaying)} src="assets/img/play.svg" className='radio-button'></img>}
        <img onClick={() => tuneStation(1)} className='radio-button' src="assets/img/next.svg"></img>
      </div>
    </div>
  );
};

export default Radio;