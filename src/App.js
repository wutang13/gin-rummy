import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from "react";
import { GameManager } from './GameManager';

function App() {

  const [gameStarted, setGameStarted] = useState(false)

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
        gameStarted ? <GameManager onExit={setGameStarted}/> : 
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '500px'}}>
          <button className='game-button' onClick={() => setGameStarted(true)}>Start Game</button>
        </div>
      }
    </>
  
  );
}

export default App;
