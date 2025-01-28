// 클라이언트 아이디 생성 및 조회
export const _getClientId = async () => {
  //   sessionStorage.clear();
  if (sessionStorage.getItem('clientId')) {
    return sessionStorage.getItem('clientId');
  }
  const clientId = Date.now().toString();
  sessionStorage.setItem('clientId', clientId);
  return clientId;
};

// 매칭 요청
export const _matching = async (gameMode: string) => {
  const clientId = await _getClientId();
  const ws = new WebSocket('ws://3.36.100.173:3000');

  ws.onopen = () => {
    ws.send(
      JSON.stringify({
        type: 'matching',
        gameMode: gameMode,
        clientId: clientId,
      })
    );
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case 'matched':
          window.location.href = `/gameScreen?gameId=${data.gameId}&clientId=${data.clientId}&enemyClientId=${data.enemyClientId}`;
          break;
        case 'waiting':
          //   updateWaitingStatus(data);
          break;
        case 'error':
          //   handleMatchError(data);
          break;
      }
    } catch (error) {
      console.error('메시지 처리 중 오류:', error);
    }
  };
};

// 매칭 요청 취소
export const _cancelMatching = async () => {
  const clientId = await _getClientId();
  const ws = new WebSocket('ws://3.36.100.173:3000');

  ws.onopen = () => {
    ws.send(
      JSON.stringify({
        type: 'cancelMatching',
        clientId: clientId,
      })
    );
  };
};

// 돌 놓기
export const _putStone = async (clientId: string, x: number, y: number) => {
  const response = await fetch(`http://localhost:3000/putStone?clientId=${clientId}&x=${x}&y=${y}`);
  return response.json();
};

// 돌 놓을때 마다 게임 진행 확인 - 끝났으면 누가 이겼는지 반환
export const _checkGame = async (clientId: string) => {
  const response = await fetch(`http://localhost:3000/checkGameEnd?clientId=${clientId}`);
  return response.json();
};
