import { useState } from 'react';
import './App.css';
import Player from './components/Player';
import PlayerContext, {initialState} from './context/PlayerContext';

function App() {
  const [state, setState] = useState(initialState)

  return (
    <div className="App">
      <PlayerContext.Provider value={[state, setState]}>
        <Player />
      </PlayerContext.Provider>
    </div>
  );
}

export default App;
