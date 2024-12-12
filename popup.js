// ------------------- 로딩 모달 출력 시작 -------------------
// 버튼 요소 가져오기
const quickStartBtn = document.getElementById('quickStartBtn');
const customStartBtn = document.getElementById('customStartBtn');

// 로딩 모달을 표시하는 함수
async function showLoadingModal() {
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

    // 모달 외부 클릭시 닫기
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        document.body.removeChild(modalOverlay);
      }
    });
  } catch (error) {
    console.error('모달을 불러오는데 실패했습니다:', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  let timeLeft = 0;
  setInterval(() => {
    timeLeft++;
    document.getElementById('timer').textContent = timeLeft;
  }, 1000);
});

// 버튼 클릭 이벤트 리스너 추가
quickStartBtn.addEventListener('click', showLoadingModal);
customStartBtn.addEventListener('click', showLoadingModal);
// ------------------- 로딩 모달 출력 끝 -------------------
