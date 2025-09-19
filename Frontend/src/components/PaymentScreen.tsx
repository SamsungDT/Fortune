import React, { useState } from 'react';
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Progress } from "./ui/progress";
import { AdBanner } from './AdBanner';
import { CreditCard, Gift, Shield, CheckCircle } from 'lucide-react';

interface PaymentScreenProps {
  serviceType: string;
  onPaymentComplete: () => void;
  onCancel: () => void;
}

export function PaymentScreen({ serviceType, onPaymentComplete, onCancel }: PaymentScreenProps) {
  const [paymentStep, setPaymentStep] = useState<'confirm' | 'processing' | 'complete'>('confirm');
  const [progress, setProgress] = useState(0);

  const getServiceInfo = (type: string) => {
    switch (type) {
      case 'physiognomy':
        return { name: '관상', icon: '👤', price: 2900 };
      case 'lifefortune':
        return { name: '평생 운세', icon: '🌟', price: 3900 };
      case 'dailyfortune':
        return { name: '오늘의 운세', icon: '📅', price: 1900 };
      case 'dream':
        return { name: '해몽', icon: '💭', price: 2400 };
      default:
        return { name: '운세 서비스', icon: '🔮', price: 2900 };
    }
  };

  const service = getServiceInfo(serviceType);

  const handlePayment = async () => {
    setPaymentStep('processing');
    
    // 결제 진행률 시뮬레이션
    const intervals = [
      { delay: 500, progress: 25, text: '구글 플레이와 연결 중...' },
      { delay: 1000, progress: 50, text: '결제 정보 확인 중...' },
      { delay: 1500, progress: 75, text: '결제 처리 중...' },
      { delay: 2000, progress: 100, text: '결제 완료!' }
    ];

    for (const interval of intervals) {
      await new Promise(resolve => setTimeout(resolve, interval.delay));
      setProgress(interval.progress);
    }

    setPaymentStep('complete');
    setTimeout(() => {
      onPaymentComplete();
    }, 1500);
  };

  return (
    <div className="p-6 flex items-center justify-center min-h-screen space-y-6">
      <div className="max-w-md w-full space-y-6">
        
        {/* 상단 광고 */}
        <AdBanner type="banner" size="small" />
        
        {paymentStep === 'confirm' && (
          <Card className="hanji-texture border border-hanbok-gold/30 p-6 rounded-3xl ink-shadow">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-hanbok-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">{service.icon}</span>
              </div>
              <h1 className="text-xl text-ink-black dark:text-ink-gray mb-3 ink-brush">{service.name} 이용</h1>
              <Badge className="bg-hanbok-gold/20 text-hanbok-gold-dark border border-hanbok-gold/40 rounded-full px-3 py-1">
                두 번째 이용부터 유료
              </Badge>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">서비스</span>
                <span className="text-ink-black dark:text-ink-gray font-medium">{service.name}</span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">가격</span>
                <span className="text-ink-black dark:text-ink-gray font-medium">{service.price.toLocaleString()}원</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">할인</span>
                <span className="text-dancheong-green font-medium">-0원</span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between items-center text-lg">
                <span className="text-ink-black dark:text-ink-gray font-semibold">총 결제금액</span>
                <span className="text-hanbok-gold-dark font-bold">{service.price.toLocaleString()}원</span>
              </div>
            </div>

            <Card className="border border-dancheong-green/30 bg-dancheong-green/5 p-4 mb-6 rounded-2xl">
              <h3 className="text-ink-black dark:text-ink-gray mb-3 ink-brush flex items-center">
                <Gift className="w-4 h-4 mr-2 text-dancheong-green" />
                첫 이용 혜택
              </h3>
              <ul className="text-muted-foreground text-sm space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="w-3 h-3 mr-2 text-dancheong-green" />
                  모든 서비스 첫 이용은 무료입니다
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-3 h-3 mr-2 text-dancheong-green" />
                  정확하고 상세한 AI 분석 제공
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-3 h-3 mr-2 text-dancheong-green" />
                  카카오톡 공유 기능 제공
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-3 h-3 mr-2 text-dancheong-green" />
                  결과 영구 보관
                </li>
              </ul>
            </Card>

            <div className="space-y-4">
              <Button 
                onClick={handlePayment}
                className="w-full h-14 bg-dancheong-green hover:bg-dancheong-green/90 text-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
              >
                <CreditCard className="w-5 h-5 mr-2" />
                구글 플레이로 결제하기
              </Button>
              
              <Button 
                onClick={onCancel}
                variant="outline"
                className="w-full h-12 border-2 border-border hover:border-hanbok-gold/50 hover:bg-hanbok-gold/5 rounded-3xl font-medium"
              >
                취소
              </Button>
            </div>

            <div className="mt-6 text-center">
              <div className="flex items-center justify-center space-x-2 text-muted-foreground text-xs">
                <Shield className="w-3 h-3" />
                <span>구글 플레이 정책에 따라 안전하게 결제됩니다</span>
              </div>
            </div>
          </Card>
        )}
        
        {/* 중간 광고 */}
        {paymentStep === 'confirm' && <AdBanner type="card" />}

        {paymentStep === 'processing' && (
          <Card className="hanji-texture border border-hanbok-gold/30 p-8 rounded-3xl ink-shadow">
            <div className="text-center space-y-6">
              <div className="relative">
                <div className="w-20 h-20 bg-hanbok-gold/20 rounded-full flex items-center justify-center mx-auto animate-pulse">
                  <span className="text-4xl animate-spin">☯</span>
                </div>
                <div className="absolute inset-0 rounded-full border-2 border-hanbok-gold/30 animate-ping"></div>
              </div>
              <h2 className="text-xl text-ink-black dark:text-ink-gray ink-brush">결제 처리 중</h2>
              <div className="space-y-3">
                <Progress value={progress} className="w-full h-3 rounded-full" />
                <p className="text-hanbok-gold-dark font-medium">{progress}% 완료</p>
              </div>
              <p className="text-muted-foreground">잠시만 기다려주세요...</p>
            </div>
          </Card>
        )}

        {paymentStep === 'complete' && (
          <Card className="hanji-texture border border-hanbok-gold/30 p-8 rounded-3xl ink-shadow">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-dancheong-green/20 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10 text-dancheong-green" />
              </div>
              <h2 className="text-xl text-ink-black dark:text-ink-gray ink-brush">결제가 완료되었습니다!</h2>
              <div className="space-y-3">
                <p className="text-muted-foreground">
                  {service.name} 서비스 이용이 가능합니다
                </p>
                <p className="text-muted-foreground text-sm">
                  결과 화면으로 이동합니다...
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}