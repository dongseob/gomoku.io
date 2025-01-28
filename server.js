const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 3000 });
const waitingPlayers = {
    quick: new Map(),
    custom: new Map()
};

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      
      switch (data.type) {
        // 매칭 요청 처리
        case 'matching':
          const { gameMode, clientId } = data;

          // clientId가 없는 경우 에러 처리
          if (!clientId) {
            return ws.send(JSON.stringify({ type: 'error', message: 'clientId가 필요합니다.' }));
          }

          // 클라이언트 정보 저장 및 대기 큐 업데이트
          ws.clientId = clientId;
          ws.gameMode = gameMode;
          waitingPlayers[gameMode].delete(clientId); // 이미 매칭 큐에 있는 동일한 clientId 제거

          const waitingQueue = waitingPlayers[gameMode];

          // 유효한 대기 플레이어만 고려
          if (waitingQueue.size === 0) {
            // 첫 번째 대기 플레이어
            waitingQueue.set(clientId, ws);
            ws.send(JSON.stringify({ type: 'waiting', message: '다른 플레이어를 기다리는 중...' }));
            console.log(`${gameMode} 모드: 플레이어1(${clientId}) 대기중`);
          } else {
            // 매칭 가능한 상대방 찾기
            const [enemyId, enemyWs] = waitingQueue.entries().next().value;

            // 상대방이 유효한지 확인
            if (enemyWs.readyState === WebSocket.OPEN) {
              waitingQueue.delete(enemyId);

              // 게임 ID 생성
              const gameId = `game_${Date.now()}`;

              // 양쪽 플레이어에게 매칭 성공 메시지 전송
              enemyWs.send(JSON.stringify({ type: 'matched', gameId: gameId, enemyClientId: clientId, clientId: enemyId }));
              ws.send(JSON.stringify({ type: 'matched', gameId: gameId, enemyClientId: enemyId, clientId: clientId }));

              // 상대방 WebSocket 참조 저장
              enemyWs.enemy = ws;
              ws.enemy = enemyWs;

              console.log(`${gameMode} 모드: 매칭 성공! (${enemyId} vs ${clientId})`);
            } else {
              // 상대방이 연결이 끊어진 경우 대기 큐에서 제거
              waitingQueue.delete(enemyId);
              waitingQueue.set(clientId, ws);
              ws.send(JSON.stringify({ type: 'waiting', message: '다른 플레이어를 기다리는 중...' }));
              console.log(`${gameMode} 모드: 플레이어1(${clientId}) 대기중`);
            }
          }
          break;

        // 매칭 취소 요청 처리
        case 'cancelMatching':
          const { clientId: cancelClientId } = data;

          // clientId가 없는 경우 에러 처리
          if (!cancelClientId) {
            return ws.send(JSON.stringify({ type: 'error', message: 'clientId가 필요합니다.' }));
          }

          // 모든 게임 모드에서 플레이어 제거
          Object.values(waitingPlayers).forEach(queue => {
            if (queue.has(cancelClientId)) {
              queue.delete(cancelClientId);
            }
          });
          
          ws.send(JSON.stringify({ type: 'cancelled', message: '매칭이 취소되었습니다.' }));
          console.log(`매칭 취소: 플레이어(${cancelClientId}) 제거됨`);
          break;

        case 'joinGame':
          const { gameId, clientId: joinClientId, enemyClientId: enemyClientId } = data;
          
          ws.clientId = joinClientId;
          ws.enemyClientId = enemyClientId;
          
          console.log(`게임 참가: 플레이어(${joinClientId}) vs 플레이어(${enemyClientId}) - 게임(${gameId})`);
          
          ws.send(JSON.stringify({
            type: 'gameJoined',
            gameId: gameId,
            enemyClientId: enemyClientId
          }));
          break;
      }
    } catch (error) {
      ws.send(
        JSON.stringify({
          type: 'error',
          message: '서버 처리 중 오류',
        })
      );
    }
  });

  ws.on('close', () => {
    // 대기 큐에서 플레이어 제거
    if (ws.clientId) {
      Object.values(waitingPlayers).forEach(queue => {
        queue.delete(ws.clientId);
      });
    }

    // 매칭된 상대방 처리
    if (ws.enemy && ws.enemy.readyState === WebSocket.OPEN) {
      // 상대방에게 게임 종료 알림
      ws.enemy.send(JSON.stringify({ 
        type: 'close', 
        message: '상대방이 나갔습니다.' 
      }));
      
      // 양쪽 모두의 enemy 참조 제거
      ws.enemy.enemy = null;
      ws.enemy = null;
      
      // 추가: 게임 종료 로그
      console.log(`플레이어 연결 종료: ${ws.clientId}`);
    }
  });
  
});

