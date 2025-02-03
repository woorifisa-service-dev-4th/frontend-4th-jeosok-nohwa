# 💪저속노화, jeosok-nohwa💪


## 👨‍💻 팀원 소개
| 권지윤 | 윤선영 | 윤태경 | 황혜영 |
| --- | --- | --- | --- |
| <img src="https://avatars.githubusercontent.com/june0216" width="150" height="150"> | <img src="https://avatars.githubusercontent.com/yunsy1103" width="150" height="150"> | <img src="https://avatars.githubusercontent.com/taegung" width="150" height="150"> | <img src="https://avatars.githubusercontent.com/HyeYoung-Hwang" width="150" height="150"> |
| 채팅 | 캘린더 | 타임라인 | 홈 화면 |


<br><br>

## 💡 프로젝트 소개
더 나은 내일을 위한 대화, 오늘 시작하세요!
<br>
매일 매일 채팅형식의 간편한 기록으로 쉽게 **“저속노화”** 하세요!
<br>
**AI와 함께 식사와 운동을 기록**하고, 저속노화 점수와 **맞춤 피드백**을 받아볼 수 있어요!
<br>
**저속노화란?** 저속 노화는 실제 나이보다 빨리 늙는 '가속 노화'의 반대 개념으로, 식단과 생활 습관만으로 노화의 속도를 늦추는 건강법

<br><br>

## 📌 상세 페이지
### 공통,메인 페이지
<img src="https://private-user-images.githubusercontent.com/76603301/408878931-25d577b5-fef9-410f-b6b5-267c2ebdbb45.gif?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3Mzg1NDA5NTEsIm5iZiI6MTczODU0MDY1MSwicGF0aCI6Ii83NjYwMzMwMS80MDg4Nzg5MzEtMjVkNTc3YjUtZmVmOS00MTBmLWI2YjUtMjY3YzJlYmRiYjQ1LmdpZj9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNTAyMDIlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjUwMjAyVDIzNTczMVomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTNhNjgzNjM4NmM2YzcwZGRmMTM2NDExNTc5MjQ4Mjg2OTFjOGJhZGI3YTJmZjUxNTEyZDM3NzM1ODI1ZTI0ZTMmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.-VgrjYERwOYEwZfejffIi2g2ikLTY7keQdnUf1vVMjU" width="350" height="600">
- 로고(홈 페이지로 이동), 채팅으로 이동 할 수 있는 공통 헤더
- 홈, 랭킹, 타임라인, 프로필로 이동 할 수 있는 공통 네브바
- 시작 화면인 메인 페이지
- Tailwind CSS와 함께 활용 가능한 **`Heroicons`** 라이브러리 사용
- **[추가 구현 예정]** 메인페이지에서 시작하기 버튼을 누르면 로그인 페이지로 이동, 저속노화 알아보기 버튼을 누르면 관련된 뉴스 등을 보여주는 페이지로 이동
<br>

### 캘린더
<img src="https://private-user-images.githubusercontent.com/76603301/408878979-c14af846-45b0-4329-b470-1870d1af7981.gif?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3Mzg1NDA4MjEsIm5iZiI6MTczODU0MDUyMSwicGF0aCI6Ii83NjYwMzMwMS80MDg4Nzg5NzktYzE0YWY4NDYtNDViMC00MzI5LWI0NzAtMTg3MGQxYWY3OTgxLmdpZj9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNTAyMDIlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjUwMjAyVDIzNTUyMVomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPWFhYjI2MzllZGFkNmE1OGI1YWFkOGQ3ZGJiMjNkMTg3YWIyOWM4MTc0YThlNTBmMTJkNWUwYjI3MTdhNDlhNWEmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.UIGWf0sIVj_s4ypVi3-2Rc7IaKmUs-IET17ZGCH6xec" width="350" height="600">

- 달력을 통해 날짜별 타임라인 요약을 확인할 수 있는 기능
- **`react-calendar`** 라이브러리를 사용하여 커스텀하여 적용
- 채팅이 있는 날 달력의 마킹으로 채팅 유무를 시각적으로 확인 가능
- **[추가 구현 예정]** 날짜 선택시 타임라인이 있는날은 타임라인이 나오게, 없는 날은 채팅 시작 창으로 이동하게 구현
<br>

### 타임라인 
<img src="https://private-user-images.githubusercontent.com/76603301/408878951-e82b11d7-b907-40e2-b5be-f82d03609b55.gif?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3Mzg1NDA5MDEsIm5iZiI6MTczODU0MDYwMSwicGF0aCI6Ii83NjYwMzMwMS80MDg4Nzg5NTEtZTgyYjExZDctYjkwNy00MGUyLWI1YmUtZjgyZDAzNjA5YjU1LmdpZj9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNTAyMDIlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjUwMjAyVDIzNTY0MVomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPWQzZDQ3ZjI0YjAwZDQwOTdhNjlkNjJiMzgyZGE5NGM1NGQ0MjRlZjFhMWI2NDE3ZWRiODg3NDRhMDhiOWE5YjcmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.1i8RJBF3IqXLYwsnJXWVAvY0fdIyBEGfK12kf024nPQ" width="350" height="600">
- 날짜를 클릭하면 해당 날짜의 타임라인 컴포넌트 보여주는 기능
- 타임라인 컴포넌트를 클릭하면 해당 타임라인의 요약내용을 모달창으로 통해 보여주는 기능
- **[추가 구현 예정]** 타임라인의 요약 내용 + 채팅 내용까지 보여주게 구현
<br>

### 채팅
<img src="https://private-user-images.githubusercontent.com/76603301/408878886-541b40e6-c1e7-400e-a4a1-d430d7bd2908.gif?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3Mzg1NDA3MDUsIm5iZiI6MTczODU0MDQwNSwicGF0aCI6Ii83NjYwMzMwMS80MDg4Nzg4ODYtNTQxYjQwZTYtYzFlNy00MDBlLWE0YTEtZDQzMGQ3YmQyOTA4LmdpZj9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNTAyMDIlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjUwMjAyVDIzNTMyNVomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPWUyNGE0NzFlMjQ1ZjI0YmMzZGM5MWQzYTg5NDk3MzlmYjAwZmM0MzYzYjE1ZWFkMDU0YTJjZjRhNDQ5YzZmZDUmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.sJYu2xlyMoQ04a9DMJygQqyruRHL6JQkK3pZs08l5z0" width="350" height="600">
- ChatGPT API를 활용한 실시간 대화
    - ChatGPT 응답을 청크 단위로 바로 렌더링
    - **`"react-markdown"`** 라이브러리를 활용하여 ChatGPT 응답을 마크다운 형식으로 렌더링하게 하여 가독성 향상
    - ChatGPT API를 활용한 실시간 대화 API 및 프롬프트 작성
- 대화 내역 요약 기능
    - 특정 대화량 이상이면 요약 버튼 활성화
    - **`supabase.realtime.on()`을 결합**하여 **프론트엔드에서 실시간 UI 업데이트**
- **[추가 구현 예정]** ChatGPT 대화 내역 history를 적절하게 잘라서 보내기

<br><br>

## 🚧 협업 규칙
### 1. 협업 전략
- 각자 개인 레포지토리를 `fork`하여 작업 후, 모든 코드는 `dev` 브랜치에 통합하고, 최종 배포 시 `main` 브랜치에 반영합니다.
- **작업 프로세스**:
    - (1) **이슈 발생**: 생성된 이슈는 자동으로 `Projects`의 `Todo`로 연결됩니다.
    - (2) **브랜치 생성**: 이슈 번호를 기반으로 작업 브랜치를 생성합니다.
    - (3) **코드 작성**: 브랜치에서 작업 후 변경사항을 커밋합니다.
    - (4) **Pull Request**: `dev` 브랜치로 병합을 요청합니다.
    - (5) **리뷰 및 병합**: 최소 2명 이상의 리뷰 승인을 받아야 메인 레포지토리로 머지가 가능합니다.
<br>
 
### 2. Branch 이름
{이슈 번호}-{feature/fix}-{개발 기능}

- ex) `17-feature-login`
