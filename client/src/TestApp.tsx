import React from 'react';

function TestApp() {
  console.log('TestApp is rendering');
  
  return (
    <div style={{ 
      padding: '20px', 
      background: '#1a1a2e', 
      color: 'white', 
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>🎮 Test App Working!</h1>
      <p>If you can see this, React is rendering correctly.</p>
      <p>Current time: {new Date().toLocaleTimeString()}</p>
    </div>
  );
}

export default TestApp;