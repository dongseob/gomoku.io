import { useEffect, useState } from 'react';
import { _cancelMatching, _matching } from '../../script';

export const Loading = ({ setIsLoading, type }: { setIsLoading: (loading: boolean) => void; type: string }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    _matching(type);

    const interval = setInterval(() => {
      setCount((prevCount) => prevCount + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className='fixed top-0 left-0 bg-black/40 w-full h-full flex items-center justify-center'>
      <div className='bg-white w-[200px] h-[150px] flex flex-col p-2'>
        <p className='h-full w-full flex items-center justify-center'>loading..{count}</p>
        <div
          className='w-full bg-red-300 mt-auto text-center cursor-pointer p-2 rounded-md'
          onClick={() => {
            setIsLoading(false);
            _cancelMatching();
          }}
        >
          cancel
        </div>
      </div>
    </div>
  );
};
