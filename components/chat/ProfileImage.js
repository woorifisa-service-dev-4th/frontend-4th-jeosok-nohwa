import Image from "next/image";

const ProfileImage = ({ src, alt }) => (
    <div className="relative w-8 h-8 px-2 mx-2">
        <Image
            src={src}
            alt={alt}
            layout="fill" // 부모 div의 크기에 맞게 이미지를 채움
            objectFit="cover" // 이미지를 잘라내지 않고 크기에 맞게 조정
            className="rounded-full"
        />
    </div>
);

export default ProfileImage;
