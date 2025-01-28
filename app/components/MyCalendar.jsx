'use client';

import React, { useState,useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; 
import '../styles/custom-calendar.css';
import { supabase } from "@/lib/supabaseClient";

function MyCalendar({ onClickDay = () => {}, ...props }) {
  const [value, onChange] = useState(new Date());
  const [markedDates, setMarkedDates] = useState([]);

  const handleClickDay = (date) => {
    onClickDay(date); // 부모 컴포넌트에 선택된 날짜 전달
    onChange(date);   // 캘린더 상태 업데이트
  };

  // Supabase에서 마킹할 날짜 가져오기
  useEffect(() => {
    const fetchMarkedDates = async () => {
      const { data, error } = await supabase
        .from('chat_summaries') 
        .select('chat_date');

      if (error) {
        console.error('Supabase Error:', error);
      } else {
        // UTC 기준으로 저장된 날짜를 한국 시간(KST)으로 변환
      const dates = data.map(item => {
        const utcDate = new Date(item.chat_date);
        const kstDate = new Date(utcDate.getTime() + (9 * 60 * 60 * 1000)); // UTC+9 변환
        return kstDate.toISOString().split('T')[0]; // YYYY-MM-DD 형식 변환
      });

        setMarkedDates(dates);
      }
    };

    fetchMarkedDates();
  }, []);

  return (
    <div>
      <Calendar
        onChange={onChange}
        value={value}  
        locale="ko-KR"
        formatDay={(locale, date) => date.getDate().toString()}
        showNeighboringMonth={false} 
        onClickDay={handleClickDay} // handleClickDay 함수로 변경
        {...props}
        calendarType="gregory"
        minDetail="decade"
        maxDetail="month"
        tileContent={({ date }) => {  // 마킹된 날짜에 점(dot)을 추가
          const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
          const formattedDate = utcDate.toISOString().split('T')[0];
          console.log('markedDates:', markedDates);
          if (markedDates.includes(formattedDate)) {
            return (
              <div className="dot-wrapper">
                <div className="dot"></div>
              </div>
            );
          }
          return null;
        }}
        tileClassName={({ date }) => {
          if (date.getDay() === 0) {
            return 'sunday';
          }
          return '';
        }}
        
        
      />
    </div>
  );
}

export default MyCalendar;
