"use client";

import {
  FaceSmileIcon as OutlineFaceSmileIcon,
  HomeIcon as OutlineHomeIcon,
  NewspaperIcon as OutlineNewspaperIcon,
  StarIcon as OutlineStarIcon,
} from "@heroicons/react/24/outline";
import {
  FaceSmileIcon as SolidFaceSmileIcon,
  HomeIcon as SolidHomeIcon,
  NewspaperIcon as SolidNewspaperIcon,
  StarIcon as SolidStarIcon,
} from "@heroicons/react/24/solid";
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
    <nav className="fixed bottom-0 w-full max-w-[390px] p-4 border-t [#ddd] pb-6 bg-white z-10">
      <ul className="flex justify-around list-none m-0 p-0">
        <li
          className={`text-[9px] font-light tracking-tight ${
            pathname === "/home" || active === "/home"
              ? "text-gray-500"
              : "text-gray-400"
          } transition-transform duration-300 ease-in-out transform hover:text-gray-700 ${
            pathname === "/home" || active === "/home"
              ? "scale-110"
              : "hover:scale-110"
          }`}
          onClick={() => handleClick("/home")}
        >
          <Link href="/home">
            <div className="flex flex-col items-center justify-center">
              {pathname === "/home" || active === "/home" ? (
                <SolidHomeIcon className="w-6 h-6 fill-[#D9F7F3] stroke-[#b1f1e8] stroke-[0.5]" />
              ) : (
                <OutlineHomeIcon className="w-6 h-6 stroke-gray-400 hover:stroke-gray-700 stroke-[0.5]" />
              )}
              <div>홈</div>
            </div>
          </Link>
        </li>
        <li
          className={`text-[9px] font-light tracking-tight ${
            pathname === "/ranking" || active === "/ranking"
              ? "text-gray-500"
              : "text-gray-400"
          } transition-transform duration-300 ease-in-out transform hover:text-gray-700 ${
            pathname === "/ranking" || active === "/ranking"
              ? "scale-110"
              : "hover:scale-110"
          }`}
          onClick={() => handleClick("/ranking")}
        >
          <Link href="/ranking">
            <div className="flex flex-col items-center justify-center">
              {pathname === "/ranking" || active === "/ranking" ? (
                <SolidStarIcon className="w-6 h-6 fill-[#D9F7F3] stroke-[#b1f1e8] stroke-[0.5]" />
              ) : (
                <OutlineStarIcon className="w-6 h-6 stroke-gray-400 hover:stroke-gray-700 stroke-[0.5]" />
              )}
              <div>랭킹</div>
            </div>
          </Link>
        </li>
        <li
          className={`text-[9px] font-light tracking-tight ${
            pathname === "/timeline" || active === "/timeline"
              ? "text-gray-500"
              : "text-gray-400"
          } transition-transform duration-300 ease-in-out transform hover:text-gray-700 ${
            pathname === "/timeline" || active === "/timeline"
              ? "scale-110"
              : "hover:scale-110"
          }`}
          onClick={() => handleClick("/timeline")}
        >
          <Link href="/timeline">
            <div className="flex flex-col items-center justify-center">
              {pathname === "/timeline" || active === "/timeline" ? (
                <SolidNewspaperIcon className="w-6 h-6 fill-[#D9F7F3] stroke-[#b1f1e8] stroke-[0.5]" />
              ) : (
                <OutlineNewspaperIcon className="w-6 h-6 stroke-gray-400 hover:stroke-gray-700 stroke-[0.5]" />
              )}
              <div>타임라인</div>
            </div>
          </Link>
        </li>
        <li
          className={`text-[9px] font-light tracking-tight ${
            pathname === "/profile" || active === "/profile"
              ? "text-gray-500"
              : "text-gray-400"
          } transition-transform duration-300 ease-in-out transform hover:text-gray-700 ${
            pathname === "/profile" || active === "/profile"
              ? "scale-110"
              : "hover:scale-110"
          }`}
          onClick={() => handleClick("/profile")}
        >
          <Link href="/profile">
            <div className="flex flex-col items-center justify-center">
              {pathname === "/profile" || active === "/profile" ? (
                <SolidFaceSmileIcon className="w-6 h-6 fill-[#D9F7F3] stroke-[#b1f1e8] stroke-[0.5]" />
              ) : (
                <OutlineFaceSmileIcon className="w-6 h-6 stroke-gray-400 hover:stroke-gray-700 stroke-[0.5]" />
              )}
              <div>프로필</div>
            </div>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
