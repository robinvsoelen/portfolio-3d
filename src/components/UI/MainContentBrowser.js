import React, { useState } from 'react';
import './MainContentBrowser.css'; // Make sure to create this CSS file

const MainContentBrowser = ({ title, setShowContent, children }) => {
  const [searchQuery, setSearchQuery] = useState('https://www.robinvansoelen.com/content/' + title.toLowerCase().replace(/\s+/g, '-'));

  // Placeholder function for handling search
  const handleSearch = () => {
    alert(`Search for: ${searchQuery}`);
    // Implement your search functionality here
  };


  return (
    <div className="mainContentBrowser">
      <div className="titleBar">
        <span className="title">{title}</span>
        <div className="windowControls">
          <button className="minimize" onClick={() => setShowContent(false)}>-</button>
          <button className="maximize">[]</button>
          <button className="close" onClick={() => setShowContent(false)}>x</button>
        </div>
      </div>
      <div className="searchBar">
        <input 
          type="text" 
          placeholder="Search or enter address" 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
        />
        <button onClick={handleSearch}>Go</button>
      </div>
      <div className="content">
        {children}
      </div>
    </div>
  );
};

export default MainContentBrowser;