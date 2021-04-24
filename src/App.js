import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from "react";
import { GameManager } from './GameManager';

function App() {

  const [gameStarted, setGameStarted] = useState(false)
  const [discardMemory, setDiscardMemory] = useState(10)
  const [gameScoreLimit, setGameScoreLimit] = useState(100)
  const [ginBonus, setGinBonus] = useState(25)
  const [undercutBonus, setUndercutBonus] = useState(25)



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
        gameStarted ? <GameManager 
                        onExit={setGameStarted}
                        discardMemory={discardMemory}
                        gameScoreLimit={gameScoreLimit}
                        undercutBonus={undercutBonus}
                        ginBonus={ginBonus}/> : 
        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '500px'}}>
          <button className='game-button' onClick={() => setGameStarted(true)}>Start Game</button>
          <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'start', marginTop: '20px'}}>
            <div className='settings-item'>
              <label className='game-text' style={{fontSize: '16px', marginRight: '10px'}}>Computer Discard Memory:</label>
              <input type='number' style={{maxWidth: '50px'}} value={discardMemory} onChange={(e) => setDiscardMemory(e.target.value)}/>
            </div>
            <div className='settings-item'>
              <label className='game-text' style={{fontSize: '16px', marginRight: '10px'}}>Game Score Limit:</label>
              <input type='number' style={{maxWidth: '50px'}} value={gameScoreLimit} onChange={(e) => setGameScoreLimit(e.target.value)}/>
            </div>
            <div className='settings-item'>
              <label className='game-text' style={{fontSize: '16px', marginRight: '10px'}}>Gin Bonus:</label>
              <input type='number' style={{maxWidth: '50px'}} value={ginBonus} onChange={(e) => setGinBonus(e.target.value)}/>
            </div>
            <div className='settings-item'>
              <label className='game-text' style={{fontSize: '16px', marginRight: '10px'}}>Undercut Bonus:</label>
              <input type='number' style={{maxWidth: '50px'}} value={undercutBonus} onChange={(e) => setUndercutBonus(e.target.value)}/>
            </div>
          </div>
        </div>
      }
    </>
  
  );
}

export default App;
