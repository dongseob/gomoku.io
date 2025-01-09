import { useContext } from 'react';
import { AppContext } from '../App';

const Home = () => {
  const { _setIsLoading, _clientId }: { _setIsLoading: React.Dispatch<React.SetStateAction<boolean>>, _clientId: string } = useContext(AppContext);

  return (
    <div className='h-full flex flex-col justify-center items-center relative bg-red-300'>
      <div className='flex flex-col gap-4'>
        <h1 className='text-center text-[32px] font-bold'>gomoku.io</h1>
        <div className='flex flex-col justify-center items-center gap-2 text-[16px]'>
          <button onClick={() => _setIsLoading(true)} className='border border-black py-2 px-3 hover:bg-black hover:text-white'>
            Quick Start
          </button>
          <button className='border border-black py-2 px-3 hover:bg-black hover:text-white'>Custom Start</button>
        </div>
      </div>
      <p className='absolute top-2 left-2'>
        Your ID: <span>{_clientId}</span>
      </p>
      <p className='absolute top-2 right-2'>prod by dongseob</p>
    </div>
  );
};

export default Home;
