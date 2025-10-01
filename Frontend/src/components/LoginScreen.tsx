// LoginScreen.tsx
import React, { useState } from 'react';
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
// import { ChevronLeft } from "lucide-react";
import { Loader2 } from 'lucide-react'; // 로딩 아이콘 추가

interface AppStats {
  totalUsers: number;
  totalReadings: number;
  physiognomyCount: number;
  lifeFortuneCount: number;
  dailyFortuneCount: number;
  dreamCount: number;
}

interface LoginScreenProps {
  onLogin: (loginData: { name: string; email: string; provider: string }) => void;
  appStats: AppStats | null; // appStats가 null일 수 있도록 타입 변경
  onGoToSignup: () => void;
}

// ================= 서버/타입 설정 =================
const API_BASE = '';
const LOGIN_URL = `${API_BASE}/api/security/email/login`;

type APIResponse<T> = {
  code: number;      // 예: 200
  message: string;    // 예: OK
  data: T | null;      // 성공 시 데이터
};

type TokenResponse = {
  accessToken: string;
  refreshToken: string;
};

export function LoginScreen({ onLogin, appStats, onGoToSignup }: LoginScreenProps) {
  const [showEmailForm, setShowEmailForm] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleSocialLogin = (provider: string) => {
    // 실제 앱에서는 각 소셜 로그인 SDK를 사용
    const mockUserData = {
      name: `사용자_${provider}`,
      email: `user@${provider}.com`,
      provider: provider
    };
    onLogin(mockUserData);
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    const formData = new FormData(e.target as HTMLFormElement);
    const email = (formData.get('email') as string)?.trim();
    const password = (formData.get('password') as string) ?? '';

    if (!email || !password) {
      setApiError('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    try {
      setSubmitting(true);

      const res = await fetch(LOGIN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      let body: APIResponse<TokenResponse> | null = null;
      try {
        body = await res.json();
      } catch {
        // JSON 파싱 실패(드문 경우) 대비
      }

      // APIResponse 포맷 기준으로 성공 판정
      const ok = body?.code === 200 && !!body.data;
      if (!ok) {
        const msg = body?.message || `로그인 실패 (HTTP ${res.status})`;
        setApiError(msg);
        return;
      }

      const { accessToken, refreshToken } = body!.data!;
      if (!accessToken || !refreshToken) {
        setApiError('토큰이 응답에 없습니다. 서버 응답을 확인해주세요.');
        return;
      }

      // 토큰 저장
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      // 상위 콜백 (기존 시그니처 유지)
      onLogin({
        name: email.split('@')[0],
        email,
        provider: 'email',
      });
    } catch (err: any) {
      setApiError(err?.message || '네트워크 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 hanji-texture">
      {/* 배경 문양 */}
      <div className="absolute inset-0 opacity-30">
        <div className="h-full w-full bg-gradient-to-br from-hanbok-gold/5 via-transparent to-hanbok-gold/5"></div>
      </div>

      <Card className="relative w-full max-w-sm mx-auto p-8 bg-white/95 dark:bg-card/95 backdrop-blur-lg border border-hanbok-gold/20 ink-shadow rounded-3xl">
        {/* 메인 헤더 */}
        <div className="text-center mb-10">
          <div className="relative mb-6">
            <div className="relative inline-block">
              <div className="text-7xl mb-3 relative">
                <span className="absolute inset-0 text-hanbok-gold/20 transform scale-110">☯</span>
                <span className="relative text-ink-black dark:text-ink-gray">☯</span>
              </div>
            </div>

            <h1 className="text-3xl mb-3 text-ink-black dark:text-ink-gray ink-brush font-bold">
              Fortune K.I
            </h1>

            <div className="flex items-center justify-center mb-3">
              <div className="h-px bg-hanbok-gold/40 w-8"></div>
              <div className="mx-2 w-2 h-2 bg-hanbok-gold rounded-full"></div>
              <div className="h-px bg-hanbok-gold/40 w-8"></div>
            </div>

            {apiError && (
              <p className="text-xs text-red-600 mt-2">{apiError}</p>
            )}
          </div>

          <p className="text-muted-foreground leading-relaxed">
            AI가 전하는 지혜로운 운세
          </p>
        </div>

        {!showEmailForm ? (
          // 소셜 로그인 선택 화면(현재 비활성)
          <>
            {/* <div className="space-y-4 mb-8"> ... </div> */}
            {/* <div className="relative my-8"> ... </div> */}
            <Button
              onClick={() => setShowEmailForm(true)}
              className="w-full h-12 bg-ink-black dark:bg-ink-gray text-white dark:text-ink-black hover:bg-ink-gray dark:hover:bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 font-medium"
            >
              <span className="flex items-center justify-center space-x-2">
                <span>✉️</span>
                <span>이메일로 로그인</span>
              </span>
            </Button>
          </>
        ) : (
          // 이메일 로그인 폼
          <>
            <form onSubmit={handleEmailLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-ink-black dark:text-ink-gray">이메일</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="이메일 주소를 입력하세요"
                  className="h-12 bg-input-background border border-border focus:border-hanbok-gold/60 focus:ring-hanbok-gold/30 rounded-xl transition-all duration-300"
                  required
                  disabled={submitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-ink-black dark:text-ink-gray">비밀번호</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                  className="h-12 bg-input-background border border-border focus:border-hanbok-gold/60 focus:ring-hanbok-gold/30 rounded-xl transition-all duration-300"
                  required
                  disabled={submitting}
                />
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full h-12 bg-ink-black dark:bg-ink-gray text-white dark:text-ink-black hover:bg-ink-gray dark:hover:bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 font-medium mt-6"
              >
                <span className="flex items-center justify-center space-x-2">
                  <span>{submitting ? '⏳' : '🚀'}</span>
                  <span>{submitting ? '로그인 중...' : '로그인'}</span>
                </span>
              </Button>
            </form>
          </>
        )}

        {/* 앱 이용 통계 */}
        <div className="mt-6 space-y-3">
          {appStats ? ( // appStats가 유효할 때만 통계 섹션 렌더링
            <>
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-3">
                  지금까지 <span className="text-hanbok-gold-dark font-semibold">{appStats.totalUsers.toLocaleString()}명</span>이 Fortune K.I와 함께했어요
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-hanbok-gold/5 border border-hanbok-gold/20 rounded-xl p-3 text-center">
                  <div className="text-lg mb-1">👤</div>
                  <div className="text-xs text-hanbok-gold-dark font-bold">{appStats.physiognomyCount.toLocaleString()}회</div>
                  <div className="text-xs text-muted-foreground">관상 분석</div>
                </div>
                <div className="bg-hanbok-gold/5 border border-hanbok-gold/20 rounded-xl p-3 text-center">
                  <div className="text-lg mb-1">🌟</div>
                  <div className="text-xs text-hanbok-gold-dark font-bold">{appStats.lifeFortuneCount.toLocaleString()}회</div>
                  <div className="text-xs text-muted-foreground">평생 운세</div>
                </div>
                <div className="bg-hanbok-gold/5 border border-hanbok-gold/20 rounded-xl p-3 text-center">
                  <div className="text-lg mb-1">📅</div>
                  <div className="text-xs text-hanbok-gold-dark font-bold">{appStats.dailyFortuneCount.toLocaleString()}회</div>
                  <div className="text-xs text-muted-foreground">오늘의 운세</div>
                </div>
                <div className="bg-hanbok-gold/5 border border-hanbok-gold/20 rounded-xl p-3 text-center">
                  <div className="text-lg mb-1">💭</div>
                  <div className="text-xs text-hanbok-gold-dark font-bold">{appStats.dreamCount.toLocaleString()}회</div>
                  <div className="text-xs text-muted-foreground">해몽</div>
                </div>
              </div>

              <div className="text-center">
                <Badge className="bg-dancheong-green/20 text-dancheong-green border border-dancheong-green/40 text-xs px-3 py-1">
                  총 {appStats.totalReadings.toLocaleString()}개의 운세 결과 생성 ✨
                </Badge>
              </div>
            </>
          ) : (
            // 로딩 중이거나 데이터가 없을 때 로딩 UI 표시
            <div className="flex justify-center items-center h-40">
              <Loader2 className="w-8 h-8 animate-spin text-hanbok-gold-dark" />
              <p className="ml-3 text-muted-foreground">통계 데이터 불러오는 중...</p>
            </div>
          )}
        </div>

        {/* 회원가입 링크 */}
        {showEmailForm && (
          <div className="mt-4 text-center">
            <p className="text-xs text-muted-foreground">
              계정이 없으신가요?{' '}
              <button
                onClick={onGoToSignup}
                className="text-hanbok-gold-dark hover:text-hanbok-gold font-medium underline underline-offset-2 transition-colors"
              >
                회원가입하기
              </button>
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}