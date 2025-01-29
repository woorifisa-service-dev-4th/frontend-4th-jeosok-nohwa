'use client';

import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '@/components/calendar/styles/custom-calendar.css';
import { supabase } from "@/lib/supabaseClient";

function MyCalendar({ onClickDay = () => {}, ...props }) {
    const [value, onChange] = useState(new Date());
    const [markedDates, setMarkedDates] = useState([]);

    const handleClickDay = (date) => {
        onClickDay(date); // 부모 컴포넌트에 선택된 날짜 전달
        onChange(date);   // 캘린더 상태 업데이트
    };

    // 한국(KST) 시간 기준 오늘 날짜
    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0]; // YYYY-MM-DD 형식 변환

    // Supabase에서 마킹할 날짜 가져오기 (한국 시간 그대로 사용)
    useEffect(() => {
        const fetchMarkedDates = async () => {
            const { data, error } = await supabase
                .from('chat_summaries')
                .select('chat_date');

            if (error) {
                console.error('Supabase Error:', error);
            } else {
                // Supabase의 `chat_date`는 KST로 저장되어 있으므로 변환 없이 그대로 사용
                const dates = data.map(item => item.chat_date);

                console.log("📌 마킹된 날짜들 (Supabase KST 기준):", dates); // 확인용 로그
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
                onClickDay={handleClickDay}
                {...props}
                calendarType="gregory"
                minDetail="decade"
                maxDetail="month"
                tileContent={({ date }) => {
                    // ✅ React-Calendar의 date를 KST 기준 날짜 문자열로 변환
                    const formattedDate = date.toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                    }).replace(/\. /g, "-").replace(/\./g, ""); // YYYY-MM-DD 형식으로 변환

                    console.log("📌 캘린더의 현재 날짜:", formattedDate); // 확인용 로그

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
                    // ✅ React-Calendar의 date를 KST 기준 날짜 문자열로 변환
                    const formattedDate = date.toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                    }).replace(/\. /g, "-").replace(/\./g, ""); // YYYY-MM-DD 형식으로 변환

                    if (formattedDate === formattedToday) {
                        console.log("✅ 오늘 날짜 적용됨:", formattedDate);
                        return 'today-highlight';
                    }
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
