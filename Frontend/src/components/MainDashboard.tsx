// MainDashboard.tsx
import React, { useState } from 'react';
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { User } from "../App";
import { ImageWithFallback } from './figma/ImageWithFallback';
//import { AdBanner } from './AdBanner';
import { Bell, ChevronRight, Gift, Megaphone, TrendingUp, Loader2 } from 'lucide-react'; // Loader2 추가

interface AppStats {
  totalUsers: number;
  totalReadings: number;
  physiognomyCount: number;
  lifeFortuneCount: number;
  dailyFortuneCount: number;
  dreamCount: number;
}

interface MainDashboardProps {
  user: User;
  appStats: AppStats | null; // appStats가 null일 수 있도록 타입 변경
  appStatsLoading: boolean; // 로딩 상태를 나타내는 prop 추가
  onServiceSelect: (service: string) => void;
  onViewMyResults: () => void;
  onLogout: () => void;
}

export function MainDashboard({ user, appStats, appStatsLoading, onServiceSelect, onViewMyResults, onLogout }: MainDashboardProps) {
  const [showTopAd, setShowTopAd] = useState(true);
  const [showBottomAd, setShowBottomAd] = useState(true);
  const services = [
    {
      id: 'physiognomy',
      title: '관상',
      description: 'AI가 분석하는 얼굴 관상',
      icon: '👤',
      image: 'https://images.unsplash.com/photo-1602015521560-54cae4574e07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYWNlJTIwcmVhZGluZyUyMHBoeXNpb2dub215JTIwcG9ydHJhaXQlMjBhbmNpZW50JTIwd2lzZG9tfGVufDF8fHx8MTc1ODE4OTY3MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      usageCount: user.usageCount.physiognomy
    },
    {
      id: 'lifefortune',
      title: '평생 운세',
      description: '생년월일로 보는 인생 운세',
      icon: '🌟',
      image: 'https://images.unsplash.com/photo-1705751668509-b3ca0953582c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx6b2RpYWMlMjBhc3Ryb2xvZ3klMjBmb3J0dW5lJTIwbGlmZSUyMGNvc21pYyUyMGVufDF8fHx8MTc1ODE4OTY3M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      usageCount: user.usageCount.lifefortune
    },
    {
      id: 'dailyfortune',
      title: '오늘의 운세',
      description: '오늘 하루의 운세와 조언',
      icon: '📅',
      image: 'https://images.unsplash.com/photo-1740375699674-1b097b4cf7f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYWlseSUyMGZvcnR1bmUlMjB0YXJvdCUyMGNhcmRzJTIwbXlzdGljYWwlMjBtb3JuaW5nfGVufDF8fHx8MTc1ODE4OTY3OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      usageCount: user.usageCount.dailyfortune
    },
    {
      id: 'dream',
      title: '해몽',
      description: '꿈의 의미를 AI가 해석',
      icon: '💭',
      image: 'https://images.unsplash.com/photo-1661430391787-6fd01434cea1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmVhbSUyMGludGVycHJldGF0aW9uJTIwbXlzdGljYWwlMjBuaWdodCUyMGNsb3VkcyUyMHN0YXJzfGVufDF8fHx8MTc1ODE4OTY4Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      usageCount: user.usageCount.dream
    }
  ];

  const notices = [
    {
      id: 1,
      type: 'event',
      title: '🎉 신규 회원 혜택',
      content: '가입 후 7일간 모든 서비스 무료 이용! 지금 바로 체험해보세요.',
      date: '2024.12.20',
      badge: '이벤트',
      badgeColor: 'bg-dancheong-red/20 text-dancheong-red'
    },
    {
      id: 2,
      type: 'update',
      title: '🔮 AI 분석 엔진 업데이트',
      content: '더욱 정확하고 세밀한 운세 분석이 가능해졌습니다.',
      date: '2024.12.18',
      badge: '업데이트',
      badgeColor: 'bg-dancheong-blue/20 text-dancheong-blue'
    },
    {
      id: 3,
      type: 'notice',
      title: '📱 앱 버전 2.1.0 출시',
      content: '새로운 기능과 개선된 사용자 경험을 만나보세요.',
      date: '2024.12.15',
      badge: '공지',
      badgeColor: 'bg-dancheong-green/20 text-dancheong-green'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* 상단 광고 배너 */}
{/* {showTopAd && (
          <AdBanner 
          type="banner" 
          size="medium" 
          onClose={() => setShowTopAd(false)}
          className="mb-4"
        />
      )} */}

      {/* 환영 인사 섹션 */}
      <div className="hanji-texture rounded-2xl p-6 border border-hanbok-gold/20 ink-shadow">
        <div className="text-center space-y-3">
          <div className="text-2xl">🌟</div>
          <h2 className="text-xl text-ink-black dark:text-ink-gray ink-brush">
            안녕하세요, {user.name}님
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            오늘도 좋은 기운이 함께하길 바랍니다
          </p>
        </div>
      </div>

      {/* 전체 통계 섹션 */}
      <Card className="border border-hanbok-gold/20 p-5 rounded-2xl">
        {appStatsLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="w-8 h-8 animate-spin text-hanbok-gold-dark" />
            <p className="ml-3 text-muted-foreground">통계 데이터 불러오는 중...</p>
          </div>
        ) : appStats ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg text-ink-black dark:text-ink-gray ink-brush flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-hanbok-gold-dark" />
                함께하는 Fortune K.I
              </h3>
              <Badge className="bg-hanbok-gold/20 text-hanbok-gold-dark border border-hanbok-gold/40 text-xs px-2 py-1">
                LIVE
              </Badge>
            </div>
            
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  현재 <span className="text-hanbok-gold-dark font-bold text-lg">{appStats.totalUsers.toLocaleString()}명</span>이 Fortune K.I와 함께하고 있어요
                </p>
              </div>
              
              <div className="grid grid-cols-4 gap-3">
                <div className="text-center p-3 bg-hanbok-gold/5 border border-hanbok-gold/20 rounded-xl">
                  <div className="text-lg mb-1">👤</div>
                  <div className="text-sm text-hanbok-gold-dark font-bold">{appStats.physiognomyCount.toLocaleString()}회</div>
                  <div className="text-xs text-muted-foreground">관상</div>
                </div>
                <div className="text-center p-3 bg-hanbok-gold/5 border border-hanbok-gold/20 rounded-xl">
                  <div className="text-lg mb-1">🌟</div>
                  <div className="text-sm text-hanbok-gold-dark font-bold">{appStats.lifeFortuneCount.toLocaleString()}회</div>
                  <div className="text-xs text-muted-foreground">평생운세</div>
                </div>
                <div className="text-center p-3 bg-hanbok-gold/5 border border-hanbok-gold/20 rounded-xl">
                  <div className="text-lg mb-1">📅</div>
                  <div className="text-sm text-hanbok-gold-dark font-bold">{appStats.dailyFortuneCount.toLocaleString()}회</div>
                  <div className="text-xs text-muted-foreground">오늘운세</div>
                </div>
                <div className="text-center p-3 bg-hanbok-gold/5 border border-hanbok-gold/20 rounded-xl">
                  <div className="text-lg mb-1">💭</div>
                  <div className="text-sm text-hanbok-gold-dark font-bold">{appStats.dreamCount.toLocaleString()}회</div>
                  <div className="text-xs text-muted-foreground">해몽</div>
                </div>
              </div>
              
              <div className="text-center pt-3 border-t border-border/50">
                <Badge className="bg-dancheong-green/20 text-dancheong-green border border-dancheong-green/40 text-sm px-3 py-1">
                  총 {appStats.totalReadings.toLocaleString()}회 운세 결과 생성 ✨
                </Badge>
              </div>
            </div>
          </>
        ) : (
          <div className="flex justify-center items-center h-40">
            <p className="text-muted-foreground">통계 데이터를 불러오지 못했습니다.</p>
          </div>
        )}
      </Card>

      {/* 빠른 액션 */}
      <div className="space-y-3">
        <Button 
          variant="outline" 
          onClick={onViewMyResults} 
          className="w-full h-14 gold-accent border-hanbok-gold/40 text-ink-black dark:text-ink-gray hover:bg-hanbok-gold/10 transition-all duration-300 rounded-xl"
        >
          <span className="flex items-center justify-center space-x-2">
            <span className="text-lg">📜</span>
            <span>내 운세 결과 모아보기</span>
          </span>
        </Button>
      </div>

      {/* 서비스 카드 그리드 - 2x2 타일 배치 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg text-ink-black dark:text-ink-gray ink-brush">
            🔮 운세 서비스
          </h3>
{/* {!user.isPremium && (
            <AdBanner type="native" size="small" className="flex-1 max-w-40 ml-4" />
          )} */}
        </div>
        <div className="grid grid-cols-2 gap-4">
          {services.map((service) => {
            const today = new Date().toDateString();
            const isFreeTodayAvailable = user.dailyFreeUsage.date !== today || 
              !user.dailyFreeUsage[service.id as keyof typeof user.dailyFreeUsage];
            
            return (
              <Card 
                key={service.id} 
                className="group overflow-hidden bg-white dark:bg-card border border-border hover:border-hanbok-gold/60 transition-all duration-500 cursor-pointer rounded-2xl ink-shadow hover:shadow-xl hover:scale-[1.02] aspect-square"
                onClick={() => onServiceSelect(service.id)}
              >
                <div className="relative h-1/3">
                  <ImageWithFallback 
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-black/90 via-ink-black/30 to-transparent" />
                  
                  {/* 한국 전통 문양 오버레이 */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="w-full h-full bg-gradient-to-br from-transparent via-hanbok-gold/10 to-transparent"></div>
                  </div>
                  
                  <div className="absolute top-3 right-3">
                    <div className="text-2xl drop-shadow-2xl filter brightness-110">{service.icon}</div>
                  </div>
                  
                  {service.usageCount > 0 && (
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-hanbok-gold/90 text-ink-black border-0 font-medium px-2 py-0.5 text-xs">
                        {service.usageCount}
                      </Badge>
                    </div>
                  )}
                  
                  {/* 전통 문양 라인 */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5">
                    <div className="h-full bg-gradient-to-r from-transparent via-hanbok-gold to-transparent opacity-80"></div>
                  </div>
                </div>
                
                <div className="p-4 h-1/3 hanji-texture flex flex-col justify-between">
                  <div className="flex-1">
                    <h3 className="text-base mb-1 text-ink-black dark:text-ink-gray ink-brush font-semibold leading-tight">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground text-xs leading-tight line-clamp-2">
                      {service.description}
                    </p>
                  </div>
                  
                  <div className="flex justify-between items-center mt-3 pt-2 border-t border-border/30">
                    {/* <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      isFreeTodayAvailable 
                        ? 'bg-hanbok-gold/20 text-hanbok-gold-dark' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      <span className="mr-1 text-xs">{isFreeTodayAvailable ? '✨' : '🪙'}</span>
                      <span className="text-xs">{isFreeTodayAvailable ? '무료' : '유료'}</span>
                    </span> */}
                    
                    <Button 
                      size="sm" 
                      className="bg-ink-black dark:bg-ink-gray text-white dark:text-ink-black hover:bg-ink-gray dark:hover:bg-white transition-all duration-300 px-3 py-1 rounded-lg shadow-sm hover:shadow-md text-xs h-6"
                    >
                      시작
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* 이용 현황 통계 */}
      <div className="space-y-4">
        <h3 className="text-lg text-ink-black dark:text-ink-gray ink-brush">
          📊 나의 운세 여정
        </h3>
        <Card className="hanji-texture border border-hanbok-gold/20 p-6 rounded-2xl ink-shadow">
          <div className="grid grid-cols-2 gap-4">
            {services.map((service) => (
              <div 
                key={service.id} 
                className="text-center p-4 rounded-xl border border-border/50 hover:border-hanbok-gold/40 transition-all duration-300 hover:bg-hanbok-gold/5"
              >
                <div className="text-2xl mb-2">{service.icon}</div>
                <div className="text-2xl mb-1 text-hanbok-gold-dark font-bold">
                  {service.usageCount}
                </div>
                <div className="text-muted-foreground text-sm">
                  {service.title}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t border-border/50 text-center">
            <p className="text-muted-foreground text-sm leading-relaxed">
              지금까지 총 <span className="text-hanbok-gold-dark font-semibold">
                {Object.values(user.usageCount).reduce((a, b) => a + b, 0)}회
              </span>의 운세를 확인하셨습니다
            </p>
          </div>
        </Card>
      </div>

      {/* 공지사항 섹션 */}
      {/* <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg text-ink-black dark:text-ink-gray ink-brush">
            📢 공지사항
          </h3>
          <Button variant="ghost" size="sm" className="text-hanbok-gold-dark hover:bg-hanbok-gold/10">
            <span className="text-sm">전체보기</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        
        <div className="space-y-3">
          {notices.slice(0, 3).map((notice) => (
            <Card 
              key={notice.id}
              className="p-4 border border-border hover:border-hanbok-gold/40 transition-all duration-300 cursor-pointer rounded-xl hover:shadow-md"
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {notice.type === 'event' && <Gift className="w-4 h-4 text-dancheong-red" />}
                  {notice.type === 'update' && <Bell className="w-4 h-4 text-dancheong-blue" />}
                  {notice.type === 'notice' && <Megaphone className="w-4 h-4 text-dancheong-green" />}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-semibold truncate">
                      {notice.title}
                    </h4>
                    <Badge className={`text-xs px-2 py-0 ${notice.badgeColor}`}>
                      {notice.badge}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {notice.content}
                  </p>
                  <span className="text-xs text-muted-foreground mt-1 block">
                    {notice.date}
                  </span>
                </div>
                
                <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
              </div>
            </Card>
          ))}
        </div>
      </div> */}

      {/* 하단 광고 카드 */}
      {/* {showBottomAd && (
        <AdBanner 
          type="card" 
          onClose={() => setShowBottomAd(false)}
          className="mt-6"
        />
      )} */}
    </div>
  );
}