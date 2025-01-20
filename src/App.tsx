import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './home';
import GameScreen from './gameScreen';

function App() {
  return (
    <BrowserRouter>
      <div className='w-[400px] h-[300px] bg-red-300'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gameScreen" element={<GameScreen />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
