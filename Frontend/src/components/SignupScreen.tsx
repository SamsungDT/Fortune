import React, { useState } from 'react';
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { Checkbox } from "./ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ChevronLeft } from "lucide-react";
import { User, Calendar, Clock, Sparkles, AlertCircle, Star } from 'lucide-react';

interface AppStats {
  totalUsers: number;
  totalReadings: number;
  physiognomyCount: number;
  lifeFortuneCount: number;
  dailyFortuneCount: number;
  dreamCount: number;
}

interface SignupScreenProps {
  onSignup: (signupData: { name: string; email: string; provider: string; birthDate?: string; birthTime?: string }) => void;
  appStats: AppStats;
  onGoToLogin: () => void;
}

export function SignupScreen({ onSignup, appStats, onGoToLogin }: SignupScreenProps) {
  const [agreed, setAgreed] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(true);
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [isUnknownTime, setIsUnknownTime] = useState(false);
  const [gender, setGender] = useState('');

  const handleSocialSignup = (provider: string) => {
    // 실제 앱에서는 각 소셜 로그인 SDK를 사용
    const mockUserData = {
      name: `신규사용자_${provider}`,
      email: `newuser@${provider}.com`,
      provider: provider
    };
    onSignup(mockUserData);
  };

  const handleEmailSignup = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    // 기본 유효성 검사
    if (!name || !email || !password || !confirmPassword) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (!birthDate) {
      alert('생년월일을 입력해주세요.');
      return;
    }

    const finalBirthTime = isUnknownTime ? '12:00' : birthTime;

    if (!isUnknownTime && !birthTime) {
      alert('태어난 시간을 입력해주세요.');
      return;
    }

    if (!agreed) {
      alert('이용약관에 동의해주세요.');
      return;
    }

    // 회원가입 완료
    onSignup({
      name: name,
      email: email,
      provider: 'email',
      birthDate: birthDate,
      birthTime: finalBirthTime
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 hanji-texture">
      {/* 배경 문양 */}
      <div className="absolute inset-0 opacity-30">
        <div className="h-full w-full bg-gradient-to-br from-hanbok-gold/5 via-transparent to-hanbok-gold/5"></div>
      </div>

      <Card className="relative w-full max-w-sm mx-auto p-8 bg-white/95 dark:bg-card/95 backdrop-blur-lg border border-hanbok-gold/20 ink-shadow rounded-3xl">
        {/* 메인 헤더 */}
        <div className="text-center mb-8">
          <div className="relative mb-6">
            {/* 한국 전통 심볼과 현대적 해석 */}
            <div className="relative inline-block">
              <div className="text-6xl mb-3 relative">
                <span className="absolute inset-0 text-hanbok-gold/20 transform scale-110">✨</span>
                <span className="relative text-ink-black dark:text-ink-gray">✨</span>
              </div>
            </div>

            <h1 className="text-2xl mb-2 text-ink-black dark:text-ink-gray ink-brush font-bold">
              Fortune K.I
            </h1>
            <h2 className="text-lg mb-3 text-ink-black dark:text-ink-gray">
              회원가입
            </h2>

            {/* 전통 장식선 */}
            <div className="flex items-center justify-center mb-3">
              <div className="h-px bg-hanbok-gold/40 w-8"></div>
              <div className="mx-2 w-2 h-2 bg-hanbok-gold rounded-full"></div>
              <div className="h-px bg-hanbok-gold/40 w-8"></div>
            </div>
          </div>

          <p className="text-muted-foreground text-sm leading-relaxed">
            Fortune K.I와 함께 새로운 시작을
          </p>
        </div>

        {!showEmailForm ? (
          // 소셜 회원가입 및 이메일 회원가입 선택
          <>
            {/* <div className="space-y-3 mb-6">
              <Button 
                onClick={() => handleSocialSignup('kakao')}
                className="w-full h-11 bg-yellow-400 hover:bg-yellow-500 text-black rounded-xl border border-yellow-500/30 shadow-md hover:shadow-lg transition-all duration-300 font-medium text-sm"
              >
                <span className="flex items-center justify-center space-x-2">
                  <span>📱</span>
                  <span>카카오로 시작하기</span>
                </span>
              </Button>
              
              <Button 
                onClick={() => handleSocialSignup('naver')}
                className="w-full h-11 bg-green-500 hover:bg-green-600 text-white rounded-xl border border-green-600/30 shadow-md hover:shadow-lg transition-all duration-300 font-medium text-sm"
              >
                <span className="flex items-center justify-center space-x-2">
                  <span>🟢</span>
                  <span>네이버로 시작하기</span>
                </span>
              </Button>
              
              <Button 
                onClick={() => handleSocialSignup('google')}
                className="w-full h-11 bg-white hover:bg-gray-50 text-gray-800 rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 font-medium text-sm"
              >
                <span className="flex items-center justify-center space-x-2">
                  <span>🔍</span>
                  <span>구글로 시작하기</span>
                </span>
              </Button>
            </div> */}

            {/* 구분선 */}
            {/* <div className="relative my-6">
              <Separator className="bg-border" />
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-card px-4">
                <span className="text-muted-foreground text-sm">또는</span>
              </div>
            </div> */}

            {/* 이메일 회원가입 버튼 */}
            <Button
              onClick={() => setShowEmailForm(true)}
              className="w-full h-11 bg-ink-black dark:bg-ink-gray text-white dark:text-ink-black hover:bg-ink-gray dark:hover:bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 font-medium"
            >
              <span className="flex items-center justify-center space-x-2">
                <span>✉️</span>
                <span>이메일로 회원가입</span>
              </span>
            </Button>
          </>
        ) : (
          // 이메일 회원가입 폼
          <>
            {/* 뒤로가기 버튼 */}
            {/* <div className="mb-6">
              <Button
                onClick={() => setShowEmailForm(false)}
                variant="ghost"
                className="flex items-center space-x-2 text-muted-foreground hover:text-ink-black dark:hover:text-ink-gray"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>다른 방법으로 회원가입</span>
              </Button>
            </div> */}

            <form onSubmit={handleEmailSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-ink-black dark:text-ink-gray">이름</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="이름을 입력하세요"
                  className="h-11 bg-input-background border border-border focus:border-hanbok-gold/60 focus:ring-hanbok-gold/30 rounded-xl transition-all duration-300"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-ink-black dark:text-ink-gray">이메일</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="이메일 주소를 입력하세요"
                  className="h-11 bg-input-background border border-border focus:border-hanbok-gold/60 focus:ring-hanbok-gold/30 rounded-xl transition-all duration-300"
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
                  className="h-11 bg-input-background border border-border focus:border-hanbok-gold/60 focus:ring-hanbok-gold/30 rounded-xl transition-all duration-300"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-ink-black dark:text-ink-gray">비밀번호 확인</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="비밀번호를 다시 입력하세요"
                  className="h-11 bg-input-background border border-border focus:border-hanbok-gold/60 focus:ring-hanbok-gold/30 rounded-xl transition-all duration-300"
                  required
                />
              </div>

              {/* 구분선 */}
              <div className="relative my-5">
                <Separator className="bg-border" />
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-card px-4">
                  <span className="text-muted-foreground text-xs">운세 분석을 위한 정보</span>
                </div>
              </div>

              {/* 생년월일 입력 */}
              <div className="space-y-2">
                <Label htmlFor="birthDate" className="text-ink-black dark:text-ink-gray">
                  생년월일 <span className="text-dancheong-red">*</span>
                </Label>
                <Input
                  id="birthDate"
                  name="birthDate"
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className="h-11 bg-input-background border border-border focus:border-hanbok-gold/60 focus:ring-hanbok-gold/30 rounded-xl transition-all duration-300 text-center"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  양력 기준으로 입력해주세요
                </p>
              </div>

              {/* 태어난 시간 입력 */}
              <div className="space-y-3">
                <Label className="text-ink-black dark:text-ink-gray">
                  태어난 시간 <span className="text-dancheong-red">*</span>
                </Label>

                {/* 시간 모름 체크박스 */}
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="unknownTime"
                    checked={isUnknownTime}
                    onChange={(e) => {
                      setIsUnknownTime(e.target.checked);
                      if (e.target.checked) {
                        setBirthTime('');
                      }
                    }}
                    className="w-4 h-4 text-hanbok-gold bg-input-background border-border rounded focus:ring-hanbok-gold/30 focus:ring-2"
                  />
                  <Label htmlFor="unknownTime" className="text-sm text-muted-foreground cursor-pointer">
                    태어난 시간을 정확히 모르겠어요 (정오 12시로 계산됩니다)
                  </Label>
                </div>

                {/* 시간 입력 필드 */}
                {!isUnknownTime && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="birthHour" className="text-xs text-muted-foreground">시</Label>
                      <Select
                        value={birthTime.split(':')[0] || ''}
                        onValueChange={(hour) => {
                          const minute = birthTime.split(':')[1] || '00';
                          setBirthTime(`${hour.padStart(2, '0')}:${minute}`);
                        }}
                      >
                        <SelectTrigger className="h-10 bg-input-background border border-border focus:border-hanbok-gold/60 rounded-xl">
                          <SelectValue placeholder="시" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 }, (_, i) => (
                            <SelectItem key={i} value={i.toString()}>
                              {i.toString().padStart(2, '0')}시
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="birthMinute" className="text-xs text-muted-foreground">분</Label>
                      <Select
                        value={birthTime.split(':')[1] || ''}
                        onValueChange={(minute) => {
                          const hour = birthTime.split(':')[0] || '00';
                          setBirthTime(`${hour}:${minute.padStart(2, '0')}`);
                        }}
                      >
                        <SelectTrigger className="h-10 bg-input-background border border-border focus:border-hanbok-gold/60 rounded-xl">
                          <SelectValue placeholder="분" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 60 }, (_, i) => (
                            <SelectItem key={i} value={i.toString()}>
                              {i.toString().padStart(2, '0')}분
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {isUnknownTime && (
                  <div className="bg-hanbok-gold/10 border border-hanbok-gold/30 rounded-xl p-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-hanbok-gold-dark">ℹ️</span>
                      <div className="text-sm text-hanbok-gold-dark">
                        <p className="font-medium">정오 12시로 계산됩니다</p>
                        <p className="text-xs mt-1">가능하면 정확한 시간을 확인해보세요.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 성별 */}
              <div className="space-y-3">
                <Label className="text-ink-black dark:text-ink-gray flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  성별
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant={gender === 'male' ? 'default' : 'outline'}
                    onClick={() => setGender('male')}
                    className={`h-12 rounded-2xl font-medium transition-all duration-300 ${gender === 'male'
                        ? 'bg-hanbok-gold hover:bg-hanbok-gold-dark text-ink-black border-hanbok-gold'
                        : 'border-border hover:border-hanbok-gold/50 hover:bg-hanbok-gold/5'
                      }`}
                  >
                    🙋‍♂️ 남성
                  </Button>
                  <Button
                    type="button"
                    variant={gender === 'female' ? 'default' : 'outline'}
                    onClick={() => setGender('female')}
                    className={`h-12 rounded-2xl font-medium transition-all duration-300 ${gender === 'female'
                        ? 'bg-hanbok-gold hover:bg-hanbok-gold-dark text-ink-black border-hanbok-gold'
                        : 'border-border hover:border-hanbok-gold/50 hover:bg-hanbok-gold/5'
                      }`}
                  >
                    🙋‍♀️ 여성
                  </Button>
                </div>
              </div>

              {/* 구분선 */}
              <div className="relative my-5">
                <Separator className="bg-border" />
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-card px-4">
                  <span className="text-muted-foreground text-xs">약관 동의</span>
                </div>
              </div>

              {/* 이용약관 동의 */}
              <div className="flex items-start space-x-3 py-3">
                <Checkbox
                  id="terms"
                  checked={agreed}
                  onCheckedChange={(checked) => setAgreed(checked as boolean)}
                  className="border-hanbok-gold/40 data-[state=checked]:bg-hanbok-gold data-[state=checked]:border-hanbok-gold"
                />
                <div className="text-sm leading-relaxed">
                  <Label htmlFor="terms" className="text-ink-black dark:text-ink-gray cursor-pointer">
                    <span className="text-hanbok-gold-dark underline">이용약관</span> 및{' '}
                    <span className="text-hanbok-gold-dark underline">개인정보처리방침</span>에 동의합니다
                  </Label>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-ink-black dark:bg-ink-gray text-white dark:text-ink-black hover:bg-ink-gray dark:hover:bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 font-medium mt-4"
              >
                <span className="flex items-center justify-center space-x-2">
                  <span>🚀</span>
                  <span>회원가입 완료</span>
                </span>
              </Button>
            </form>
          </>
        )}

        {/* 무료 체험 안내 */}
        {/* <div className="mt-6 text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-hanbok-gold/10 border border-hanbok-gold/30 rounded-full">
            <span className="text-hanbok-gold-dark">🎁</span>
            <span className="text-hanbok-gold-dark text-xs font-medium">가입하면 매일 무료 체험</span>
          </div>
        </div> */}

        {/* 앱 이용 통계 */}
        <div className="mt-4 space-y-3">
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-3">
              지금까지 <span className="text-hanbok-gold-dark font-semibold">{appStats.totalUsers.toLocaleString()}명</span>이 Fortune K.I와 함께했어요
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-hanbok-gold/5 border border-hanbok-gold/20 rounded-xl p-2 text-center">
              <div className="text-sm mb-1">👤</div>
              <div className="text-xs text-hanbok-gold-dark font-bold">{appStats.physiognomyCount.toLocaleString()}회</div>
              <div className="text-xs text-muted-foreground">관상 분석</div>
            </div>
            <div className="bg-hanbok-gold/5 border border-hanbok-gold/20 rounded-xl p-2 text-center">
              <div className="text-sm mb-1">🌟</div>
              <div className="text-xs text-hanbok-gold-dark font-bold">{appStats.lifeFortuneCount.toLocaleString()}회</div>
              <div className="text-xs text-muted-foreground">평생 운세</div>
            </div>
            <div className="bg-hanbok-gold/5 border border-hanbok-gold/20 rounded-xl p-2 text-center">
              <div className="text-sm mb-1">📅</div>
              <div className="text-xs text-hanbok-gold-dark font-bold">{appStats.dailyFortuneCount.toLocaleString()}회</div>
              <div className="text-xs text-muted-foreground">오늘의 운세</div>
            </div>
            <div className="bg-hanbok-gold/5 border border-hanbok-gold/20 rounded-xl p-2 text-center">
              <div className="text-sm mb-1">💭</div>
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

        {/* 로그인 링크 */}
        {!showEmailForm && (
          <div className="mt-4 text-center">
            <p className="text-xs text-muted-foreground">
              이미 계정이 있으신가요?{' '}
              <button
                onClick={onGoToLogin}
                className="text-hanbok-gold-dark hover:text-hanbok-gold font-medium underline underline-offset-2 transition-colors"
              >
                로그인하기
              </button>
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}