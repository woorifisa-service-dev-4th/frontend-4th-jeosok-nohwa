'use client';

import React, { useState, useEffect } from 'react';
import MyCalendar from '../components/MyCalendar';
import NavBar from "../components/nav-bar";
import Timeline from '../components/timeline/Timeline';
import { supabase } from "@/lib/supabaseClient";

export default function CalandarPage() {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toLocaleDateString('en-CA'); // 'en-CA'는 YYYY-MM-DD 형식
  });

  const [events, setEvents] = useState([]); // Supabase에서 가져온 데이터를 저장할 상태
  const [loading, setLoading] = useState(true);

  // 랜덤 이미지를 선택하는 함수
  const getRandomImage = () => {
    const images = [
      '/image/random1.png',
      '/image/random2.png',
      '/image/random3.png',
    ];
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
  };

  // Supabase에서 데이터 가져오는 함수
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('chat_summaries')
        .select('*');
  
      if (error) throw error;
  
      setEvents(
        data.map((event) => {
          const time = event.created_at
            ? new Date(event.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
            : '00:00';

          return {
            date: event.chat_date,
            time: time,
            title: event.summary,
            imageSrc: getRandomImage(),
          };
        })
      );
    } catch (error) {
      console.error('Error fetching data:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  
  const handleDateClick = (date) => {
    const formattedDate = date.toLocaleDateString('en-CA'); // 'en-CA'는 YYYY-MM-DD 형식
    setSelectedDate(formattedDate);
  };

  
  const filteredEvents = events.filter(event => event.date === selectedDate);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
     
      <MyCalendar onClickDay={handleDateClick} />

      
      <Timeline events={filteredEvents} />

      <NavBar />
    </div>
  );
}
