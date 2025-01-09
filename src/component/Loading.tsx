import { useState, useEffect, useContext } from 'react';
import { AppContext } from '../App';

const Loading = () => {
  const { _setIsLoading }: { _setIsLoading: React.Dispatch<React.SetStateAction<boolean>> } = useContext(AppContext);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(count + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [count]);

  return (
    <div 
      className='fixed left-0 top-0 w-full h-full bg-black/30 flex justify-center items-center'
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          _setIsLoading(false);
        }
      }}
    >
      <div className='w-[150px] h-[100px] bg-white flex justify-center items-center'>
        loading...{count}
      </div>
    </div>
  )
}

export default Loading