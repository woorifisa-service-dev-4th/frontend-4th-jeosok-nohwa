import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req) {
    try {
        // 📌 URL에서 `owner_id`와 `chat_date` 쿼리 파라미터 가져오기
        const { searchParams } = new URL(req.url);
        const owner_id = searchParams.get("owner_id");
        const chat_date = searchParams.get("chat_date");

        // ✅ 유효성 검사
        if (!owner_id || !chat_date) {
            return NextResponse.json({ success: false, error: "Missing owner_id or chat_date" }, { status: 400 });
        }

        // 🔎 Supabase에서 요약 가져오기
        const { data, error } = await supabase
            .from("chat_summaries")
            .select("summary")
            .eq("owner_id", owner_id)
            .eq("chat_date", chat_date)
            .single();

        if (error || !data) {
            return NextResponse.json({ success: false, error: "Summary not found" }, { status: 404 });
        }

        console.log("✅ 요약 데이터 가져오기 성공:", data.summary);
        return NextResponse.json({ success: true, summary: data.summary });

    } catch (error) {
        console.error("❌ API 호출 에러:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
