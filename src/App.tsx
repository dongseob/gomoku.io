import { createContext, useState, useEffect } from 'react';
import './App.css';
import Home from './home';
import Loading from './component/Loading';

type AppContextType = {
  _isLoading: boolean;
  _setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  _clientId: string;
  _setClientId: React.Dispatch<React.SetStateAction<string>>;
}

export const AppContext = createContext<AppContextType>({
  _isLoading: false,
  _setIsLoading: () => {},
  _clientId: '',
  _setClientId: () => {},
});

function App() {
  const [_isLoading, _setIsLoading] = useState<boolean>(false);
  const [_clientId, _setClientId] = useState<string>('');

  useEffect(() => {
    const savedClientId = localStorage.getItem('clientId');
    if (savedClientId) {
      _setClientId(savedClientId);
    } else {
      const timestamp = Date.now().toString();
      localStorage.setItem('clientId', timestamp);
      _setClientId(timestamp);
    }
  }, []);

  return (
   <div className='w-[400px] h-[300px] relative'>
      <AppContext.Provider value={{ 
        _isLoading: _isLoading, 
        _setIsLoading: _setIsLoading, 
        _clientId: _clientId,
        _setClientId: _setClientId
      }}>
        <Home />
  
        {_isLoading && <Loading />}
      </AppContext.Provider>
   </div>
  );
}

export default App;