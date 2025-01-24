"use client";

import {
  FaceSmileIcon,
  HomeIcon,
  NewspaperIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function NavBar() {
  const pathname = usePathname();
  const [active, setActive] = useState("/"); // 기본 선택 상태를 "/"로 설정

  // 버튼 클릭 시 활성화 상태를 변경하는 함수
  const handleClick = (path) => {
    setActive(path);
  };

  return (
    <nav className="fixed bottom-0 w-full max-w-[390px] p-4 border-t [#ddd] mb-4">
      <ul className="flex justify-around list-none m-0 p-0">
        <li
          className={`text-[9px] font-light tracking-tight ${
            pathname === "/home" || active === "/home"
              ? "text-[#388c25]"
              : "text-gray-700"
          } transition-transform duration-300 ease-in-out transform ${
            pathname === "/home" || active === "/home"
              ? "scale-110"
              : "hover:scale-110"
          }`}
          onClick={() => handleClick("/home")} // 클릭 시 active 상태 변경
        >
          <Link href="/home">
            <div className="flex flex-col items-center justify-center">
              <HomeIcon
                className={`w-6 h-6 stroke-[0.5] ${
                  pathname === "/home" || active === "/home"
                    ? "fill-[#EAF7E7]"
                    : "stroke-gray-700"
                }`}
              />
              <div>홈</div>
            </div>
          </Link>
        </li>
        <li
          className={`text-[9px] font-light tracking-tight ${
            pathname === "/ranking" || active === "/ranking"
              ? "text-[#388c25]"
              : "text-gray-700"
          } transition-transform duration-300 ease-in-out transform ${
            pathname === "/ranking" || active === "/ranking"
              ? "scale-110"
              : "hover:scale-110"
          }`}
          onClick={() => handleClick("/ranking")} // 클릭 시 active 상태 변경
        >
          <Link href="/ranking">
            <div className="flex flex-col items-center justify-center">
              <StarIcon
                className={`w-6 h-6 stroke-[0.5] ${
                  pathname === "/ranking" || active === "/ranking"
                    ? "fill-[#EAF7E7]"
                    : "stroke-gray-700"
                }`}
              />
              <div>랭킹</div>
            </div>
          </Link>
        </li>
        <li
          className={`text-[9px] font-light tracking-tight ${
            pathname === "/timeline" || active === "/timeline"
              ? "text-[#388c25]"
              : "text-gray-700"
          } transition-transform duration-300 ease-in-out transform ${
            pathname === "/timeline" || active === "/timeline"
              ? "scale-110"
              : "hover:scale-110"
          }`}
          onClick={() => handleClick("/timeline")} // 클릭 시 active 상태 변경
        >
          <Link href="/timeline">
            <div className="flex flex-col items-center justify-center">
              <NewspaperIcon
                className={`w-6 h-6 stroke-[0.5] ${
                  pathname === "/timeline" || active === "/timeline"
                    ? "fill-[#EAF7E7]"
                    : "stroke-gray-700"
                }`}
              />
              <div>타임라인</div>
            </div>
          </Link>
        </li>
        <li
          className={`text-[9px] font-light tracking-tight ${
            pathname === "/profile" || active === "/profile"
              ? "text-[#388c25]"
              : "text-gray-700"
          } transition-transform duration-300 ease-in-out transform ${
            pathname === "/profile" || active === "/profile"
              ? "scale-110"
              : "hover:scale-110"
          }`}
          onClick={() => handleClick("/profile")} // 클릭 시 active 상태 변경
        >
          <Link href="/profile">
            <div className="flex flex-col items-center justify-center">
              <FaceSmileIcon
                className={`w-6 h-6 stroke-[0.5] ${
                  pathname === "/profile" || active === "/profile"
                    ? "fill-[#EAF7E7]"
                    : "stroke-gray-700"
                }`}
              />
              <div>프로필</div>
            </div>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
