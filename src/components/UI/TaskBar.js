import React, { useState, useEffect, useRef } from 'react';
import './TaskBar.css'; // Assuming you will put your CSS here
import MainContentBrowser from './MainContentBrowser';
import Radio from './Radio';
import { Car } from '../3D/CarModel';

const TaskBarWindowIcon = ({ window, toggleWindowVisibility, visibleWindows }) => {
  const isVisible = visibleWindows.get(window.id);
  const iconClasses = `window-icon ${isVisible ? 'pressed' : ''}`;

  return (
    <div className={iconClasses} onClick={() => toggleWindowVisibility(window.id)}>
      {!window.click.isArtworkCreator && !window.click.isArtworkShower && <img src="assets/img/fancy-window.svg" /> }
      {window.click.isArtworkCreator && <img src="assets/img/paintbrush.svg" /> }
      {window.click.isArtworkShower && <img src="assets/img/gallery.svg" /> }


    </div>
  );
};

const StartMenu = ({ isVisible, onMenuItemClick }) => {
  if (!isVisible) return null;

  const menuItems = [
    { id: 1, text: 'Programs' },
    { id: 2, text: 'Documents' },
    // Add more menu items here
    { id: 3, text: 'Settings' },
    { id: 4, text: 'Shut Down' },
  ];

  return (
    <div className="start-menu">
      {menuItems.map(item => (
        <div key={item.id} className="menu-item" onClick={() => onMenuItemClick(item.id)}>
          {item.text}
        </div>
      ))}
    </div>
  );
};


const MessageBox = ({ type, title, message, options }) => {
  return (
    <div className={`message-box ${type}`}>
      <div className="message-title-bar"><span >{title}</span></div>
      <div className="message-content">
        <div className="message-icon"></div>
        <div className="message-text">{message}</div>
      </div>
      <div className="message-buttons">
        {options.map((option, index) => (
          <button key={index} onClick={option.onClick} className="message-button">
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};


const Taskbar = ({ openWindows, setOpenWindows, hoverText, setFoundRadio, foundRadio, carRef, foundGuitar, foundSurfboard }) => {

  const [showContent, setShowContent] = useState(false);
  const [showStart, setShowStart] = useState(false);
  const [highestZIndex, setHighestZIndex] = useState(0);

  const startIconClasses = `window-icon ${showStart ? 'pressed' : ''}`;


  const [visibleWindows, setVisibleWindows] = useState(() =>
    new Map(openWindows.map(window => [window.id, true]))
  );

  const handleCloseWindow = (windowId) => {
    setOpenWindows(currentWindows => currentWindows.filter(window => window.id !== windowId));
  };

  const toggleWindowVisibility = (windowId) => {
    setVisibleWindows(currentVisibleWindows => {
      const newVisibleWindows = new Map(currentVisibleWindows);
      newVisibleWindows.set(windowId, !newVisibleWindows.get(windowId));
      return newVisibleWindows;
    });
    console.log(visibleWindows)
  };

  const honk = () => {
    carRef.current.onHonk();
    const audio = new Audio();
    audio.src = 'assets/audio/car-horn.mp3';
    audio.volume = 0.8;
    audio.play()
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === "Space") {
        honk();
      }
    };
  
    window.addEventListener('keydown', handleKeyDown);
  
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    setVisibleWindows(new Map(openWindows.map(window => [window.id, visibleWindows.get(window.id) ?? true])));
  }, [openWindows]);

  const bringToFront = (windowId) => {
    setVisibleWindows(prevVisibleWindows => {
      const updated = new Map(prevVisibleWindows);
      // Assuming you want to use the same map to store visibility and z-index, you could store an object instead
      // If the value is currently just a boolean, you'll need to adjust how you handle visibility as well
      updated.set(windowId, { ...updated.get(windowId), zIndex: highestZIndex + 1 });
      return updated;
    });
    setHighestZIndex(highestZIndex + 1);
  };

  const [currentTime, setCurrentTime] = useState(new Date());

  const [attachedRadio, setAttachedRadio] = useState(false);
  const [attachedGuitar, setAttachedGuitar] = useState(false);
  const [attachedSurfboard, setAttachedSurfboard] = useState(false);


  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer); // Cleanup the interval on component unmount
  }, []);

  const attachRadio = () => {
    setAttachedRadio(true);
    setFoundRadio(false);
  };

  const attachGuitar = () => {
    setAttachedGuitar(true);
    carRef.current.foundGuitar();
  }

  const attachSurfboard = () => {
    setAttachedSurfboard(true);
    carRef.current.foundSurfboard();
  }

  return (
    <div>
      {openWindows ? (
        openWindows.map((window, index) => (
          <MainContentBrowser
            bringToFront={bringToFront}
            key={window.id}
            setShowContent={setShowContent}
            onClose={() => handleCloseWindow(window.id)}
            visibleWindows={visibleWindows}
            toggleWindowVisibility={toggleWindowVisibility}
            browserWindow={window}
          />
        ))
      ) : (
        <div></div>
      )}

      {!attachedRadio && foundRadio && <MessageBox
        type="info"
        message="You just found a radio!"
        options={[
          { label: 'Awesome!', onClick: attachRadio },
        ]}
      />
      }

      {!attachedGuitar && foundGuitar && <MessageBox
        type="info"
        message="You just found a guitar!"
        options={[
          { label: 'Awesome!', onClick: attachGuitar },
        ]}
      />
      }

      {!attachedSurfboard && foundSurfboard && <MessageBox
        type="info"
        message="You just found a surfboard!"
        options={[
          { label: 'Radical dude!', onClick: attachSurfboard },
        ]}
      />
      } 

      <div className="taskbar">
        <StartMenu
          isVisible={showStart}
          onMenuItemClick={(itemId) => {
            console.log('Menu item clicked:', itemId);
            setShowStart(false);
          }}
        />

        <div className={startIconClasses} onClick={() => setShowStart(prev => !prev)}>
          <img src="assets/img/start-menu.svg" />
        </div>

        <div className='taskbar-break'>
          ||
        </div>

        {openWindows ? (
          openWindows.map((window, index) => (
            <TaskBarWindowIcon
              visibleWindows={visibleWindows}
              key={index}
              window={window}
              toggleWindowVisibility={toggleWindowVisibility}
            />
          ))
        ) : (
          <div></div>
        )}

        <div id={"tooltip"} ></div>

        {attachedRadio && <Radio />}
        <div className='honk' onClick={() => honk()}>
        <img className='honkImage' src={'assets/img/klaxon.svg'} width={45} height={45} />
        </div>
        <div className="taskbar-time">
          {currentTime.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};


export default Taskbar;