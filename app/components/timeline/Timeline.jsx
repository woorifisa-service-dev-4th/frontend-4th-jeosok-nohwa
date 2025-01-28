'use client';

import React, { useState } from 'react';
import TimelineItem from './TimelineItem';
import Modal from '../ui/modal/Modal'; // Modal 컴포넌트 가져오기
import ChatInput from '@/components/chat/ChatInput';
import './timeline.css'; // 기존 CSS 유지

const Timeline = ({ events }) => {
  const [isModalOpen, setModalOpen] = useState(false); // 모달 상태 관리
  const [selectedEvent, setSelectedEvent] = useState(null); // 선택된 이벤트 데이터

  const handleItemClick = (event) => {
    setSelectedEvent(event); // 선택된 이벤트 저장
    setModalOpen(true); // 모달 열기
  };

  const handleCloseModal = () => {
    setModalOpen(false); // 모달 닫기
    setSelectedEvent(null); // 선택된 이벤트 초기화
  };

  if (!events || events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <img
          src="/image/giphy.gif"
          alt="No events available"
          className="w-60 h-50 mb-4 py-6"
        />
        <p className="text-gray-500 text-lg font-medium">
          채팅을 시작해보세요
        </p>
      </div>
    );
  }

  return (
    <div className="timeline-wrapper">
      {events.map((event, index) => (
        <TimelineItem
          key={index}
          event={event}
          onClick={() => handleItemClick(event)} // 클릭 시 모달 열기
        />
      ))}

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          date={selectedEvent?.date} // 선택된 이벤트의 날짜 전달
        >
          {/* 선택된 이벤트에 따라 모달 내용이 다름 */}
          <h2 className="modal-title">{selectedEvent?.title}</h2>
          <p>{`Time: ${selectedEvent?.time}`}</p>

        </Modal>
      )}
    </div>
  );
};

export default Timeline;
