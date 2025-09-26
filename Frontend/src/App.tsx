import React, { useState, useEffect } from 'react';
import { Card } from "./components/ui/card";
import { Button } from "./components/ui/button";
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

export interface User {
  id: string;
  name: string;
  email: string;
  loginProvider: string;
  birthDate?: string; // YYYY-MM-DD 형태
  birthTime?: string; // HH:MM 형태
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

export interface AppStats {
  totalUsers: number;
  totalReadings: number;
  physiognomyCount: number;
  lifeFortuneCount: number;
  dailyFortuneCount: number;
  dreamCount: number;
}

type Screen = 'login' | 'signup' | 'userinfo' | 'dashboard' | 'physiognomy' | 'lifefortune' | 'dailyfortune' | 'dream' | 'result' | 'payment' | 'myresults' | 'profile' | 'support';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [user, setUser] = useState<User | null>(null);
  const [currentResult, setCurrentResult] = useState<FortuneResult | null>(null);
  const [pendingService, setPendingService] = useState<string>('');

  // API 호출을 위한 상태 변수 추가
  const [appStats, setAppStats] = useState<AppStats | null>(null);
  const [appStatsLoading, setAppStatsLoading] = useState<boolean>(true);

  // 컴포넌트 마운트 시 API 호출
  useEffect(() => {
    const fetchAppStats = async () => {
      try {
        // 로컬 스토리지에서 토큰을 가져옵니다.
        const accessToken = localStorage.getItem('accessToken');
        
        // 토큰이 없으면 요청을 보내지 않고 로딩을 마칩니다.
        // 또는 인증되지 않은 사용자용 더미 데이터를 반환할 수 있습니다.
        if (!accessToken) {
            setAppStats(null); // 로그인 전이므로 통계 데이터 없음
            setAppStatsLoading(false);
            return;
        }

        // 인증 헤더를 추가하여 요청을 보냅니다.
        const response = await fetch('http://localhost:8080/api/fortune/statistics', {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`);
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            console.error("Received non-JSON response from server:", await response.text());
            throw new TypeError("Did not receive JSON from server");
        }

        const data = await response.json();
        
        const fetchedStats: AppStats = {
          totalUsers: data.data.totalUsers,
          physiognomyCount: data.data.faceResultCount,
          lifeFortuneCount: data.data.lifeLongResultCount,
          dailyFortuneCount: data.data.dailyFortuneResultCount,
          dreamCount: data.data.dreamInterpretationResultCount,
          totalReadings: data.data.faceResultCount + data.data.lifeLongResultCount + data.data.dailyFortuneResultCount + data.data.dreamInterpretationResultCount,
        };
        
        setAppStats(fetchedStats);
      } catch (error) {
        console.error("Failed to fetch app stats:", error);
        setAppStats({
          totalUsers: 12847,
          totalReadings: 89235,
          physiognomyCount: 28459,
          lifeFortuneCount: 18237,
          dailyFortuneCount: 32146,
          dreamCount: 10393
        });
      } finally {
        setAppStatsLoading(false);
      }
    };

    // user 상태가 변경될 때마다 fetchAppStats 함수를 실행합니다.
    // user가 null이 아니면(로그인 상태), API를 호출합니다.
    if (user) {
        fetchAppStats();
    }
    // user가 로그아웃하여 null이 되면, 통계 데이터를 초기화하고 로딩 상태를 false로 설정합니다.
    else if (appStats) {
        setAppStats(null);
        setAppStatsLoading(false);
    }
    
  }, [user]); // user 상태가 변경될 때마다 useEffect를 실행하도록 의존성 배열을 추가

  const handleSignup = (signupData: any) => {
    // 회원가입 완료 후 자동 로그인 처리
    handleLogin(signupData);
  };

  const handleUserInfoComplete = (userInfoData: any) => {
    if (!user) return;
    
    const updatedUser = { 
      ...user, 
      birthDate: userInfoData.birthDate, 
      birthTime: userInfoData.birthTime 
    };
    setUser(updatedUser);
    setCurrentScreen('dashboard');
  };

  const handleLogin = (loginData: any) => {
    const today = new Date().toDateString();
    
    // 더미 데이터 생성
    const dummyResults: FortuneResult[] = [
      {
        id: '1',
        type: 'physiognomy',
        title: '관상 분석 결과',
        content: `🎯 **전체적인 인상** 당신의 얼굴에서는 따뜻하고 친근한 기운이 느껴집니다. 특히 눈가의 미소 주름은 주변 사람들에게 편안함을 주는 성격을 나타냅니다. 

👁️ **눈의 특징** • 눈매가 선하고 진실된 마음을 보여줍니다 
• 집중력이 뛰어나며 목표 달성 능력이 강합니다 
• 인간관계에서 진심으로 대하는 성격입니다 

🔮 **종합 운세** 전반적으로 매우 좋은 관상을 가지고 계십니다. 특히 30대 중반부터 운세가 크게 상승하며, 인간관계와 사업에서 큰 성과를 거둘 것입니다.`,
        date: '2024.12.20',
        paid: false
      },
      {
        id: '2',
        type: 'dailyfortune',
        title: '2024.12.19 오늘의 운세',
        content: `📅 **2024.12.19 운세** 🌟 **오늘의 전체운: ★★★★☆** 오늘은 전반적으로 좋은 기운이 흐르는 날입니다. 특히 오전 시간대에는 중요한 결정을 내리기에 좋은 때입니다. 

💰 **재물운: ★★★☆☆** • 예상치 못한 수입이 있을 수 있습니다 
• 투자보다는 저축에 집중하는 것이 좋겠습니다 

💕 **연애운: ★★★★★** • 새로운 만남의 기회가 생길 수 있습니다 
• 깊은 대화를 나누기 좋은 날입니다`,
        date: '2024.12.19',
        paid: false
      },
      {
        id: '3',
        type: 'lifefortune',
        title: '평생 운세 분석 결과',
        content: `🌟 **${loginData.name}님의 평생 운세** 🎂 **타고난 성격과 재능** • 차분하고 신중한 성격으로 주변 사람들의 신뢰를 받습니다 
• 예술적 감이 뛰어나며 창의적인 분야에 재능이 있습니다 

💰 **재물운** • 20대: 기반을 다지는 시기, 꾸준한 저축이 중요 
• 30대: 본격적인 재물 증식기, 투자 기회가 많이 옵니다 
• 40대: 재물운이 절정에 달하며 부동산 투자에 좋은 시기 

💕 **연애운 & 결혼운** • 첫사랑은 25세 전후에 만나게 됩니다 
• 결혼 적령기는 28-32세 사이가 가장 좋습니다`,
        date: '2024.12.18',
        paid: true
      },
      {
        id: '4',
        type: 'dream',
        title: '꿈 해몽 결과',
        content: `🌙 **꿈 해몽 분석** 📝 **꿈의 요약** 당신이 꾼 꿈은 현재의 심리상태와 미래에 대한 잠재의식을 반영하고 있습니다. 

🔍 **주요 상징 해석** 💧 **물의 상징** 꿈 속의 물은 감정과 정화를 의미합니다. 맑은 물이었다면 마음이 정화되고 새로운 시작을 알립니다. 

🎯 **심리상태 분석** • 현재 당신은 변화에 대한 준비가 되어 있는 상태입니다 
• 새로운 도전에 대한 두려움과 기대감이 공존하고 있습니다`,
        date: '2024.12.17',
        paid: false
      },
      {
        id: '5',
        type: 'dailyfortune',
        title: '2024.12.16 오늘의 운세',
        content: `📅 **2024.12.16 운세** 🌟 **오늘의 전체운: ★★★☆☆** 오늘은 차분하게 하루를 보내기 좋은 날입니다. 급한 일보다는 계획을 세우는 데 집중하세요. 

💰 **재물운: ★★★★☆** • 재정 관리에 좋은 날입니다 
• 가계부 정리나 투자 계획을 세워보세요 

🏥 **건강운: ★★★★★** • 컨디션이 매우 좋은 상태입니다 
• 새로운 운동을 시작하기 좋은 날입니다`,
        date: '2024.12.16',
        paid: true
      },
      {
        id: '6',
        type: 'physiognomy',
        title: '관상 분석 결과 #2',
        content: `🎯 **전체적인 인상** 밝고 긍정적인 에너지가 느껴지는 관상입니다. 특히 이마가 넓어 지혜와 통찰력이 뛰어남을 보여줍니다. 

👁️ **눈의 특징** • 눈매가 크고 맑아 솔직하고 진실한 성격을 나타냅니다 
• 상대방을 배려하는 마음이 깊습니다 

👃 **코의 특징** • 재물운이 점진적으로 상승하는 형태입니다 
• 중년 이후 안정적인 재정 상태를 유지할 것입니다`,
        date: '2024.12.15',
        paid: false
      },
      {
        id: '7',
        type: 'dream',
        title: '꿈 해몽 결과 #2',
        content: `🌙 **꿈 해몽 분석** 📝 **꿈의 요약** 비행하는 꿈은 자유로움과 현실 극복 의지를 상징합니다. 

🔍 **주요 상징 해** 🕊️ **비행의 상징** 하늘을 나는 꿈은 자유에 대한 갈망과 현실 극복 의지를 나타냅니다. 높이 날수록 목표 달성에 대한 강한 의지를 의미합니다. 

🔮 **운세 전망** **단기 전망 (1개월)** • 새로운 기회가 찾아올 것입니다 
• 창의적인 아이디어가 떠오를 수 있습니다`,
        date: '2024.12.14',
        paid: true
      }
    ];

    const newUser: User = {
      id: Date.now().toString(),
      name: loginData.name,
      email: loginData.email,
      loginProvider: loginData.provider,
      birthDate: loginData.birthDate || undefined,
      birthTime: loginData.birthTime || undefined,
      isPremium: false,
      premiumExpiry: undefined,
      usageCount: {
        physiognomy: 2,
        lifefortune: 1,
        dailyfortune: 2,
        dream: 2
      },
      dailyFreeUsage: {
        date: today,
        physiognomy: false,
        lifefortune: false,
        dailyfortune: false,
        dream: false
      },
      results: dummyResults
    };
    setUser(newUser);
    
    // 이메일 로그인/회원가입 시 생년월일과 생시가 있으면 바로 dashboard로
    // 소셜 로그인은 추가 정보 입력 페이지로
    if (loginData.provider === 'email') {
      if (loginData.birthDate && loginData.birthTime) {
        // 이메일 회원가입에서 생년월일과 생시를 이미 입력받았으므로 바로 dashboard로
        setCurrentScreen('dashboard');
      } else {
        // 이메일 로그인 (기존 사용자)이므로 더미 생년월일 정보 추가 후 dashboard로
        newUser.birthDate = '1990-01-01';
        newUser.birthTime = '12:00';
        setCurrentScreen('dashboard');
      }
    } else {
      // 소셜 로그인은 추가 정보 입력 페이지로
      setCurrentScreen('userinfo');
    }
  };

  const handleServiceSelect = (service: string) => {
    setCurrentScreen(service as Screen);
  };

  const handleServiceResult = (result: FortuneResult, serviceType: string) => {
    if (!user) return;

    const today = new Date().toDateString();
    const updatedUser = { ...user };
    
    // 날짜가 바뀌었으면 일일 무료 사용 초기화
    if (updatedUser.dailyFreeUsage.date !== today) {
      updatedUser.dailyFreeUsage = {
        date: today,
        physiognomy: false,
        lifefortune: false,
        dailyfortune: false,
        dream: false
      };
    }
    
    updatedUser.usageCount[serviceType as keyof typeof user.usageCount]++;
    
    // 오늘 해당 서비스를 무료로 사용했는지 확인
    const hasUsedFreeToday = updatedUser.dailyFreeUsage[serviceType as keyof typeof updatedUser.dailyFreeUsage];
    
    if (!hasUsedFreeToday) {
      // 오늘 첫 무료 사용
      updatedUser.dailyFreeUsage[serviceType as keyof typeof updatedUser.dailyFreeUsage] = true;
      result.paid = false;
      updatedUser.results.push(result);
      setUser(updatedUser);
      setCurrentResult(result);
      setCurrentScreen('result');
    } else {
      // 오늘 이미 무료로 사용했으므로 결제 필요
      setPendingService(serviceType);
      setCurrentResult(result);
      setCurrentScreen('payment');
    }
  };

  const handlePaymentComplete = () => {
    if (!user || !currentResult) return;
    
    const updatedUser = { ...user };
    currentResult.paid = true;
    updatedUser.results.push(currentResult);
    setUser(updatedUser);
    setCurrentScreen('result');
  };

  const handleBackToDashboard = () => {
    setCurrentScreen('dashboard');
    setCurrentResult(null);
    setPendingService('');
  };

  const handleViewMyResults = () => {
    setCurrentScreen('myresults');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentScreen('login');
    setCurrentResult(null);
    setPendingService('');
  };

  const handleBottomNavigation = (screen: string) => {
    switch (screen) {
      case 'dashboard':
        setCurrentScreen('dashboard');
        break;
      case 'myresults':
        setCurrentScreen('myresults');
        break;
      case 'support':
        setCurrentScreen('support');
        break;
      case 'profile':
        setCurrentScreen('profile');
        break;
    }
    setCurrentResult(null);
    setPendingService('');
  };

  const handleSupportPurchase = (planType: 'monthly' | 'yearly') => {
    if (!user) return;
    
    // 실제 앱에서는 Google Play Billing 연동
    alert(`${planType === 'monthly' ? '월간' : '연간'} 후원을 시작합니다! 감사합니다 🙏`);
    
    // 후원 시 영구 프리미엄 제공
    const updatedUser = { ...user };
    updatedUser.isPremium = true;
    updatedUser.premiumExpiry = '영구 프리미엄';
    
    setUser(updatedUser);
  };

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
          userName: user?.name,
          showProfileButton: true,
          onProfileClick: () => setCurrentScreen('profile')
        };
      case 'physiognomy':
        return {
          title: '👤 관상 분석',
          subtitle: 'AI가 얼굴을 분석해 운세를 알려드립니다',
          showBackButton: true,
          onBack: handleBackToDashboard
        };
      case 'lifefortune':
        return {
          title: '🌟 평생 운세',
          subtitle: '생년월일로 알아보는 평생의 운세',
          showBackButton: true,
          onBack: handleBackToDashboard
        };
      case 'dailyfortune':
        return {
          title: '📅 오늘의 운세',
          subtitle: '오늘 하루의 운세를 확인해보세요',
          showBackButton: true,
          onBack: handleBackToDashboard
        };
      case 'dream':
        return {
          title: '💭 해몽',
          subtitle: '꿈의 의미를 AI가 해석해드립니다',
          showBackButton: true,
          onBack: handleBackToDashboard
        };
      case 'result':
        return {
          title: currentResult?.title || '결과',
          subtitle: currentResult?.date,
          showBackButton: true,
          onBack: handleBackToDashboard
        };
      case 'payment':
        return {
          title: '💳 결제',
          subtitle: '운세 서비스 이용권을 구매해주세요',
          showBackButton: true,
          onBack: handleBackToDashboard
        };
      case 'myresults':
        return {
          title: '📜 내 결과',
          subtitle: '지금까지의 운세 결과를 모아봤어요',
          showBackButton: true,
          onBack: () => setCurrentScreen('dashboard')
        };
      case 'profile':
        return {
          title: '👤 프로필',
          subtitle: '내 정보 및 이용 현황',
          showBackButton: true,
          onBack: () => setCurrentScreen('dashboard')
        };
      case 'support':
        return {
          title: '💝 개발자 후원',
          subtitle: user?.isPremium ? '후원해주셔서 감사합니다' : '개발자를 응원해주세요',
          showBackButton: true,
          onBack: () => setCurrentScreen('dashboard')
        };
      default:
        return {
          title: 'Fortune K.I',
          showBackButton: true,
          onBack: handleBackToDashboard
        };
    }
  };

  const shouldShowBottomNav = currentScreen !== 'login' && currentScreen !== 'signup' && currentScreen !== 'userinfo' && currentScreen !== 'result' && currentScreen !== 'payment';

  const appBarProps = getAppBarProps();

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-black max-w-md mx-auto relative oriental-pattern flex flex-col">
        {/* 상단 앱바 */}
        {appBarProps && (
          <TopAppBar {...appBarProps} />
        )}
        
        {/* 메인 콘텐츠 */}
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
            appStats={appStats} // API에서 불러온 데이터 prop으로 전달
            appStatsLoading={appStatsLoading} // 로딩 상태 prop으로 전달
            onServiceSelect={handleServiceSelect}
            onViewMyResults={handleViewMyResults}
            onLogout={handleLogout}
          />
        )}
        
        {currentScreen === 'physiognomy' && (
          <PhysiognomyService 
            onResult={(result) => handleServiceResult(result, 'physiognomy')}
            onBack={handleBackToDashboard}
          />
        )}
        
        {currentScreen === 'lifefortune' && (
          <LifeFortuneService 
            onResult={(result) => handleServiceResult(result, 'lifefortune')}
            onBack={handleBackToDashboard}
          />
        )}
        
        {currentScreen === 'dailyfortune' && (
          <DailyFortuneService 
            onResult={(result) => handleServiceResult(result, 'dailyfortune')}
            onBack={handleBackToDashboard}
          />
        )}
        
        {currentScreen === 'dream' && (
          <DreamInterpretationService 
            onResult={(result) => handleServiceResult(result, 'dream')}
            onBack={handleBackToDashboard}
          />
        )}
        
        {currentScreen === 'result' && currentResult && (
          <ResultScreen 
            result={currentResult}
            onBack={handleBackToDashboard}
            onShare={() => alert('카카오톡 공유 기능 (실제 앱에서는 카카오 SDK 연동)')}
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
            onResultSelect={(result) => {
              setCurrentResult(result);
              setCurrentScreen('result');
            }}
          />
        )}
        
        {currentScreen === 'profile' && user && (
          <ProfileScreen 
            user={user}
            onLogout={handleLogout}
          />
        )}
        
        {currentScreen === 'support' && user && (
          <SupportScreen 
            user={user}
            onSupport={handleSupportPurchase}
          />
        )}
        </div>
        
        {/* 하단 네비게이션 */}
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