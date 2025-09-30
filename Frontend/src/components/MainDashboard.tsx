// MainDashboard.tsx
import React, { useState } from 'react';
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { User } from "../App";
import { ImageWithFallback } from './figma/ImageWithFallback';
import { TrendingUp, Loader2 } from 'lucide-react';

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
  appStats: AppStats | null;
  appStatsLoading: boolean;
  onServiceSelect: (service: string) => void;
  onViewMyResults: () => void;
  onLogout: () => void;
}

export function MainDashboard({
  user, appStats, appStatsLoading, onServiceSelect, onViewMyResults
}: MainDashboardProps) {

  // 인사말 표시 이름 (이메일 로컬 파트는 절대 사용 X)
  const saved = (localStorage.getItem('userName') || '').trim();
  const emailLocal = (user.email || '').split('@')[0]?.trim() || '';
  const displayName =
    (user.name && !user.name.includes('@') && user.name.toLowerCase() !== emailLocal.toLowerCase())
      ? user.name
      : (saved && !saved.includes('@') && saved.toLowerCase() !== emailLocal.toLowerCase())
        ? saved
        : '사용자';

  const services = [
    {
      id: 'physiognomy', title: '관상', description: 'AI가 분석하는 얼굴 관상', icon: '👤',
      image: 'https://images.unsplash.com/photo-1602015521560-54cae4574e07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      usageCount: user.usageCount.physiognomy
    },
    {
      id: 'lifefortune', title: '평생 운세', description: '생년월일로 보는 인생 운세', icon: '🌟',
      image: 'https://images.unsplash.com/photo-1705751668509-b3ca0953582c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      usageCount: user.usageCount.lifefortune
    },
    {
      id: 'dailyfortune', title: '오늘의 운세', description: '오늘 하루의 운세와 조언', icon: '📅',
      image: 'https://images.unsplash.com/photo-1740375699674-1b097b4cf7f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      usageCount: user.usageCount.dailyfortune
    },
    {
      id: 'dream', title: '해몽', description: '꿈의 의미를 AI가 해석', icon: '💭',
      image: 'https://images.unsplash.com/photo-1661430391787-6fd01434cea1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      usageCount: user.usageCount.dream
    }
  ];

  return (
    <div className="p-6 space-y-6">

      {/* 환영 인사 */}
      <div className="hanji-texture rounded-2xl p-6 border border-hanbok-gold/20 ink-shadow">
        <div className="text-center space-y-3">
          <div className="text-2xl">🌟</div>
          <h2 className="text-xl text-ink-black dark:text-ink-gray ink-brush">
            안녕하세요, {displayName}님
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            오늘도 좋은 기운이 함께하길 바랍니다
          </p>
        </div>
      </div>

      {/* 전체 통계 */}
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

      {/* 서비스 카드 그리드 */}
      <div className="space-y-4 mb-10">
        <div className="flex items-center justify-between">
          <h3 className="text-lg text-ink-black dark:text-ink-gray ink-brush">🔮 운세 서비스</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {services.map((service) => (
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
                <div className="absolute top-3 right-3">
                  <div className="text-2xl drop-shadow-2xl filter brightness-110">{service.icon}</div>
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

                <div className="flex justify-end mt-3 pt-2 border-t border-border/30">
                  <Button
                    size="sm"
                    className="bg-ink-black dark:bg-ink-gray text-white dark:text-ink-black hover:bg-ink-gray dark:hover:bg-white transition-all duration-300 px-3 py-1 rounded-lg shadow-sm hover:shadow-md text-xs h-6"
                  >
                    시작
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* 이용 현황 */}
      {/* <div className="space-y-4">
        <h3 className="text-lg text-ink-black dark:text-ink-gray ink-brush">📊 나의 운세 여정</h3>
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
                <div className="text-muted-foreground text-sm">{service.title}</div>
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
      </div> */}
    </div>
  );
}
