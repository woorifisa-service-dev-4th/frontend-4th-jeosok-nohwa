import { OpenAI } from "openai";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
    try {
        // ✅ 요청 데이터 파싱
        const { owner_id, chat_date } = await request.json();

        if (!owner_id || !chat_date) {
            return new NextResponse(
                JSON.stringify({ error: "Missing owner_id or chat_date" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        // ✅ Supabase에서 해당 날짜의 대화 불러오기
        const { data: messages, error } = await supabase
            .from("messages")
            .select("text, is_user")
            .eq("owner_id", owner_id)
            .filter("chat_time", "gte", `${chat_date} 00:00:00`)
            .filter("chat_time", "lt", `${chat_date} 23:59:59`)
            .order("chat_time", { ascending: true });

        if (error) {
            console.error("Supabase query error:", error);
            return new NextResponse(
                JSON.stringify({ error: "Error fetching messages from Supabase" }),
                { status: 500, headers: { "Content-Type": "application/json" } }
            );
        }

        if (!messages || messages.length === 0) {
            return new NextResponse(
                JSON.stringify({ error: "No messages found for the given date" }),
                { status: 404, headers: { "Content-Type": "application/json" } }
            );
        }

        // ✅ ChatGPT 요약 요청
        const historyMessages = messages.map(msg => ({
            role: msg.is_user ? "user" : "assistant",
            content: msg.text,
        }));

        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content:
                        "유저는 이 대화를 마무리하려고 해.\n" +
                        "오늘 내용에 대한 요약 기록을 작성해줘.\n" +
                        "다음의 조건을 반드시 반영해야 해:\n" +
                        "공유의 재미 요소: 간단한 이모지를 활용하여 내용을 생동감 있고 흥미롭게 꾸며줘.\n" +
                        "뛰어난 정확성: 앞선 대화를 참고해서 매우 정확한 요약 정보만을 줘. 정확한 정보가 아니라면 해당 부분을 제외하고 보내줘. 할루시네이션은 절대 안돼.\n" +
                        "- 유저의 식단이나 운동 \n" +
                        "- 마지막에 핵심을 관통하는 저속노화 전문가의 한마디\n" +
                        "등\n" +
                        "추가 지침:\n" +
                        "SNS 공유 최적화: 시각적으로 매력적인 요소(예: 간단한 이모지)를 포함하고, 공유하기 쉬운 구조로 작성해줘.\n" +
                        "단편 소설 같은 문체: 이야기의 흐름이 자연스럽고 감성적으로 이어지도록 해줘.\n" +
                        "적절한 이모지 활용: 내용의 분위기를 해치지 않으면서도 감정을 표현할 수 있는 이모지를 적절히 배치해줘.",
                },
                ...historyMessages,
            ],
            temperature: 0.7,
        });

        const summary = completion.choices[0]?.message?.content?.trim() || "";

        if (!summary) {
            return new NextResponse(
                JSON.stringify({ error: "Failed to generate summary" }),
                { status: 500, headers: { "Content-Type": "application/json" } }
            );
        }

        // ✅ Supabase에 요약 저장
        const { error: insertError } = await supabase
            .from("chat_summaries")
            .insert([{ owner_id, chat_date, summary, created_at: new Date().toISOString() }]);

        if (insertError) {
            console.error("Supabase insert error:", insertError);
            return new NextResponse(
                JSON.stringify({ error: "Error saving summary to Supabase" }),
                { status: 500, headers: { "Content-Type": "application/json" } }
            );
        }



        // ✅ 클라이언트에 요약 반환
        return new NextResponse(
            JSON.stringify({ summary }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (err) {
        console.error("Error handling request:", err);
        return new NextResponse(
            JSON.stringify({ error: "Internal Server Error" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}