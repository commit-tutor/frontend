# Commit Tutor - Frontend Project Structure

## 개요
Commit Tutor의 프론트엔드는 TanStack Router, React Query, shadcn/ui를 활용하여 구축되었습니다.

## 기술 스택
- **Framework**: React 19
- **Routing**: TanStack Router (파일 기반 라우팅)
- **State Management**: React Context API
- **Data Fetching**: TanStack React Query
- **UI Components**: shadcn/ui (Radix UI 기반)
- **Styling**: Tailwind CSS 4
- **Build Tool**: Vite

## 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 컴포넌트
│   ├── ui/             # shadcn/ui 컴포넌트
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── tabs.tsx
│   │   ├── badge.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── avatar.tsx
│   │   ├── separator.tsx
│   │   ├── skeleton.tsx
│   │   ├── alert.tsx
│   │   └── label.tsx
│   └── layout/         # 레이아웃 컴포넌트
│       └── Header.tsx  # GNB with user profile
│
├── contexts/           # React Context Providers
│   └── AuthContext.tsx # 인증 및 사용자 상태 관리
│
├── routes/            # TanStack Router 파일 기반 라우팅
│   ├── __root.tsx                    # Root layout
│   ├── index.tsx                     # 랜딩 페이지 (/)
│   ├── auth/
│   │   └── callback.tsx              # OAuth 콜백 (/auth/callback)
│   ├── onboarding.tsx                # 온보딩 (/onboarding)
│   ├── dashboard.tsx                 # 저장소 대시보드 (/dashboard)
│   ├── repo/
│   │   └── $repoId/
│   │       └── commits.tsx           # 커밋 목록 (/repo/:repoId/commits)
│   ├── session/
│   │   └── $commitSha/
│   │       ├── index.tsx             # 학습 세션 (/session/:commitSha)
│   │       └── result.tsx            # 학습 결과 (/session/:commitSha/result)
│   ├── settings/
│   │   └── profile.tsx               # 설정 (/settings/profile)
│   └── $404.tsx                      # 404 페이지
│
├── lib/               # 유틸리티
│   └── utils.ts       # shadcn/ui 유틸리티
│
├── main.tsx           # 앱 진입점
├── index.css          # 전역 스타일
└── routeTree.gen.ts   # 자동 생성된 라우트 트리
```

## 페이지 상세

### 1. 인증 및 온보딩 (3개)

#### `/` - 랜딩 페이지
- **파일**: `routes/index.tsx`
- **기능**:
  - 서비스 소개
  - GitHub OAuth 로그인 버튼
  - 주요 기능 카드 (AI 코드 리뷰, 맞춤형 퀴즈, 학습 성과 추적)
- **인증**: 불필요
- **특징**: 이미 로그인한 사용자는 자동으로 대시보드로 리다이렉트

#### `/auth/callback` - OAuth 콜백
- **파일**: `routes/auth/callback.tsx`
- **기능**:
  - GitHub OAuth 인증 코드 처리
  - 토큰 교환 및 저장
  - 신규/기존 사용자 구분하여 리다이렉트
- **인증**: 불필요 (인증 프로세스 중)

#### `/onboarding` - 온보딩
- **파일**: `routes/onboarding.tsx`
- **기능**:
  - 3단계 프로필 설정
    - 1단계: 관심 분야 선택 (백엔드, 프론트엔드 등)
    - 2단계: 목표 수준 선택 (입문, 취업준비, 실무향상)
    - 3단계: 일일 학습 목표 설정 (커밋/퀴즈 수)
  - 진행 상태 표시
  - 건너뛰기 옵션
- **인증**: 필수

### 2. 메인 대시보드 (2개)

#### `/dashboard` - 저장소 대시보드
- **파일**: `routes/dashboard.tsx`
- **기능**:
  - GitHub 저장소 목록 표시
  - 검색 기능
  - 저장소 연결/학습 버튼
  - 저장소 메타데이터 (언어, 스타, 업데이트 날짜)
  - 로딩 스켈레톤 UI
  - 빈 상태 처리
- **인증**: 필수

#### `/repo/:repoId/commits` - 커밋 목록
- **파일**: `routes/repo/$repoId/commits.tsx`
- **기능**:
  - 커밋 타임라인 표시
  - 브랜치 선택 드롭다운
  - 학습 가치 점수 배지 (높음/중간/낮음)
  - 커밋 메타데이터 (작성자, 날짜, 파일 수, 변경 라인)
  - 학습 완료 상태 표시
  - 학습 시작 버튼
- **인증**: 필수

### 3. 학습 플로우 (2개)

#### `/session/:commitSha` - 학습 세션
- **파일**: `routes/session/$commitSha/index.tsx`
- **기능**:
  - 탭 네비게이션 (코드 리뷰 / 퀴즈)
  - **코드 리뷰 탭**:
    - AI 분석 요약
    - 코드 품질 점수 (가독성, 성능, 보안)
    - 개선 제안 목록
    - 잠재적 버그 지적
    - Diff 뷰어 (placeholder)
  - **퀴즈 탭**:
    - AI 생성 퀴즈 (3-5문항)
    - 객관식/단답형 문제
    - 답안 입력 UI
    - 제출 버튼
- **인증**: 필수

#### `/session/:commitSha/result` - 학습 결과
- **파일**: `routes/session/$commitSha/result.tsx`
- **기능**:
  - 점수 요약 (정답률, 소요 시간)
  - AI 종합 코멘트
  - 학습 성과 분석 (강점/약점 키워드)
  - 문항별 상세 해설
  - 개념 노트
  - 외부 학습 자료 추천
  - 복습 일정 설정 (3일/7일 후)
  - 커밋 목록으로 돌아가기
- **인증**: 필수

### 4. 기타 (2개)

#### `/settings/profile` - 설정
- **파일**: `routes/settings/profile.tsx`
- **기능**:
  - 사용자 프로필 정보 표시
  - 관심 분야 수정
  - 목표 수준 수정
  - 일일 학습 목표 수정
  - 로그아웃
  - 회원 탈퇴 (확인 단계 포함)
- **인증**: 필수

#### `/*` - 404 페이지
- **파일**: `routes/$404.tsx`
- **기능**:
  - 404 에러 메시지
  - 대시보드로 돌아가기
  - 이전 페이지로 돌아가기
- **인증**: 불필요

## Context & State Management

### AuthContext
**위치**: `contexts/AuthContext.tsx`

**제공 기능**:
- `user`: 현재 사용자 정보 (GitHub 프로필)
- `profile`: 사용자 학습 프로필 (온보딩 데이터)
- `isAuthenticated`: 인증 상태
- `isLoading`: 로딩 상태
- `login(token)`: 로그인 처리
- `logout()`: 로그아웃 처리
- `updateProfile(profile)`: 프로필 업데이트

**사용 방법**:
```tsx
import { useAuth } from '@/contexts/AuthContext'

function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth()
  // ...
}
```

## Layout & Navigation

### Root Layout
**파일**: `routes/__root.tsx`
- 모바일 뷰포트 (390x844)
- 조건부 헤더 표시 (랜딩/콜백 페이지 제외)
- 스크롤 가능한 컨텐츠 영역

### Header (GNB)
**파일**: `components/layout/Header.tsx`
- 로고 (클릭 시 대시보드 이동)
- 사용자 프로필 드롭다운
  - 내 프로필
  - 설정
  - 로그아웃

## 개발 가이드

### 개발 서버 실행
```bash
npm run dev
# http://localhost:5174/
```

### 빌드
```bash
npm run build
```

### 새 페이지 추가
1. `src/routes/` 에 파일 생성
2. TanStack Router의 파일 기반 라우팅 규칙 따르기:
   - `index.tsx` → `/`
   - `about.tsx` → `/about`
   - `posts/$postId.tsx` → `/posts/:postId`
3. 라우트 정의:
```tsx
import { createFileRoute } from '@tanstack/react-router'

function MyPage() {
  return <div>My Page</div>
}

export const Route = createFileRoute('/my-page')({
  component: MyPage,
})
```

### shadcn/ui 컴포넌트 추가
```bash
npx shadcn@latest add [component-name]
```

## 환경 변수

`.env` 파일에 다음 변수 설정:
```
VITE_GITHUB_CLIENT_ID=your_github_oauth_client_id
VITE_API_URL=your_backend_api_url
```

## TODO / 다음 단계

### 백엔드 연동
- [ ] API 클라이언트 설정 (axios)
- [ ] React Query hooks 작성
- [ ] GitHub OAuth 토큰 교환 API 연동
- [ ] 저장소 목록 API 연동
- [ ] 커밋 목록 API 연동
- [ ] AI 분석/퀴즈 API 연동

### 기능 개선
- [ ] 실제 Diff 뷰어 컴포넌트 구현
- [ ] 토스트 알림 시스템 추가
- [ ] 로딩 상태 개선
- [ ] 에러 바운더리 추가
- [ ] 다크 모드 (이미 다크 모드로 디자인됨)

### 성능 최적화
- [ ] 이미지 최적화
- [ ] Code splitting
- [ ] React.memo 적용
- [ ] Virtual scrolling (긴 목록)

### 테스트
- [ ] Unit tests (Vitest)
- [ ] Integration tests
- [ ] E2E tests (Playwright)

## 라이선스
프로젝트 라이선스 정보
