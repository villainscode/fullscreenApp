# Full Screen Desktop Application

이 애플리케이션은 Electron을 사용하여 제작된 커스텀 프레임 데스크톱 애플리케이션입니다.

## 주요 특징

- **커스텀 윈도우 프레임**
  - 기본 운영체제의 윈도우 프레임을 제거하고 커스텀 디자인 적용
  - 최소화, 최대화, 닫기 버튼 구현
  - 헤더 영역을 통한 창 드래그 지원

- **레이아웃 구조**
  - 좌측: 256px 고정 너비의 사이드바
  - 우측: 동적 크기 조절이 가능한 메인 영역
    - 70px 높이의 헤더
    - 자동 조절되는 컨텐츠 영역
    - 60px 높이의 푸터

- **시스템 트레이 지원**
  - 커스텀 트레이 아이콘 표시
  - 트레이 메뉴를 통한 앱 제어 (열기/종료)
  - 트레이 아이콘 클릭으로 창 표시

## 기술 스택

- Electron
- HTML5
- Tailwind CSS
- Vanilla JavaScript

## 설치 방법

1. 저장소 클론 또는 다운로드
```bash
git clone [repository-url]
cd full-screen
```

2. 의존성 설치
```bash
npm install
```

## 실행 방법

1. 개발 모드로 실행
```bash
npm start
```

## 앱 조작 방법

- **창 제어**
  - 최소화: 헤더의 최소화 버튼 클릭
  - 최대화/복원: 헤더의 최대화 버튼 클릭
  - 닫기: 헤더의 닫기 버튼 클릭 (앱 완전 종료)

- **창 이동**
  - 헤더 영역을 드래그하여 창 이동 가능

## 개발 환경 설정

- Node.js 및 npm 설치 필요
- 권장 Node.js 버전: 14.x 이상

## 라이선스

ISC License # fullscreenApp


개발 모드 실행: npm run dev
프로덕션 모드 실행: npm run prod