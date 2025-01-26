'use client';

import React from 'react';
import Image from 'next/image';

const TimelineItem = ({ event }) => {
  const { time, title, imageSrc } = event; // 객체 구조 분해로 데이터 추출

  return (
    <div className="w-[358px] h-[96px] bg-[#D9F7F3] rounded-2xl p-3 flex flex-col justify-between mb-2 relative">
      {/* 상단 (시간, 아이콘) */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* 원형 아이콘 */}
          <div className="w-2.5 h-2.5 bg-[#33C9AC] rounded-full"></div>
          {/* 시간 */}
          <span className="text-gray-500 text-sm">{time}</span>
        </div>
      </div>

      {/* 제목 */}
      <div className="font-medium text-base text-mainGray flex items-center h-full px-2">
        {title}
      </div>

      {/* 이미지 */}
      {imageSrc && (
        <div className="absolute bottom-3 right-3"> {/* 이미지 오른쪽 하단에 고정 */}
          <Image
            src={imageSrc}
            alt="icon"
            width={24}
            height={24}
            className="rounded-full"
          />
        </div>
      )}
    </div>
  );
};

export default TimelineItem;
