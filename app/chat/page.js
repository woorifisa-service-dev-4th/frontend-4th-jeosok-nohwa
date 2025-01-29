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

    // 메시지가 업데이트될 때 로그 출력
    useEffect(() => {
        console.log("Messages updated:", messages);
    }, [messages]);

    // 메시지 전송 핸들러
    const handleSend = async (message, isUser = false) => {
        if (!message.trim()) return;

        const now = new Date();

        // 한국 시간(KST)으로 변환
        const offset = 9 * 60 * 60 * 1000; // UTC+9 시간(밀리초)
        const kstDate = new Date(now.getTime() + offset);

        // ISO 8601 형식에서 시간 부분 추출
        const isoString = kstDate.toISOString().replace("Z", "+09:00"); // 한국 시간 ISO 8601
        const timePart = isoString.split("T")[1].split("+")[0]; // "HH:mm:ss" 추출



        const [year, month, day] = date.split("."); // 날짜 파싱

        const chatTime = `${year}-${month}-${day}T${timePart}+09:00`; // 날짜와 시간 합성

        const newMessage = {
            text: message.trim(),
            is_user: isUser,
            owner_id: currentUserId,
            chat_time: chatTime, // 날짜와 시간 합성한 값
            created_at: isoString, // 한국 시간 그대로 저장
        };
        console.log(newMessage);

        if(isUser){
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        }


        const { error } = await supabase.from("messages").insert([newMessage]);

        if (error) {
            console.error("Error sending message to DB:", error);
        } else {
            console.log("Message successfully sent to DB.");
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
            <ChatHeader date={date} />
            <div className="flex-1 overflow-y-auto">
                <MessageList   messages={messages} />
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
