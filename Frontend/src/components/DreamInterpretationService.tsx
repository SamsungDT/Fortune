import React, { useState } from 'react';
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Progress } from "./ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { FortuneResult } from "../App";
import { Brain, Moon, Sparkles, AlertCircle, Heart, Calendar } from 'lucide-react';
import { AdBanner } from './AdBanner';

interface DreamInterpretationServiceProps {
  onResult: (result: FortuneResult) => void;
  onBack: () => void;
}

export function DreamInterpretationService({ onResult, onBack }: DreamInterpretationServiceProps) {
  const [step, setStep] = useState<'info' | 'input' | 'analyzing' | 'complete'>('info');
  const [dreamContent, setDreamContent] = useState('');
  const [dreamMood, setDreamMood] = useState('');
  const [dreamType, setDreamType] = useState('');
  const [progress, setProgress] = useState(0);
  const [currentStatus, setCurrentStatus] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleAnalyze = async () => {
    if (!dreamContent.trim()) {
      alert('꿈의 내용을 입력해주세요.');
      return;
    }

    setStep('analyzing');
    
    // 진행률 시뮬레이션
    const analysisSteps = [
      { delay: 700, progress: 25, text: '🔍 꿈의 상징 분석 중...' },
      { delay: 1400, progress: 50, text: '🧠 심리상태 해석 중...' },
      { delay: 2100, progress: 75, text: '🔮 미래 전망 계산 중...' },
      { delay: 2800, progress: 100, text: '✨ 해몽 완료!' }
    ];

    for (const step of analysisSteps) {
      await new Promise(resolve => setTimeout(resolve, step.delay));
      setProgress(step.progress);
      setCurrentStatus(step.text);
    }

    // AI 분석 결과 생성 (목업)
    const result: FortuneResult = {
      id: Date.now().toString(),
      type: 'dream',
      title: '꿈 해몽 결과',
      content: `🌙 **꿈 해몽 분석**

📝 **꿈의 요약**
당신이 꾼 꿈은 현재의 심리상태와 미래에 대한 잠재의식을 반영하고 있습니다. ${dreamMood ? `꿈의 분위기가 ${dreamMood}했다는 것은 ` : ''}현재 내면의 상태와 밀접한 관련이 있습니다.

🔍 **주요 상징 해석**

${dreamContent.includes('물') ? `💧 **물의 상징**
꿈 속의 물은 감정과 정화를 의미합니다. 맑은 물이었다면 마음이 정화되고 새로운 시작을 알리며, 탁한 물이었다면 복잡한 감정 상태를 나타냅니다.

` : ''}${dreamContent.includes('동물') || dreamContent.includes('개') || dreamContent.includes('고양이') || dreamContent.includes('새') ? `🐾 **동물의 상징**
꿈 속의 동물은 본능과 직감을 상징합니다. 친근한 동물이었다면 좋은 인연을 만날 징조이고, 무서운 동물이었다면 현재 스트레스나 두려움을 나타냅니다.

` : ''}${dreamContent.includes('비행') || dreamContent.includes('날다') || dreamContent.includes('하늘') ? `🕊️ **비행의 상징**
하늘을 나는 꿈은 자유에 대한 갈망과 현실 극복 의지를 나타냅니다. 높이 날수록 목표 달성에 대한 강한 의지를 의미합니다.

` : ''}${dreamContent.includes('돈') || dreamContent.includes('금') || dreamContent.includes('보석') ? `💎 **재물의 상징**
돈이나 보석이 나오는 꿈은 재물운이 상승할 징조입니다. 특히 주워서 얻었다면 예상치 못한 수입이 생길 수 있습니다.

` : ''}
🎯 **심리상태 분석**
• 현재 당신은 변화에 대한 준비가 되어 있는 상태입니다
• 새로운 도전에 대한 두려움과 기대감이 공존하고 있습니다
• 주변 관계에서 더 깊은 소통을 원하고 있습니다
• 자아 발전에 대한 강한 욕구가 있습니다

🔮 **운세 전망**

**단기 전망 (1개월)**
• 새로운 기회가 찾아올 것입니다
• 인간관계에서 좋은 변화가 있을 것입니다
• 창의적인 아이디어가 떠오를 수 있습니다

**중기 전망 (3개월)**
• 목표했던 일에서 진전이 있을 것입니다
• 재정적인 면에서 안정감을 찾게 될 것입니다
• 건강 상태도 좋아질 것입니다

**장기 전망 (1년)**
• 인생의 중요한 전환점을 맞게 될 것입니다
• 오랫동안 바라던 일이 성취될 가능성이 높습니다
• 새로운 환경에서의 성공을 예고합니다

⚠️ **주의사항**
• 성급한 결정보다는 신중한 판단이 필요합니다
• 주변 사람들의 조언에 귀 기울이세요
• 건강 관리에 소홀하지 마세요

💡 **조언 및 개운법**
• 꿈 일기를 써보시는 것을 추천합니다
• 명상이나 요가로 마음의 평정을 찾으세요
• 파란색이나 초록색 계열의 옷을 입으세요
• 동쪽으로 산책하거나 여행을 계획해보세요
• 새로운 취미나 학습을 시작하기 좋은 시기입니다

🌟 **특별 메시지**
이 꿈은 당신의 내면이 성장하고 있음을 보여줍니다. 현재의 어려움이나 고민도 곧 해결될 것이니 긍정적인 마음을 유지하세요. 꿈은 미래에 대한 희망적인 메시지를 담고 있습니다.`,
      date: new Date().toLocaleDateString('ko-KR'),
      paid: false
    };

    setStep('complete');
    setTimeout(() => onResult(result), 500);
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

          {/* <AdBanner type="card" className="mt-4" /> */}

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
                      className={`cursor-pointer p-3 rounded-2xl text-center justify-center hover:scale-105 transition-all duration-200 ${
                        selectedTags.includes(tag.text) 
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
              {/* <div className="space-y-3">
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
              </div> */}
            </div>
          </Card>

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