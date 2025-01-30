"use client";

import React, { useState, useEffect } from "react";
import MyCalendar from "../../components/calendar/MyCalendar";
import NavBar from "../../components/common/NavBar";
import Timeline from "../../components/timeline/Timeline";
import { supabase } from "@/lib/supabaseClient";
import SkeletonLoader from "@/components/home/SkeletonLoader";

export default function CalandarPage() {
    const [selectedDate, setSelectedDate] = useState(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("selectedDate") || new Date().toLocaleDateString("en-CA");
        }
        return new Date().toLocaleDateString("en-CA");
    });

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const getRandomImage = () => {
        const images = [
            "/image/random1.png",
            "/image/random2.png",
            "/image/random3.png",
        ];
        return images[Math.floor(Math.random() * images.length)];
    };

    useEffect(() => {
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
                        title: event.title,
                        summary: event.summary,
                        imageSrc: getRandomImage(),
                    }))
                );
            } catch (error) {
                console.error("Error fetching data:", error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const handleDateClick = (date) => {
        const formattedDate = date.toLocaleDateString("en-CA");
        setSelectedDate(formattedDate);
        localStorage.setItem("selectedDate", formattedDate);
    };

    const filteredEvents = events.filter((event) => event.date === selectedDate);

    return (
        <div className="flex flex-col min-h-[calc(100vh-64px)] w-full">
            {/* ✅ CommonHeader 높이를 고려하여 min-h-[calc(100vh-HeaderHeight)] 적용 */}
            <div className="flex flex-col items-center w-full min-h-[calc(100vh-64px)]">
                {loading ? (
                    <div className="flex flex-col w-full items-center">
                        <SkeletonLoader className="w-full max-w-md mt-4" />
                    </div>
                ) : (
                    <div className="w-full flex flex-col items-center">
                        <div className="w-full max-w-md mt-2">
                            <MyCalendar onClickDay={handleDateClick}/>

                            {/* ✅ 달력과 타임라인 사이 간격 추가 */}
                            <div className="mt-4"></div>

                            {/* ✅ Timeline도 동일한 max-w-md 적용 */}
                            <div className="w-full flex justify-center">
                                <Timeline events={filteredEvents} className="w-full max-w-md"/>
                            </div>
                        </div>
                    </div>


                )}

            </div>

            {/* ✅ NavBar가 페이지 하단에 고정되도록 설정 */}
            <NavBar className="w-full fixed bottom-0"/>
        </div>
    );
}
