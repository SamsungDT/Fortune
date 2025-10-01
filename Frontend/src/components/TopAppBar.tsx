import React from 'react';
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface TopAppBarProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  showLogout?: boolean;
  onLogout?: () => void;
  userName?: string;
  rightAction?: React.ReactNode;
  showProfileButton?: boolean;
  onProfileClick?: () => void;
}

export function TopAppBar({ 
  title, 
  subtitle, 
  showBackButton = false, 
  onBack, 
  showLogout = false, 
  onLogout, 
  userName,
  rightAction,
  showProfileButton = false,
  onProfileClick
}: TopAppBarProps) {
  return (
    <div className="sticky top-0 z-50 bg-white/95 dark:bg-black/95 backdrop-blur-lg border-b border-hanbok-gold/20 ink-shadow">
      {/* 한국 전통 문양 배경 */}
      <div className="absolute inset-0 opacity-30">
        <div className="h-full w-full bg-gradient-to-r from-transparent via-hanbok-gold/5 to-transparent"></div>
      </div>
      
      <div className="relative flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4 flex-1">
          {showBackButton && (
            <Button 
              variant="ghost" 
              onClick={onBack} 
              className="h-10 w-10 rounded-full border border-hanbok-gold/30 text-ink-black dark:text-ink-gray hover:bg-hanbok-gold/10 hover:border-hanbok-gold/60 transition-all duration-300 p-0 flex items-center justify-center"
            >
              <span className="text-lg">←</span>
            </Button>
          )}
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-xl text-ink-black dark:text-ink-gray ink-brush truncate font-semibold">
                {title}
              </h1>
              {/* {userName && (
                <Badge className="bg-hanbok-gold/20 text-hanbok-gold-dark border border-hanbok-gold/40 rounded-full px-3 py-1 text-xs font-medium">
                  {userName}
                </Badge>
              )} */}
            </div>
            {subtitle && (
              <p className="text-sm text-muted-foreground truncate leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {rightAction}
          {showProfileButton && (
            <Button 
              variant="ghost" 
              onClick={onProfileClick} 
              className="h-10 w-10 rounded-full border border-hanbok-gold/30 text-hanbok-gold-dark hover:bg-hanbok-gold/10 hover:border-hanbok-gold/60 transition-all duration-300 p-0 flex items-center justify-center"
              title="프로필"
            >
              <span className="text-lg">👤</span>
            </Button>
          )}
          {showLogout && (
            <Button 
              variant="ghost" 
              onClick={onLogout} 
              className="h-10 w-10 rounded-full border border-dancheong-red/30 text-dancheong-red hover:bg-dancheong-red/10 hover:border-dancheong-red/60 transition-all duration-300 p-0 flex items-center justify-center"
              title="로그아웃"
            >
              <span className="text-lg">🚪</span>
            </Button>
          )}
        </div>
      </div>
      
      {/* 한국 전통 장식선 - 붓터치 효과 */}
      <div className="relative h-1">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-hanbok-gold/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-hanbok-gold-light/40 to-transparent transform scale-y-50"></div>
      </div>
    </div>
  );
}