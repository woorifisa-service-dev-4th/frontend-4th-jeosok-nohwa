"use client";

import React, { useState } from "react";
import ChatInput from "@/components/chat/ChatInput";
import ChatHeader from "@/components/chat/ChatHeader";
import MessageList from "@/components/chat/MessageList";

const ChatPage = () => {
    const [messages, setMessages] = useState([
        { text: "오늘 삼겹살 먹었어", isUser: true, time: getCurrentTime() },
        { text: "삼겹살이랑 김치나 다른 거는 안드셨나요?", isUser: false, time: getCurrentTime() },
    ]);

    const date = "2025.01.22";

    // 현재 시간을 가져오는 함수
    function getCurrentTime() {
        return new Date().toLocaleTimeString("ko-KR", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });
    }

    // 메시지를 전송하는 함수
    const handleSend = (message) => {
        return new Promise((resolve) => {
            const newMessage = {
                text: message,
                isUser: true,
                time: getCurrentTime(),
            };

            setMessages((prev) => [...prev, newMessage]);

            // 자동 응답 시뮬레이션
            setTimeout(() => {
                const botMessage = {
                    text: "잘 하고 계시는군요!",
                    isUser: false,
                    time: getCurrentTime(),
                };
                setMessages((prev) => [...prev, botMessage]);
            }, 1000);

            resolve();
        });
    };

    return (
        <div className="flex flex-col h-screen bg-white">
            {/* 상단 헤더 */}
            <ChatHeader
                date={date}
                onBack={() => console.log("Go back!")}
            />
            {/* 메시지 리스트 */}
            <div className="flex-1 overflow-y-auto">
                <MessageList messages={messages} />
            </div>
            {/* 하단 입력창 */}
            <div className="sticky bottom-0 bg-white   z-10">
                <ChatInput onSend={handleSend} />
            </div>
        </div>
    );
};

export default ChatPage;
