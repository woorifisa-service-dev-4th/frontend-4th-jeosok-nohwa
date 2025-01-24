"use client"
import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import ChatInput from "@/components/chat/ChatInput";
import ChatHeader from "@/components/chat/ChatHeader";
import MessageList from "@/components/chat/MessageList";

const ChatPage = () => {
    const [messages, setMessages] = useState([
        { text: "오늘 삼겹살 먹었어", isUser: true, time: getCurrentTime() },
        { text: "삼겹살이랑 김치나 다른 거는 안드셨나요?", isUser: false, time: getCurrentTime() },
    ]);
    const searchParams = useSearchParams();
    const dateParam = searchParams.get("date");
    const date = dateParam ? dateParam.replace(/-/g, ".") : "...";

    function getCurrentTime() {
        return new Date().toLocaleTimeString("ko-KR", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });
    }

    function handleSend(message) {
        if (!message || !message.trim()) {
            console.log("Message is empty, skipping send.");
            return;
        }

        setMessages((prevMessages) => {
            const lastMessage = prevMessages[prevMessages.length - 1];
            if (lastMessage && lastMessage.text === message.trim()) {
                console.log("Duplicate message, skipping.");
                return prevMessages;
            }

            const newMessage = {
                text: message.trim(),
                isUser: true,
                time: getCurrentTime(),
            };

            return [...prevMessages, newMessage];
        });
    }



    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault(); // 기본 Enter 동작 방지
            if (!isProcessing) {
                console.log("엔터 이벤트");
                handleSend(); // Enter 키로 전송
            }
        }
    };





    return (
        <div className="flex flex-col h-screen bg-white">
            <ChatHeader date={date || "..."} onBack={() => history.back()} />
            <div className="flex-1 overflow-y-auto">
                <MessageList messages={messages} />
            </div>
            <div className="sticky bottom-0 bg-white z-10">
                <ChatInput onSend={(message) => handleSend(message)} />
            </div>
        </div>
    );
};

export default ChatPage;