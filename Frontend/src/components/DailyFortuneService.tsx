import React, { useState } from 'react';
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Progress } from "./ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Alert, AlertDescription } from "./ui/alert";
import { FortuneResult } from "../App";
import { Calendar, Heart, Sparkles, AlertCircle, Star, Clock } from 'lucide-react';
import { AdBanner } from './AdBanner';

interface DailyFortuneServiceProps {
  onResult: (result: FortuneResult) => void;
  onBack: () => void;
}

export function DailyFortuneService({ onResult, onBack }: DailyFortuneServiceProps) {
  const [step, setStep] = useState<'info' | 'input' | 'analyzing' | 'complete'>('info');
  const [birthDate, setBirthDate] = useState('');
  const [zodiacSign, setZodiacSign] = useState('');
  const [currentConcern, setCurrentConcern] = useState('');
  const [progress, setProgress] = useState(0);
  const [currentStatus, setCurrentStatus] = useState('');

  const handleAnalyze = async () => {
    if (!birthDate || !zodiacSign) {
      alert('생년월일과 띠를 선택해주세요.');
      return;
    }

    setStep('analyzing');
    
    // 진행률 시뮬레이션
    const analysisSteps = [
      { delay: 600, progress: 25, text: '📊 오늘의 운기 계산 중...' },
      { delay: 1200, progress: 50, text: '🌟 길흉화복 분석 중...' },
      { delay: 1800, progress: 75, text: '💫 맞춤 조언 생성 중...' },
      { delay: 2400, progress: 100, text: '✨ 오늘의 운세 완성!' }
    ];

    for (const step of analysisSteps) {
      await new Promise(resolve => setTimeout(resolve, step.delay));
      setProgress(step.progress);
      setCurrentStatus(step.text);
    }

    const today = new Date().toLocaleDateString('ko-KR');

    // AI 분석 결과 생성 (목업)
    const result: FortuneResult = {
      id: Date.now().toString(),
      type: 'dailyfortune',
      title: `${today} 오늘의 운세`,
      content: `📅 **${today} 운세**

🌟 **오늘의 전체운: ★★★★☆**
오늘은 전반적으로 좋은 기운이 흐르는 날입니다. 특히 오전 시간대에는 중요한 결정을 내리기에 좋은 때입니다. 다만 오후 3시 이후로는 신중함이 필요합니다.

💰 **재물운: ★★★☆☆**
• 예상치 못한 수입이 있을 수 있습니다
• 투자보다는 저축에 집중하는 것이 좋겠습니다
• 지출 계획을 세우고 불필요한 소비는 자제하세요
• 오늘 복권을 사신다면 3, 17, 22, 35번이 좋습니다

💕 **연애운: ★★★★★**
• 싱글: 새로운 만남의 기회가 생길 수 있습니다. 카페나 서점에서 특별한 인연을 만날 가능성이 높습니다
• 연인 있음: 깊은 대화를 나누기 좋은 날입니다. 진솔한 마음을 표현해보세요
• 기혼: 배우자와의 시간을 소중히 하세요. 작은 선물이나 따뜻한 말 한마디가 큰 행복을 가져다줄 것입니다

🏆 **직장/학업운: ★★★☆☆**
• 새로운 프로젝트나 업무에 적극적으로 임하세요
• 동료나 상사와의 관계에서 좋은 평가를 받을 수 있습니다
• 학습 능력이 향상되는 시기이니 새로운 것을 배워보세요
• 회의나 프레젠테이션이 있다면 자신감을 가지고 임하세요

🏥 **건강운: ★★★★☆**
• 전반적으로 건강한 상태입니다
• 목과 어깨 부분에 신경 쓰세요
• 충분한 수분 섭취를 하시기 바랍니다
• 저녁 운동이 특히 도움이 될 것입니다

🎯 **오늘의 키워드**
• 행운의 색깔: 파란색, 하얀색
• 행운의 숫자: 7, 14, 21
• 행운의 시간: 오전 10시-12시, 오후 7시-9시
• 행운의 방향: 동북쪽
• 좋은 음식: 해산물, 찬 음료

⚠️ **주의사항**
• 오후 3시-5시 사이에는 중요한 결정을 피하세요
• 붉은색 계열의 옷은 오늘 피하는 것이 좋겠습니다
• 감정적인 대화나 논쟁은 자제하세요
• 교통수단 이용 시 여유시간을 두고 출발하세요

💡 **오늘의 조언**
${currentConcern ? `특히 "${currentConcern}"에 대해서는 ` : ''}오늘은 차분하게 상황을 판단하고 행동하는 것이 중요합니다. 주변 사람들의 조언에 귀 기울이고, 감사하는 마음을 잊지 마세요. 작은 행복들을 발견하려고 노력하면 더욱 좋은 하루가 될 것입니다.

🌙 **내일 미리보기**
내일은 창의적인 아이디어가 떠오르기 좋은 날입니다. 새로운 계획을 세우거나 혁신적인 접근을 시도해보세요!`,
      date: today,
      paid: false
    };

    setStep('complete');
    setTimeout(() => onResult(result), 500);
  };

  const zodiacOptions = [
    { value: 'rat', label: '쥐띠 🐭', years: '1960, 1972, 1984, 1996, 2008, 2020' },
    { value: 'ox', label: '소띠 🐂', years: '1961, 1973, 1985, 1997, 2009, 2021' },
    { value: 'tiger', label: '호랑이띠 🐅', years: '1962, 1974, 1986, 1998, 2010, 2022' },
    { value: 'rabbit', label: '토끼띠 🐰', years: '1963, 1975, 1987, 1999, 2011, 2023' },
    { value: 'dragon', label: '용띠 🐉', years: '1964, 1976, 1988, 2000, 2012, 2024' },
    { value: 'snake', label: '뱀띠 🐍', years: '1965, 1977, 1989, 2001, 2013, 2025' },
    { value: 'horse', label: '말띠 🐴', years: '1966, 1978, 1990, 2002, 2014, 2026' },
    { value: 'goat', label: '양띠 🐑', years: '1967, 1979, 1991, 2003, 2015, 2027' },
    { value: 'monkey', label: '원숭이띠 🐵', years: '1968, 1980, 1992, 2004, 2016, 2028' },
    { value: 'rooster', label: '닭띠 🐓', years: '1969, 1981, 1993, 2005, 2017, 2029' },
    { value: 'dog', label: '개띠 🐕', years: '1970, 1982, 1994, 2006, 2018, 2030' },
    { value: 'pig', label: '돼지띠 🐷', years: '1971, 1983, 1995, 2007, 2019, 2031' }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* 서비스 소개 */}
      {step === 'info' && (
        <div className="space-y-6">
          <Card className="hanji-texture border border-hanbok-gold/30 p-6 rounded-3xl ink-shadow">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-hanbok-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📅</span>
              </div>
              
              <h2 className="text-xl text-ink-black dark:text-ink-gray ink-brush">
                오늘의 운세
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {new Date().toLocaleDateString('ko-KR')} 하루의 운세를 상세히 분석해드립니다.
              </p>
            </div>
          </Card>

          <Card className="border border-border p-5 rounded-2xl">
            <h3 className="text-lg text-ink-black dark:text-ink-gray ink-brush mb-4">
              📊 분석 내용
            </h3>
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
              오늘의 운세는 매일 자정에 새롭게 업데이트됩니다. 가장 정확한 운세를 위해 생년월일과 띠를 정확히 입력해주세요.
            </AlertDescription>
          </Alert>

          <AdBanner type="card" className="mt-4" />

          <Button 
            onClick={() => setStep('input')} 
            className="w-full h-14 bg-hanbok-gold hover:bg-hanbok-gold-dark text-ink-black rounded-3xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            오늘의 운세 확인하기
          </Button>
        </div>
      )}

      {step === 'input' && (
        <div className="space-y-6">
          <Card className="hanji-texture border border-hanbok-gold/30 p-6 rounded-3xl ink-shadow">
            <div className="space-y-6">
              {/* 생년월일 */}
              <div className="space-y-3">
                <Label className="text-ink-black dark:text-ink-gray flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  생년월일
                </Label>
                <Input 
                  type="date" 
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="h-12 rounded-2xl border-border focus:border-hanbok-gold/50 focus:ring-hanbok-gold/20"
                />
              </div>

              {/* 띠 */}
              <div className="space-y-3">
                <Label className="text-ink-black dark:text-ink-gray flex items-center">
                  <Star className="w-4 h-4 mr-2" />
                  띠
                </Label>
                <Select value={zodiacSign} onValueChange={setZodiacSign}>
                  <SelectTrigger className="h-12 rounded-2xl border-border focus:border-hanbok-gold/50 focus:ring-hanbok-gold/20">
                    <SelectValue placeholder="본인의 띠를 선택해주세요" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    {zodiacOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex flex-col">
                          <span>{option.label}</span>
                          <span className="text-xs text-muted-foreground">{option.years}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 현재 고민 */}
              <div className="space-y-3">
                <Label className="text-ink-black dark:text-ink-gray flex items-center">
                  <Heart className="w-4 h-4 mr-2" />
                  현재 가장 신경 쓰이는 일 (선택사항)
                </Label>
                <Input 
                  placeholder="예: 취업, 연애, 건강, 시험 등"
                  value={currentConcern}
                  onChange={(e) => setCurrentConcern(e.target.value)}
                  className="h-12 rounded-2xl border-border focus:border-hanbok-gold/50 focus:ring-hanbok-gold/20"
                />
                <p className="text-xs text-muted-foreground">
                  입력하시면 더 구체적인 조언을 받을 수 있어요
                </p>
              </div>
            </div>
          </Card>

          <Card className="border border-dancheong-blue/30 bg-dancheong-blue/5 p-5 rounded-2xl">
            <h3 className="text-ink-black dark:text-ink-gray mb-3 flex items-center">
              <Star className="w-4 h-4 mr-2 text-dancheong-blue" />
              오늘의 특별 혜택
            </h3>
            <p className="text-sm text-muted-foreground">
              오늘 운세를 확인하면 내일 운세 미리보기도 함께 제공해드립니다!
            </p>
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
              disabled={!birthDate || !zodiacSign}
              className="flex-2 h-12 bg-hanbok-gold hover:bg-hanbok-gold-dark text-ink-black rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              운세 확인
            </Button>
          </div>
        </div>
      )}

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
              <h2 className="text-xl text-ink-black dark:text-ink-gray ink-brush">
                오늘의 운세를 분석하고 있습니다
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
                ✨ 오늘의 기운과 별자리를 종합하여 정확한 운세를 분석하고 있습니다
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}