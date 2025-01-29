import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const SummarizeButton = ({ ownerId, chatDate, setMessages, messages, onSend }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [lastSummaryIndex, setLastSummaryIndex] = useState(null);

    const handleSummarize = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from("chat_summaries")
                .select("summary")
                .eq("owner_id", ownerId)
                .eq("chat_date", chatDate)
                .single();

            let summaryText;
            if (error || !data) {
                console.log("✅ 기존 요약 없음 → 새로 생성");
                const response = await fetch("/api/chat/summarize", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ owner_id: ownerId, chat_date: chatDate }),
                });

                const result = await response.json();
                if (!response.ok || result.error) {
                    console.error("❌ 요약 실패:", result.error);
                    setIsLoading(false);
                    return;
                }
                summaryText = result.summary;
            } else {
                console.log("✅ 기존 요약 있음 → 불러오기");
                summaryText = data.summary;
            }

            onSend(summaryText.trim(), false); // ✅ 메시지 추가

            setLastSummaryIndex(messages.length);
            setIsCompleted(true);
        } catch (error) {
            console.error("❌ API 호출 에러:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleSummarize}
            className={`text-mainGray font-bold text-sm bg-white px-4 py-2 rounded-lg border border-gray-300
            transition-opacity duration-500 opacity-100 hover:bg-gray-100 self-center ${
                isLoading || isCompleted ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading || isCompleted}
        >
            {isLoading ? "⏳ 요약 중..." : isCompleted ? "✔️ 요약 확인하기" : "✨ 저속노화 기록 ✨"}
        </button>
    );
};

export default SummarizeButton;
