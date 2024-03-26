import React, {useState, useEffect} from 'react';
import './TaskBar.css'; // Assuming you will put your CSS here
import MainContentBrowser from './MainContentBrowser';


const TaskBarWindowIcon = ({ window, toggleWindowVisibility}) => {
    return (
      <div className="window-icon" onClick={() => toggleWindowVisibility(window.id)}>
            {window.text}
      </div>
    );
  };

const Taskbar = ({openWindows, setOpenWindows }) => {

    const [showContent, setShowContent] = useState(false);

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

    useEffect(() => {
        setVisibleWindows(new Map(openWindows.map(window => [window.id, visibleWindows.get(window.id) ?? true])));
    }, [openWindows]);

    return (
        <div>
            {openWindows ? (
            openWindows.map((window, index) => (
                <MainContentBrowser
                windowId={window.id}
                key={index}
                title={window.text}
                setShowContent={setShowContent}
                articleFilename={window.click.articleFilename}
                onClose={() => handleCloseWindow(window.id)}
                visibleWindows={visibleWindows}
                toggleWindowVisibility={toggleWindowVisibility}
                />
            ))
            ) : (
            <div></div>
            )}
    
          <div className="taskbar">
            {/* Taskbar content goes here */}
            {openWindows ? (
            openWindows.map((window, index) => (
                <TaskBarWindowIcon
                key={index}
                window={window}
                toggleWindowVisibility={toggleWindowVisibility}
                />
            ))
            ) : (
            <div></div>
            )}            {/* Add more elements as needed */}
          </div>
        </div>
      );
    };


export default Taskbar;