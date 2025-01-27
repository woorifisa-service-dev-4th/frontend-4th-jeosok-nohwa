'use client'
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import ChatInput from "@/components/chat/ChatInput";
import ChatHeader from "@/components/chat/ChatHeader";
import MessageList from "@/components/chat/MessageList";
import {useSearchParams} from "next/navigation";

const ChatPage = () => {
    const [messages, setMessages] = useState([]);
    const currentUserId = 1; // 하드코딩된 사용자 ID 예시
    const searchParams = useSearchParams();
    const dateParam = searchParams.get("date");
    const date = dateParam ? dateParam.replace(/-/g, ".") : "...";

    const fetchMessages = async () => {
        if (date === "...") {
            console.error("Invalid date parameter");
            return;
        }

        const formattedDate = date.replace(/\./g, "-"); // 2025.01.02 -> 2025-01-02

        const { data, error } = await supabase
            .from("messages")
            .select("*")
            .eq("owner_id", currentUserId)
            .filter("chat_time", "gte", `${formattedDate} 00:00:00`) // 시작 시간
            .filter("chat_time", "lt", `${formattedDate} 23:59:59`) // 종료 시간
            .order("chat_time", { ascending: true }); // 주의: DB 컬럼명이 "chat_time"이어야 함

        if (error) {
            console.error("Error fetching messages:", error);
        } else {
            setMessages(data);
        }
    };

    // Realtime 구독
    useEffect(() => {
        fetchMessages();

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
        // 현재 시간을 가져오기
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, "0"); // 현재 시간의 시 (2자리)
        const minutes = String(now.getMinutes()).padStart(2, "0"); // 현재 시간의 분 (2자리)
        const seconds = String(now.getSeconds()).padStart(2, "0"); // 현재 시간의 초 (2자리)

// chat_time을 Params 날짜와 현재 시간으로 조합
        const chatTimeString = `${date} ${hours}:${minutes}:${seconds}`; // e.g., 2025-01-02 14:30:45
        const chatTime = new Date(chatTimeString).toISOString(); // ISO 8601 형식 (e.g., 2025-01-02T14:30:45.000Z)

        const newMessage = {
            text: message.trim(),
            is_user: true,
            owner_id: currentUserId,
            chat_time: chatTime, // 조합된 TIMESTAMP
            created_at: new Date().toISOString(), // 로컬에서 생성 시간 설정
        };

        // 로컬 상태 업데이트
        setMessages((prevMessages) => [...prevMessages, newMessage]);

        // DB에 메시지 저장
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
