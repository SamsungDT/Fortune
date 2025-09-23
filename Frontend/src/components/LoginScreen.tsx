import React, { useState } from 'react';
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { ChevronLeft } from "lucide-react";

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
  appStats: AppStats;
  onGoToSignup: () => void;
}

export function LoginScreen({ onLogin, appStats, onGoToSignup }: LoginScreenProps) {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const handleSocialLogin = (provider: string) => {
    // 실제 앱에서는 각 소셜 로그인 SDK를 사용
    const mockUserData = {
      name: `사용자_${provider}`,
      email: `user@${provider}.com`,
      provider: provider
    };
    onLogin(mockUserData);
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    // 간단한 목업 로그인
    if (email && password) {
      onLogin({
        name: email.split('@')[0],
        email: email,
        provider: 'email'
      });
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
            {/* 한국 전통 심볼과 현대적 해석 */}
            <div className="relative inline-block">
              <div className="text-7xl mb-3 relative">
                <span className="absolute inset-0 text-hanbok-gold/20 transform scale-110">☯</span>
                <span className="relative text-ink-black dark:text-ink-gray">☯</span>
              </div>
            </div>
            
            <h1 className="text-3xl mb-3 text-ink-black dark:text-ink-gray ink-brush font-bold">
              Fortune K.I
            </h1>
            
            {/* 전통 장식선 */}
            <div className="flex items-center justify-center mb-3">
              <div className="h-px bg-hanbok-gold/40 w-8"></div>
              <div className="mx-2 w-2 h-2 bg-hanbok-gold rounded-full"></div>
              <div className="h-px bg-hanbok-gold/40 w-8"></div>
            </div>
          </div>
          
          <p className="text-muted-foreground leading-relaxed">
            AI가 전하는 지혜로운 운세
          </p>
        </div>

        {!showEmailForm ? (
          // 소셜 로그인 및 이메일 로그인 선택
          <>
            {/* <div className="space-y-4 mb-8">
              <Button 
                onClick={() => handleSocialLogin('kakao')}
                className="w-full h-12 bg-yellow-400 hover:bg-yellow-500 text-black rounded-xl border border-yellow-500/30 shadow-md hover:shadow-lg transition-all duration-300 font-medium"
              >
                <span className="flex items-center justify-center space-x-2">
                  <span>📱</span>
                  <span>카카오 로그인</span>
                </span>
              </Button>
              
              <Button 
                onClick={() => handleSocialLogin('naver')}
                className="w-full h-12 bg-green-500 hover:bg-green-600 text-white rounded-xl border border-green-600/30 shadow-md hover:shadow-lg transition-all duration-300 font-medium"
              >
                <span className="flex items-center justify-center space-x-2">
                  <span>🟢</span>
                  <span>네이버 로그인</span>
                </span>
              </Button>
              
              <Button 
                onClick={() => handleSocialLogin('google')}
                className="w-full h-12 bg-white hover:bg-gray-50 text-gray-800 rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 font-medium"
              >
                <span className="flex items-center justify-center space-x-2">
                  <span>🔍</span>
                  <span>구글 로그인</span>
                </span>
              </Button>
            </div> */}

            {/* 구분선 */}
            {/* <div className="relative my-8">
              <Separator className="bg-border" />
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-card px-4">
                <span className="text-muted-foreground text-sm">또는</span>
              </div>
            </div> */}

            {/* 이메일 로그인 버튼 */}
            <Button 
              onClick={() => setShowEmailForm(true)}
              className="w-full h-12 bg-ink-black dark:bg-ink-gray text-white dark:text-ink-black hover:bg-ink-gray dark:hover:bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 font-medium"
            >
              <span className="flex items-center justify-center space-x-2">
                <span>✉️</span>
                <span>로그인</span>
                <span>✉️</span>
              </span>
            </Button>
          </>
        ) : (
          // 이메일 로그인 폼
          <>
            {/* 뒤로가기 버튼 */}
            <div className="mb-6">
              <Button
                onClick={() => setShowEmailForm(false)}
                variant="ghost"
                className="flex items-center space-x-2 text-muted-foreground hover:text-ink-black dark:hover:text-ink-gray"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>다른 방법으로 로그인</span>
              </Button>
            </div>

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
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 bg-ink-black dark:bg-ink-gray text-white dark:text-ink-black hover:bg-ink-gray dark:hover:bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 font-medium mt-6"
              >
                <span className="flex items-center justify-center space-x-2">
                  <span>🚀</span>
                  <span>로그인</span>
                </span>
              </Button>
            </form>
          </>
        )}

        {/* 무료 체험 안내 */}
        {/* <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-hanbok-gold/10 border border-hanbok-gold/30 rounded-full">
            <span className="text-hanbok-gold-dark">✨</span>
            <span className="text-hanbok-gold-dark text-sm font-medium">매일 한 번 무료 체험</span>
          </div>
        </div> */}

        {/* 앱 이용 통계 */}
        <div className="mt-6 space-y-3">
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
        </div>

        {/* 회원가입 링크 */}
        {!showEmailForm && (
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
