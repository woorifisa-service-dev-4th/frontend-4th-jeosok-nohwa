'use client';

import React from 'react';
import TimelineItem from './TimelineItem';
import './timeline.css'; // 기존 스크롤바 스타일 유지

const Timeline = ({ events }) => {
  if (!events || events.length === 0) {
    return <div className="text-gray-500">No events for this date.</div>;
  }

  return (
    <div className="timeline-wrapper">
      {events.map((event, index) => (
        <TimelineItem
          key={index}
          time={event.time}
          title={event.title}
          imageSrc={event.imageSrc}
        />
      ))}
    </div>
  );
};

export default Timeline;
