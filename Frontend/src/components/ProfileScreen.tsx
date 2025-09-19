import React, { useState } from 'react';
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Switch } from "./ui/switch";
import { Alert, AlertDescription } from "./ui/alert";
import { User } from "../App";
import { useTheme } from "./ThemeProvider";
import { 
  Settings, 
  Bell, 
  Shield, 
  HelpCircle, 
  Star, 
  Share2, 
  Download,
  Trash2,
  ChevronRight,
  Moon,
  Sun,
  Smartphone,
  Volume2,
  VolumeX
} from 'lucide-react';

interface ProfileScreenProps {
  user: User;
  onLogout: () => void;
}

export function ProfileScreen({ user, onLogout }: ProfileScreenProps) {
  const { isDark, toggleTheme } = useTheme();
  const [settings, setSettings] = useState({
    notifications: true,
    sound: true,
    vibration: true,
    autoBackup: false,
    shareUsage: true
  });

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };
  const getProviderName = (provider: string) => {
    switch (provider) {
      case 'kakao': return '카카오';
      case 'naver': return '네이버';
      case 'google': return '구글';
      case 'email': return '이메일';
      default: return provider;
    }
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'kakao': return '💬';
      case 'naver': return '🟢';
      case 'google': return '🔍';
      case 'email': return '✉️';
      default: return '👤';
    }
  };

  const totalUsage = Object.values(user.usageCount).reduce((sum, count) => sum + count, 0);
  const todayFreeUsed = Object.values(user.dailyFreeUsage).filter(used => used).length - 1; // -1 for date field
  const availableFreeToday = 4 - todayFreeUsed;

  return (
    <div className="min-h-screen pb-20 bg-white dark:bg-black">
      <div className="p-6 space-y-6">
        {/* 프로필 정보 */}
        <Card className="hanji-texture border border-hanbok-gold/20 p-6 rounded-2xl ink-shadow">
          <div className="text-center space-y-4">
            <div className="relative">
              <div className="w-24 h-24 bg-hanbok-gold/20 border-2 border-hanbok-gold/40 mx-auto flex items-center justify-center text-4xl rounded-full">
                {getProviderIcon(user.loginProvider)}
              </div>
              {user.isPremium && (
                <div className="absolute -top-1 -right-1 w-8 h-8 bg-hanbok-gold rounded-full flex items-center justify-center">
                  <span className="text-ink-black text-lg">👑</span>
                </div>
              )}
            </div>
            
            <div>
              <h2 className="text-xl text-ink-black dark:text-ink-gray ink-brush font-semibold">{user.name}</h2>
              <p className="text-muted-foreground text-sm">{user.email}</p>
              <div className="flex items-center justify-center gap-2 mt-3">
                <Badge className="bg-hanbok-gold/20 text-hanbok-gold-dark border border-hanbok-gold/40">
                  {getProviderName(user.loginProvider)} 로그인
                </Badge>
                {user.isPremium && (
                  <Badge className="bg-hanbok-gold text-ink-black">
                    후원자
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* 오늘의 이용 현황 */}
        <Card className="border border-border p-5 rounded-2xl">
          <h3 className="text-lg mb-4 text-ink-black dark:text-ink-gray ink-brush">✨ 오늘의 이용 현황</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">무료 이용 가능</span>
              <Badge className="bg-hanbok-gold/20 text-hanbok-gold-dark border border-hanbok-gold/40">
                {availableFreeToday}회 남음
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">오늘 이용한 서비스</span>
              <span className="text-hanbok-gold-dark font-semibold">{todayFreeUsed}회</span>
            </div>
            {user.isPremium && (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">후원 상태</span>
                <span className="text-hanbok-gold-dark font-semibold text-sm">{user.premiumExpiry}</span>
              </div>
            )}
          </div>
        </Card>

        {/* 설정 섹션 */}
        <Card className="border border-border p-5 rounded-2xl">
          <h3 className="text-lg mb-4 text-ink-black dark:text-ink-gray ink-brush flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            설정
          </h3>
          
          <div className="space-y-4">
            {/* 테마 설정 */}
            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-hanbok-gold/5 transition-colors">
              <div className="flex items-center space-x-3">
                {isDark ? <Moon className="w-5 h-5 text-hanbok-gold-dark" /> : <Sun className="w-5 h-5 text-hanbok-gold-dark" />}
                <div>
                  <p className="text-sm font-medium text-ink-black dark:text-ink-gray">다크 모드</p>
                  <p className="text-xs text-muted-foreground">어두운 테마로 변경</p>
                </div>
              </div>
              <Switch 
                checked={isDark} 
                onCheckedChange={toggleTheme}
                className="data-[state=checked]:bg-hanbok-gold"
              />
            </div>

            {/* 알림 설정 */}
            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-hanbok-gold/5 transition-colors">
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5 text-hanbok-gold-dark" />
                <div>
                  <p className="text-sm font-medium text-ink-black dark:text-ink-gray">푸시 알림</p>
                  <p className="text-xs text-muted-foreground">운세 알림 받기</p>
                </div>
              </div>
              <Switch 
                checked={settings.notifications} 
                onCheckedChange={(checked) => handleSettingChange('notifications', checked)}
                className="data-[state=checked]:bg-hanbok-gold"
              />
            </div>

            {/* 사운드 설정 */}
            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-hanbok-gold/5 transition-colors">
              <div className="flex items-center space-x-3">
                {settings.sound ? <Volume2 className="w-5 h-5 text-hanbok-gold-dark" /> : <VolumeX className="w-5 h-5 text-hanbok-gold-dark" />}
                <div>
                  <p className="text-sm font-medium text-ink-black dark:text-ink-gray">사운드</p>
                  <p className="text-xs text-muted-foreground">효과음 및 알림음</p>
                </div>
              </div>
              <Switch 
                checked={settings.sound} 
                onCheckedChange={(checked) => handleSettingChange('sound', checked)}
                className="data-[state=checked]:bg-hanbok-gold"
              />
            </div>

            {/* 진동 설정 */}
            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-hanbok-gold/5 transition-colors">
              <div className="flex items-center space-x-3">
                <Smartphone className="w-5 h-5 text-hanbok-gold-dark" />
                <div>
                  <p className="text-sm font-medium text-ink-black dark:text-ink-gray">진동</p>
                  <p className="text-xs text-muted-foreground">알림 시 진동</p>
                </div>
              </div>
              <Switch 
                checked={settings.vibration} 
                onCheckedChange={(checked) => handleSettingChange('vibration', checked)}
                className="data-[state=checked]:bg-hanbok-gold"
              />
            </div>
          </div>
        </Card>

        {/* 전체 이용 통계 */}
        <Card className="border border-border p-5 rounded-2xl">
          <h3 className="text-lg mb-4 text-ink-black dark:text-ink-gray ink-brush">📊 전체 이용 통계</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 border border-border rounded-xl hover:border-hanbok-gold/40 transition-colors">
              <div className="text-2xl mb-2">👤</div>
              <div className="text-xl text-hanbok-gold-dark font-bold">{user.usageCount.physiognomy}</div>
              <div className="text-xs text-muted-foreground">관상</div>
            </div>
            <div className="text-center p-4 border border-border rounded-xl hover:border-hanbok-gold/40 transition-colors">
              <div className="text-2xl mb-2">🌟</div>
              <div className="text-xl text-hanbok-gold-dark font-bold">{user.usageCount.lifefortune}</div>
              <div className="text-xs text-muted-foreground">평생운세</div>
            </div>
            <div className="text-center p-4 border border-border rounded-xl hover:border-hanbok-gold/40 transition-colors">
              <div className="text-2xl mb-2">📅</div>
              <div className="text-xl text-hanbok-gold-dark font-bold">{user.usageCount.dailyfortune}</div>
              <div className="text-xs text-muted-foreground">오늘운세</div>
            </div>
            <div className="text-center p-4 border border-border rounded-xl hover:border-hanbok-gold/40 transition-colors">
              <div className="text-2xl mb-2">💭</div>
              <div className="text-xl text-hanbok-gold-dark font-bold">{user.usageCount.dream}</div>
              <div className="text-xs text-muted-foreground">해몽</div>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">총 이용 횟수</span>
            <span className="text-2xl text-hanbok-gold-dark font-bold">{totalUsage}회</span>
          </div>
        </Card>

        {/* 기타 메뉴 */}
        <Card className="border border-border rounded-2xl overflow-hidden">
          <div className="divide-y divide-border">
            <button className="w-full flex items-center justify-between p-4 hover:bg-hanbok-gold/5 transition-colors">
              <div className="flex items-center space-x-3">
                <Star className="w-5 h-5 text-hanbok-gold-dark" />
                <span className="text-ink-black dark:text-ink-gray">앱 평가하기</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
            
            <button className="w-full flex items-center justify-between p-4 hover:bg-hanbok-gold/5 transition-colors">
              <div className="flex items-center space-x-3">
                <Share2 className="w-5 h-5 text-hanbok-gold-dark" />
                <span className="text-ink-black dark:text-ink-gray">앱 공유하기</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
            
            <button className="w-full flex items-center justify-between p-4 hover:bg-hanbok-gold/5 transition-colors">
              <div className="flex items-center space-x-3">
                <HelpCircle className="w-5 h-5 text-hanbok-gold-dark" />
                <span className="text-ink-black dark:text-ink-gray">고객지원</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
            
            <button className="w-full flex items-center justify-between p-4 hover:bg-hanbok-gold/5 transition-colors">
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-hanbok-gold-dark" />
                <span className="text-ink-black dark:text-ink-gray">개인정보처리방침</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </Card>

        {/* 앱 정보 */}
        <Card className="border border-border p-5 rounded-2xl">
          <h3 className="text-lg mb-4 text-ink-black dark:text-ink-gray ink-brush">ℹ️ 앱 정보</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">앱 버전</span>
              <span className="text-ink-black dark:text-ink-gray font-medium">2.1.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">저장된 결과</span>
              <span className="text-ink-black dark:text-ink-gray font-medium">{user.results.length}개</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">가입일</span>
              <span className="text-ink-black dark:text-ink-gray font-medium">2024.12.15</span>
            </div>
          </div>
        </Card>

        {/* 데이터 관리 */}
        <Card className="border border-border p-5 rounded-2xl">
          <h3 className="text-lg mb-4 text-ink-black dark:text-ink-gray ink-brush">🗂️ 데이터 관리</h3>
          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start border-hanbok-gold/30 hover:bg-hanbok-gold/10"
            >
              <Download className="w-4 h-4 mr-2" />
              내 데이터 내보내기
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start border-dancheong-red/30 text-dancheong-red hover:bg-dancheong-red/10"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              모든 데이터 삭제
            </Button>
          </div>
        </Card>

        {/* 로그아웃 */}
        <div className="pt-4">
          <Button 
            onClick={onLogout}
            variant="outline"
            className="w-full border-2 border-dancheong-red/40 text-dancheong-red hover:bg-dancheong-red hover:text-white py-4 rounded-2xl font-medium"
          >
            🚪 로그아웃
          </Button>
        </div>
      </div>
    </div>
  );
}