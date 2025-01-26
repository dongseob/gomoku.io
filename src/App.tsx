import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { _getClientId } from '../script';
import Home from './home';
import GameScreen from './gameScreen';

function App() {
  const [clientId, setClientId] = useState('');

  useEffect(() => {
    _getClientId().then((res: any) => {
      setClientId(res);
    });
  }, []);

  return (
    <BrowserRouter>
      <div className='w-[400px] h-[300px] bg-red-300 relative'>
        <Routes>
          <Route path='/' element={<Home clientId={clientId} />} />
          <Route path='/gameScreen' element={<GameScreen />} />
        </Routes>

        {/* yogiyo */}
        {/* <GameScreen clientId={clientId}></GameScreen> */}
      </div>
    </BrowserRouter>
  );
}

export default App;
