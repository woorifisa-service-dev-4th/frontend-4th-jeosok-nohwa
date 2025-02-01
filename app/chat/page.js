'use client';
import React, { useState, useEffect } from "react";
import ChatInput from "@/components/chat/ChatInput";
import ChatHeader from "@/components/chat/ChatHeader";
import MessageList from "@/components/chat/MessageList";
import { useSearchParams } from "next/navigation";
import {supabase} from "@/lib/supabaseClient";
import CommonHeader from "@/components/common/CommonHeader";

const ChatPage = () => {
    const [messages, setMessages] = useState([]);
    const currentUserId = 1;
    const searchParams = useSearchParams();
    const dateParam = searchParams.get("date");
    const date = dateParam ? dateParam.replace(/-/g, ".") : "...";


    const fetchMessages = async () => {
        if (!dateParam) {
            console.error("Invalid date parameter");
            return;
        }

        try {
            const response = await fetch(`/api/chat?date=${dateParam}`);
            const result = await response.json();

            if (result.success) {
                setMessages(result.messages);
            } else {
                console.error("Error fetching messages:", result.error);
            }
        } catch (error) {
            console.error("Fetch error:", error);
        }
    };

    useEffect(() => {
        if (dateParam) {
            fetchMessages();
        }
    }, [dateParam]);



    useEffect(() => {
        const channel = supabase.channel("realtime:public:chat_summaries")
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "chat_summaries" },
                (payload) => {
                    const { summary, chat_date, created_at } = payload.new;

                    // ✅ `summary`가 없으면 아무 작업도 하지 않음
                    if (!summary) return;
                    if(chat_date !== dateParam) return;

                    console.log("🟢 New summary received (CLIENT):", payload.new);


                    const newMessage = {
                        text: summary.trim(),
                        is_user: false,
                        owner_id: currentUserId,
                        chat_time: chat_date,
                        created_at: created_at,
                    };

                    setMessages((prevMessages) => [...prevMessages, newMessage]); // UI 업데이트
                }
            )
            .subscribe();

        return () => {
            console.log("🔴 Unsubscribing from Supabase (CLIENT)");
            supabase.removeChannel(channel);
        };
    }, []);





    useEffect(() => {
        console.log("Messages updated:", messages);
    }, [messages]);

    const handleSend = async (message, isUser = false) => {
        if (!message.trim()) return;

        const now = new Date();
        const offset = 9 * 60 * 60 * 1000; // KST 시간대 보정
        const kstDate = new Date(now.getTime() + offset);

        const isoString = kstDate.toISOString().replace("Z", "+09:00");
        const timePart = isoString.split("T")[1].split("+")[0];

        const [year, month, day] = date.split(".");

        const chatTime = `${year}-${month}-${day}T${timePart}+09:00`;

        const newMessage = {
            text: message.trim(),
            is_user: isUser,
            owner_id: currentUserId,
            chat_time: chatTime,
            created_at: isoString,
        };

        if (isUser) {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        }

        try {
            // ✅ 서버 API를 통해 메시지 저장
            const response = await fetch("/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newMessage),
            });

            const result = await response.json();

            if (!result.success) {
                console.error("Error sending message to API:", result.error);
            } else {
                console.log("Messages successfully sent to API.");
            }
        } catch (error) {
            console.error("Error sending messages to API:", error);
        }
    };


    const getKSTChatTime = (date) => {
        const offset = 9 * 60 * 60 * 1000;
        const kstDate = new Date(new Date().getTime() + offset);
        const timePart = kstDate.toISOString().split("T")[1].split("+")[0];
        const [year, month, day] = date.split(".");
        return `${year}-${month}-${day}T${timePart}+09:00`;
    };

    const handleStreamUpdate = (chunk, isFinal = false, isUser = false, tempId) => {
        const chatTime = getKSTChatTime(date);

        setMessages((prevMessages) => {
            // 청크가 업데이트될 메시지를 찾기
            const messageIndex = prevMessages.findIndex((msg) => msg.id === tempId);


            if (messageIndex !== -1) {
                // 기존 메시지에 청크를 추가
                const updatedMessages = [...prevMessages];
                updatedMessages[messageIndex] = {
                    ...updatedMessages[messageIndex],
                    text: updatedMessages[messageIndex].text + chunk, // 청크 추가
                    isFinal, // 마지막 메시지인지 업데이트
                };
                return updatedMessages;
            }

            // 기존 메시지가 없으면 새 메시지 추가
            return [
                ...prevMessages,
                {
                    id: tempId,
                    text: chunk,
                    owner_id: currentUserId,
                    is_user: isUser,
                    chat_time: chatTime,
                    created_at: new Date().toISOString(),
                    isFinal, // 마지막 메시지 여부
                },
            ];
        });
    };



    console.log("After update:", messages);

    return (
        <div className="flex flex-col h-screen bg-white">
            <CommonHeader />
            <ChatHeader date={date} />
            <div className="flex-1 overflow-y-auto">
                <MessageList
                    messages={messages}
                    setMessages={setMessages}
                    currentUserId={currentUserId}
                    date={dateParam}
                    onSend={handleSend}
                />
            </div>
            <ChatInput
                onSend={handleSend}
                onStreamUpdate={handleStreamUpdate}
                currentUserId={currentUserId}
                date={dateParam}
            />
        </div>
    );
};

export default ChatPage;
