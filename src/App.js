import './App.css';
import { GameManager } from './GameManager';

function App() {
  return (
    <>
      <h1 style={{fontFamily: 'Lato',
                  fontSize: '80px',
                  color: '#F1FAEE',
                  backgroundColor:"#457B9D",
                  margin:"0",
                  textAlign: 'center',
                  padding: '20px'}}>Gin Rummy</h1>
      <GameManager/>
    </>
  
  );
}

export default App;
