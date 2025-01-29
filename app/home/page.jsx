"use client";

import React, { useState, useEffect } from "react";
import MyCalendar from "../../components/calendar/MyCalendar";
import NavBar from "../../components/common/NavBar";
import Timeline from "../../components/timeline/Timeline";
import { supabase } from "@/lib/supabaseClient";
import SkeletonLoader from "@/components/home/SkeletonLoader";


export default function CalandarPage() {
    const [selectedDate, setSelectedDate] = useState(() => {
        const today = new Date();
        return today.toLocaleDateString("en-CA"); // YYYY-MM-DD 형식
    });

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    // 랜덤 이미지 선택 함수
    const getRandomImage = () => {
        const images = [
            "/image/random1.png",
            "/image/random2.png",
            "/image/random3.png",
        ];
        return images[Math.floor(Math.random() * images.length)];
    };

    // Supabase에서 데이터 가져오는 함수
    const fetchEvents = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase.from("chat_summaries").select("*");
            if (error) throw error;

            setEvents(
                data.map((event) => ({
                    date: event.chat_date,
                    time: event.created_at
                        ? new Date(event.created_at).toLocaleTimeString("en-GB", {
                            hour: "2-digit",
                            minute: "2-digit",
                        })
                        : "00:00",
                    title: event.summary,
                    imageSrc: getRandomImage(),
                }))
            );
        } catch (error) {
            console.error("Error fetching data:", error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleDateClick = (date) => {
        setSelectedDate(date.toLocaleDateString("en-CA"));
    };

    const filteredEvents = events.filter((event) => event.date === selectedDate);

    return (
        <div>
            {/* ✅ 로딩 중이면 스켈레톤 UI 표시 */}

            {loading ? (
                <SkeletonLoader />
            ) : (
                <>
                    <MyCalendar onClickDay={handleDateClick} />
                    <Timeline events={filteredEvents} />

                </>
            )}
            <div className="min-h-screen flex flex-col items-center justify-between w-full">
                <NavBar className="w-full"/>
            </div>
        </div>
    );
}
