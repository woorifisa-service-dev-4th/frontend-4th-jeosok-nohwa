import Image from "next/image";
export default function CommonHeader() {
  return (
    <header className="fixed ">
      <Image
        className="m-3"
        src="/image/jeosok-nohwa-logo.png"
        alt=""
        width={40}
        height={40}
      />
    </header>
  );
}
