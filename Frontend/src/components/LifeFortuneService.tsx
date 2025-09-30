import React, { useState } from 'react';
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Alert, AlertDescription } from "./ui/alert";
import { FortuneResult } from "../App";
import { Sparkles, Star } from 'lucide-react';

interface LifeFortuneServiceProps {
  onResult: (result: FortuneResult) => void;
  onBack: () => void;
}

// ================= 서버/타입 =================
const API_BASE = '';
const LIFELONG_URL = `${API_BASE}/api/fortune/lifelong`;

type APIResponse<T> = { code: number; message: string; data: T | null };

type LifelongFortuneResponse = {
  id: string; // UUID
  personality: {
    strength: string;
    talent: string;
    responsibility: string;
    empathy: string;
  };
  wealth: {
    twenties: string;
    thirties: string;
    forties: string;
    fiftiesAndBeyond: string;
  };
  loveAndMarriage: {
    firstLove: string;
    marriageAge: string;
    spouseMeeting: string;
    marriedLife: string;
  };
  career: {
    successfulFields: string;
    careerChangeAge: string;
    leadershipStyle: string;
    entrepreneurship: string;
  };
  health: {
    generalHealth: string;
    weakPoint: string;
    checkupReminder: string;
    recommendedExercise: string;
  };
  turningPoints: {
    ein: string;
    zwei: string;
    drei: string;
  };
  goodLuck: {
    luckyColors: string;
    luckyNumbers: string;
    luckyDirection: string;
    goodDays: string;
    avoidances: string;
  };
};

// 토큰/이름 유틸
function getAccessToken() {
  return localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
}
function getDisplayName() {
  const fromLS = localStorage.getItem('userName') || localStorage.getItem('name');
  const fromSS = sessionStorage.getItem('userName') || sessionStorage.getItem('name');
  if (fromLS) return fromLS;
  if (fromSS) return fromSS;
  try {
    const u = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (u) {
      const o = JSON.parse(u);
      if (o?.name) return o.name as string;
    }
  } catch { }
  return '회원';
}
const s = (v?: string | null) => (v && String(v).trim().length ? v : '-');

// API 응답 → 화면용 마크다운
function buildFortuneMarkdown(displayName: string, f: LifelongFortuneResponse) {
  return `🌟 **${displayName}님의 평생 운세**

🎯 **타고난 성격과 재능**
• 장점: ${s(f.personality?.strength)}
• 재능: ${s(f.personality?.talent)}
• 책임감: ${s(f.personality?.responsibility)}
• 공감 능력: ${s(f.personality?.empathy)}

💰 **재물운**
• 20대: ${s(f.wealth?.twenties)}
• 30대: ${s(f.wealth?.thirties)}
• 40대: ${s(f.wealth?.forties)}
• 50대 이후: ${s(f.wealth?.fiftiesAndBeyond)}

💕 **연애·결혼운**
• 첫사랑: ${s(f.loveAndMarriage?.firstLove)}
• 결혼 적령기: ${s(f.loveAndMarriage?.marriageAge)}
• 배우자 만나는 법: ${s(f.loveAndMarriage?.spouseMeeting)}
• 결혼 생활: ${s(f.loveAndMarriage?.marriedLife)}

🏆 **직업·커리어**
• 잘 맞는 분야: ${s(f.career?.successfulFields)}
• 이직 적령기: ${s(f.career?.careerChangeAge)}
• 리더십 스타일: ${s(f.career?.leadershipStyle)}
• 창업 관련: ${s(f.career?.entrepreneurship)}

🏥 **건강운**
• 전반: ${s(f.health?.generalHealth)}
• 약한 부분: ${s(f.health?.weakPoint)}
• 건강검진: ${s(f.health?.checkupReminder)}
• 추천 운동: ${s(f.health?.recommendedExercise)}

🌈 **인생의 전환점**
• 1차: ${s(f.turningPoints?.ein)}
• 2차: ${s(f.turningPoints?.zwei)}
• 3차: ${s(f.turningPoints?.drei)}

💎 **개운 정보**
• 행운의 색: ${s(f.goodLuck?.luckyColors)}
• 행운의 숫자: ${s(f.goodLuck?.luckyNumbers)}
• 행운의 방향: ${s(f.goodLuck?.luckyDirection)}
• 좋은 날: ${s(f.goodLuck?.goodDays)}
• 피해야 할 것: ${s(f.goodLuck?.avoidances)}`;
}

export function LifeFortuneService({ onResult, onBack }: LifeFortuneServiceProps) {
  const [step, setStep] = useState<'info' | 'analyzing' | 'complete'>('info');
  const [progress, setProgress] = useState(0);
  const [currentStatus, setCurrentStatus] = useState('');
  const [apiError, setApiError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setApiError(null);

    const token = getAccessToken();
    if (!token) {
      alert('로그인이 필요합니다. 로그인 후 다시 시도해주세요.');
      onBack?.();
      return;
    }

    setStep('analyzing');

    const analysisSteps = [
      { delay: 700, progress: 20, text: '📊 생년월일 데이터 처리 중...' },
      { delay: 900, progress: 40, text: '⭐ 사주팔자 계산 중...' },
      { delay: 900, progress: 60, text: '🌀 오행 균형 분석 중...' },
      { delay: 800, progress: 80, text: '🔮 평생 운세 해석 중...' },
      { delay: 700, progress: 100, text: '✨ 개인 맞춤 조언 생성 완료!' }
    ];

    // API 호출 시작
    const apiPromise = (async () => {
      const res = await fetch(LIFELONG_URL, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      let body: APIResponse<LifelongFortuneResponse> | null = null;
      try { body = await res.json(); } catch { }

      if (!res.ok || !body || body.code !== 200 || !body.data) {
        const msg = body?.message || `평생 운세 호출 실패 (HTTP ${res.status})`;
        throw new Error(msg);
      }
      return body.data;
    })();

    // 진행률 표시
    for (const st of analysisSteps) {
      await new Promise(r => setTimeout(r, st.delay));
      setProgress(st.progress);
      setCurrentStatus(st.text);
    }

    try {
      const data = await apiPromise;
      const displayName = getDisplayName();
      const result: FortuneResult = {
        id: data.id || Date.now().toString(),
        type: 'lifefortune',
        title: '평생 운세 분석 결과',
        content: buildFortuneMarkdown(displayName, data),
        date: new Date().toLocaleDateString('ko-KR'),
        paid: false
      };

      setStep('complete');
      setTimeout(() => onResult(result), 300);
    } catch (e: any) {
      const msg = e?.message || '분석 중 오류가 발생했습니다.';
      setApiError(msg);
      alert(msg);
      setStep('info');
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* 소개 화면 (여기서 바로 분석 시작) */}
      {step === 'info' && (
        <div className="space-y-6">
          <Card className="hanji-texture border border-hanbok-gold/30 p-6 rounded-3xl ink-shadow">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-hanbok-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🌟</span>
              </div>
              <h2 className="text-xl text-ink-black dark:text-ink-gray ink-brush">
                평생 운세 분석
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                로그인한 계정의 프로필(생년월일·출생시각)로 서버에서 직접 계산합니다.
              </p>
            </div>
          </Card>

          <Card className="border border-border p-5 rounded-2xl">
            <h3 className="text-lg text-ink-black dark:text-ink-gray ink-brush mb-4">
              🔮 분석 내용
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: '💰', text: '재물운' },
                { icon: '💕', text: '연애·결혼운' },
                { icon: '🏆', text: '사업·직업운' },
                { icon: '🏥', text: '건강운' },
                { icon: '🎯', text: '성격·재능' },
                { icon: '🌈', text: '인생 전환점' }
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-xl hover:bg-hanbok-gold/5 transition-colors">
                  <div className="w-8 h-8 bg-hanbok-gold/20 rounded-full flex items-center justify-center">
                    <span className="text-sm">{item.icon}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{item.text}</span>
                </div>
              ))}
            </div>
          </Card>

          <Alert className="border-hanbok-gold/30 bg-hanbok-gold/5 rounded-2xl">
            <Star className="h-4 w-4 text-hanbok-gold-dark" />
            <AlertDescription className="text-sm text-ink-black dark:text-ink-gray">
              정확한 분석을 위해 프로필의 출생 시간이 중요해요. 프로필에서 정확한 시간을 확인해주세요.
            </AlertDescription>
          </Alert>

          <Button
            onClick={handleAnalyze}
            className="w-full h-14 bg-hanbok-gold hover:bg-hanbok-gold-dark text-ink-black rounded-3xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            평생 운세 보기
          </Button>
        </div>
      )}

      {/* 분석 중 */}
      {step === 'analyzing' && (
        <Card className="hanji-texture border border-hanbok-gold/30 p-8 rounded-3xl ink-shadow">
          <div className="text-center space-y-6">
            <div className="relative">
              <div className="w-24 h-24 bg-hanbok-gold/20 rounded-full flex items-center justify-center mx-auto animate-pulse">
                <span className="text-4xl animate-bounce">🌟</span>
              </div>
              <div className="absolute inset-0 rounded-full border-2 border-hanbok-gold/30 animate-ping"></div>
            </div>
            <div className="space-y-3">
              <h2 className="text-xl text-ink-black dark:text-ink-gray ink-brush">사주팔자를 분석하고 있습니다</h2>
              <p className="text-muted-foreground">{currentStatus}</p>
            </div>
            <div className="space-y-3">
              <Progress value={progress} className="w-full h-3 rounded-full" />
              <p className="text-hanbok-gold-dark font-medium">{progress}% 완료</p>
            </div>
            <div className="bg-hanbok-gold/10 rounded-2xl p-4">
              <p className="text-sm text-muted-foreground">✨ 수천 년의 사주학 지혜와 현대 AI 기술로 평생 운세를 분석하고 있습니다</p>
            </div>
            {apiError && <div className="text-xs text-red-600">{apiError}</div>}
          </div>
        </Card>
      )}
    </div>
  );
}
