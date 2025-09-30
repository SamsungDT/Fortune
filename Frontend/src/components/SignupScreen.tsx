import React, { useState } from 'react';
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { Checkbox } from "./ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { User } from 'lucide-react';

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

// -------------------- 서버 연결 설정 --------------------
const API_BASE = 'http://43.202.64.247';
const SIGNUP_URL = `${API_BASE}/api/security/email/signup`;
const CHECK_EMAIL_URL = `${API_BASE}/api/security/email/check-email`;

// 공통 응답 포맷
type APIResponse<T> = {
  code: number;         // 예: 200
  message: string;      // 예: OK
  data: T | null;       // 성공 시 UUID/Boolean, 실패 시 null
};

// 백엔드 enum 네이밍에 맞춰 필요시 수정
type BirthTimeEnum =
  | 'Missing' | 'Ja' | 'Chuk' | 'In' | 'Myo' | 'Jin' | 'Sa'
  | 'OH' | 'Mi' | 'Sin' | 'Yu' | 'Sul' | 'Hae';

// 프론트 입력(HH:mm or unknown)을 백엔드 enum으로 변환
function mapBirthTimeToEnum(birthTimeHHmm: string, isUnknown: boolean): BirthTimeEnum {
  if (isUnknown) return 'Missing'; // ← 시간 모름은 Missing (중요!)
  const hour = Number((birthTimeHHmm || '12:00').split(':')[0] || 12);

  // 12지지 경계: [23-01] [01-03] [03-05] [05-07] [07-09] [09-11] [11-13] [13-15] [15-17] [17-19] [19-21] [21-23]
  if (hour === 23 || hour === 0) return 'Ja';
  if (hour === 1 || hour === 2) return 'Chuk';
  if (hour === 3 || hour === 4) return 'In';
  if (hour === 5 || hour === 6) return 'Myo';
  if (hour === 7 || hour === 8) return 'Jin';
  if (hour === 9 || hour === 10) return 'Sa';
  if (hour === 11 || hour === 12) return 'OH';
  if (hour === 13 || hour === 14) return 'Mi';
  if (hour === 15 || hour === 16) return 'Sin';
  if (hour === 17 || hour === 18) return 'Yu';
  if (hour === 19 || hour === 20) return 'Sul';
  if (hour === 21 || hour === 22) return 'Hae';
  return 'Missing';
}

// 성별 매핑: UI('male'|'female') -> API('MALE'|'FEMALE')
function mapSex(gender: string): 'MALE' | 'FEMALE' {
  return gender === 'male' ? 'MALE' : 'FEMALE';
}

// 이메일 형식 검증(간단)
const isValidEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

export function SignupScreen({ onSignup, appStats, onGoToLogin }: SignupScreenProps) {
  const [agreed, setAgreed] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(true);

  // 신규: 이메일을 상태로 관리(중복 확인을 위해)
  const [email, setEmail] = useState('');
  const [emailStatus, setEmailStatus] = useState<'idle'|'checking'|'available'|'taken'|'error'>('idle');
  const [emailMsg, setEmailMsg] = useState<string | null>(null);

  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [isUnknownTime, setIsUnknownTime] = useState(false);
  const [gender, setGender] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // 이메일 변경 시 상태 초기화
  const onEmailChange = (v: string) => {
    setEmail(v);
    setEmailStatus('idle');
    setEmailMsg(null);
  };

  // 이메일 중복 확인 호출(성공 시 true/false 반환)
  const checkEmailAvailability = async (): Promise<boolean | null> => {
    if (!email || !isValidEmail(email)) {
      setEmailStatus('error');
      setEmailMsg('이메일 형식이 올바르지 않습니다.');
      return null;
    }
    try {
      setEmailStatus('checking');
      setEmailMsg('중복 확인 중...');
      const res = await fetch(CHECK_EMAIL_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const body = (await res.json()) as APIResponse<boolean>;
      if (!res.ok || body.code !== 200 || typeof body.data !== 'boolean') {
        setEmailStatus('error');
        setEmailMsg(body?.message || `중복 확인 실패 (HTTP ${res.status})`);
        return null;
      }
      if (body.data === true) {
        setEmailStatus('available');
        setEmailMsg('사용 가능한 이메일입니다.');
        return true;
      } else {
        setEmailStatus('taken');
        setEmailMsg('이미 사용 중인 이메일입니다.');
        return false;
      }
    } catch (e: any) {
      setEmailStatus('error');
      setEmailMsg(e?.message || '네트워크 오류로 중복 확인에 실패했습니다.');
      return null;
    }
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get('name') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    // 기본 유효성 검사
    if (!name || !email || !password || !confirmPassword) {
      alert('모든 필드를 입력해주세요.');
      return;
    }
    if (!isValidEmail(email)) {
      alert('이메일 형식이 올바르지 않습니다.');
      return;
    }
    if (password.length < 8) {
      alert('비밀번호는 8자 이상이어야 합니다.');
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
    if (!isUnknownTime && !birthTime) {
      alert('태어난 시간을 입력해주세요.');
      return;
    }
    if (!gender) {
      alert('성별을 선택해주세요.');
      return;
    }
    if (!agreed) {
      alert('이용약관에 동의해주세요.');
      return;
    }

    // 이메일 중복 미확인 or 사용 중이면 여기서 보정
    if (emailStatus !== 'available') {
      const ok = await checkEmailAvailability();
      if (ok !== true) {
        // taken(false) 또는 error(null)
        return;
      }
    }

    // 날짜 분해 -> 연/월/일 숫자
    const [yyyy, mm, dd] = birthDate.split('-').map((s) => parseInt(s, 10));
    // 시간대 변환(enum)
    const birthTimeEnum = mapBirthTimeToEnum(birthTime, isUnknownTime);
    // 성별 변환(enum)
    const sexEnum = mapSex(gender);

    const payload = {
      email,
      password,
      name,
      sex: sexEnum,           // 'MALE' | 'FEMALE'
      birthYear: yyyy,        // int
      birthMonth: mm,         // int
      birthDay: dd,           // int
      birthTime: birthTimeEnum as BirthTimeEnum, // enum
    };

    try {
      setSubmitting(true);
      const res = await fetch(SIGNUP_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      // 응답 파싱
      let body: APIResponse<string> | null = null;
      try {
        body = await res.json();
      } catch {
        // 서버가 바디 없이 에러를 내는 경우 대비
      }

      if (!res.ok || !body || typeof body.code !== 'number' || body.code !== 200) {
        const msg = body?.message || `회원가입 실패 (HTTP ${res.status})`;
        setApiError(msg);
        alert(msg);
        return;
      }

      // 성공: 서버가 준 UUID
      const userId = body.data;

      // 상위 상태 갱신(기존 prop 시그니처 유지)
      onSignup({
        name,
        email,
        provider: 'email',
        birthDate: birthDate,
        birthTime: isUnknownTime ? '12:00' : birthTime, // 이후 분석화면 프리필용
      });

      alert('회원가입이 완료되었습니다!');
      onGoToLogin?.();

    } catch (err: any) {
      const msg = err?.message || '네트워크 오류로 회원가입에 실패했습니다.';
      setApiError(msg);
      alert(msg);
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
        <div className="text-center mb-8">
          <div className="relative mb-6">
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

            <div className="flex items-center justify-center mb-3">
              <div className="h-px bg-hanbok-gold/40 w-8"></div>
              <div className="mx-2 w-2 h-2 bg-hanbok-gold rounded-full"></div>
              <div className="h-px bg-hanbok-gold/40 w-8"></div>
            </div>

            {apiError && (
              <p className="text-xs text-red-600 mt-2">{apiError}</p>
            )}
          </div>

          <p className="text-muted-foreground text-sm leading-relaxed">
            Fortune K.I와 함께 새로운 시작을
          </p>
        </div>

        {!showEmailForm ? (
          <>
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
          <>
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
                  disabled={submitting}
                />
              </div>

              {/* 이메일 + 중복 확인 */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-ink-black dark:text-ink-gray">이메일</Label>
                <div className="flex gap-2">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="이메일 주소를 입력하세요"
                    value={email}
                    onChange={(e) => onEmailChange(e.target.value)}
                    className="h-11 bg-input-background border border-border focus:border-hanbok-gold/60 focus:ring-hanbok-gold/30 rounded-xl transition-all duration-300 flex-1"
                    required
                    disabled={submitting || emailStatus === 'checking'}
                  />
                  <Button
                    type="button"
                    onClick={checkEmailAvailability}
                    disabled={
                      submitting ||
                      emailStatus === 'checking' ||
                      !email ||
                      !isValidEmail(email)
                    }
                    className="h-11 whitespace-nowrap"
                    variant="outline"
                  >
                    {emailStatus === 'checking' ? '확인 중...' : '중복 확인'}
                  </Button>
                </div>
                {/* 상태 메시지/배지 */}
                {emailStatus === 'available' && (
                  <div className="text-xs text-green-600">사용 가능한 이메일입니다.</div>
                )}
                {emailStatus === 'taken' && (
                  <div className="text-xs text-red-600">이미 사용 중인 이메일입니다.</div>
                )}
                {emailStatus === 'error' && emailMsg && (
                  <div className="text-xs text-red-600">{emailMsg}</div>
                )}
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
                  disabled={submitting}
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
                  disabled={submitting}
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
                  disabled={submitting}
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
                      if (e.target.checked) setBirthTime('');
                    }}
                    className="w-4 h-4 text-hanbok-gold bg-input-background border-border rounded focus:ring-hanbok-gold/30 focus:ring-2"
                    disabled={submitting}
                  />
                  <Label htmlFor="unknownTime" className="text-sm text-muted-foreground cursor-pointer">
                    태어난 시간을 정확히 모르겠어요 (정오 12시로 계산됩니다)
                  </Label>
                </div>

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
                        <SelectTrigger className="h-10 bg-input-background border border-border focus:border-hanbok-gold/60 rounded-xl" disabled={submitting}>
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
                        <SelectTrigger className="h-10 bg-input-background border border-border focus:border-hanbok-gold/60 rounded-xl" disabled={submitting}>
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
                    disabled={submitting}
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
                    disabled={submitting}
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
                  disabled={submitting}
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
                className="w-full h-11 bg-ink-black dark:bg-ink-gray text-white dark:text-ink-black hover:bg-ink-gray dark:hover:bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 font-medium mt-4 disabled:opacity-60"
                disabled={submitting || emailStatus === 'checking'}
              >
                <span className="flex items-center justify-center space-x-2">
                  <span>{submitting ? '⏳' : '🚀'}</span>
                  <span>{submitting ? '가입 중...' : '회원가입 완료'}</span>
                </span>
              </Button>
            </form>
          </>
        )}

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
        {showEmailForm && (
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
