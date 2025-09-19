import React from 'react';
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { X } from 'lucide-react';

interface AdBannerProps {
  type?: 'banner' | 'card' | 'native';
  size?: 'small' | 'medium' | 'large';
  position?: 'top' | 'middle' | 'bottom';
  onClose?: () => void;
  className?: string;
}

export function AdBanner({ 
  type = 'banner', 
  size = 'medium', 
  position = 'middle',
  onClose,
  className = '' 
}: AdBannerProps) {
  
  const adData = {
    banner: [
      {
        title: "🌟 새해 프리미엄 특가",
        description: "50% 할인된 가격으로 프리미엄 혜택을 누려보세요",
        cta: "지금 확인하기",
        bg: "bg-gradient-to-r from-hanbok-gold/20 to-dancheong-red/20"
      },
      {
        title: "🔮 무료 상담 이벤트",
        description: "운세 전문가와 1:1 상담을 무료로 받아보세요",
        cta: "신청하기",
        bg: "bg-gradient-to-r from-dancheong-blue/20 to-shadow-purple/20"
      }
    ],
    card: [
      {
        title: "🎯 맞춤형 운세 추천",
        description: "AI가 분석한 당신만의 특별한 운세를 받아보세요",
        cta: "체험하기",
        bg: "bg-gradient-to-br from-dancheong-green/20 to-hanbok-gold/20"
      }
    ],
    native: [
      {
        title: "💎 프리미엄 업그레이드",
        description: "무제한 운세와 전문가 상담을 이용해보세요",
        cta: "업그레이드",
        bg: "bg-gradient-to-r from-royal-navy/20 to-hanbok-gold/20"
      }
    ]
  };

  const ads = adData[type];
  const ad = ads[Math.floor(Math.random() * ads.length)];

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'h-16 px-4 py-2';
      case 'large':
        return 'h-32 px-6 py-4';
      default:
        return 'h-24 px-5 py-3';
    }
  };

  if (type === 'banner') {
    return (
      <div className={`relative ${ad.bg} rounded-2xl ${getSizeClasses()} ${className}`}>
        <div className="absolute inset-0 opacity-30">
          <div className="h-full w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        </div>
        
        <div className="relative flex items-center justify-between h-full">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-ink-black dark:text-ink-gray mb-1 truncate">
              {ad.title}
            </h3>
            <p className="text-xs text-muted-foreground truncate">
              {ad.description}
            </p>
          </div>
          
          <div className="flex items-center gap-2 ml-3">
            <Button 
              size="sm" 
              className="bg-ink-black dark:bg-hanbok-gold text-white dark:text-ink-black hover:bg-ink-gray dark:hover:bg-hanbok-gold-dark transition-all duration-300 rounded-lg text-xs h-8 px-3"
            >
              {ad.cta}
            </Button>
            
            {onClose && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={onClose}
                className="h-6 w-6 p-0 hover:bg-white/20 rounded-full"
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>
        
        <Badge className="absolute top-1 right-1 bg-hanbok-gold/80 text-ink-black text-xs px-2 py-0">
          AD
        </Badge>
      </div>
    );
  }

  if (type === 'card') {
    return (
      <Card className={`${ad.bg} border border-hanbok-gold/30 rounded-2xl ink-shadow hover:shadow-lg transition-all duration-300 cursor-pointer ${className}`}>
        <div className="p-4 relative">
          <Badge className="absolute top-2 right-2 bg-hanbok-gold/80 text-ink-black text-xs">
            AD
          </Badge>
          
          <div className="space-y-3">
            <h3 className="text-base font-semibold text-ink-black dark:text-ink-gray">
              {ad.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {ad.description}
            </p>
            
            <div className="flex justify-between items-center pt-2">
              <span className="text-xs text-muted-foreground">sponsored</span>
              <Button 
                size="sm" 
                className="bg-ink-black dark:bg-hanbok-gold text-white dark:text-ink-black hover:bg-ink-gray dark:hover:bg-hanbok-gold-dark transition-all duration-300 rounded-lg text-xs h-7 px-3"
              >
                {ad.cta}
              </Button>
            </div>
          </div>
          
          {onClose && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onClose}
              className="absolute top-1 right-1 h-6 w-6 p-0 hover:bg-white/20 rounded-full"
            >
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>
      </Card>
    );
  }

  // Native ad
  return (
    <div className={`${ad.bg} rounded-xl p-3 border border-border ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-semibold text-ink-black dark:text-ink-gray truncate">
              {ad.title}
            </h4>
            <Badge className="bg-hanbok-gold/80 text-ink-black text-xs px-1 py-0">
              AD
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground truncate">
            {ad.description}
          </p>
        </div>
        
        <Button 
          size="sm" 
          variant="outline"
          className="ml-2 h-8 px-3 text-xs rounded-lg border-hanbok-gold/30 hover:bg-hanbok-gold/10"
        >
          {ad.cta}
        </Button>
      </div>
    </div>
  );
}