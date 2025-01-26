'use client'
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import ChatInput from "@/components/chat/ChatInput";
import ChatHeader from "@/components/chat/ChatHeader";
import MessageList from "@/components/chat/MessageList";

const ChatPage = () => {
    const [messages, setMessages] = useState([]);
    const currentUserId = 1; // 하드코딩된 사용자 ID 예시

    // 메시지 로드 함수
    const fetchMessages = async () => {
        const { data, error } = await supabase
            .from("messages")
            .select("*")
            .eq("owner_id", currentUserId)
            .order("created_at", { ascending: true });

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

        const newMessage = {
            text: message.trim(),
            is_user: true,
            owner_id: currentUserId,
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
            <ChatHeader />
            <div className="flex-1 overflow-y-auto">
                <MessageList messages={messages} />
            </div>
            <ChatInput onSend={handleSend} />
        </div>
    );
};

export default ChatPage;
