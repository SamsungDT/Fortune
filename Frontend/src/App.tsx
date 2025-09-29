// App.tsx
import React, { useState, useEffect, useCallback } from 'react';
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

// ====================================================================
// API 및 타입 정의 (설명서 기반)
// ====================================================================
const API_BASE = 'http://localhost:8080';
const APP_STATS_URL = `${API_BASE}/api/fortune/statistics`; 

interface StatisticsResponseData {
    totalUsers: number;
    faceResultCount: number;
    lifeLongResultCount: number;
    dailyFortuneResultCount: number;
    dreamInterpretationResultCount: number;
}

type APIResponse<T> = {
    code: string;
    message: string;
    data: T | null;
};

// 클라이언트에서 사용할 AppStats 타입
export interface AppStats {
    totalUsers: number;
    totalReadings: number;
    physiognomyCount: number;
    lifeFortuneCount: number;
    dailyFortuneCount: number;
    dreamCount: number;
}

// Mock 데이터 (API 호출 실패 시 대비)
const MOCK_APP_STATS: AppStats = {
    totalUsers: 12847,
    totalReadings: 89235,
    physiognomyCount: 28459,
    lifeFortuneCount: 18237,
    dailyFortuneCount: 32146,
    dreamCount: 10393
};

// ====================================================================
// User 및 Result 타입 (기존 App.tsx 내용 유지)
// ====================================================================
export interface User {
    id: string;
    name: string;
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

type Screen = 'login' | 'signup' | 'userinfo' | 'dashboard' | 'physiognomy' | 'lifefortune' | 'dailyfortune' | 'dream' | 'result' | 'payment' | 'myresults' | 'profile' | 'support';

function App() {
    const [currentScreen, setCurrentScreen] = useState<Screen>('login');
    const [user, setUser] = useState<User | null>(null);
    const [currentResult, setCurrentResult] = useState<FortuneResult | null>(null);
    const [pendingService, setPendingService] = useState<string>('');
    
    // 통계 데이터 상태와 로딩 상태를 App 컴포넌트에서 중앙 관리
    const [appStats, setAppStats] = useState<AppStats | null>(null);
    const [appStatsLoading, setAppStatsLoading] = useState(true);

    // ====================================================================
    // 통계 데이터를 가져오는 비동기 함수 (인증 헤더 제거 및 오류 방어 보강)
    // ====================================================================
const fetchAppStats = useCallback(async () => {
    setAppStatsLoading(true);
    try {
        const res = await fetch(APP_STATS_URL); 
        
        if (!res.ok) {
            console.error(`통계 API 호출 실패: HTTP ${res.status} ${res.statusText}. Mock 데이터 사용.`);
            setAppStats(MOCK_APP_STATS); 
            return;
        }

        const body: APIResponse<StatisticsResponseData> = await res.json();
        
        // ✨ 수정된 조건: body.code가 문자열 '200'이거나 숫자 200일 때, 그리고 data가 존재할 때 성공으로 간주
        const isSuccess = (body.code === '200' || body.code === 200) && body.data;

        if (isSuccess) {
            const data = body.data as StatisticsResponseData; // body.data가 null이 아님을 TypeScript에 명시
            
            const totalReadings = 
                data.faceResultCount + 
                data.lifeLongResultCount + 
                data.dailyFortuneResultCount + 
                data.dreamInterpretationResultCount;
            
            const mappedStats: AppStats = {
                totalUsers: data.totalUsers,
                totalReadings: totalReadings,
                physiognomyCount: data.faceResultCount,
                lifeFortuneCount: data.lifeLongResultCount, 
                dailyFortuneCount: data.dailyFortuneResultCount,
                dreamCount: data.dreamInterpretationResultCount, 
            };
            
            console.log("App Stats successfully loaded:", mappedStats);
            setAppStats(mappedStats);
        } else {
            console.error("Failed to fetch app stats (API Message Error):", body.message, "Full body:", body);
            // 이 경우, 서버는 성공 메시지를 보냈지만 데이터가 유효하지 않으므로 Mock 데이터를 사용합니다.
            setAppStats(MOCK_APP_STATS); 
        }
    } catch (error) {
        console.error("Network or parsing error fetching app stats. Using mock data:", error);
        setAppStats(MOCK_APP_STATS);
    } finally {
        setAppStatsLoading(false);
    }
}, []);

    // 앱 마운트 시 통계 데이터 로드 시작
    useEffect(() => {
        fetchAppStats();
    }, [fetchAppStats]);

    // ====================================================================
    // 나머지 핸들러 함수들 (기존 로직 유지)
    // ====================================================================
    const handleSignup = (signupData: any) => {
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
        
        // 더미 결과 데이터 생성 (생략된 부분)
        const dummyResults: FortuneResult[] = [
            { id: '1', type: 'physiognomy', title: '관상 분석 결과', content: '...', date: '2024.12.20', paid: false },
            { id: '2', type: 'dailyfortune', title: '2024.12.19 오늘의 운세', content: '...', date: '2024.12.19', paid: false },
            { id: '3', type: 'lifefortune', title: '평생 운세 분석 결과', content: '...', date: '2024.12.18', paid: true },
            { id: '4', type: 'dream', title: '꿈 해몽 결과', content: '...', date: '2024.12.17', paid: false },
            { id: '5', type: 'dailyfortune', title: '2024.12.16 오늘의 운세', content: '...', date: '2024.12.16', paid: true },
            { id: '6', type: 'physiognomy', title: '관상 분석 결과 #2', content: '...', date: '2024.12.15', paid: false },
            { id: '7', type: 'dream', title: '꿈 해몽 결과 #2', content: '...', date: '2024.12.14', paid: true }
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
            results: []
        };
        setUser(newUser);
        
        if (loginData.provider === 'email') {
            if (loginData.birthDate && loginData.birthTime) {
                setCurrentScreen('dashboard');
            } else {
                newUser.birthDate = '1990-01-01';
                newUser.birthTime = '12:00';
                setCurrentScreen('dashboard');
            }
        } else {
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
        
        const hasUsedFreeToday = updatedUser.dailyFreeUsage[serviceType as keyof typeof updatedUser.dailyFreeUsage];
        
        if (!hasUsedFreeToday) {
            updatedUser.dailyFreeUsage[serviceType as keyof typeof updatedUser.dailyFreeUsage] = true;
            result.paid = false;
            updatedUser.results.push(result);
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
        
        alert(`${planType === 'monthly' ? '월간' : '연간'} 후원을 시작합니다! 감사합니다 🙏`);
        
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
                {/* LoginScreen에 통계 데이터 전달 */}
                {currentScreen === 'login' && (
                    <LoginScreen 
                        onLogin={handleLogin} 
                        appStats={appStats}
                        onGoToSignup={() => setCurrentScreen('signup')}
                    />
                )}
                
                {/* SignupScreen에 통계 데이터 전달 */}
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
                
                {/* MainDashboard에 통계 데이터 및 로딩 상태 전달 */}
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