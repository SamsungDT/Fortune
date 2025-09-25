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

// ================= 서버/엔드포인트/헬퍼 =================
const API_BASE = 'http://localhost:8080'; // 필요 시 .env로 교체
const PRESIGN_URL = `${API_BASE}/api/fortune/face/picture`; // 레시피: POST presign 발급 URL

function getAccessToken() {
  return localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
}

// 확장자 유지: 없으면 .png로 생성
function getFileName(file: File) {
  return file.name && file.name.includes('.') ? file.name : `${Date.now()}.png`;
}

// (A) Presigned URL 발급: POST /api/fortune/face/picture (Body: {"fileName": "..."}; 토큰 필수)
async function requestPresignedUrl(fileName: string): Promise<string> {
  const token = getAccessToken();
  if (!token) throw new Error('로그인이 필요합니다.');

  const res = await fetch(PRESIGN_URL, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fileName }), // 레시피: Body 타입 String(JSON), 키: fileName
  });

  const body = await res.json().catch(() => null);
  if (!res.ok || !body || body.code !== 200 || !body.data?.url) {
    const msg = body?.message || `Presigned URL 발급 실패 (HTTP ${res.status})`;
    throw new Error(msg);
  }
  return body.data.url as string;
}

// (B) S3 업로드: PUT {url} (헤더 Content-Type: image/*, 바디: 파일 바이너리)
async function uploadToS3(presignedUrl: string, file: File): Promise<void> {
  const contentType = file.type || 'application/octet-stream';
  const res = await fetch(presignedUrl, {
    method: 'PUT',
    headers: { 'Content-Type': contentType }, // 레시피 권장
    body: file, // 바이너리 그대로
  });
  if (!res.ok) {
    throw new Error(`S3 업로드 실패 (HTTP ${res.status})`);
  }
}

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
      // 5MB 제한
      if (file.size > 5 * 1024 * 1024) {
        alert('파일 크기는 5MB를 초과할 수 없습니다.');
        return;
      }
      // 이미지 타입 확인
      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드 가능합니다.');
        return;
      }
      setPhotoFile(file);

      // 미리보기
      const reader = new FileReader();
      reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  // 🔗 실제 Presign + S3 업로드 연결 (목업 제거)
  const handleAnalyze = async () => {
    if (!photoFile) {
      alert('얼굴 사진을 업로드해주세요.');
      return;
    }

    setStep('analyzing');
    setCurrentStatus('📸 사진 확인 중...');
    setProgress(10);

    try {
      // 1) Presigned URL 발급(POST)
      setCurrentStatus('🔐 업로드 URL 발급 중...');
      setProgress(25);
      const fileName = getFileName(photoFile);
      const presignedUrl = await requestPresignedUrl(fileName);

      // 2) S3 업로드(PUT)
      setCurrentStatus('☁️ S3로 사진 업로드 중...');
      setProgress(60);
      await uploadToS3(presignedUrl, photoFile);

      // 3) 업로드 완료
      setCurrentStatus('✅ 업로드 완료! 분석 대기 중...');
      setProgress(100);

      // 표시용 경로 추출(옵션)
      // const pathMatch = presignedUrl.match(/amazonaws\.com\/([^?]+)/);
         const pathMatch = presignedUrl.split("?")
      const uploadedKey = pathMatch ? decodeURIComponent(pathMatch[0]) : '(경로 확인 불가)';

      // ⚠️ 현재는 "업로드 성공 안내"까지만. 분석 API 레시피 받으면 여기서 POST 이어서 실제 결과로 교체
      const result: FortuneResult = {
        id: Date.now().toString(),
        type: 'physiognomy',
        title: '관상 분석 요청 접수',
        content:
`📤 **사진 업로드 성공**
- 버킷: \`fortune-ki-bucket\`
- 경로: \`${uploadedKey}\`

> 다음 단계(분석 API)가 준비되면 이 이미지를 사용해 결과를 생성합니다.`,
        date: new Date().toLocaleDateString('ko-KR'),
        paid: false,
      };

      setStep('complete');
      setTimeout(() => onResult(result), 300);
    } catch (e: any) {
      const msg = e?.message || '업로드 처리 중 오류가 발생했습니다.';
      alert(msg);
      setCurrentStatus('❌ 오류로 인해 작업이 중단되었습니다.');
      setProgress(0);
      setStep('input');
    }
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

          {/* <AdBanner type="card" className="mt-4" /> */}

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

              {/* 생년월일 — 레시피 필요 시 주석 해제 */}
              {/* <div className="space-y-3">
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
              </div> */}

              {/* 성별 — 레시피 필요 시 주석 해제 */}
              {/* <div className="space-y-3">
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
              </div> */}
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
              // 🔧 레시피상 birthDate/gender 미사용이므로 비활성 조건 완화
              disabled={!photoFile}
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
