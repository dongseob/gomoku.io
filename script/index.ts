// 클라이언트 아이디 생성 및 조회
export const _getClientId = async () => {
    if(localStorage.getItem('clientId')) {
        return localStorage.getItem('clientId');
    }
    const clientId = Date.now().toString();
    localStorage.setItem('clientId', clientId);
    return clientId;
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
