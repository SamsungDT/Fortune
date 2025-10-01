import React, { useState } from 'react';
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Progress } from "./ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { FortuneResult } from "../App";
import { Brain, Moon, Sparkles, AlertCircle, Heart, Calendar } from 'lucide-react';

interface DreamInterpretationServiceProps {
  onResult: (result: FortuneResult) => void;
  onBack: () => void;
}

const API_BASE = 'https://fortuneki.site';

export function DreamInterpretationService({ onResult, onBack }: DreamInterpretationServiceProps) {
  const [step, setStep] = useState<'info' | 'input' | 'analyzing' | 'complete'>('info');
  const [dreamContent, setDreamContent] = useState('');
  const [dreamMood, setDreamMood] = useState('');
  const [dreamType, setDreamType] = useState('');
  const [progress, setProgress] = useState(0);
  const [currentStatus, setCurrentStatus] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!dreamContent.trim()) {
      setError('꿈의 내용을 입력해주세요.');
      return;
    }

    setStep('analyzing');
    setError(null);

    const keywordMapping: { [key: string]: string } = {
      '동물': 'ANIMAL',
      '비행': 'FLYING',
      '물': 'WATER',
      '불': 'FIRE',
      '돈': 'MONEY',
      '사람': 'PERSON',
      '집': 'HOUSE',
      '자동차': 'CAR',
      '음식': 'FOOD',
      '꽃': 'FLOWER',
      '산': 'MOUNTAIN',
      '바다': 'SEA',
      '학교': 'SCHOOL',
      '직장': 'WORK',
      '가족': 'FAMILY',
      '친구': 'FRIENDS',
    };

    const keywords = selectedTags.map(tag =>
      keywordMapping[tag] || 'ETC',
    );

    const requestBody = {
      dreamDescription: dreamContent,
      dreamAtmosphere: dreamMood || 'unknown', // 분위기 미선택 시 'unknown'으로 처리
      keywords: keywords,
    };

    // ✨ 중요: localStorage에서 JWT 토큰을 가져옵니다.
    // ✨ 실제 로그인 로직에서 이 토큰을 localStorage에 저장해야 합니다.
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
      setError('인증 실패: 로그인이 필요합니다.');
      setStep('input');
      return;
    }

    try {
      setCurrentStatus('🔍 서버와 통신 중...');
      setProgress(20);

      const response = await fetch(`${API_BASE}/api/fortune/dream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(requestBody),
      });

      setProgress(50);
      setCurrentStatus('🧠 응답 데이터 처리 중...');

      if (response.status === 401) {
        throw new Error('인증 실패: 로그인이 필요하거나 토큰이 만료되었습니다.');
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API 오류: ${errorData.message || response.statusText}`);
      }

      const apiResponse = await response.json();
      const apiData = apiResponse.data;

      if (!apiData) {
        throw new Error('서버 응답 데이터가 비어있습니다.');
      }

      setProgress(80);
      setCurrentStatus('✨ 해몽 결과 생성 중...');

      // API 응답을 FortuneResult 형식에 맞게 변환
      const result: FortuneResult = {
        id: Date.now().toString(),
        type: 'dream',
        title: '꿈 해몽 결과',
        content: `🌙 **꿈 해몽 분석**
        
📝 **꿈의 요약**
${apiData.summary}

🔍 **주요 상징 해석**
${apiData.symbolInterpretation.symbolText}

🎯 **심리상태 분석**
• ${apiData.psychologicalAnalysis.tip1}
• ${apiData.psychologicalAnalysis.tip2}
• ${apiData.psychologicalAnalysis.tip3}
• ${apiData.psychologicalAnalysis.tip4}

🔮 **운세 전망**
**단기 전망 (1개월)**
• ${apiData.fortuneProspects.shortTermOutlook}

**중기 전망 (3개월)**
• ${apiData.fortuneProspects.mediumTermOutlook}

**장기 전망 (1년)**
• ${apiData.fortuneProspects.longTermOutlook}

⚠️ **주의사항**
• ${apiData.precautions.precaution1}
• ${apiData.precautions.precaution2}
• ${apiData.precautions.precaution3}

💡 **조언 및 개운법**
• ${apiData.adviceAndLuck.advice1}
• ${apiData.adviceAndLuck.advice2}
• ${apiData.adviceAndLuck.advice3}
• ${apiData.adviceAndLuck.advice4}
• ${apiData.adviceAndLuck.advice5}

🌟 **특별 메시지**
${apiData.specialMessage.messageText}`,
        date: new Date().toLocaleDateString('ko-KR'),
        paid: false,
      };

      setProgress(100);
      setTimeout(() => onResult(result), 500);

    } catch (error) {
      setProgress(0);
      setCurrentStatus('⚠️ 오류가 발생했습니다.');
      setError(`서버와 통신 중 오류가 발생했습니다: ${error.message}`);
      setStep('input');
    }
  };

  const dreamTags = [
    { emoji: '🐾', text: '동물' },
    { emoji: '🕊️', text: '비행' },
    { emoji: '💧', text: '물' },
    { emoji: '🔥', text: '불' },
    { emoji: '💰', text: '돈' },
    { emoji: '👥', text: '사람' },
    { emoji: '🏠', text: '집' },
    { emoji: '🚗', text: '자동차' },
    { emoji: '🍽️', text: '음식' },
    { emoji: '🌸', text: '꽃' },
    { emoji: '⛰️', text: '산' },
    { emoji: '🌊', text: '바다' },
    { emoji: '🏫', text: '학교' },
    { emoji: '🏢', text: '직장' },
    { emoji: '👨‍👩‍👧‍👦', text: '가족' },
    { emoji: '👯', text: '친구' }
  ];

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* 서비스 소개 */}
      {step === 'info' && (
        <div className="space-y-6">
          <Card className="hanji-texture border border-hanbok-gold/30 p-6 rounded-3xl ink-shadow">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-hanbok-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💭</span>
              </div>

              <h2 className="text-xl text-ink-black dark:text-ink-gray ink-brush">
                AI 꿈 해몽
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                고대로부터 전해내려오는 해몽학과 현대 심리학을 결합하여 꿈의 의미를 해석해드립니다.
              </p>
            </div>
          </Card>

          <Card className="border border-border p-5 rounded-2xl">
            <h3 className="text-lg text-ink-black dark:text-ink-gray ink-brush mb-4">
              🔮 해몽 내용
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: '🔍', text: '상징 분석' },
                { icon: '🧠', text: '심리상태' },
                { icon: '🔮', text: '운세 전망' },
                { icon: '💡', text: '개운법' },
                { icon: '⚠️', text: '주의사항' },
                { icon: '🌟', text: '특별 메시지' }
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
            <Brain className="h-4 w-4 text-hanbok-gold-dark" />
            <AlertDescription className="text-sm text-ink-black dark:text-ink-gray">
              꿈의 내용을 자세히 적어주시면 더 정확한 해몽이 가능합니다. 감정과 분위기도 중요한 해석 요소입니다.
            </AlertDescription>
          </Alert>


          <Button
            onClick={() => setStep('input')}
            className="w-full h-14 bg-hanbok-gold hover:bg-hanbok-gold-dark text-ink-black rounded-3xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            꿈 해몽 받기
          </Button>
        </div>
      )}

      {step === 'input' && (
        <div className="space-y-6">
          <Card className="hanji-texture border border-hanbok-gold/30 p-6 rounded-3xl ink-shadow">
            <div className="space-y-6">
              {/* 꿈의 내용 */}
              <div className="space-y-3">
                <Label className="text-ink-black dark:text-ink-gray flex items-center">
                  <Moon className="w-4 h-4 mr-2" />
                  꿈의 내용
                </Label>
                <Textarea
                  placeholder="꿈에서 본 내용을 자세히 적어주세요. 누가 나왔는지, 어떤 일이 일어났는지, 어떤 감정을 느꼈는지 등을 포함해주세요."
                  value={dreamContent}
                  onChange={(e) => setDreamContent(e.target.value)}
                  className="min-h-32 rounded-2xl border-border focus:border-hanbok-gold/50 focus:ring-hanbok-gold/20 resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  자세히 적을수록 더 정확한 해몽을 받을 수 있어요
                </p>
              </div>

              {/* 꿈의 분위기 */}
              <div className="space-y-3">
                <Label className="text-ink-black dark:text-ink-gray flex items-center">
                  <Heart className="w-4 h-4 mr-2" />
                  꿈의 전체적인 분위기
                </Label>
                <Select value={dreamMood} onValueChange={setDreamMood}>
                  <SelectTrigger className="h-12 rounded-2xl border-border focus:border-hanbok-gold/50 focus:ring-hanbok-gold/20">
                    <SelectValue placeholder="꿈의 분위기를 선택해주세요" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    <SelectItem value="happy">😊 기분 좋고 즐거웠음</SelectItem>
                    <SelectItem value="scary">😨 무섭고 불안했음</SelectItem>
                    <SelectItem value="sad">😢 슬프고 우울했음</SelectItem>
                    <SelectItem value="exciting">😃 흥미롭고 신기했음</SelectItem>
                    <SelectItem value="confusing">🤔 혼란스럽고 이상했음</SelectItem>
                    <SelectItem value="peaceful">😌 평화롭고 고요했음</SelectItem>
                    <SelectItem value="urgent">😰 급하고 바빴음</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 주요 요소들 */}
              <div className="space-y-3">
                <Label className="text-ink-black dark:text-ink-gray">
                  꿈에 나온 주요 요소들 (선택사항)
                </Label>
                <div className="grid grid-cols-4 gap-2">
                  {dreamTags.map((tag) => (
                    <Badge
                      key={tag.text}
                      variant={selectedTags.includes(tag.text) ? "default" : "outline"}
                      className={`cursor-pointer p-3 rounded-2xl text-center justify-center hover:scale-105 transition-all duration-200 ${selectedTags.includes(tag.text)
                          ? 'bg-hanbok-gold text-ink-black border-hanbok-gold shadow-lg'
                          : 'border-border hover:border-hanbok-gold/50 hover:bg-hanbok-gold/5'
                        }`}
                      onClick={() => toggleTag(tag.text)}
                    >
                      <div className="flex flex-col items-center space-y-1">
                        <span className="text-lg">{tag.emoji}</span>
                        <span className="text-xs">{tag.text}</span>
                      </div>
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  꿈에 나온 요소들을 선택하면 더 정확한 해몽이 가능해요
                </p>
              </div>

              {/* 꿈을 꾼 시기 */}
              <div className="space-y-3">
                <Label className="text-ink-black dark:text-ink-gray flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  꿈을 꾼 시기
                </Label>
                <Select value={dreamType} onValueChange={setDreamType}>
                  <SelectTrigger className="h-12 rounded-2xl border-border focus:border-hanbok-gold/50 focus:ring-hanbok-gold/20">
                    <SelectValue placeholder="언제 꾼 꿈인가요?" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    <SelectItem value="today">🌙 오늘 밤</SelectItem>
                    <SelectItem value="yesterday">🌛 어젯밤</SelectItem>
                    <SelectItem value="thisweek">📅 이번 주</SelectItem>
                    <SelectItem value="recurring">🔄 자주 반복되는 꿈</SelectItem>
                    <SelectItem value="lucid">💭 자각몽 (꿈인 줄 알았음)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {error && (
            <Alert variant="destructive" className="rounded-2xl">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>오류 발생</AlertTitle>
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          )}

          <Card className="border border-shadow-purple/30 bg-shadow-purple/5 p-5 rounded-2xl">
            <h3 className="text-ink-black dark:text-ink-gray mb-3 flex items-center">
              <Brain className="w-4 h-4 mr-2 text-shadow-purple" />
              해몽 팁
            </h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 꿈에서 느낀 감정이 가장 중요합니다</li>
              <li>• 꿈의 색깔이나 소리도 의미가 있어요</li>
              <li>• 반복되는 꿈은 특별한 메시지가 있을 수 있습니다</li>
            </ul>
          </Card>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setStep('info')}
              className="flex-1 h-12 border-border rounded-2xl hover:bg-muted"
            >
              이전
            </Button>
            <Button
              onClick={handleAnalyze}
              disabled={!dreamContent.trim()}
              className="flex-2 h-12 bg-hanbok-gold hover:bg-hanbok-gold-dark text-ink-black rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              해몽 받기
            </Button>
          </div>
        </div>
      )}

      {step === 'analyzing' && (
        <Card className="hanji-texture border border-hanbok-gold/30 p-8 rounded-3xl ink-shadow">
          <div className="text-center space-y-6">
            <div className="relative">
              <div className="w-24 h-24 bg-hanbok-gold/20 rounded-full flex items-center justify-center mx-auto animate-pulse">
                <span className="text-4xl animate-pulse">💭</span>
              </div>
              <div className="absolute inset-0 rounded-full border-2 border-hanbok-gold/30 animate-ping"></div>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl text-ink-black dark:text-ink-gray ink-brush">
                꿈을 해석하고 있습니다
              </h2>
              <p className="text-muted-foreground">{currentStatus}</p>
            </div>

            <div className="space-y-3">
              <Progress
                value={progress}
                className="w-full h-3 rounded-full"
              />
              <p className="text-hanbok-gold-dark font-medium">{progress}% 완료</p>
            </div>

            <div className="bg-hanbok-gold/10 rounded-2xl p-4">
              <p className="text-sm text-muted-foreground">
                ✨ 꿈의 상징과 심리학적 의미를 종합하여 정확한 해몽을 진행하고 있습니다
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
