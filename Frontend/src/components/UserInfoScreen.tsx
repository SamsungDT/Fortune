import React, { useState } from 'react';
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface User {
  id: string;
  name: string;
  email: string;
  loginProvider: string;
  birthDate?: string;
  birthTime?: string;
}

interface UserInfoScreenProps {
  user: User;
  onComplete: (userInfo: { birthDate: string; birthTime: string }) => void;
}

export function UserInfoScreen({ user, onComplete }: UserInfoScreenProps) {
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [isUnknownTime, setIsUnknownTime] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!birthDate) {
      alert('생년월일을 입력해주세요.');
      return;
    }
    
    const finalBirthTime = isUnknownTime ? '12:00' : birthTime;
    
    if (!isUnknownTime && !birthTime) {
      alert('태어난 시간을 입력해주세요.');
      return;
    }
    
    onComplete({
      birthDate,
      birthTime: finalBirthTime
    });
  };



  return (
    <div className="min-h-screen flex items-center justify-center p-6 hanji-texture">
      {/* 배경 문양 */}
      <div className="absolute inset-0 opacity-30">
        <div className="h-full w-full bg-gradient-to-br from-hanbok-gold/5 via-transparent to-hanbok-gold/5"></div>
      </div>
      
      <Card className="relative w-full max-w-sm mx-auto p-8 bg-white/95 dark:bg-card/95 backdrop-blur-lg border border-hanbok-gold/20 ink-shadow rounded-3xl">
        {/* 메인 헤더 */}
        <div className="text-center mb-8">
          <div className="relative mb-6">
            {/* 환영 메시지 */}
            <div className="relative inline-block">
              <div className="text-4xl mb-3 relative">
                <span className="absolute inset-0 text-hanbok-gold/20 transform scale-110">🌟</span>
                <span className="relative text-ink-black dark:text-ink-gray">🌟</span>
              </div>
            </div>
            
            <h1 className="text-xl mb-2 text-ink-black dark:text-ink-gray ink-brush">
              환영합니다, {user.name}님!
            </h1>
            
            <div className="flex items-center justify-center space-x-2 mb-4">
              <span className="text-sm text-muted-foreground">
                {getProviderName(user.loginProvider)} 로그인 완료
              </span>
            </div>
            
            <h2 className="text-lg mb-3 text-ink-black dark:text-ink-gray">
              추가 정보 입력
            </h2>
            
            {/* 전통 장식선 */}
            <div className="flex items-center justify-center mb-3">
              <div className="h-px bg-hanbok-gold/40 w-8"></div>
              <div className="mx-2 w-2 h-2 bg-hanbok-gold rounded-full"></div>
              <div className="h-px bg-hanbok-gold/40 w-8"></div>
            </div>
          </div>
          
          <p className="text-muted-foreground text-sm leading-relaxed">
            정확한 운세 분석을 위해<br />
            생년월일과 태어난 시간을 알려주세요
          </p>
        </div>

        {/* 생년월일 및 생시 입력 폼 */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 생년월일 입력 */}
          <div className="space-y-2">
            <Label htmlFor="birthDate" className="text-ink-black dark:text-ink-gray">
              생년월일 <span className="text-dancheong-red">*</span>
            </Label>
            <Input 
              id="birthDate" 
              name="birthDate" 
              type="date" 
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="h-12 bg-input-background border border-border focus:border-hanbok-gold/60 focus:ring-hanbok-gold/30 rounded-xl transition-all duration-300 text-center"
              required
            />
            <p className="text-xs text-muted-foreground">
              양력 기준으로 입력해주세요
            </p>
          </div>
          
          {/* 태어난 시간 입력 */}
          <div className="space-y-4">
            <Label className="text-ink-black dark:text-ink-gray">
              태어난 시간 <span className="text-dancheong-red">*</span>
            </Label>
            
            {/* 시간 모름 체크박스 */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="unknownTime"
                checked={isUnknownTime}
                onChange={(e) => {
                  setIsUnknownTime(e.target.checked);
                  if (e.target.checked) {
                    setBirthTime('');
                  }
                }}
                className="w-4 h-4 text-hanbok-gold bg-input-background border-border rounded focus:ring-hanbok-gold/30 focus:ring-2"
              />
              <Label htmlFor="unknownTime" className="text-sm text-muted-foreground cursor-pointer">
                태어난 시간을 정확히 모르겠어요 (정오 12시로 계산됩니다)
              </Label>
            </div>
            
            {/* 시간 입력 필드 */}
            {!isUnknownTime && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="birthHour" className="text-xs text-muted-foreground">시</Label>
                  <Select
                    value={birthTime.split(':')[0] || ''}
                    onValueChange={(hour) => {
                      const minute = birthTime.split(':')[1] || '00';
                      setBirthTime(`${hour.padStart(2, '0')}:${minute}`);
                    }}
                  >
                    <SelectTrigger className="h-11 bg-input-background border border-border focus:border-hanbok-gold/60 rounded-xl">
                      <SelectValue placeholder="시" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => (
                        <SelectItem key={i} value={i.toString()}>
                          {i.toString().padStart(2, '0')}시
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="birthMinute" className="text-xs text-muted-foreground">분</Label>
                  <Select
                    value={birthTime.split(':')[1] || ''}
                    onValueChange={(minute) => {
                      const hour = birthTime.split(':')[0] || '00';
                      setBirthTime(`${hour}:${minute.padStart(2, '0')}`);
                    }}
                  >
                    <SelectTrigger className="h-11 bg-input-background border border-border focus:border-hanbok-gold/60 rounded-xl">
                      <SelectValue placeholder="분" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 60 }, (_, i) => (
                        <SelectItem key={i} value={i.toString()}>
                          {i.toString().padStart(2, '0')}분
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            
            {isUnknownTime && (
              <div className="bg-hanbok-gold/10 border border-hanbok-gold/30 rounded-xl p-4">
                <div className="flex items-center space-x-2">
                  <span className="text-hanbok-gold-dark">ℹ️</span>
                  <div className="text-sm text-hanbok-gold-dark">
                    <p className="font-medium">정오 12시로 계산됩니다</p>
                    <p className="text-xs mt-1">가능하면 정확한 시간을 확인해보세요. 더 정확한 운세 분석이 가능합니다.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* 완료 버튼 */}
          <Button 
            type="submit" 
            className="w-full h-12 bg-ink-black dark:bg-ink-gray text-white dark:text-ink-black hover:bg-ink-gray dark:hover:bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 font-medium mt-8"
          >
            <span className="flex items-center justify-center space-x-2">
              <span>🚀</span>
              <span>Fortune K.I 시작하기</span>
            </span>
          </Button>
        </form>

        {/* 안내 메시지 */}
        <div className="mt-6 text-center">
          <div className="bg-dancheong-green/10 border border-dancheong-green/30 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <span className="text-dancheong-green text-sm">🔒</span>
              <div className="text-xs text-dancheong-green leading-relaxed">
                <p className="font-medium">개인정보 보안</p>
                <p className="mt-1">
                  입력하신 정보는 운세 분석 목적으로만 사용되며, 
                  안전하게 암호화되어 보관됩니다.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 장식 */}
        <div className="mt-4 text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-hanbok-gold/10 border border-hanbok-gold/30 rounded-full">
            <span className="text-hanbok-gold-dark">✨</span>
            <span className="text-hanbok-gold-dark text-xs font-medium">정확한 정보로 더 나은 운세를</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
