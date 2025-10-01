// App.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { LoginScreen } from "./components/LoginScreen";
import { SignupScreen } from "./components/SignupScreen";
import { UserInfoScreen } from "./components/UserInfoScreen";
import { MainDashboard } from "./components/MainDashboard";
import { PhysiognomyService } from "./components/PhysiognomyService";
import { LifeFortuneService } from "./components/LifeFortuneService";
import { DailyFortuneService } from "./components/DailyFortuneService";
import { DreamInterpretationService } from "./components/DreamInterpretationService";
import { ResultScreen } from "./components/ResultScreen";
import { PaymentScreen } from "./components/PaymentScreen";
import { MyResultsScreen } from "./components/MyResultsScreen";
import { TopAppBar } from "./components/TopAppBar";
import { BottomNavigation } from "./components/BottomNavigation";
import { ProfileScreen } from './components/ProfileScreen';
import { SupportScreen } from "./components/SupportScreen";
import { ThemeProvider } from "./components/ThemeProvider";

// ==============================
// API
// ==============================
const API_BASE = '';
const APP_STATS_URL = `${API_BASE}/api/fortune/statistics`;
const MY_RESULTS_URL = `${API_BASE}/api/fortune/statistics/findAll`;

// ==============================
// Types
// ==============================
interface StatisticsResponseData {
  totalUsers: number;
  faceResultCount: number;
  lifeLongResultCount: number;
  dailyFortuneResultCount: number;
  dreamInterpretationResultCount: number;
}

type APIResponse<T> = {
  code: string | number;
  message: string;
  data: T | null;
};

export interface AppStats {
  totalUsers: number;
  totalReadings: number;
  physiognomyCount: number;
  lifeFortuneCount: number;
  dailyFortuneCount: number;
  dreamCount: number;
}

const MOCK_APP_STATS: AppStats = {
  totalUsers: 12847,
  totalReadings: 89235,
  physiognomyCount: 28459,
  lifeFortuneCount: 18237,
  dailyFortuneCount: 32146,
  dreamCount: 10393
};

export interface User {
  id: string;
  name: string;     // 진짜 이름 (이메일X)
  email: string;
  loginProvider: string;
  birthDate?: string;
  birthTime?: string;
  isPremium?: boolean;
  premiumExpiry?: string;
  usageCount: {
    physiognomy: number;
    lifefortune: number;
    dailyfortune: number;
    dream: number;
  };
  dailyFreeUsage: {
    date: string;
    physiognomy: boolean;
    lifefortune: boolean;
    dailyfortune: boolean;
    dream: boolean;
  };
  results: FortuneResult[];
}

export interface FortuneResult {
  id: string;
  type: 'physiognomy' | 'lifefortune' | 'dailyfortune' | 'dream';
  title: string;
  content: string;
  date: string;
  paid: boolean;
}

type Screen =
  | 'login' | 'signup' | 'userinfo' | 'dashboard'
  | 'physiognomy' | 'lifefortune' | 'dailyfortune' | 'dream'
  | 'result' | 'payment' | 'myresults' | 'profile' | 'support';

// ==============================
// Name helpers (이메일 로컬 파트는 버림)
// ==============================
const emailLocal = (email?: string) => (email || '').split('@')[0]?.trim() || '';
const pickDisplayName = (u?: User | null) => {
  const saved = (localStorage.getItem('userName') || '').trim();
  const uName = (u?.name || '').trim();
  const eLocal = emailLocal(u?.email);

  // 이메일 모양/이메일 로컬과 동일한 값은 제외
  const cands = [uName, saved].filter(Boolean);
  for (const c of cands) {
    if (!c.includes('@') && c.toLowerCase() !== eLocal.toLowerCase()) return c;
  }
  return '';
};

// ==============================
// App
// ==============================
function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [user, setUser] = useState<User | null>(null);
  const [currentResult, setCurrentResult] = useState<FortuneResult | null>(null);
  const [pendingService, setPendingService] = useState<string>('');

  // 통계
  const [appStats, setAppStats] = useState<AppStats | null>(null);
  const [appStatsLoading, setAppStatsLoading] = useState(true);

  // 통계 조회
  const fetchAppStats = useCallback(async () => {
    setAppStatsLoading(true);
    try {
      const res = await fetch(APP_STATS_URL, { headers: { Accept: 'application/json' } });
      let body: APIResponse<StatisticsResponseData> | null = null;
      try { body = await res.json(); } catch { }

      const ok = res.ok && body && (body.code === '200' || body.code === 200) && body.data;
      if (!ok || !body?.data) { setAppStats(MOCK_APP_STATS); return; }

      const d = body.data;
      const face = Number(d.faceResultCount ?? 0);
      const life = Number(d.lifeLongResultCount ?? 0);
      const daily = Number(d.dailyFortuneResultCount ?? 0);
      const dream = Number(d.dreamInterpretationResultCount ?? 0);

      setAppStats({
        totalUsers: Number(d.totalUsers ?? 0),
        totalReadings: face + life + daily + dream,
        physiognomyCount: face,
        lifeFortuneCount: life,
        dailyFortuneCount: daily,
        dreamCount: dream,
      });
    } catch {
      setAppStats(MOCK_APP_STATS);
    } finally {
      setAppStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentScreen === 'dashboard' || currentScreen === 'login') {
      fetchAppStats(); // 대시보드 들어올 때마다 새로고침
    }
  }, [currentScreen, fetchAppStats]);

  // 회원가입 → 로그인 재사용
  const handleSignup = (signupData: any) => handleLogin(signupData);

  // 유저정보 완료(현재 화면 폼은 이름 미포함이므로 기존 이름 유지)
  const handleUserInfoComplete = (userInfoData: any) => {
    if (!user) return;
    const updatedUser = {
      ...user,
      // 이름은 유지 (혹시 name을 보내주면 반영)
      name: (userInfoData?.name || user.name),
      birthDate: userInfoData.birthDate,
      birthTime: userInfoData.birthTime
    };
    setUser(updatedUser);
    // 전달된 이름이 있으면 저장
    if (userInfoData?.name && !userInfoData.name.includes('@')) {
      localStorage.setItem('userName', userInfoData.name);
    }
    setCurrentScreen('dashboard');
  };

  // 로그인
  const handleLogin = async (loginData: any) => {
    const today = new Date().toDateString();

    // 이름 결정: providerName(이메일 모양X) → 저장된 이름 → 없으면 빈 문자열
    const storedNameRaw = (localStorage.getItem('userName') || '').trim();
    const eLocal = emailLocal(loginData?.email);
    const validStoredName =
      storedNameRaw && !storedNameRaw.includes('@') && storedNameRaw.toLowerCase() !== eLocal.toLowerCase()
        ? storedNameRaw : '';

    const rawProviderName = (loginData?.name ?? loginData?.realName ?? loginData?.profile?.name ?? '').toString().trim();
    const providerName =
      rawProviderName && !rawProviderName.includes('@') && rawProviderName.toLowerCase() !== eLocal.toLowerCase()
        ? rawProviderName : '';

    const finalName = providerName || validStoredName || '사용자';
    if (finalName !== '사용자') localStorage.setItem('userName', finalName);

    const newUser: User = {
      id: Date.now().toString(),
      name: finalName,
      email: loginData.email,
      loginProvider: loginData.provider,
      birthDate: loginData.birthDate || undefined,
      birthTime: loginData.birthTime || undefined,
      isPremium: false,
      premiumExpiry: undefined,
      usageCount: { physiognomy: 0, lifefortune: 0, dailyfortune: 0, dream: 0 },
      dailyFreeUsage: { date: today, physiognomy: false, lifefortune: false, dailyfortune: false, dream: false },
      results: []
    };
    setUser(newUser);

    // (선택) 내 결과 불러오기
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) throw new Error('no token');
      const res = await fetch(MY_RESULTS_URL, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${accessToken}`, 'Accept': 'application/json' }
      });
      const body: APIResponse<any> = await res.json().catch(() => ({ code: 0, message: '', data: null }));
      if ((body.code === '200' || body.code === 200) && body.data && Array.isArray(body.data?.results)) {
        const mappedResults: FortuneResult[] = body.data.results.map((r: any) => {
          const type: FortuneResult['type'] =
            r.resultType === 'FACE' ? 'physiognomy' :
              r.resultType === 'LIFE_LONG' ? 'lifefortune' :
                r.resultType === 'DAILY' ? 'dailyfortune' :
                  r.resultType === 'DREAM' ? 'dream' : 'dailyfortune';
          const date = (r.createdAt?.split?.('T')?.[0] ?? r.date ?? '').replace(/-/g, '.');
          const title =
            type === 'physiognomy' ? '관상 분석 결과' :
              type === 'lifefortune' ? '평생 운세 분석 결과' :
                type === 'dailyfortune' ? `${date} 오늘의 운세` :
                  '꿈 해몽 결과';
          return {
            id: String(r.resultId ?? r.id ?? Date.now()),
            type, title,
            content: r.content ?? '...',
            date: date || ' ',
            paid: !!r.paid
          };
        });
        newUser.results = mappedResults;
        setUser({ ...newUser });
      }
    } catch { }

    // 이름이 ‘사용자’면 추가정보(이름 입력하도록 화면 구성 시)로 보낼 수 있음
    setCurrentScreen(loginData.provider === 'email' ? 'dashboard' : 'userinfo');
  };

  // 서비스 핸들러들
  const handleServiceSelect = (service: string) => setCurrentScreen(service as Screen);

  const handleServiceResult = (result: FortuneResult, serviceType: string) => {
    if (!user) return;
    const today = new Date().toDateString();
    const updatedUser = { ...user };

    if (updatedUser.dailyFreeUsage.date !== today) {
      updatedUser.dailyFreeUsage = { date: today, physiognomy: false, lifefortune: false, dailyfortune: false, dream: false };
    }

    updatedUser.usageCount[serviceType as keyof typeof user.usageCount]++;
    const hasUsedFreeToday = updatedUser.dailyFreeUsage[serviceType as keyof typeof updatedUser.dailyFreeUsage];

    if (!hasUsedFreeToday) {
      updatedUser.dailyFreeUsage[serviceType as keyof typeof updatedUser.dailyFreeUsage] = true;
      result.paid = false;
      updatedUser.results = Array.isArray(updatedUser.results) ? [...updatedUser.results, result] : [result];
      setUser(updatedUser);
      setCurrentResult(result);
      setCurrentScreen('result');
    } else {
      setPendingService(serviceType);
      setCurrentResult(result);
      setCurrentScreen('payment');
    }
  };

  const handlePaymentComplete = () => {
    if (!user || !currentResult) return;
    const updatedUser = { ...user };
    currentResult.paid = true;
    updatedUser.results = Array.isArray(updatedUser.results) ? [...updatedUser.results, currentResult] : [currentResult];
    setUser(updatedUser);
    setCurrentScreen('result');
  };

  const handleBackToDashboard = () => { setCurrentScreen('dashboard'); setCurrentResult(null); setPendingService(''); };
  const handleViewMyResults = () => setCurrentScreen('myresults');
  const handleLogout = () => { 
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    // 혹시 fortune:token 쓴 흔적이 남아있다면 이것도 지워주면 안전
    localStorage.removeItem('fortune:token');
    setUser(null); 
    setCurrentScreen('login');
    setCurrentResult(null); 
    setPendingService('');
   };
  const handleBottomNavigation = (screen: string) => { setCurrentScreen(screen as Screen); setCurrentResult(null); setPendingService(''); };
  const handleSupportPurchase = (planType: 'monthly' | 'yearly') => {
    if (!user) return;
    alert(`${planType === 'monthly' ? '월간' : '연간'} 후원을 시작합니다! 감사합니다 🙏`);
    const updatedUser = { ...user, isPremium: true, premiumExpiry: '영구 프리미엄' };
    setUser(updatedUser);
  };

  // 앱바
  const getAppBarProps = () => {
    switch (currentScreen) {
      case 'login':
      case 'signup':
      case 'userinfo':
        return null;
      case 'dashboard':
        return {
          title: 'Fortune K.I',
          subtitle: 'AI가 알려주는 나만의 운세',
          userName: pickDisplayName(user) || '사용자',
          showProfileButton: true,
          onProfileClick: () => setCurrentScreen('profile')
        };
      case 'physiognomy': return { title: '👤 관상 분석', subtitle: 'AI가 얼굴을 분석해 운세를 알려드립니다', showBackButton: true, onBack: handleBackToDashboard };
      case 'lifefortune': return { title: '🌟 평생 운세', subtitle: '생년월일로 알아보는 평생의 운세', showBackButton: true, onBack: handleBackToDashboard };
      case 'dailyfortune': return { title: '📅 오늘의 운세', subtitle: '오늘 하루의 운세를 확인해보세요', showBackButton: true, onBack: handleBackToDashboard };
      case 'dream': return { title: '💭 해몽', subtitle: '꿈의 의미를 AI가 해석해드립니다', showBackButton: true, onBack: handleBackToDashboard };
      case 'result': {
        const isDaily = currentResult?.type === 'dailyfortune';
        return {
          title: isDaily ? '오늘의 운세' : (currentResult?.title || '결과'),
          subtitle: currentResult?.date,
          showBackButton: true,
          onBack: handleBackToDashboard
        };
      }
      case 'payment': return { title: '💳 결제', subtitle: '운세 서비스 이용권을 구매해주세요', showBackButton: true, onBack: handleBackToDashboard };
      case 'myresults': return { title: '📜 내 결과', subtitle: '지금까지의 운세 결과를 모아봤어요', showBackButton: true, onBack: () => setCurrentScreen('dashboard') };
      case 'profile': return { title: '👤 프로필', subtitle: '내 정보 및 이용 현황', showBackButton: true, onBack: () => setCurrentScreen('dashboard') };
      case 'support': return { title: '💝 개발자 후원', subtitle: user?.isPremium ? '후원해주셔서 감사합니다' : '개발자를 응원해주세요', showBackButton: true, onBack: () => setCurrentScreen('dashboard') };
      default: return { title: 'Fortune K.I', showBackButton: true, onBack: handleBackToDashboard };
    }
  };

  const shouldShowBottomNav = !['login', 'signup', 'userinfo', 'result', 'payment'].includes(currentScreen);
  const appBarProps = getAppBarProps();

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-black max-w-md mx-auto relative oriental-pattern flex flex-col">
        {appBarProps && <TopAppBar {...appBarProps} />}

        <div className={`flex-1 ${shouldShowBottomNav ? 'pb-16' : ''}`}>
          {currentScreen === 'login' && (
            <LoginScreen
              onLogin={handleLogin}
              appStats={appStats}
              onGoToSignup={() => setCurrentScreen('signup')}
            />
          )}

          {currentScreen === 'signup' && (
            <SignupScreen
              onSignup={handleSignup}
              appStats={appStats}
              onGoToLogin={() => setCurrentScreen('login')}
            />
          )}

          {currentScreen === 'userinfo' && user && (
            <UserInfoScreen
              user={user}
              onComplete={handleUserInfoComplete}
            />
          )}

          {currentScreen === 'dashboard' && user && (
            <MainDashboard
              user={user}
              appStats={appStats}
              appStatsLoading={appStatsLoading}
              onServiceSelect={handleServiceSelect}
              onViewMyResults={handleViewMyResults}
              onLogout={handleLogout}
            />
          )}

          {currentScreen === 'physiognomy' && (
            <PhysiognomyService
              onResult={(res) => handleServiceResult(res, 'physiognomy')}
              onBack={handleBackToDashboard}
            />
          )}

          {currentScreen === 'lifefortune' && (
            <LifeFortuneService
              onResult={(res) => handleServiceResult(res, 'lifefortune')}
              onBack={handleBackToDashboard}
            />
          )}

          {currentScreen === 'dailyfortune' && (
            <DailyFortuneService
              onResult={(res) => handleServiceResult(res, 'dailyfortune')}
              onBack={handleBackToDashboard}
            />
          )}

          {currentScreen === 'dream' && (
            <DreamInterpretationService
              onResult={(res) => handleServiceResult(res, 'dream')}
              onBack={handleBackToDashboard}
            />
          )}

          {currentScreen === 'result' && currentResult && (
            <ResultScreen
              result={currentResult}
              onBack={handleBackToDashboard}
              onShare={() => alert('카카오톡 공유 기능')}
              onRecommend={(service) => setCurrentScreen(service as Screen)}
            />
          )}

          {currentScreen === 'payment' && (
            <PaymentScreen
              serviceType={pendingService}
              onPaymentComplete={handlePaymentComplete}
              onCancel={handleBackToDashboard}
            />
          )}

          {currentScreen === 'myresults' && user && (
            <MyResultsScreen
              user={user}
              onBack={() => setCurrentScreen('dashboard')}
              onResultSelect={(res) => { setCurrentResult(res); setCurrentScreen('result'); }}
            />
          )}

          {currentScreen === 'profile' && user && (
            <ProfileScreen user={user} onLogout={handleLogout} />
          )}

          {currentScreen === 'support' && user && (
            <SupportScreen user={user} onSupport={handleSupportPurchase} />
          )}
        </div>

        {shouldShowBottomNav && (
          <BottomNavigation
            currentScreen={currentScreen}
            onNavigate={handleBottomNavigation}
            user={user}
          />
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;
