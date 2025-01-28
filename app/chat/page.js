'use client';
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import ChatInput from "@/components/chat/ChatInput";
import ChatHeader from "@/components/chat/ChatHeader";
import MessageList from "@/components/chat/MessageList";
import { useSearchParams } from "next/navigation";

const ChatPage = () => {
    const [messages, setMessages] = useState([]);
    const currentUserId = 1; // 하드코딩된 사용자 ID 예시
    const searchParams = useSearchParams();
    const dateParam = searchParams.get("date");
    const date = dateParam ? dateParam.replace(/-/g, ".") : "...";

    const fetchMessages = async () => {
        if (!dateParam) {
            console.error("Invalid date parameter");
            return;
        }

        const formattedDate = dateParam; // 이미 URL에서 '-' 형식으로 가져옴

        const { data, error } = await supabase
            .from("messages")
            .select("*")
            .eq("owner_id", currentUserId)
            .filter("chat_time", "gte", `${formattedDate} 00:00:00`) // 시작 시간
            .filter("chat_time", "lt", `${formattedDate} 23:59:59`) // 종료 시간
            .order("chat_time", { ascending: true });

        if (error) {
            console.error("Error fetching messages:", error);
        } else {
            setMessages(data);
        }
    };

    // URL 파라미터 변경 감지 및 데이터 재요청
    useEffect(() => {
        if (dateParam) {
            fetchMessages();
        }
    }, [dateParam]); // dateParam이 변경될 때마다 실행

    // Realtime 구독
    useEffect(() => {
        const subscription = supabase
            .channel("realtime:public:messages")
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "messages",
                    filter: `owner_id=eq.${currentUserId}`,
                },
                (payload) => {
                    console.log("Realtime new message:", payload.new);
                    setMessages((prevMessages) => [...prevMessages, payload.new]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, []);

    // 메시지 전송 핸들러
    const handleSend = async (message) => {
        if (!message.trim()) return;

        const now = new Date();

        // 한국 시간(KST)으로 변환
        const offset = 9 * 60 * 60 * 1000; // UTC+9 시간(밀리초)
        const kstDate = new Date(now.getTime() + offset);

        // ISO 8601 형식에서 시간 부분 추출
        const isoString = kstDate.toISOString().replace("Z", "+09:00"); // 한국 시간 ISO 8601
        const timePart = isoString.split("T")[1].split("+")[0]; // "HH:mm:ss" 추출

        // 주어진 날짜와 시간 합성 (날짜는 "2021.01.01" 형식으로 주어진다고 가정)
        const dateParam = "2021.01.01"; // 예: "2021.01.01"
        const [year, month, day] = dateParam.split("."); // 날짜 파싱
        const chatTime = `${year}-${month}-${day}T${timePart}+09:00`; // 날짜와 시간 합성

        const newMessage = {
            text: message.trim(),
            is_user: true,
            owner_id: currentUserId,
            chat_time: chatTime, // 날짜와 시간 합성한 값
            created_at: isoString, // 한국 시간 그대로 저장
        };
        console.log(newMessage);


        setMessages((prevMessages) => [...prevMessages, newMessage]);

        const { error } = await supabase.from("messages").insert([newMessage]);

        if (error) {
            console.error("Error sending message to DB:", error);
        } else {
            console.log("Message successfully sent to DB.");
        }
    };

    return (
        <div className="flex flex-col h-screen bg-white">
            <ChatHeader date={date} />
            <div className="flex-1 overflow-y-auto">
                <MessageList messages={messages} />
            </div>
            <ChatInput onSend={handleSend} />
        </div>
    );
};

export default ChatPage;
