'use client';
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import ChatInput from "@/components/chat/ChatInput";
import ChatHeader from "@/components/chat/ChatHeader";
import MessageList from "@/components/chat/MessageList";
import { useSearchParams } from "next/navigation";

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

        const formattedDate = dateParam;

        const { data, error } = await supabase
            .from("messages")
            .select("*")
            .eq("owner_id", currentUserId)
            .filter("chat_time", "gte", `${formattedDate} 00:00:00`)
            .filter("chat_time", "lt", `${formattedDate} 23:59:59`)
            .order("chat_time", { ascending: true });

        if (error) {
            console.error("Error fetching messages:", error);
        } else {
            setMessages(data);
        }
    };

    useEffect(() => {
        if (dateParam) {
            fetchMessages();
        }
    }, [dateParam]);

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

    useEffect(() => {
        console.log("Messages updated:", messages);
    }, [messages]);

    const handleSend = async (message, isUser = false) => {
        if (!message.trim()) return;

        const now = new Date();
        const offset = 9 * 60 * 60 * 1000;
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
                currentUserId={currentUserId}
                date={dateParam}
            />
        </div>
    );
};

export default ChatPage;
