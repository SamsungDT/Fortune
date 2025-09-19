import React, { useState } from 'react';
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Check, Crown, Sparkles, Clock, Heart, Shield, Star } from 'lucide-react';

interface PremiumScreenProps {
  user: {
    name: string;
    email: string;
    isPremium?: boolean;
    premiumExpiry?: string;
  };
  onPurchase: (planType: 'monthly' | 'yearly') => void;
}

export function PremiumScreen({ user, onPurchase }: PremiumScreenProps) {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');

  const premiumFeatures = [
    {
      icon: '🌟',
      title: '무제한 운세 이용',
      description: '모든 운세 서비스를 횟수 제한 없이 자유롭게 이용하세요',
      color: 'text-hanbok-gold-dark'
    },
    {
      icon: '🔮',
      title: 'AI 프리미엄 분석',
      description: '더욱 정확하고 상세한 AI 분석으로 깊이 있는 결과를 받아보세요',
      color: 'text-shadow-purple'
    },
    {
      icon: '📱',
      title: '전용 상담 서비스',
      description: '운세 전문가와 1:1 개인 상담을 받을 수 있습니다',
      color: 'text-dancheong-blue'
    },
    {
      icon: '🎯',
      title: '맞춤형 운세 추천',
      description: '개인 성향과 관심사에 맞는 맞춤형 운세를 추천받으세요',
      color: 'text-dancheong-green'
    },
    {
      icon: '📊',
      title: '상세 운세 리포트',
      description: '월간/연간 운세 트렌드와 상세 분석 리포트를 제공합니다',
      color: 'text-royal-navy'
    },
    {
      icon: '⚡',
      title: '우선 처리 서비스',
      description: '모든 운세 분석을 우선적으로 처리해드립니다',
      color: 'text-dancheong-red'
    }
  ];

  const plans = [
    {
      id: 'monthly',
      name: '월간 프리미엄',
      price: '9,900',
      originalPrice: '19,800',
      period: '월',
      discount: '50%',
      description: '한 달간 모든 프리미엄 기능을 이용해보세요',
      popular: false
    },
    {
      id: 'yearly',
      name: '연간 프리미엄',
      price: '79,000',
      originalPrice: '118,800',
      period: '년',
      discount: '33%',
      description: '1년간 프리미엄 혜택을 최대한 누려보세요',
      popular: true,
      monthlyEquivalent: '6,583원/월'
    }
  ];

  return (
    <div className="p-6 space-y-8">
      {/* 헤더 섹션 */}
      <div className="text-center space-y-4">
        <div className="relative inline-block">
          <div className="text-6xl mb-3">
            <span className="absolute inset-0 text-hanbok-gold/20 transform scale-110">👑</span>
            <span className="relative">👑</span>
          </div>
        </div>
        <h1 className="text-2xl text-ink-black dark:text-ink-gray ink-brush font-bold">
          Fortune K.I Premium
        </h1>
        <p className="text-muted-foreground leading-relaxed">
          더욱 정확하고 깊이 있는 운세를 경험해보세요
        </p>
      </div>

      {/* 현재 상태 */}
      {user.isPremium ? (
        <Card className="hanji-texture border border-hanbok-gold/30 p-6 rounded-2xl ink-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-hanbok-gold/20 rounded-full flex items-center justify-center">
                <Crown className="w-6 h-6 text-hanbok-gold-dark" />
              </div>
              <div>
                <h3 className="font-semibold text-ink-black dark:text-ink-gray">
                  프리미엄 회원
                </h3>
                <p className="text-sm text-muted-foreground">
                  {user.premiumExpiry}까지 이용 가능
                </p>
              </div>
            </div>
            <Badge className="bg-hanbok-gold text-ink-black">
              PREMIUM
            </Badge>
          </div>
        </Card>
      ) : (
        <Card className="border border-dancheong-red/30 p-6 rounded-2xl">
          <div className="text-center space-y-2">
            <div className="text-2xl">✨</div>
            <h3 className="font-semibold text-ink-black dark:text-ink-gray">
              기본 회원
            </h3>
            <p className="text-sm text-muted-foreground">
              프리미엄으로 업그레이드하여 더 많은 혜택을 누려보세요
            </p>
          </div>
        </Card>
      )}

      {/* 프리미엄 기능 */}
      <div className="space-y-4">
        <h2 className="text-lg text-ink-black dark:text-ink-gray ink-brush">
          💎 프리미엄 전용 혜택
        </h2>
        <div className="grid grid-cols-1 gap-4">
          {premiumFeatures.map((feature, index) => (
            <Card 
              key={index}
              className="p-4 border border-border hover:border-hanbok-gold/40 transition-all duration-300 rounded-xl"
            >
              <div className="flex items-start space-x-4">
                <div className="text-2xl">{feature.icon}</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-ink-black dark:text-ink-gray mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
                <Check className="w-5 h-5 text-hanbok-gold-dark flex-shrink-0 mt-0.5" />
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* 요금 플랜 */}
      {!user.isPremium && (
        <div className="space-y-6">
          <h2 className="text-lg text-ink-black dark:text-ink-gray ink-brush text-center">
            🎯 요금 플랜 선택
          </h2>
          
          <div className="grid grid-cols-1 gap-4">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={`relative p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
                  selectedPlan === plan.id
                    ? 'border-2 border-hanbok-gold bg-hanbok-gold/5'
                    : 'border border-border hover:border-hanbok-gold/40'
                } ${
                  plan.popular ? 'ring-2 ring-hanbok-gold/20' : ''
                }`}
                onClick={() => setSelectedPlan(plan.id as 'monthly' | 'yearly')}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-hanbok-gold text-ink-black px-4 py-1 shadow-lg">
                      <Star className="w-3 h-3 mr-1" />
                      추천
                    </Badge>
                  </div>
                )}
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-ink-black dark:text-ink-gray">
                        {plan.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {plan.description}
                      </p>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedPlan === plan.id
                        ? 'border-hanbok-gold bg-hanbok-gold'
                        : 'border-border'
                    }`}>
                      {selectedPlan === plan.id && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-bold text-ink-black dark:text-ink-gray">
                      {plan.price}원
                    </span>
                    <span className="text-sm text-muted-foreground">
                      /{plan.period}
                    </span>
                    <span className="text-sm text-muted-foreground line-through">
                      {plan.originalPrice}원
                    </span>
                    <Badge variant="secondary" className="bg-dancheong-red/10 text-dancheong-red text-xs">
                      {plan.discount} 할인
                    </Badge>
                  </div>
                  
                  {plan.monthlyEquivalent && (
                    <p className="text-sm text-hanbok-gold-dark">
                      월 환산 {plan.monthlyEquivalent}
                    </p>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {/* 구매 버튼 */}
          <div className="space-y-4">
            <Button
              onClick={() => onPurchase(selectedPlan)}
              className="w-full h-14 bg-hanbok-gold hover:bg-hanbok-gold-dark text-ink-black rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Crown className="w-5 h-5 mr-2" />
              프리미엄 시작하기
            </Button>
            
            <div className="text-center space-y-2">
              <p className="text-xs text-muted-foreground">
                • 언제든지 해지 가능 • 7일 무료 체험 • 안전한 결제
              </p>
              <p className="text-xs text-muted-foreground">
                결제는 Google Play 스토어를 통해 안전하게 처리됩니다
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 고객 후기 */}
      <div className="space-y-4">
        <h2 className="text-lg text-ink-black dark:text-ink-gray ink-brush">
          💬 이용자 후기
        </h2>
        <div className="grid grid-cols-1 gap-4">
          {[
            {
              name: "김**님",
              rating: 5,
              comment: "프리미엄 분석이 정말 정확해요! 특히 맞춤형 조언이 도움이 많이 됩니다.",
              date: "2024.12.15"
            },
            {
              name: "이**님", 
              rating: 5,
              comment: "전문가 상담 서비스가 정말 좋아요. 혼자 고민하던 일들이 많이 해결됐어요.",
              date: "2024.12.10"
            },
            {
              name: "박**님",
              rating: 5,
              comment: "무제한 이용이 가능해서 언제든 궁금할 때 바로 확인할 수 있어 좋습니다.",
              date: "2024.12.08"
            }
          ].map((review, index) => (
            <Card key={index} className="p-4 border border-border rounded-xl">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-ink-black dark:text-ink-gray">
                      {review.name}
                    </span>
                    <div className="flex space-x-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-hanbok-gold text-hanbok-gold" />
                      ))}
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{review.date}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  "{review.comment}"
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}