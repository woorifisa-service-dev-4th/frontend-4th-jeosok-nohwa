"use client";

import { useRouter } from "next/navigation";
import React from "react";

export default function RouterButton() {
  const router = useRouter();

  return (
    <>
      <button
        className="bg-mainGreen text-[#3b3b3b] text-[16px] font-[400] w-full py-3 rounded-lg mt-9 shadow-[0px_0px_2px_0px_rgba(0,0,0,0.08),_0px_1px_1px_0px_rgba(0,0,0,0.17)]"
        onClick={() => router.push("/home")}
      >
        시작하기
      </button>
      <button
        className="bg-[#ffffff] text-mainGray text-[16px] font-[400] w-full py-3 rounded-lg mt-5 shadow-[0px_0px_2px_0px_rgba(0,0,0,0.08),_0px_1px_1px_0px_rgba(0,0,0,0.17)]"
        onClick={() => router.push("/home")}
      >
        저속노화 알아보기
      </button>
    </>
  );
}
