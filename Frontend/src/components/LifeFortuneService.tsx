import React, { useState } from 'react';
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Progress } from "./ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Alert, AlertDescription } from "./ui/alert";
import { FortuneResult } from "../App";
import { User, Calendar, Clock, Sparkles, AlertCircle, Star } from 'lucide-react';
import { AdBanner } from './AdBanner';

interface LifeFortuneServiceProps {
  onResult: (result: FortuneResult) => void;
  onBack: () => void;
}

export function LifeFortuneService({ onResult, onBack }: LifeFortuneServiceProps) {
  const [step, setStep] = useState<'info' | 'input' | 'analyzing' | 'complete'>('info');
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [gender, setGender] = useState('');
  const [name, setName] = useState('');
  const [progress, setProgress] = useState(0);
  const [currentStatus, setCurrentStatus] = useState('');

  const handleAnalyze = async () => {
    if (!birthDate || !birthTime || !gender || !name) {
      alert('모든 정보를 입력해주세요.');
      return;
    }

    setStep('analyzing');
    
    // 진행률 시뮬레이션
    const analysisSteps = [
      { delay: 800, progress: 20, text: '📊 생년월일 데이터 처리 중...' },
      { delay: 1400, progress: 40, text: '⭐ 사주팔자 계산 중...' },
      { delay: 2000, progress: 60, text: '🌀 오행 균형 분석 중...' },
      { delay: 2600, progress: 80, text: '🔮 평생 운세 해석 중...' },
      { delay: 3200, progress: 100, text: '✨ 개인 맞춤 조언 생성 완료!' }
    ];

    for (const step of analysisSteps) {
      await new Promise(resolve => setTimeout(resolve, step.delay));
      setProgress(step.progress);
      setCurrentStatus(step.text);
    }

    // AI 분석 결과 생성 (목업)
    const result: FortuneResult = {
      id: Date.now().toString(),
      type: 'lifefortune',
      title: '평생 운세 분석 결과',
      content: `🌟 **${name}님의 평생 운세**

🎂 **타고난 성격과 재능**
• 차분하고 신중한 성격으로 주변 사람들의 신뢰를 받습니다
• 예술적 감각이 뛰어나며 창의적인 분야에 재능이 있습니다
• 책임감이 강하고 한번 시작한 일은 끝까지 해내는 의지력을 가지고 있습니다
• 타인의 감정을 잘 이해하는 공감 능력이 뛰어납니다

💰 **재물운**
• 20대: 기반을 다지는 시기, 꾸준한 저축이 중요
• 30대: 본격적인 재물 증식기, 투자 기회가 많이 옵니다
• 40대: 재물운이 절정에 달하며 부동산 투자에 좋은 시기
• 50대 이후: 안정적인 재물 관리로 여유로운 노후 준비

💕 **연애운 & 결혼운**
• 첫사랑은 25세 전후에 만나게 됩니다
• 결혼 적령기는 28-32세 사이가 가장 좋습니다
• 배우자는 같은 분야 종사자이거나 소개로 만날 가능성이 높습니다
• 결혼 후에는 서로를 이해하고 지지하는 행복한 가정을 꾸리게 됩니다

🏆 **사업운 & 직업운**
• 교육, 상담, 서비스업 분야에서 큰 성공을 거둘 것입니다
• 35세 전후로 중요한 커리어 변화의 기회가 옵니다
• 리더십보다는 전문성을 바탕으로 한 성공이 어울립니다
• 45세 이후에는 독립 창업의 기회도 좋습니다

🏥 **건강운**
• 전반적으로 건강한 체질이지만 스트레스 관리에 신경써야 합니다
• 소화기관이 약간 약하니 규칙적인 식사를 하세요
• 40대 중반부터는 정기 건강검진을 꼭 받으시기 바랍니다
• 등산이나 요가 같은 운동이 체질에 잘 맞습니다

🌈 **인생의 전환점**
• 1차 전환점 (27-29세): 새로운 환경과 사람들을 만나게 됩니다
• 2차 전환점 (36-38세): 인생의 방향을 크게 바꾸는 결정을 하게 됩니다
• 3차 전환점 (45-47세): 안정적인 기반 위에서 새로운 도전을 시작합니다

💎 **개운법**
• 행운의 색깔: 파란색, 흰색
• 행운의 숫자: 3, 7, 21
• 행운의 방향: 동남쪽
• 좋은 날: 매주 수요일, 토요일
• 피해야 할 것: 붉은색 옷, 8월 중순 중요한 결정`,
      date: new Date().toLocaleDateString('ko-KR'),
      paid: false
    };

    setStep('complete');
    setTimeout(() => onResult(result), 500);
  };

  return (
    <div className="p-6 space-y-6">
      {/* 서비스 소개 */}
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
                태어난 순간의 사주팔자를 바탕으로 평생의 운세를 상세히 분석해드립니다.
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
              정확한 분석을 위해 태어난 시간이 중요합니다. 모르시는 경우 '정확한 시간을 모름'을 선택해주세요.
            </AlertDescription>
          </Alert>

          <AdBanner type="card" className="mt-4" />

          <Button 
            onClick={() => setStep('input')} 
            className="w-full h-14 bg-hanbok-gold hover:bg-hanbok-gold-dark text-ink-black rounded-3xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            평생 운세 보기
          </Button>
        </div>
      )}

      {step === 'input' && (
        <div className="space-y-6">
          <Card className="hanji-texture border border-hanbok-gold/30 p-6 rounded-3xl ink-shadow">
            <div className="space-y-6">
              {/* 이름 */}
              <div className="space-y-3">
                <Label className="text-ink-black dark:text-ink-gray flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  이름
                </Label>
                <Input 
                  placeholder="성함을 입력해주세요"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12 rounded-2xl border-border focus:border-hanbok-gold/50 focus:ring-hanbok-gold/20"
                />
              </div>

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

              {/* 태어난 시간 */}
              <div className="space-y-3">
                <Label className="text-ink-black dark:text-ink-gray flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  태어난 시간
                </Label>
                <Select value={birthTime} onValueChange={setBirthTime}>
                  <SelectTrigger className="h-12 rounded-2xl border-border focus:border-hanbok-gold/50 focus:ring-hanbok-gold/20">
                    <SelectValue placeholder="태어난 시간을 선택해주세요" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    <SelectItem value="23-01">자시 (23시-01시) 🐭</SelectItem>
                    <SelectItem value="01-03">축시 (01시-03시) 🐂</SelectItem>
                    <SelectItem value="03-05">인시 (03시-05시) 🐅</SelectItem>
                    <SelectItem value="05-07">묘시 (05시-07시) 🐰</SelectItem>
                    <SelectItem value="07-09">진시 (07시-09시) 🐉</SelectItem>
                    <SelectItem value="09-11">사시 (09시-11시) 🐍</SelectItem>
                    <SelectItem value="11-13">오시 (11시-13시) 🐴</SelectItem>
                    <SelectItem value="13-15">미시 (13시-15시) 🐑</SelectItem>
                    <SelectItem value="15-17">신시 (15시-17시) 🐵</SelectItem>
                    <SelectItem value="17-19">유시 (17시-19시) 🐓</SelectItem>
                    <SelectItem value="19-21">술시 (19시-21시) 🐕</SelectItem>
                    <SelectItem value="21-23">해시 (21시-23시) 🐷</SelectItem>
                    <SelectItem value="unknown">⏰ 정확한 시간을 모름</SelectItem>
                  </SelectContent>
                </Select>
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
                    className={`h-12 rounded-2xl font-medium transition-all duration-300 ${
                      gender === 'male' 
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
                    className={`h-12 rounded-2xl font-medium transition-all duration-300 ${
                      gender === 'female' 
                        ? 'bg-hanbok-gold hover:bg-hanbok-gold-dark text-ink-black border-hanbok-gold' 
                        : 'border-border hover:border-hanbok-gold/50 hover:bg-hanbok-gold/5'
                    }`}
                  >
                    🙋‍♀️ 여성
                  </Button>
                </div>
              </div>
            </div>
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
              disabled={!birthDate || !birthTime || !gender || !name}
              className="flex-2 h-12 bg-hanbok-gold hover:bg-hanbok-gold-dark text-ink-black rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              분석 시작
            </Button>
          </div>
        </div>
      )}

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
              <h2 className="text-xl text-ink-black dark:text-ink-gray ink-brush">
                {name}님의 사주팔자를 분석하고 있습니다
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
                ✨ 수천 년의 사주학 지혜와 현대 AI 기술로 정확한 평생 운세를 분석하고 있습니다
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}