<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 이상형 보드 (Ideal Type Board)

이미지를 자유롭게 배치하고 꾸밀 수 있는 무드보드 앱입니다.

## 기능

- 이미지 여러 장 동시 업로드
- 드래그로 이미지 위치 이동
- 모서리를 드래그해 이미지 크기 조절 (비율 고정)
- 업로드 비율 선택: 원본 비율 유지 / 정사각형(1:1)
- 이미지 호버 시 삭제 버튼 표시
- 보드를 PNG 파일로 저장

## 로컬 실행 방법

**사전 준비:** Node.js 설치 필요

1. 의존성 설치:

   ```bash
   npm install
   ```

2. 개발 서버 실행:

   ```bash
   npm run dev
   ```

3. 브라우저에서 접속:

   ```text
   http://localhost:3001
   ```

## 사용 방법

1. 상단의 **사진 업로드** 버튼을 클릭해 이미지를 추가합니다.
2. 이미지를 드래그해 원하는 위치로 이동합니다.
3. 이미지 모서리를 드래그해 크기를 조절합니다.
4. 이미지 위에 마우스를 올리면 나타나는 빨간 버튼으로 삭제합니다.
5. 업로드 비율 드롭다운으로 원본 비율 또는 정사각형을 선택할 수 있습니다.
6. **저장하기** 버튼을 클릭하면 현재 보드를 PNG로 다운로드합니다.

## 기술 스택

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- react-rnd (드래그 & 리사이즈)
- html-to-image (PNG 저장)
