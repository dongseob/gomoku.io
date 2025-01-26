import GameScreenBoard from './GameScreenBoard';

const GameScreen = ({ clientId }: { clientId: string }) => {
  return (
    <div className='flex h-full'>
      {/* 게임 화면 */}
      <GameScreenBoard />

      {/* 정보 화면 */}
      <div className='w-[100px] bg-green-300 p-2 text-sm flex flex-col gap-4'>
        {/* 정보 화면 > 시간 */}
        <div className='bg-red-500 flex flex-col gap-2'>
          {/* 전체시간 */}
          <div>
            <div>total</div>
            <div>00:00</div>
          </div>
          {/* 카운트시간 */}
          <div>
            <div>count</div>
            <div>00:00</div>
          </div>
        </div>

        {/* 정보 화면 > 아이디 */}
        <div className='flex flex-col justify-between h-full bg-red-300'>
          <div className='bg-red-500'>
            <div>enemy</div>
          </div>
          <div className='bg-red-500'>
            <div>your</div>
            <div className='w-10 h-10 bg-yellow-300 flex justify-center items-center'>
              <p className='text-2xl'>😀</p>
            </div>
          </div>
        </div>

        {/* 정보 화면 > 이모티콘 */}
      </div>
    </div>
  );
};

export default GameScreen;
