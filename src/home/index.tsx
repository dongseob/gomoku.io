import { useState } from 'react';
import { Loading } from '../components/Loading';
import ModalCustomGame from '../components/ModalCustomGame';

const Home = ({ clientId }: { clientId: string }) => {
  const [isLoading, setIsLoading] = useState(false); // 기본 게임 로딩 출력 유무
  const [isCustomModal, setIsCustomModal] = useState(false); // 커스텀 게임 모달 출력 유무
  const [isCopy, setIsCopy] = useState(false); // 클라이언트 ID 복사 유무

  return (
    <>
      <div className='flex flex-col items-center justify-center h-full relative'>
        <div className='flex flex-col items-center justify-center gap-4'>
          <h1 className='text-2xl font-bold'>gomoku.io</h1>
          <div className='flex flex-col gap-2'>
            <button
              onClick={() => {
                setIsLoading(true);
              }}
              className='bg-black text-white px-4 py-2 rounded-md hover:bg-white hover:text-black'
            >
              Quick Game
            </button>
            <button
              onClick={() => {
                setIsCustomModal(true);
              }}
              className='bg-black text-white px-4 py-2 rounded-md hover:bg-white hover:text-black'
            >
              Custom Game
            </button>
          </div>
        </div>

        {clientId && (
          <div className='absolute top-2 left-2 text-sm'>
            Client ID: {clientId}
            <span
            onClick={() => {
              navigator.clipboard.writeText(clientId);
              setIsCopy(true);
              setTimeout(() => {
                setIsCopy(false);
              }, 2000);
            }}
            className={`cursor-pointer ${isCopy ? 'bg-red-500' : 'bg-red-400'} px-2 py-1 rounded-md ml-2 text-xs`}
          >
            {isCopy ? 'copied' : 'copy'}
            </span>
          </div>
        )}
        <div className='absolute top-2 right-2 text-sm'>by jds</div>
      </div>

      {isLoading && <Loading setIsLoading={setIsLoading} />}
      {isCustomModal && <ModalCustomGame setIsCustomModal={setIsCustomModal} />}
    </>
  );
};

export default Home;
