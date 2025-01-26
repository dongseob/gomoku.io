import React from 'react';

const GameScreenBoard = () => {
    const boardSize = 10; // 보드 크기
    const board = Array.from({ length: boardSize }, () => Array(boardSize).fill(null)); // 2차원 배열 생성

    return (
        <div className='w-[300px] h-[300px] bg-blue-300 p-2'>
            {/* 보드 */}
            <div className='w-full h-full bg-red-300 grid overflow-hidden' style={{ gridTemplateColumns: `repeat(${boardSize}, 1fr)` }}>
                {board.flat().map((_, index) => ( // 2차원 배열을 평탄화하여 사용
                    <div 
                        key={index} 
                        className={`border border-black ${index % boardSize === 0 ? 'border-l-0' : 'border-l-0'} ${index < boardSize ? 'border-t-0' : 'border-t-0'} ${index % boardSize === boardSize - 1 ? 'border-r-0' : ''} ${index >= boardSize * (boardSize - 1) ? 'border-b-0' : ''}`}
                    ></div>
                ))}
            </div>
        </div>
    );
}

export default GameScreenBoard;