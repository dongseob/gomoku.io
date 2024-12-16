const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 3000 });
const waitingPlayers = {
    quick: new Map(),
    custom: new Map()
};

wss.on('connection', (ws) => {
    console.log('클라이언트 연결됨');

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            // console.log('받은 메시지:', data);

            // 매칭 요청
            if (data.type === 'matching') {
                const gameMode = data.gameMode;
                const clientId = data.clientId;

                // clientId가 없는 경우 에러 처리
                if (!clientId) {
                    ws.send(JSON.stringify({
                        type: 'error',
                        message: 'clientId가 필요합니다.'
                    }));
                    return;
                }

                // 클라이언트 정보 저장
                ws.clientId = clientId;
                ws.gameMode = gameMode;

                // 이미 매칭 큐에 있는 동일한 clientId 제거
                if (waitingPlayers[gameMode].has(clientId)) {
                    waitingPlayers[gameMode].delete(clientId);
                }

                const waitingQueue = waitingPlayers[gameMode];

                if (waitingQueue.size === 0) {
                    // 첫 번째 대기 플레이어
                    waitingQueue.set(clientId, ws);
                    ws.send(JSON.stringify({
                        type: 'waiting',
                        message: '다른 플레이어를 기다리는 중...'
                    }));
                    console.log(`${gameMode} 모드: 플레이어1(${clientId}) 대기중`);
                } else {
                    // 매칭 가능한 상대방 찾기
                    const [enemyId, enemyWs] = waitingQueue.entries().next().value;

                    // 자기 자신과 매칭되는 것 방지
                    if (enemyId === clientId) {
                        ws.send(JSON.stringify({
                            type: 'waiting',
                            message: '다른 플레이어를 기다리는 중...'
                        }));
                        return;
                    }

                    waitingQueue.delete(enemyId);

                    // 게임 ID 생성
                    const gameId = `game_${Date.now()}`;

                    // 양쪽 플레이어에게 매칭 성공 메시지 전송
                    enemyWs.send(JSON.stringify({
                        type: 'matched',
                        role: 'player1',
                        gameId: gameId,
                        enemy: clientId
                    }));

                    ws.send(JSON.stringify({
                        type: 'matched',
                        role: 'player2',
                        gameId: gameId,
                        enemy: enemyId
                    }));

                    console.log(`${gameMode} 모드: 매칭 성공! (${enemyId} vs ${clientId})`);
                }
            }
        } catch (error) {
            console.error('메시지 처리 중 오류:', error);
            ws.send(JSON.stringify({
                type: 'error',
                message: '서버 처리 중 오류가 발생했습니다.'
            }));
        }
    });

    ws.on('close', () => {
        if (ws.gameMode && ws.clientId) {
            waitingPlayers[ws.gameMode].delete(ws.clientId);
            console.log(`클라이언트 연결 끊김 (${ws.clientId})`);
        }
    });

    ws.on('error', (error) => {
        console.error('WebSocket 에러:', error);
    });
});