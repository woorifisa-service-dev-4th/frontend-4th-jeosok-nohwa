import { BellIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";

export default function CommonHeader() {
  return (
    <header className="fixed flex items-center justify-between top-0 w-full max-w-[390px] p-2 bg-white  z-10">
      <Link href="/home">
        <Image
          className="m-1"
          src="/image/jeosok-nohwa-logo.png"
          alt=""
          width={40}
          height={40}
        />
      </Link>
      <Link href="/home">
        <BellIcon className="w-6 h-6 stroke-[0.5] transition-transform duration-300 ease-in-out hover:scale-110 hover:text-blue-500" />
      </Link>
    </header>
  );
}
