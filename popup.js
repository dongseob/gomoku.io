// ------------------- 로딩 모달 출력 시작 -------------------
// 버튼 요소 가져오기
const quickStartBtn = document.getElementById('quickStartBtn');
const customStartBtn = document.getElementById('customStartBtn');

let timeLeft = 0; // 전역 변수로 이동
let timerInterval; // 인터벌 ID를 저장할 변수

// 로딩 모달을 표시하는 함수
async function showLoadingModal(gameMode) {
  clearInterval(timerInterval);

  try {
    const clientId = await getClientId();

    // 모달 추가
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = await (await fetch('src/loadingModal.html')).text();
    // modalContainer.innerHTML = await (await fetch('src/gameScreenModal.html')).text();
    const modalElement = modalContainer.firstElementChild;
    document.body.appendChild(modalElement);

    // 타이머 시작
    timerInterval = setInterval(() => {
      timeLeft++;
      const timerElement = document.getElementById('timer');
      if (timerElement) {
        timerElement.textContent = timeLeft;
      }
    }, 1000);

    // 모달 외부 클릭시 닫기 이벤트 리스너
    modalElement.addEventListener('click', (e) => {
      if (e.target === modalElement) {
        ws.close();
        document.body.removeChild(modalElement);
        clearInterval(timerInterval);
        timeLeft = 0;
      }
    });

    // WebSocket 연결
    const ws = new WebSocket('ws://3.36.100.173:3000');

    ws.onopen = () => {
      console.log('서버 연결 성공!');
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
            handleMatchSuccess(data);
            break;
          case 'waiting':
            updateWaitingStatus(data);
            break;
          case 'error':
            handleMatchError(data);
            break;
        }
      } catch (error) {
        console.error('메시지 처리 중 오류:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket 에러:', error);
    };

    ws.onclose = (event) => {
      console.log('서버와 연결이 종료됨:', event.code, event.reason);
    };
  } catch (error) {
    handleError('매칭 처리 중 오류가 발생했습니다:', error);
  }
}

// 버튼 클릭 이벤트 리스너 수정
quickStartBtn.addEventListener('click', () => showLoadingModal('quick'));
customStartBtn.addEventListener('click', () => showLoadingModal('custom'));
// ------------------- 로딩 모달 출력 끝 -------------------


// 클라이언트 ID 생성 및 가져오기
async function getClientId() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['clientId'], (result) => {
      if (result.clientId) {
        resolve(result.clientId);
      } else {
        const newClientId = 'client_' + Date.now();
        chrome.storage.local.set({ clientId: newClientId }, () => {
          resolve(newClientId);
        });
      }
    });
  });
}

// 클라이언트 ID 표시
document.addEventListener('DOMContentLoaded', async () => {
  const clientId = await getClientId();
  const clientIdElement = document.getElementById('clientId');
  if (clientIdElement) {
    clientIdElement.textContent = clientId;
  }
});

// 매칭 성공 시 게임 화면 출력
async function handleMatchSuccess(data) {
  // 로딩 모달 제거
  const loadingModal = document.querySelector('#loadingModal');
  if (loadingModal) {
      document.body.removeChild(loadingModal);
  }
  clearInterval(timerInterval);
  
  // gameScreenModal 추가
  const modalContainer = document.createElement('div');
  modalContainer.innerHTML = await (await fetch('src/gameScreenModal.html')).text();
  const gameScreenModal = modalContainer.firstElementChild;
  
  // 내 아이디와 상대방 아이디 세팅
  const myClientId = await getClientId();
  const clientIdElement = gameScreenModal.querySelector('#clientId');
  const enemyIdElement = gameScreenModal.querySelector('#enemyId');
  
  if (clientIdElement) {
      clientIdElement.textContent = myClientId;
  }
  
  if (enemyIdElement) {
      enemyIdElement.textContent = data.enemy;
  }
  
  // 게임 데이터 전달을 위한 커스텀 이벤트 발생
  const gameDataEvent = new CustomEvent('gameDataReceived', {
      detail: {
          role: data.role,
          gameId: data.gameId,
          enemy: data.enemy
      }
  });
  
  document.body.appendChild(gameScreenModal);
  document.dispatchEvent(gameDataEvent);

  // 게임 종료 버튼 클릭 이벤트 리스너
  const exitGameBtn = gameScreenModal.querySelector('#exitGame');
  if (exitGameBtn) {
      exitGameBtn.addEventListener('click', () => {
          if (gameScreenModal) {
              document.body.removeChild(gameScreenModal);
          }
      });
  }
}