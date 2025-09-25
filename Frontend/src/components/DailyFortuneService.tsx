import React, { useState } from 'react';
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Alert, AlertDescription } from "./ui/alert";
import { FortuneResult } from "../App";
import { Sparkles, Star, Clock } from 'lucide-react';

// ================= 서버/타입 =================
const API_BASE = 'http://localhost:8080';
const DAILY_URL = `${API_BASE}/api/fortune/daily`;

type APIResponse<T> = { code: number; message: string; data: T | null };

type DailyFortuneResponse = {
  id: string;
  fortuneDate: string; // 'YYYY-MM-DD'
  overallRating: number; // 1-5
  overallSummary: string;
  wealth: {
    wealthSummary: string;
    wealthTip1: string;
    wealthTip2: string;
    lottoNumbers: string;
  };
  love: { single: string; inRelationship: string; married: string; };
  career: { tip1: string; tip2: string; tip3: string; tip4: string; };
  health: { tip1: string; tip2: string; tip3: string; tip4: string; };
  keywords: { luckyColors: string; luckyNumbers: string; luckyTimes: string; luckyDirection: string; goodFoods: string; };
  precautions: { precaution1: string; precaution2: string; precaution3: string; precaution4: string; };
  advice: { adviceText: string; };
  tomorrowPreview: string;
};

function getAccessToken() {
  return localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
}
const s = (v?: string | null) => (v && String(v).trim().length ? v : '-');
function stars(n: number) { const c = Math.max(0, Math.min(5, Number(n) || 0)); return '★'.repeat(c) + '☆'.repeat(5 - c); }
function formatDateKo(d: string) {
  try { return new Date(`${d}T00:00:00`).toLocaleDateString('ko-KR'); } catch { return d; }
}

function buildDailyMarkdown(f: DailyFortuneResponse) {
  const dateKo = formatDateKo(f.fortuneDate);
  return `📅 **${dateKo} 오늘의 운세**

🌟 **전체운: ${stars(f.overallRating)}**
${s(f.overallSummary)}

💰 **재물운**
• 요약: ${s(f.wealth?.wealthSummary)}
• 팁1: ${s(f.wealth?.wealthTip1)}
• 팁2: ${s(f.wealth?.wealthTip2)}
• 오늘의 로또 번호: ${s(f.wealth?.lottoNumbers)}

💕 **연애운**
• 싱글: ${s(f.love?.single)}
• 연애 중: ${s(f.love?.inRelationship)}
• 기혼: ${s(f.love?.married)}

🏆 **직장·학업운**
• ${s(f.career?.tip1)}
• ${s(f.career?.tip2)}
• ${s(f.career?.tip3)}
• ${s(f.career?.tip4)}

🏥 **건강운**
• ${s(f.health?.tip1)}
• ${s(f.health?.tip2)}
• ${s(f.health?.tip3)}
• ${s(f.health?.tip4)}

🎯 **행운 키워드**
• 색상: ${s(f.keywords?.luckyColors)}
• 숫자: ${s(f.keywords?.luckyNumbers)}
• 시간: ${s(f.keywords?.luckyTimes)}
• 방향: ${s(f.keywords?.luckyDirection)}
• 음식: ${s(f.keywords?.goodFoods)}

⚠️ **주의사항**
• ${s(f.precautions?.precaution1)}
• ${s(f.precautions?.precaution2)}
• ${s(f.precautions?.precaution3)}
• ${s(f.precautions?.precaution4)}

💡 **오늘의 조언**
${s(f.advice?.adviceText)}

🌙 **내일 미리보기**
${s(f.tomorrowPreview)}
`;
}

interface DailyFortuneServiceProps {
  onResult: (result: FortuneResult) => void;
  onBack: () => void;
}

export function DailyFortuneService({ onResult, onBack }: DailyFortuneServiceProps) {
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
      { delay: 500, progress: 25, text: '📊 오늘의 운기 계산 중...' },
      { delay: 800, progress: 50, text: '🌟 길흉화복 분석 중...' },
      { delay: 900, progress: 75, text: '💫 맞춤 조언 생성 중...' },
      { delay: 700, progress: 100, text: '✨ 오늘의 운세 완성!' }
    ];

    // API 호출 시작
    const apiPromise = (async () => {
      const res = await fetch(DAILY_URL, {
        method: 'GET',
        headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` },
      });
      let body: APIResponse<DailyFortuneResponse> | null = null;
      try { body = await res.json(); } catch {}
      if (!res.ok || !body || body.code !== 200 || !body.data) {
        const msg = body?.message || `오늘의 운세 호출 실패 (HTTP ${res.status})`;
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
      const content = buildDailyMarkdown(data);
      const result: FortuneResult = {
        id: data.id || Date.now().toString(),
        type: 'dailyfortune',
        title: `${formatDateKo(data.fortuneDate)} 오늘의 운세`,
        content,
        date: formatDateKo(data.fortuneDate),
        paid: false,
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
                <span className="text-3xl">📅</span>
              </div>
              <h2 className="text-xl text-ink-black dark:text-ink-gray ink-brush">오늘의 운세</h2>
              <p className="text-muted-foreground leading-relaxed">
                {new Date().toLocaleDateString('ko-KR')} 하루의 운세를 상세히 분석해드립니다.
              </p>
            </div>
          </Card>

          <Card className="border border-border p-5 rounded-2xl">
            <h3 className="text-lg text-ink-black dark:text-ink-gray ink-brush mb-4">📊 분석 내용</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: '💰', text: '재물운' },
                { icon: '💕', text: '연애운' },
                { icon: '🏆', text: '직장·학업운' },
                { icon: '🏥', text: '건강운' },
                { icon: '🎯', text: '행운 키워드' },
                { icon: '🌙', text: '내일 미리보기' }
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
            <Clock className="h-4 w-4 text-hanbok-gold-dark" />
            <AlertDescription className="text-sm text-ink-black dark:text-ink-gray">
              이 서비스는 <b>로그인한 계정의 프로필(생년월일/출생시각)</b>로 서버에서 직접 계산합니다.
              별도 입력 단계 없이 바로 분석을 시작합니다.
            </AlertDescription>
          </Alert>

          <Button
            onClick={handleAnalyze}
            className="w-full h-14 bg-hanbok-gold hover:bg-hanbok-gold-dark text-ink-black rounded-3xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            오늘의 운세 확인하기
          </Button>
        </div>
      )}

      {/* 분석 중 */}
      {step === 'analyzing' && (
        <Card className="hanji-texture border border-hanbok-gold/30 p-8 rounded-3xl ink-shadow">
          <div className="text-center space-y-6">
            <div className="relative">
              <div className="w-24 h-24 bg-hanbok-gold/20 rounded-full flex items-center justify-center mx-auto animate-pulse">
                <span className="text-4xl animate-bounce">📅</span>
              </div>
              <div className="absolute inset-0 rounded-full border-2 border-hanbok-gold/30 animate-ping"></div>
            </div>
            <div className="space-y-3">
              <h2 className="text-xl text-ink-black dark:text-ink-gray ink-brush">오늘의 운세를 분석하고 있습니다</h2>
              <p className="text-muted-foreground">{currentStatus}</p>
            </div>
            <div className="space-y-3">
              <Progress value={progress} className="w-full h-3 rounded-full" />
              <p className="text-hanbok-gold-dark font-medium">{progress}% 완료</p>
            </div>
            <div className="bg-hanbok-gold/10 rounded-2xl p-4">
              <p className="text-sm text-muted-foreground">✨ 오늘의 기운과 별자리를 종합하여 정확한 운세를 분석하고 있습니다</p>
            </div>
            {apiError && <div className="text-xs text-red-600">{apiError}</div>}
          </div>
        </Card>
      )}
    </div>
  );
}
