'use client';

import React from 'react';
import Image from 'next/image';

const TimelineItem = ({ event, onClick }) => {
  const { time, title, imageSrc } = event; // 객체 구조 분해로 데이터 추출

  return (
    <div
      className="w-[358px] h-[96px] bg-[#D9F7F3] rounded-2xl p-3 flex flex-col justify-between mb-2 relative"
      onClick={onClick}
    >

      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-[#33C9AC] rounded-full self-start translate-y-1.5"></div>

          <span className="text-mainGray text-sm">{time}</span>
        </div>
      </div>
      <div className="font-sm text-sm text-mainGray flex items-center h-full px-6">
        {title}
      </div>


      {imageSrc && (
        <div className="absolute bottom-3 right-3">
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
