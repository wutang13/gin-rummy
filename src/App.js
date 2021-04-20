import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from "react";
import { GameManager } from './GameManager';

function App() {

  const [gameStarted, setGameStarted] = useState(false)
  const [discardMemory, setDiscardMemory] = useState(10)

  return (
    <>
      <h1 style={{fontFamily: 'Lato',
                  fontSize: '80px',
                  color: '#F1FAEE',
                  backgroundColor:"#457B9D",
                  margin:"0",
                  textAlign: 'center',
                  padding: '20px'}}>Gin Rummy</h1>
      {
        gameStarted ? <GameManager onExit={setGameStarted} discardMemory={discardMemory}/> : 
        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '500px'}}>
          <button className='game-button' onClick={() => setGameStarted(true)}>Start Game</button>
          <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: '20px'}}>
            <label className='game-text' style={{fontSize: '16px', marginRight: '10px'}}>Computer Discard Memory:</label>
            <input type='number' style={{maxWidth: '50px'}} value={discardMemory} onChange={(e) => setDiscardMemory(e.target.value)}/>
          </div>
        </div>
      }
    </>
  
  );
}

export default App;
