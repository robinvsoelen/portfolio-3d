import React, { useState, useEffect } from 'react';
import './MainContentBrowser.css'; // Make sure to create this CSS file
import CreateArtwork from './artwork/CreateArtwork';
import { isMobile } from 'react-device-detect';
import ShowArtwork from './artwork/ShowArtwork'

const MainContentBrowser = ({onClose, visibleWindows, toggleWindowVisibility, bringToFront, browserWindow }) => {
  const [searchQuery, setSearchQuery] = useState(`${process.env.PUBLIC_URL}/articles/${browserWindow.click.articleFilename}`);


  const PageNotFound  = () => "<h1>404 Page Not Found</h1><p>You messed up. Shame on you.</p>"
  // Placeholder function for handling search
  const handleSearch = () => {
    fetch(`${searchQuery}`)
      .then(response => {

        return response.text()
      })
      .then(html => {
        if (html.startsWith('<!DOCTYPE html>')) {
          // If the server response was not ok (e.g., 404 or 500 error), throw an error
          throw new Error('Network response was not ok');
        }
        else 
        {
          setArticleContent(html);
        }
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        // Handle the error, e.g., by setting an error message in the state to display to the user
        setArticleContent(PageNotFound);
      });
  };

  const handleLinkClick = (e) => {
    const href = e.target.href;
    if (href.includes("INTERNAL_LINK/")) {
      e.preventDefault();
      const lastSlashIndex = href.lastIndexOf('/');
      const articleFilename = href.substring(lastSlashIndex + 1);
      const newSearchQuery = `${process.env.PUBLIC_URL}/articles/${articleFilename}`;
      setSearchQuery(newSearchQuery);
      handleLinkSearch(newSearchQuery);  // Pass the new search query directly
      browserWindow.text = articleFilename.replace(".html", "").toUpperCase()
    }
  };
  
  const handleLinkSearch = (query) => {  // Accept query as an argument
    fetch(query)
      .then(response => response.text())
      .then(html => {
        if (!html.startsWith('<!DOCTYPE html>')) {
          setArticleContent(html);
        } else {
          // If the server response was not ok (e.g., 404 or 500 error), handle it
          throw new Error('Network response was not ok');
        }
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        setArticleContent(PageNotFound());
      });
  };

  const handleContentMount = (node) => {
    if (node) {
      const links = node.querySelectorAll('a');
      links.forEach(link => {
        link.addEventListener('click', handleLinkClick);
      });
    }
  };

  const [articleContent, setArticleContent] = useState('');

  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const [isResizing, setIsResizing] = useState(false);
  const [startResizePosition, setStartResizePosition] = useState({ x: 0, y: 0 });
  const [startSize, setStartSize] = useState({ width: 0, height: 0 });
  const [currentResizeDirection, setCurrentResizeDirection] = useState('');
  const [size, setSize] = useState({ width: window.innerWidth * 0.4, height: window.innerHeight * 0.6 }); 

  const [isFullscreen, setIsFullscreen] = useState(false); 

  useEffect(() => {
    const calculateCenterPosition = () => {
      const x = (window.innerWidth - document.querySelector('.mainContentBrowser').offsetWidth) / 4 - (Math.random() * 100);
      const y = (window.innerHeight - document.querySelector('.mainContentBrowser').offsetHeight) / 8 - (Math.random() * 100);
      setPosition({ x, y });
      setStartPosition({ x, y });
    };

    calculateCenterPosition();

    return () => window.removeEventListener('resize', calculateCenterPosition);
  }, []);

  const handleResizeStart = (e, direction) => {
    setIsResizing(true);
    setStartResizePosition({ x: e.clientX, y: e.clientY });
    setStartSize({
      width: document.querySelector('.mainContentBrowser').offsetWidth,
      height: document.querySelector('.mainContentBrowser').offsetHeight,
    });
    setCurrentResizeDirection(direction);
  };
  
  const handleResizeMove = (e) => {
    if (!isResizing) return;
    
    const minWidth = 300;
    const minHeight = 200;
    let newWidth = startSize.width;
    let newHeight = startSize.height;
  
    if (currentResizeDirection.includes('right')) {
      newWidth = startSize.width + (e.clientX - startResizePosition.x);
      if (newWidth < minWidth) newWidth = minWidth;
    }
    if (currentResizeDirection.includes('bottom')) {
      newHeight = startSize.height + (e.clientY - startResizePosition.y);
      if (newHeight < minHeight) newHeight = minHeight;
    }
  
    setSize({width: newWidth, height: newHeight });
  };
  
  const handleResizeEnd = () => {
    setIsResizing(false);
  };

  useEffect(() => {
    const handleMouseMove = (e) => handleResizeMove(e);
    const handleMouseUp = () => handleResizeEnd();
  
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
  
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, handleResizeMove, handleResizeEnd]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartPosition({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - startPosition.x,
      y: e.clientY - startPosition.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/articles/${browserWindow.click.articleFilename}`)
      .then(response => response.text())
      .then(html => {
        setArticleContent(html);
      });
  }, [browserWindow.click.articleFilename]);

  useEffect(() => {
    const move = (e) => handleMouseMove(e);
    const up = () => handleMouseUp();
  
    if (isDragging) {
      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', up);
    }
  
    return () => {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', up);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);


  return (
    <div
    className="mainContentBrowser"
    onMouseDown={() => bringToFront(browserWindow.id)} 
    style={{
      left: isFullscreen  || isMobile ? '0px' : `${position.x}px`,
      top: isFullscreen  || isMobile ? '0px' : `${position.y}px`,
      width: isFullscreen || isMobile ? '100%' : `${size.width}px`,
      height: isFullscreen || isMobile ? 'calc(100% - 72px)' : `${size.height}px`,
      transform: 'none',
      position: isFullscreen || isMobile ? 'fixed' : 'absolute', 
      margin: isFullscreen || isMobile  ? '0px' : '20px', 
      zIndex: visibleWindows.get(browserWindow.id)?.zIndex || 1, 
      display: visibleWindows.get(browserWindow.id) ? 'flex' : 'none'

    }}
  >      
  <div className="titleBar" onMouseDown={handleMouseDown}>
        <span className="title">{browserWindow.text}</span>
        <div className="windowControls">
          <button className="minimize" onClick={() => toggleWindowVisibility(browserWindow.id)}>-</button>
         {!isMobile && <button className="maximize" onClick={() => setIsFullscreen(!isFullscreen)}>[]</button>}
          <button className="close" onClick={() => onClose(browserWindow.id)}>x</button>
        </div>
      </div>
     {!browserWindow.click.isArtworkCreator && !browserWindow.click.isArtworkShower &&  
     <div className="searchBar">
        <input 
          type="text" 
          placeholder="Search or enter address" 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
        />
        <button onClick={handleSearch}>Go</button>
      </div>}
      {!browserWindow.click.isArtworkCreator && !browserWindow.click.isArtworkShower && 
      <div className="content">
       <div className='article' ref={handleContentMount}
 dangerouslySetInnerHTML={{ __html: articleContent }} />
      </div>
      }
      {browserWindow.click.isArtworkCreator && <CreateArtwork/> }
      
      {browserWindow.click.isArtworkShower && <ShowArtwork/> }


      <div className="resizeHandle right" onMouseDown={(e) => handleResizeStart(e, 'right')}></div>
      <div className="resizeHandle bottom" onMouseDown={(e) => handleResizeStart(e, 'bottom')}></div>
    </div>
  );
};

export default MainContentBrowser;