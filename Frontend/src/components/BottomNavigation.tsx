import React from 'react';
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface BottomNavigationProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  user?: {
    results: any[];
    dailyFreeUsage: {
      physiognomy: boolean;
      lifefortune: boolean;
      dailyfortune: boolean;
      dream: boolean;
    };
  };
}

export function BottomNavigation({ currentScreen, onNavigate, user }: BottomNavigationProps) {
  const navigationItems = [
    {
      id: 'dashboard',
      label: '홈',
      icon: '🏮',
      activeIcon: '🏮',
    },
    {
      id: 'myresults',
      label: '내 결과',
      icon: '📜',
      activeIcon: '📜',
      badge: user?.results?.length || 0
    },
    // {
    //   id: 'support',
    //   label: '후원하기',
    //   icon: '💝',
    //   activeIcon: '💝',
    // },
    {
      id: 'profile',
      label: '프로필',
      icon: '👤',
      activeIcon: '👤',
    }
  ];

  // 서비스 화면들을 dashboard로 그룹화
  const serviceScreens = ['physiognomy', 'lifefortune', 'dailyfortune', 'dream'];
  const currentTab = serviceScreens.includes(currentScreen) ? 'dashboard' : currentScreen;

  return (
    <div
      className="
      fixed
      bottom-0
      left-1/2 -translate-x-1/2
      w-full max-w-md
      z-50
    "
    >
      {/* 한국 전통 장식선 - 붓터치 효과 */}
      <div className="relative h-1">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-hanbok-gold/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-hanbok-gold-light/40 to-transparent transform scale-y-50"></div>
      </div>

      <div className="bg-white/95 dark:bg-black/95 backdrop-blur-lg border-t border-hanbok-gold/20">
        <div className="absolute inset-0 opacity-20">
          <div className="h-full w-full bg-gradient-to-t from-hanbok-gold/5 to-transparent"></div>
        </div>

        <div className="relative flex justify-around items-center py-3 px-2 pb-[calc(12px+env(safe-area-inset-bottom))]">
          {navigationItems.map((item) => {
            const isActive = currentTab === item.id;

            return (
              <Button
                key={item.id}
                variant="ghost"
                onClick={() => onNavigate(item.id)}
                className={`group flex flex-col items-center gap-2 p-3 h-auto rounded-2xl min-w-0 flex-1 relative transition-all duration-300 ${isActive
                    ? 'text-hanbok-gold-dark bg-hanbok-gold/10 border border-hanbok-gold/30'
                    : 'text-muted-foreground hover:text-ink-black dark:hover:text-ink-gray hover:bg-hanbok-gold/5'
                  }`}
              >
                <div className="relative">
                  <span
                    className={`text-xl transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-105'
                      }`}
                  >
                    {isActive ? item.activeIcon : item.icon}
                  </span>

                  {item.badge !== undefined && item.badge > 0 && (
                    <Badge className="absolute -top-1 -right-1 bg-dancheong-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center p-0 border-2 border-white dark:border-black shadow-lg">
                      {item.badge > 99 ? '99+' : item.badge}
                    </Badge>
                  )}
                </div>

                <span
                  className={`text-xs truncate w-full text-center font-medium transition-all duration-300 ${isActive ? 'text-hanbok-gold-dark' : ''
                    }`}
                >
                  {item.label}
                </span>

                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                    <div className="w-2 h-2 bg-hanbok-gold rounded-full shadow-md"></div>
                  </div>
                )}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );

}
