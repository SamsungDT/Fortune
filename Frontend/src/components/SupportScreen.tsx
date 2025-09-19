import React, { useState } from 'react';
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { User } from "../App";
import { Heart, Coffee, Zap, Star, Gift, CheckCircle, Sparkles } from 'lucide-react';

interface SupportScreenProps {
  user: User;
  onSupport: (planType: 'monthly' | 'yearly') => void;
}

export function SupportScreen({ user, onSupport }: SupportScreenProps) {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const supportPlans = [
    {
      id: 'monthly',
      name: '월간 후원',
      price: 990,
      period: '월',
      description: '매달 커피 한 잔 값으로',
      emoji: '☕',
      benefits: [
        '광고 제거',
        '모든 서비스 무제한 이용',
        '우선 고객 지원',
        '신규 기능 우선 체험'
      ]
    },
    {
      id: 'yearly',
      name: '연간 후원',
      price: 9900,
      period: '년',
      description: '한 번의 후원으로 1년간 지원',
      emoji: '🎁',
      popular: true,
      savings: '11개월치 가격으로 12개월 이용',
      benefits: [
        '광고 제거',
        '모든 서비스 무제한 이용',
        '우선 고객 지원',
        '신규 기능 우선 체험',
        '개발자와 직접 소통 채널',
        '특별 감사 인사'
      ]
    }
  ];

  const handleSupportClick = async (planType: 'monthly' | 'yearly') => {
    setIsProcessing(true);
    setProgress(0);

    // 후원 처리 시뮬레이션
    const steps = [
      { delay: 500, progress: 25, text: '후원 정보 확인 중...' },
      { delay: 1000, progress: 50, text: '결제 처리 중...' },
      { delay: 1500, progress: 75, text: '감사 인사 준비 중...' },
      { delay: 2000, progress: 100, text: '후원 완료!' }
    ];

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, step.delay));
      setProgress(step.progress);
    }

    setTimeout(() => {
      onSupport(planType);
      setIsProcessing(false);
    }, 500);
  };

  if (user.isPremium) {
    return (
      <div className="p-6 space-y-6">
        {/* 감사 메시지 */}
        <Card className="hanji-texture border border-hanbok-gold/30 p-8 rounded-3xl ink-shadow text-center">
          <div className="w-20 h-20 bg-hanbok-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-dancheong-red animate-pulse" />
          </div>
          
          <h2 className="text-2xl text-ink-black dark:text-ink-gray ink-brush mb-4">
            후원해주셔서 감사합니다! 🙏
          </h2>
          
          <p className="text-muted-foreground leading-relaxed mb-6">
            당신의 소중한 후원 덕분에 더 나은 서비스를 제공할 수 있습니다. 
            앞으로도 계속해서 정확하고 유용한 운세 서비스로 보답하겠습니다.
          </p>
          
          <Badge className="bg-hanbok-gold/20 text-hanbok-gold-dark border border-hanbok-gold/40 rounded-full px-4 py-2 text-base">
            ✨ 영구 프리미엄 회원
          </Badge>
        </Card>

        {/* 후원자 혜택 */}
        <Card className="border border-border p-6 rounded-3xl">
          <h3 className="text-lg text-ink-black dark:text-ink-gray ink-brush mb-4 flex items-center">
            <Gift className="w-5 h-5 mr-2 text-hanbok-gold-dark" />
            후원자 혜택
          </h3>
          
          <div className="space-y-3">
            {[
              { icon: '🚫', text: '모든 광고 제거', status: '적용됨' },
              { icon: '♾️', text: '모든 서비스 무제한 이용', status: '적용됨' },
              { icon: '⚡', text: '우선 고객 지원', status: '적용됨' },
              { icon: '🆕', text: '신규 기능 우선 체험', status: '적용됨' },
              { icon: '💬', text: '개발자와 직접 소통', status: '적용됨' }
            ].map((benefit, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-2xl hover:bg-hanbok-gold/5 transition-colors">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{benefit.icon}</span>
                  <span className="text-muted-foreground">{benefit.text}</span>
                </div>
                <Badge className="bg-dancheong-green/20 text-dancheong-green border border-dancheong-green/40 rounded-full px-2 py-1 text-xs">
                  {benefit.status}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* 개발자 메시지 */}
        <Card className="border border-dancheong-blue/30 bg-dancheong-blue/5 p-6 rounded-3xl">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-dancheong-blue/20 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl">👨‍💻</span>
            </div>
            
            <h4 className="text-ink-black dark:text-ink-gray ink-brush">개발자 메시지</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              "Fortune K.I을 사랑해주시고 후원까지 해주셔서 정말 감사합니다. 
              여러분의 응원이 더 나은 앱을 만드는 원동력이 됩니다. 
              앞으로도 최고의 운세 서비스로 보답하겠습니다! 💪"
            </p>
            <p className="text-xs text-muted-foreground">- Fortune K.I 개발팀 -</p>
          </div>
        </Card>
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <Card className="hanji-texture border border-hanbok-gold/30 p-8 rounded-3xl ink-shadow w-full max-w-sm">
          <div className="text-center space-y-6">
            <div className="relative">
              <div className="w-20 h-20 bg-hanbok-gold/20 rounded-full flex items-center justify-center mx-auto animate-pulse">
                <Heart className="w-10 h-10 text-dancheong-red animate-ping" />
              </div>
              <div className="absolute inset-0 rounded-full border-2 border-hanbok-gold/30 animate-ping"></div>
            </div>
            
            <h2 className="text-xl text-ink-black dark:text-ink-gray ink-brush">
              후원 처리 중입니다
            </h2>
            
            <div className="space-y-3">
              <Progress value={progress} className="w-full h-3 rounded-full" />
              <p className="text-hanbok-gold-dark font-medium">{progress}% 완료</p>
            </div>
            
            <p className="text-muted-foreground text-sm">
              감사한 마음으로 처리하고 있습니다...
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* 헤더 */}
      <Card className="hanji-texture border border-hanbok-gold/30 p-6 rounded-3xl ink-shadow text-center">
        <div className="w-20 h-20 bg-hanbok-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="w-10 h-10 text-dancheong-red" />
        </div>
        
        <h2 className="text-xl text-ink-black dark:text-ink-gray ink-brush mb-3">
          개발자를 응원해주세요
        </h2>
        
        <p className="text-muted-foreground leading-relaxed">
          후원해주시면 <strong>영구 프리미엄</strong>을 제공하며, 
          광고 없이 모든 기능을 자유롭게 이용하실 수 있습니다.
        </p>
      </Card>

      {/* 후원 플랜 */}
      <div className="space-y-4">
        {supportPlans.map((plan) => (
          <Card 
            key={plan.id}
            className={`relative p-6 rounded-3xl cursor-pointer transition-all duration-300 border-2 ${
              selectedPlan === plan.id 
                ? 'border-hanbok-gold bg-hanbok-gold/5 shadow-lg' 
                : 'border-border hover:border-hanbok-gold/40 hover:shadow-md'
            }`}
            onClick={() => setSelectedPlan(plan.id as 'monthly' | 'yearly')}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-dancheong-red text-white border border-dancheong-red/40 rounded-full px-3 py-1 shadow-lg">
                  <Star className="w-3 h-3 mr-1" />
                  추천
                </Badge>
              </div>
            )}
            
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-hanbok-gold/20 rounded-2xl flex items-center justify-center">
                  <span className="text-2xl">{plan.emoji}</span>
                </div>
                <div>
                  <h3 className="text-lg text-ink-black dark:text-ink-gray ink-brush">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-hanbok-gold-dark">
                  {plan.price.toLocaleString()}원
                </div>
                <div className="text-sm text-muted-foreground">/ {plan.period}</div>
              </div>
            </div>
            
            {plan.savings && (
              <div className="mb-4">
                <Badge className="bg-dancheong-green/20 text-dancheong-green border border-dancheong-green/40 rounded-full px-3 py-1 text-sm">
                  💰 {plan.savings}
                </Badge>
              </div>
            )}
            
            <div className="space-y-2">
              {plan.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-dancheong-green" />
                  <span className="text-sm text-muted-foreground">{benefit}</span>
                </div>
              ))}
            </div>
            
            {selectedPlan === plan.id && (
              <div className="absolute inset-0 rounded-3xl border-2 border-hanbok-gold animate-pulse pointer-events-none"></div>
            )}
          </Card>
        ))}
      </div>

      {/* 개발자 소개 */}
      <Card className="border border-dancheong-blue/30 bg-dancheong-blue/5 p-6 rounded-3xl">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-dancheong-blue/20 rounded-2xl flex items-center justify-center">
            <span className="text-xl">👨‍💻</span>
          </div>
          <div className="flex-1">
            <h4 className="text-ink-black dark:text-ink-gray ink-brush mb-2">
              개발자 이야기
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              안녕하세요! Fortune K.I를 개발한 개발자입니다. 
              전통적인 운세와 최신 AI 기술을 결합해 정확하고 유용한 서비스를 만들기 위해 노력하고 있습니다.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              여러분의 소중한 후원은 서버 운영비, 더 나은 AI 모델 도입, 
              그리고 새로운 기능 개발에 사용됩니다. 🙏
            </p>
          </div>
        </div>
      </Card>

      {/* 후원하기 버튼 */}
      <div className="space-y-3">
        <Button 
          onClick={() => handleSupportClick(selectedPlan)}
          className="w-full h-16 bg-hanbok-gold hover:bg-hanbok-gold-dark text-ink-black rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg font-semibold"
        >
          <Sparkles className="w-6 h-6 mr-3" />
          {supportPlans.find(p => p.id === selectedPlan)?.price.toLocaleString()}원으로 후원하기
        </Button>
        
        <p className="text-center text-xs text-muted-foreground">
          후원하시면 즉시 영구 프리미엄 혜택이 적용됩니다
        </p>
      </div>

      {/* 안내사항 */}
      <Card className="border border-border p-4 rounded-2xl">
        <h4 className="text-sm text-ink-black dark:text-ink-gray mb-2 flex items-center">
          <Coffee className="w-4 h-4 mr-2 text-hanbok-gold-dark" />
          후원 안내
        </h4>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• 후원은 구글 플레이를 통해 안전하게 처리됩니다</li>
          <li>• 후원 즉시 영구 프리미엄 혜택이 적용됩니다</li>
          <li>• 모든 기능을 광고 없이 무제한 이용 가능합니다</li>
          <li>• 후원금은 서비스 개선과 운영에 사용됩니다</li>
        </ul>
      </Card>
    </div>
  );
}