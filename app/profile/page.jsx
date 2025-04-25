"use client";
import CommonHeader from "@/components/common/CommonHeader";
import NavBar from "../../components/common/NavBar";
import React from "react";
import { useState } from "react";

export default function Page() {
  const [profileName, setProfileName] = useState("김건강");
  const [profileEmail, setProfileEmail] = useState("health@example.com");
  const [profileAge, setProfileAge] = useState("35");
  const [profileHeight, setProfileHeight] = useState("170");
  const [profileWeight, setProfileWeight] = useState("65");

  const healthScores = [
    { name: "식단 점수", score: 85, color: "bg-green-500" },
    { name: "운동 점수", score: 72, color: "bg-blue-500" },
    { name: "수면 점수", score: 68, color: "bg-purple-500" },
    { name: "스트레스 관리", score: 78, color: "bg-orange-500" },
  ];

  const recentActivities = [
    { time: "10:30", text: "아침은 바나나를 추천해요", emoji: "🍑" },
    { time: "12:00", text: "운동을 좀 하세요", emoji: "🍑" },
    { time: "15:30", text: "오후 간식은 견과류가 좋아요", emoji: "🥑" },
    { time: "18:00", text: "저녁 운동을 추천해요", emoji: "🥑" },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-between w-full">
      <CommonHeader />
      <div className="flex flex-col items-center justify-center h-screen">
        {/* 프로필 섹션 */}
        <section className="p-4 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* <Avatar className="h-16 w-16">
              <AvatarImage
                // src="/placeholder.svg?height=64&width=64"
                alt="프로필 이미지"
              />
              <AvatarFallback>{profileName.charAt(0)}</AvatarFallback>
            </Avatar> */}
              <div>
                <h2 className="text-xl font-bold">{profileName}</h2>
                <p className="text-sm text-muted-foreground">{profileEmail}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
      <NavBar className="w-full" />
    </div>
  );
}
