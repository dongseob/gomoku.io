import GameScreenBoard from './GameScreenBoard';
import { useEffect } from 'react';

const GameScreen = () => {

  useEffect(() => {
    const ws = new WebSocket('ws://3.36.100.173:3000');
    const urlParams = new URLSearchParams(window.location.search);
    const clientId = urlParams.get('clientId');
    const gameId = urlParams.get('gameId');
    const enemyClientId = urlParams.get('enemyClientId');

    // 필요한 파라미터가 없으면 메인 페이지로 리다이렉트
    if (!clientId || !gameId || !enemyClientId) {
      alert('게임 참가에 필요한 정보가 부족합니다.');
      window.location.href = '/';
      return;
    }

    ws.onopen = () => {
      // 게임 참가 메시지 전송
      ws.send(JSON.stringify({
        type: 'joinGame',
        clientId,
        gameId,
        enemyClientId
      }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        switch (data.type) {
          case 'gameJoined':
            console.log(data);
            console.log('게임 참가 성공');
            break;
          case 'close':
            alert(data.message || '상대방이 나갔습니다.');
            window.location.href = '/';
            break;
        }
      } catch (error) {
        console.error('메시지 처리 중 오류:', error);
      }
    };
  }, []);

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
