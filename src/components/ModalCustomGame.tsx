import { useState, useEffect, useRef } from 'react';
import { Loading } from './Loading';

const ModalCustomGame = ({ setIsCustomModal }: { setIsCustomModal: (modal: boolean) => void }) => {
  const enemyClientIdRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false); // 커스텀 게임 로딩 출력 유무

  useEffect(() => {
    if (enemyClientIdRef.current) {
      enemyClientIdRef.current.focus();
    }
  }, [enemyClientIdRef]);

  return (
    <>
      <div className='fixed top-0 left-0 bg-black/40 w-full h-full flex items-center justify-center'>
        <div className='bg-white w-[300px] h-[150px] flex flex-col p-2'>
          <div className='flex flex-col gap-2'>
              <label htmlFor='enemyClientId'>Enemy Client ID</label>
              <input ref={enemyClientIdRef} type='text' className='border border-black px-2 py-1 text-sm' id='enemyClientId' />
          </div>
          <div className='flex mt-auto gap-2'>
            <div
              onClick={() => {
                setIsLoading(true);
              }}
              className='bg-red-400 text-center cursor-pointer w-full p-2 rounded-md'
            >
              confirm
            </div>
            <div className='bg-red-300 text-center cursor-pointer w-full p-2 rounded-md' onClick={() => setIsCustomModal(false)}>
              cancel
            </div>
          </div>
        </div>
      </div>
      {isLoading && <Loading setIsLoading={setIsLoading} type='custom' />}
    </>
  );
};

export default ModalCustomGame;
