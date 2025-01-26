'use client';

import React, { useState, useEffect } from 'react';
import MyCalendar from '../components/MyCalendar';
import NavBar from "../components/nav-bar";
import Timeline from '../components/timeline/Timeline';

export default function Page() {
  // 오늘 날짜를 초기값으로 설정
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toLocaleDateString('en-CA'); // 'en-CA'는 YYYY-MM-DD 형식
  });

  const exampleData = [
    {
      date: "2025-01-01",
      time: "10:00-13:00",
      title: "Design new UX flow",
      imageSrc: "/image/random1.png",
    },
    {
      date: "2025-01-24",
      time: "09:00-10:00",
      title: "한글로 해보세요 알겟어요",
      imageSrc: "/image/random2.png",
    },
    {
      date: "2025-01-24",
      time: "11:00-12:00",
      title: "Prepare Design Presentation",
      imageSrc: "/image/random1.png",
    },
    {
      date: "2025-02-01",
      time: "09:00-10:00",
      title: "Client Feedback Review",
      imageSrc: "/image/random2.png",
    },
    {
      date: "2025-01-04",
      time: "11:00-12:00",
      title: "Prepare Design Presentation",
      imageSrc: "/image/random1.png",
    },
  ];

  // MyCalendar에서 날짜 클릭 시 호출될 핸들러
  const handleDateClick = (date) => {
    // 날짜를 YYYY-MM-DD 형식으로 변환 (로컬 시간 기준)
    const formattedDate = date.toLocaleDateString('en-CA'); // 'en-CA'는 YYYY-MM-DD 형식
    setSelectedDate(formattedDate); // 선택된 날짜 상태 저장
  };

  // 선택된 날짜에 해당하는 이벤트 필터링
  const filteredEvents = exampleData.filter(event => event.date === selectedDate);

  return (
    <div>
      {/* MyCalendar에 handleDateClick 전달 */}
      <MyCalendar onClickDay={handleDateClick} />
      
      {/* 필터링된 이벤트를 Timeline에 전달 */}
      <Timeline events={filteredEvents} />
      
      <NavBar />
    </div>
  );
}
