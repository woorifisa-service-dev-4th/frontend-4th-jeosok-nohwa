"use client";

import React, { useState } from "react";
import TimelineItem from "./TimelineItem";

import TimelineSkeleton from "@/components/timeline/TimelineSkeleton";
import Modal from "@/components/common/Modal";


const Timeline = ({ events, loading }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleItemClick = (event) => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedEvent(null);
  };

  // 로딩 상태일 때 스켈레톤 표시
  if (loading) return <TimelineSkeleton />;

 /* if (!events || events.length === 0) {
    return (

        <div className="flex flex-col items-center justify-center h-full">
          <img
              src="/image/giphy.gif"
              alt="No events available"
              className="w-60 h-50 mb-4 py-6"
          />
          <p className="text-gray-500 text-lg font-medium">채팅을 시작해보세요</p>
        </div>
    );
  }*/

  return (
      <div className="timeline-wrapper">
        {events.map((event, index) => (
            <TimelineItem
                key={index}
                event={event}
                onClick={() => handleItemClick(event)}
            />
        ))}

        {isModalOpen && (
         <Modal
         isOpen={isModalOpen}
         onClose={handleCloseModal}
         date={selectedEvent?.date}
       >
         {typeof selectedEvent?.summary === 'string'
           ? selectedEvent.summary
           : JSON.stringify(selectedEvent?.summary)}
       </Modal>
       
        )}
      </div>
  );
};

export default Timeline;
