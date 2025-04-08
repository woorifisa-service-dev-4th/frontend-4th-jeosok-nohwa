# 1. Node.js 기반 이미지 사용 (빌드 단계)
FROM node:18 AS builder
WORKDIR /app

# 2. package.json, package-lock.json 복사 후 의존성 설치
COPY package.json package-lock.json ./
RUN npm install

# 3. 환경 변수 파일 복사
COPY .env.local .env

# 4. 소스 코드 복사 및 Next.js 빌드
COPY . .



RUN npm run build

# 5. 런타임 이미지 (프로덕션 환경)
FROM node:18-alpine
WORKDIR /app

# 6. 빌드된 파일과 node_modules 복사
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/public ./public

# 7. 포트 및 실행 명령어 설정
# 외부에 노출할 포트 지정
EXPOSE 3000
CMD ["npm", "run", "start"]
