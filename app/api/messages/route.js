// app/api/messages/route.ts

import { NextResponse } from "next/server";
import {supabase} from "@/lib/supabase";

export async function POST(request) {
    try {
        const newMessage = await request.json();

        // Supabase를 사용하여 메시지 DB에 저장
        const { error } = await supabase.from("messages").insert([newMessage]);

        if (error) {
            console.error("Supabase insert error:", error);
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: "Message stored successfully." });
    } catch (error) {
        console.error("Error processing request:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
