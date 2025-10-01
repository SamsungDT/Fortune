// ProfileScreen.tsx
import React, { useState, useEffect } from 'react';
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Switch } from "./ui/switch";
import { Alert, AlertDescription } from "./ui/alert";
import { User } from "../App";
import type { FortuneResult } from "../App"; // ← 타입만 가져오기
import { useTheme } from "./ThemeProvider";
import {
  Settings, Bell, Shield, HelpCircle, Star, Share2, Download, Trash2,
  ChevronRight, Moon, Sun, Smartphone, Volume2, VolumeX
} from 'lucide-react';

interface ProfileScreenProps {
  user: User;
  onLogout: () => void;
}

/* ====== Logout & API wiring ====== */
const API_BASE = '';
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

  // 🔹 API에서 받은 이름 (우선 사용)
  const [meName, setMeName] = useState<string>('');

  const [settings, setSettings] = useState({ autoBackup: false, shareUsage: true });
  const [userResults, setUserResults] = useState<FortuneResult[]>(user.results);
  const [stats, setStats] = useState({
    total: 0, physiognomy: 0, lifefortune: 0, dailyfortune: 0, dream: 0, paid: 0, free: 0,
  });
  const [loggingOut, setLoggingOut] = useState(false);

  // 🔹 이름 가져오기 (한 번만)
  useEffect(() => {
    const token =
      localStorage.getItem('accessToken') ||
      sessionStorage.getItem('accessToken');
    if (!token) return;

    let ignore = false;
    fetch(`${API_BASE}/api/info/me`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(json => {
        if (!ignore && json && typeof json.data === 'string') {
          setMeName(json.data.trim());
          try { localStorage.setItem('displayName', json.data.trim()); } catch { }
        }
      })
      .catch(() => { /* 실패 시 조용히 무시 (폴백 사용) */ });

    return () => { ignore = true; };
  }, []);

  // 🔹 최종 표시 이름: API 이름 > user.name / 저장값 > '사용자'
  const saved = (localStorage.getItem('userName') || '').trim();
  const emailLocal = (user.email || '').split('@')[0]?.trim() || '';
  const fallback =
    (user.name && !user.name.includes('@') && user.name.toLowerCase() !== emailLocal.toLowerCase())
      ? user.name
      : (saved && !saved.includes('@') && saved.toLowerCase() !== emailLocal.toLowerCase())
        ? saved
        : '사용자';
  const finalName = (meName && meName.trim()) || fallback;

  // ==================================================
  // 나의 결과 조회 API
  // ==================================================
  const fetchMyResults = async () => {
    try {
      const at = getAccessToken();
      if (!at) return;

      const res = await fetch(`${API_BASE}/api/fortune/statistics/findAll`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${at}`, 'Content-Type': 'application/json' },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const body: APIResponse<{
        total?: number; physiognomy?: number; lifefortune?: number; dailyfortune?: number; dream?: number;
        paid?: number; free?: number; results?: FortuneResult[];
      }> = await res.json();

      if (body.code === 200 && body.data) {
        if (body.data.results) setUserResults(body.data.results);
        const resData = body.data.results ?? userResults;

        setStats({
          total: body.data.total ?? resData.length,
          physiognomy: body.data.physiognomy ?? resData.filter(r => r.type === 'physiognomy').length,
          lifefortune: body.data.lifefortune ?? resData.filter(r => r.type === 'lifefortune').length,
          dailyfortune: body.data.dailyfortune ?? resData.filter(r => r.type === 'dailyfortune').length,
          dream: body.data.dream ?? resData.filter(r => r.type === 'dream').length,
          paid: body.data.paid ?? resData.filter(r => r.paid).length,
          free: body.data.free ?? resData.filter(r => !r.paid).length,
        });
      }
    } catch (err) {
      console.error('나의 결과 조회 실패:', err);
      const resData = userResults;
      setStats({
        total: resData.length,
        physiognomy: resData.filter(r => r.type === 'physiognomy').length,
        lifefortune: resData.filter(r => r.type === 'lifefortune').length,
        dailyfortune: resData.filter(r => r.type === 'dailyfortune').length,
        dream: resData.filter(r => r.type === 'dream').length,
        paid: resData.filter(r => r.paid).length,
        free: resData.filter(r => !r.paid).length,
      });
    }
  };

  useEffect(() => {
    const results = user.results;
    const newStats = {
      total: results.length,
      physiognomy: results.filter(r => r.type === 'physiognomy').length,
      lifefortune: results.filter(r => r.type === 'lifefortune').length,
      dailyfortune: results.filter(r => r.type === 'dailyfortune').length,
      dream: results.filter(r => r.type === 'dream').length,
      paid: results.filter(r => r.paid).length,
      free: results.filter(r => !r.paid).length,
    };
    setStats(newStats);
  }, [user.results]);

  // ==================================================
  // 로그아웃 처리
  // ==================================================
  const handleLogout = () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      const at = getAccessToken();
      if (at) {
        fetch(`${API_BASE}/api/security/common/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${at}` }
        }).catch(() => { });
      }
    } finally {
      clearTokens();
      setLoggingOut(false);
      onLogout();
    }
  };

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
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
              {/* 🔹 여기만 교체: user.name → finalName */}
              <h2 className="text-xl text-ink-black dark:text-ink-gray ink-brush font-semibold">{finalName}</h2>
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
              <Switch checked={isDark} onCheckedChange={toggleTheme} className="data-[state=checked]:bg-hanbok-gold" />
            </div>
          </div>
        </Card>

        {/* 전체 이용 통계 */}
        <Card className="border border-border p-5 rounded-2xl">
          <h3 className="text-lg mb-4 text-ink-black dark:text-ink-gray ink-brush">📊 나의 운세 여정</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 border border-border rounded-xl hover:border-hanbok-gold/40 transition-colors">
              <div className="text-2xl mb-2">👤</div>
              <div className="text-xl text-hanbok-gold-dark font-bold">{stats.physiognomy}</div>
              <div className="text-xs text-muted-foreground">관상</div>
            </div>
            <div className="text-center p-4 border border-border rounded-xl hover:border-hanbok-gold/40 transition-colors">
              <div className="text-2xl mb-2">🌟</div>
              <div className="text-xl text-hanbok-gold-dark font-bold">{stats.lifefortune}</div>
              <div className="text-xs text-muted-foreground">평생운세</div>
            </div>
            <div className="text-center p-4 border border-border rounded-xl hover:border-hanbok-gold/40 transition-colors">
              <div className="text-2xl mb-2">📅</div>
              <div className="text-xl text-hanbok-gold-dark font-bold">{stats.dailyfortune}</div>
              <div className="text-xs text-muted-foreground">오늘운세</div>
            </div>
            <div className="text-center p-4 border border-border rounded-xl hover:border-hanbok-gold/40 transition-colors">
              <div className="text-2xl mb-2">💭</div>
              <div className="text-xl text-hanbok-gold-dark font-bold">{stats.dream}</div>
              <div className="text-xs text-muted-foreground">해몽</div>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">총 이용 횟수</span>
            <span className="text-2xl text-hanbok-gold-dark font-bold">{stats.total}회</span>
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
