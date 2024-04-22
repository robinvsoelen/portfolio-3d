import React, { useState, useEffect, useRef } from 'react';
import './TaskBar.css'; 
import MainContentBrowser from './MainContentBrowser';
import Radio from './Radio';
import { Car } from '../3D/CarModel';
import { isMobile, isTablet } from 'react-device-detect';

const TaskBarWindowIcon = ({ window, toggleWindowVisibility, visibleWindows }) => {
  const isVisible = visibleWindows.get(window.id);
  const iconClasses = `window-icon ${isVisible ? 'pressed' : ''}`;

  return (
    <div className={iconClasses} onClick={() => toggleWindowVisibility(window.id)}>
      {!window.click.isArtworkCreator && !window.click.isArtworkShower && <img src="assets/img/fancy-window.svg" />}
      {window.click.isArtworkCreator && <img src="assets/img/paintbrush.svg" />}
      {window.click.isArtworkShower && <img src="assets/img/gallery.svg" />}


    </div>
  );
};

const StartMenu = ({ isVisible, onMenuItemClick }) => {
  if (!isVisible) return null;

  const menuItems = [
    { id: 1, text: 'Help' },
    { id: 2, text: 'Shut Down' },
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
    audio.volume = 1;
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

    return () => clearInterval(timer);
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

  const ShowHelp = () => {

  }

  const [shutDownWarning, setShutDownWarning] = useState(false);
  const [hasShutDown, setHasShutdown] = useState(false);
  const [helpMessage, setHelpMessage] = useState(false);
  const [loveLifeMessage, setLoveLifeMessage] = useState(false);
  const [pastaMessage, setPastaMessage] = useState(false);
  const [websiteMessage, setWebsiteMessage] = useState(false);


  const ShutDown = () => {
    const audio = new Audio();
    audio.src = 'assets/audio/shutdown.mp3';
    audio.volume = 1;
    audio.play()

    setShutDownWarning(false);
    setHasShutdown(true);

    setTimeout(() => {
      var element = document.getElementById('powerbutton');
      element.style.opacity = 1;
    }, 1000);
  }

  const powerOn = () => {
    const audio = new Audio();
    audio.src = 'assets/audio/startup.mp3';
    audio.volume = 1;
    audio.play()

    var element = document.getElementById('blackout');
    element.style.opacity = 0;
    var element = document.getElementById('powerbutton');
    element.style.display = 'none';

    setTimeout(() => {
      setHasShutdown(false);
    }, 1000);


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


      <div id={"tooltip"} ></div>

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
          { label: 'Sweet!', onClick: attachGuitar },
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

      {helpMessage && <MessageBox
        type="info"
        message="What can I help you with?"
        options={[
          { label: 'My relationship', onClick: () => { setLoveLifeMessage(true); setHelpMessage(false) }}, 
          { label: 'Cooking pasta', onClick: () => { setPastaMessage(true); setHelpMessage(false) }}, 
          { label: 'This website', onClick: () => {setWebsiteMessage(true) ; setHelpMessage(false)}},
        ]}
      />
      }

      {loveLifeMessage && <MessageBox
        type="info"
        message="Love yourself first, surprise each other every once in a while and make sure to communicate"
        options={[
          { label: 'Aight, thanks!', onClick: () => setLoveLifeMessage(false) }, 
        ]}
      />
      }

      {pastaMessage && <MessageBox
        type="info"
        message="Boil water. When it boils add the pasta. Cook it for about 10 minutes. Add salt for flavor"
        options={[
          { label: 'Brilliant!', onClick: () => setPastaMessage(false) },
        ]}
      />
      }

      {(isMobile || isTablet) && websiteMessage && <MessageBox
        type="info"
        message="Scroll vertically to move. Scroll horizontally to pan the camera. Double tap on the items you want to interact with"
        options={[
          { label: 'Thank you so so much!', onClick: () => setWebsiteMessage(false) }, 
        ]}
      />
      }

      {(!isMobile && !isTablet) && websiteMessage && <MessageBox
        type="info"
        message="Use the mousewheel to move. Use the left mouse button to click on stuff."
        options={[
          { label: 'Thank you so so much!', onClick: () => setWebsiteMessage(false) }, 
        ]}
      />
      }

      {shutDownWarning && <MessageBox
        type="info"
        message="Are you sure you want to shut down? It seems like a bad idea..."
        options={[
          { label: 'Nevermind', onClick: () => setShutDownWarning(false) }, 
          { label: 'I have no fear!', onClick: () => ShutDown() } 
        ]}
      />
      }

      {hasShutDown && <div id='blackout' className="blackout">
        <img src='assets/img/powerbutton.svg' id='powerbutton' onClick={() => powerOn()}></img>
      </div>}


      <div className="taskbar">
        <StartMenu
          isVisible={showStart}
          onMenuItemClick={(itemId) => {
            if (itemId == 1) setHelpMessage(true);
            if (itemId == 2) setShutDownWarning(true);
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