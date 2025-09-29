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

/* ====== Logout API wiring ====== */
const API_BASE = 'http://localhost:8080';
type APIResponse<T> = { code: number; message: string; data: T | null };

function getAccessToken() {
  return localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
}
function clearTokens() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  sessionStorage.removeItem('accessToken');
  sessionStorage.removeItem('refreshToken');
}

export function ProfileScreen({ user, onLogout }: ProfileScreenProps) {
  const { isDark, toggleTheme } = useTheme();
  const [settings, setSettings] = useState({
    autoBackup: false,
    shareUsage: true
  });
  const [loggingOut, setLoggingOut] = useState(false);

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      const at = getAccessToken();
      if (at) {
        await fetch(`${API_BASE}/api/security/common/logout`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${at}`, // 액세스 토큰로 로그아웃
          },
        }).catch(() => {}); // 네트워크 에러여도 토큰 정리는 진행
      }
    } finally {
      clearTokens(); // 200/401 상관없이 정리
      setLoggingOut(false);
      onLogout?.();  // 라우팅/상태 초기화는 부모에서
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
                {user.isPremium && (
                  <Badge className="bg-hanbok-gold text-ink-black">
                    후원자
                  </Badge>
                )}
              </div>
            </div>
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
          </div>
        </Card>

        {/* 데이터 관리 */}
        <Card className="border border-border p-5 rounded-2xl">
          <h3 className="text-lg mb-4 text-ink-black dark:text-ink-gray ink-brush">🗂️ 데이터 관리</h3>
          <div className="space-y-3">            
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
            onClick={handleLogout}
            disabled={loggingOut}
            variant="outline"
            className="w-full border-2 border-dancheong-red/40 text-dancheong-red hover:bg-dancheong-red hover:text-white py-4 rounded-2xl font-medium disabled:opacity-60"
          >
            {loggingOut ? '로그아웃 중...' : '🚪 로그아웃'}
          </Button>
        </div>
      </div>
    </div>
  );
}
