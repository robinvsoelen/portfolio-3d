import React from 'react';
import './App.css'; // Your main application styles


// Import components
//import Header from './components/common/Header';
//import Footer from './components/common/Footer';
// Example of importing a 3D scene component
import MainScene from './components/scenes/MainScene';

function App() {
  return (
    <div className="App" >
      {/* Your routing and main content would typically go here. For simplicity, we're just rendering the HomeScene */}
      <main>
        <MainScene />
      </main>
    </div>
  );
}

export default App;