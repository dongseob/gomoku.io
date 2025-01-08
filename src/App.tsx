import './App.css';

function App() {
  return (
    <div className='w-[400px] h-[300px] flex flex-col justify-center items-center relative'>
      {/* 홈 */}
      <div className='p-4'>
        {/* 타이틀 */}
        <h1 className='text-center text-[32px] font-bold'>gomoku.io</h1>

        {/* 버튼 */}
        <div className='flex flex-col justify-center items-center gap-3 text-[16px]'>
          <button className='border py-2 px-4'>Quick Start</button>
          <button className='border py-2 px-4'>Custom Start</button>
        </div>

        {/* 아이디 */}
        <p className='absolute top-0 left-0'>
          Your ID: <span id='clientId'></span>
        </p>

        {/* 크레딧 */}
        <p className='absolute top-0 right-0'>prod by dongseob</p>
      </div>
    </div>
  );
}

export default App;
