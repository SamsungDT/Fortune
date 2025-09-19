import React, { useState } from 'react';
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Progress } from "./ui/progress";
import { Alert, AlertDescription } from "./ui/alert";
import { FortuneResult } from "../App";
import { Upload, Camera, User, Calendar, Sparkles, AlertCircle } from 'lucide-react';
import { AdBanner } from './AdBanner';

interface PhysiognomyServiceProps {
  onResult: (result: FortuneResult) => void;
  onBack: () => void;
}

export function PhysiognomyService({ onResult, onBack }: PhysiognomyServiceProps) {
  const [step, setStep] = useState<'info' | 'input' | 'analyzing' | 'complete'>('info');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [progress, setProgress] = useState(0);
  const [currentStatus, setCurrentStatus] = useState('');

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 파일 크기 체크 (5MB 제한)
      if (file.size > 5 * 1024 * 1024) {
        alert('파일 크기는 5MB를 초과할 수 없습니다.');
        return;
      }
      
      // 이미지 파일 타입 체크
      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드 가능합니다.');
        return;
      }
      
      setPhotoFile(file);
      
      // 미리보기 생성
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!photoFile || !birthDate || !gender) {
      alert('모든 정보를 입력해주세요.');
      return;
    }

    setStep('analyzing');
    
    // 진행률 시뮬레이션
    const analysisSteps = [
      { delay: 800, progress: 15, text: '📸 사진 업로드 완료' },
      { delay: 1200, progress: 35, text: '🔍 얼굴 특징 분석 중...' },
      { delay: 1800, progress: 60, text: '🧠 AI 관상학적 해석 중...' },
      { delay: 2200, progress: 85, text: '✨ 개인별 운세 생성 중...' },
      { delay: 2800, progress: 100, text: '🎉 분석 완료!' }
    ];

    for (const step of analysisSteps) {
      await new Promise(resolve => setTimeout(resolve, step.delay));
      setProgress(step.progress);
      setCurrentStatus(step.text);
    }

    // AI 분석 결과 생성 (목업)
    const result: FortuneResult = {
      id: Date.now().toString(),
      type: 'physiognomy',
      title: '관상 분석 결과',
      content: `🎯 **전체적인 인상**
당신의 얼굴에서는 따뜻하고 친근한 기운이 느껴집니다. 특히 눈가의 미소 주름은 주변 사람들에게 편안함을 주는 성격을 나타냅니다.

👁️ **눈의 특징**
• 눈매가 선하고 진실된 마음을 보여줍니다
• 집중력이 뛰어나며 목표 달성 능력이 강합니다
• 인간관계에서 진심으로 대하는 성격입니다

👃 **코의 특징**
• 재정운이 안정적이며 꾸준히 발전할 상입니다
• 책임감이 강하고 신뢰받는 성격입니다
• 중년 이후 더욱 풍요로운 삶을 살게 될 것입니다

👄 **입의 특징**
• 말재주가 뛰어나며 설득력이 있습니다
• 인복이 많아 좋은 인연들을 만나게 됩니다
• 소통 능력을 활용한 분야에서 성공할 것입니다

🔮 **종합 운세**
전반적으로 매우 좋은 관상을 가지고 계십니다. 특히 30대 중반부터 운세가 크게 상승하며, 인간관계와 사업에서 큰 성과를 거둘 것입니다. 다만 너무 완벽을 추구하지 말고 여유를 가지는 것이 더 큰 행복을 가져다 줄 것입니다.

💡 **조언**
• 주황색과 금색 계열의 옷을 자주 입으세요
• 매주 화요일이 가장 좋은 날입니다
• 동쪽 방향이 길한 방위입니다`,
      date: new Date().toLocaleDateString('ko-KR'),
      paid: false
    };

    setStep('complete');
    setTimeout(() => onResult(result), 500);
  };

  return (
    <div className="p-6 space-y-6">
      {/* 서비스 소개 */}
      {step === 'info' && (
        <div className="space-y-6">
          <Card className="hanji-texture border border-hanbok-gold/30 p-6 rounded-3xl ink-shadow">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-hanbok-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">👤</span>
              </div>
              
              <h2 className="text-xl text-ink-black dark:text-ink-gray ink-brush">
                AI 관상 분석
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                수천 년 전통의 관상학과 최신 AI 기술이 만나 당신의 얼굴에서 운세를 읽어드립니다.
              </p>
            </div>
          </Card>

          <Card className="border border-border p-5 rounded-2xl">
            <h3 className="text-lg text-ink-black dark:text-ink-gray ink-brush mb-4">
              📋 분석 과정
            </h3>
            <div className="space-y-3">
              {[
                { icon: '📸', text: '정면 얼굴 사진 업로드' },
                { icon: '🔍', text: 'AI가 얼굴 특징 분석' },
                { icon: '🧠', text: '관상학적 해석 및 운세 생성' },
                { icon: '✨', text: '개인 맞춤 조언 제공' }
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-xl hover:bg-hanbok-gold/5 transition-colors">
                  <div className="w-8 h-8 bg-hanbok-gold/20 rounded-full flex items-center justify-center">
                    <span className="text-sm">{item.icon}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{item.text}</span>
                </div>
              ))}
            </div>
          </Card>

          <Alert className="border-hanbok-gold/30 bg-hanbok-gold/5 rounded-2xl">
            <AlertCircle className="h-4 w-4 text-hanbok-gold-dark" />
            <AlertDescription className="text-sm text-ink-black dark:text-ink-gray">
              개인정보는 분석 후 즉시 삭제되며, 결과만 안전하게 저장됩니다.
            </AlertDescription>
          </Alert>

          <AdBanner type="card" className="mt-4" />

          <Button 
            onClick={() => setStep('input')} 
            className="w-full h-14 bg-hanbok-gold hover:bg-hanbok-gold-dark text-ink-black rounded-3xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            관상 분석 시작하기
          </Button>
        </div>
      )}

      {step === 'input' && (
        <div className="space-y-6">
          <Card className="hanji-texture border border-hanbok-gold/30 p-6 rounded-3xl ink-shadow">
            <div className="space-y-6">
              {/* 사진 업로드 */}
              <div className="space-y-4">
                <Label className="text-ink-black dark:text-ink-gray mb-2 flex items-center">
                  <Camera className="w-4 h-4 mr-2" />
                  얼굴 사진 업로드
                </Label>
                
                <div className="relative">
                  <Input 
                    type="file" 
                    accept="image/*" 
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label 
                    htmlFor="photo-upload"
                    className="cursor-pointer block"
                  >
                    <div className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                      photoFile 
                        ? 'border-hanbok-gold bg-hanbok-gold/5' 
                        : 'border-border hover:border-hanbok-gold/50 hover:bg-hanbok-gold/5'
                    }`}>
                      {photoPreview ? (
                        <div className="space-y-4">
                          <img 
                            src={photoPreview} 
                            alt="업로드된 사진" 
                            className="w-32 h-32 object-cover rounded-2xl mx-auto border border-hanbok-gold/30"
                          />
                          <p className="text-sm text-hanbok-gold-dark">사진이 업로드되었습니다</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <Upload className="w-12 h-12 text-muted-foreground mx-auto" />
                          <div>
                            <p className="text-ink-black dark:text-ink-gray">사진을 선택하세요</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              정면을 바라보는 선명한 얼굴 사진 (최대 5MB)
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              </div>

              {/* 생년월일 */}
              <div className="space-y-3">
                <Label className="text-ink-black dark:text-ink-gray flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  생년월일
                </Label>
                <Input 
                  type="date" 
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="h-12 rounded-2xl border-border focus:border-hanbok-gold/50 focus:ring-hanbok-gold/20"
                />
              </div>

              {/* 성별 */}
              <div className="space-y-3">
                <Label className="text-ink-black dark:text-ink-gray flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  성별
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    type="button"
                    variant={gender === 'male' ? 'default' : 'outline'}
                    onClick={() => setGender('male')}
                    className={`h-12 rounded-2xl font-medium transition-all duration-300 ${
                      gender === 'male' 
                        ? 'bg-hanbok-gold hover:bg-hanbok-gold-dark text-ink-black border-hanbok-gold' 
                        : 'border-border hover:border-hanbok-gold/50 hover:bg-hanbok-gold/5'
                    }`}
                  >
                    🙋‍♂️ 남성
                  </Button>
                  <Button 
                    type="button"
                    variant={gender === 'female' ? 'default' : 'outline'}
                    onClick={() => setGender('female')}
                    className={`h-12 rounded-2xl font-medium transition-all duration-300 ${
                      gender === 'female' 
                        ? 'bg-hanbok-gold hover:bg-hanbok-gold-dark text-ink-black border-hanbok-gold' 
                        : 'border-border hover:border-hanbok-gold/50 hover:bg-hanbok-gold/5'
                    }`}
                  >
                    🙋‍♀️ 여성
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <div className="flex gap-3">
            <Button 
              variant="outline"
              onClick={() => setStep('info')} 
              className="flex-1 h-12 border-border rounded-2xl hover:bg-muted"
            >
              이전
            </Button>
            <Button 
              onClick={handleAnalyze} 
              disabled={!photoFile || !birthDate || !gender}
              className="flex-2 h-12 bg-hanbok-gold hover:bg-hanbok-gold-dark text-ink-black rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              분석 시작
            </Button>
          </div>
        </div>
      )}

      {step === 'analyzing' && (
        <Card className="hanji-texture border border-hanbok-gold/30 p-8 rounded-3xl ink-shadow">
          <div className="text-center space-y-6">
            <div className="relative">
              <div className="w-24 h-24 bg-hanbok-gold/20 rounded-full flex items-center justify-center mx-auto animate-pulse">
                <span className="text-4xl animate-spin">☯</span>
              </div>
              <div className="absolute inset-0 rounded-full border-2 border-hanbok-gold/30 animate-ping"></div>
            </div>
            
            <div className="space-y-3">
              <h2 className="text-xl text-ink-black dark:text-ink-gray ink-brush">
                AI가 관상을 분석하고 있습니다
              </h2>
              <p className="text-muted-foreground">{currentStatus}</p>
            </div>
            
            <div className="space-y-3">
              <Progress 
                value={progress} 
                className="w-full h-3 rounded-full"
              />
              <p className="text-hanbok-gold-dark font-medium">{progress}% 완료</p>
            </div>
            
            <div className="bg-hanbok-gold/10 rounded-2xl p-4">
              <p className="text-sm text-muted-foreground">
                ✨ 수천 년의 관상학 지혜와 최신 AI 기술로 정확한 분석을 진행하고 있습니다
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}