"use client";

const SkeletonLoader = () => {
    return (
        <div className="space-y-8 px-6 py-4 animate-pulse">
            {/* ✅ 캘린더 스켈레톤 (크기 확장) */}
            <div className="h-96 bg-gray-200 rounded-lg  w-[390px] h-[282px]"></div>

            {/* ✅ 타임라인 스켈레톤 (크기 확대) */}
            <div className="space-y-6">
                {Array.from({ length: 1 }).map((_, index) => ( // TODO : 추후 컨텐츠 개수에 따라 동적으로 바뀌도록 수정
                    <div
                        key={index}
                        className="flex items-center space-x-6 p-6 bg-gray-100 rounded-lg w-full "
                    >


                        {/* ✅ 콘텐츠 박스 크기 확장 */}
                        <div className="flex-1 space-y-3">
                            <div className="h-5 bg-gray-300 rounded w-1/5"></div>
                            <div className="h-4 bg-gray-300 rounded w-4/5"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default SkeletonLoader;
