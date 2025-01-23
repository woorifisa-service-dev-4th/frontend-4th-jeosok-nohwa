'use client';

import React from 'react';
import TimelineItem from './TimelineItem';
import './timeline.css';

const Timeline = ({ events }) => {
  if (!events || events.length === 0) {
    return <div>No events for this date.</div>;
  }

  return (
    <div className="timeline-container">
      {events.map((event, index) => (
        <TimelineItem
          key={index}
          time={event.time}
          description={event.description}
        />
      ))}
    </div>
  );
};

export default Timeline;
