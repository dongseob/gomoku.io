// ------------------- 로딩 모달 출력 시작 -------------------
// 버튼 요소 가져오기
const quickStartBtn = document.getElementById('quickStartBtn');
const customStartBtn = document.getElementById('customStartBtn');

let timeLeft = 0; // 전역 변수로 이동
let timerInterval; // 인터벌 ID를 저장할 변수

// 로딩 모달을 표시하는 함수
async function showLoadingModal() {
  // 타이머 초기화
  timeLeft = 0;
  clearInterval(timerInterval);

  // 모달 오버레이 생성
  const modalOverlay = document.createElement('div');
  modalOverlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
  `;

  try {
    // loadingModal.html 내용 가져오기
    const response = await fetch('src/loadingModal.html');
    const html = await response.text();

    // HTML 파싱
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const modalContent = doc.body.firstElementChild;

    // 모달에 내용 추가
    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);

    // HTML이 DOM에 추가된 후에 타이머 시작
    timerInterval = setInterval(() => {
      timeLeft++;
      const timerElement = document.getElementById('timer');
      if (timerElement) {
        timerElement.textContent = timeLeft;
      }
    }, 1000);

    // 모달 외부 클릭시 닫기
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        document.body.removeChild(modalOverlay);
        clearInterval(timerInterval);
      }
    });

    // WebSocket 연결
    const ws = new WebSocket('ws://3.38.96.242:3000');

    ws.onopen = () => {
      console.log('서버 연결 성공!');
      // 매칭 요청 보내기
      ws.send(
        JSON.stringify({
          type: 'matching',
        })
      );
    };

    ws.onmessage = (event) => {
      console.log('서버로부터 메시지 수신:', event.data);
      const data = JSON.parse(event.data);

      if (data.type === 'matched') {
        console.log('매칭 성공! 역할:', data.role);
        // 타이머 정지
        clearInterval(timerInterval);

        // 플레이어 역할 저장
        chrome.storage.local.set({ playerRole: data.role }, () => {
          // 게임 화면으로 이동
          window.location.href = 'src/gameScreen.html';
        });
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket 에러 발생:', error);
      const timerElement = document.getElementById('timer');
      if (timerElement) {
        timerElement.textContent = '연결 오류 발생!';
      }
    };

    ws.onclose = () => {
      console.log('서버와 연결이 끊어졌습니다.');
      clearInterval(timerInterval);
      const timerElement = document.getElementById('timer');
      if (timerElement) {
        timerElement.textContent = '서버와 연결이 끊어졌습니다.';
      }
    };

    // 모달 외부 클릭시 닫기 및 WebSocket 연결 종료
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        ws.close();
        document.body.removeChild(modalOverlay);
        clearInterval(timerInterval);
      }
    });
  } catch (error) {
    console.error('모달을 불러오는데 실패했습니다:', error);
  }
}
// 버튼 클릭 이벤트 리스너 추가
quickStartBtn.addEventListener('click', showLoadingModal);
customStartBtn.addEventListener('click', showLoadingModal);
// ------------------- 로딩 모달 출력 끝 -------------------
