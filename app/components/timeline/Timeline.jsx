'use client';

import React from 'react';
import TimelineItem from './TimelineItem';
import './timeline.css'; // 기존 스크롤바 스타일 유지

const Timeline = ({ events }) => {
  if (!events || events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        {/* .gif 애니메이션 */}
        <img
          src="/image/giphy.gif"
          alt="No events available"
          className="w-60 h-50 mb-4 py-6"
        />
        {/* 안내 메시지 */}
        <p className="text-gray-500 text-lg font-medium">
          채팅을 시작해보세요
        </p>
      </div>
    );
  }

  return (
    <div className="timeline-wrapper">
      {events.map((event, index) => (
        <TimelineItem key={index} event={event} />
      ))}
    </div>
  );
};

export default Timeline;
