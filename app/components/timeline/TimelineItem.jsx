'use client';

import React from 'react';
import Image from 'next/image';

const TimelineItem = ({ time, title, imageSrc }) => {
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
      <div className="font-bold text-base text-gray-800 flex items-center h-full">
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
