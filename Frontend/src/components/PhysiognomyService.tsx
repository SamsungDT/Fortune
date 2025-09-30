import React, { useState } from 'react';
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Progress } from "./ui/progress";
import { Alert, AlertDescription } from "./ui/alert";
import { FortuneResult } from "../App";
import { Upload, Camera, Sparkles, AlertCircle } from 'lucide-react';

// 서버 응답 → 화면용 구조로 매핑
function mapFaceResponse(data: any) {
  // caution이 문자열이면 "1. ... 2. ..." 같은 패턴을 깔끔히 분리
  const splitCaution = (v: any): string[] => {
    if (Array.isArray(v)) return v.filter(Boolean).map(String);
    if (typeof v === 'string') {
      // 숫자목록/줄바꿈 모두 분리
      const arr = v.split(/(?:^\s*\d+\.\s*|\s*\d+\.\s*|\r?\n)+/).map(s => s.trim()).filter(Boolean);
      return arr.length ? arr : [v];
    }
    return [];
  };

  return {
    overall: {
      // 전체 인상 설명/운세
      summary: data?.overallImpression?.overallImpression ?? '',
      fortune: data?.overallImpression?.overallFortune ?? ''
    },
    eye:   { feature: data?.eye?.feature ?? '' },
    nose:  { feature: data?.nose?.feature ?? '' },
    mouth: { feature: data?.mouth?.feature ?? '' },
    advice: {
      keyword:    data?.advice?.keyword ?? '',
      caution:    splitCaution(data?.advice?.caution),
      mainAdvice: data?.advice?.mainAdvice ?? '',
      summary:    data?.advice?.summary ?? ''
    }
  };
}

// ================= 서버/엔드포인트/타입/헬퍼 =================
const API_BASE = 'http://43.202.64.247'; // 필요 시 .env 로 치환
const PRESIGN_URL = `${API_BASE}/api/fortune/face/picture`; // Presigned URL 발급(POST)
const ANALYZE_URL = `${API_BASE}/api/fortune/face`;          // 관상 분석(POST)
const LOGIN_URL   = `${API_BASE}/api/auth/login`;            // ⬅️ 예시: 로그인 엔드포인트(프로젝트에 맞게 수정)

// 공용 API 래퍼
type APIResponse<T> = { code: number; message: string; data: T | null };

// 분석 응답 스키마(문서 기준)
type FaceAnalyzeResponse = {
  overallImpression: { totalRating: number; summary: string };
  eye:   { rating: number; description: string };
  nose:  { rating: number; description: string };
  mouth: { rating: number; description: string };
  advice: {
    keyword?: string;
    caution?: string[] | string;
    adviceList?: string[] | string;
    summary?: string;
    [k: string]: any;
  };
};

// ======== 🔐 토큰 저장/가져오기 + authFetch 래퍼 =========
function setAccessToken(token: string, persist: boolean = true) {
  // persist=true → localStorage, false → sessionStorage
  const where = persist ? localStorage : sessionStorage;
  where.setItem('accessToken', token);
}

function getAccessToken() {
  return localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
}

async function authFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const token = getAccessToken();
  if (!token) {
    // 토큰 없을 때 동작(알림/페이지 이동 등)
    throw new Error('로그인이 필요합니다.');
  }

  const headers = new Headers(init.headers || {});
  headers.set('Accept', headers.get('Accept') || 'application/json');
  headers.set('Authorization', `Bearer ${token}`);

  // JSON 바디면 Content-Type 보장
  if (init.body && !(init.body instanceof FormData)) {
    headers.set('Content-Type', headers.get('Content-Type') || 'application/json');
  }

  const res = await fetch(input, { ...init, headers });

  // 전역 401 처리(만료 등)
  if (res.status === 401) {
    // 필요 시 토큰 삭제 및 라우팅
    localStorage.removeItem('accessToken');
    sessionStorage.removeItem('accessToken');
    throw new Error('세션이 만료되었거나 권한이 없습니다. 다시 로그인 해주세요.');
  }
  return res;
}

// (선택) 예시: 로그인 함수 — 서버 응답 포맷에 맞춰 수정해 사용
// 서버가 { token: "ey..." }를 준다고 가정
export async function loginAndSaveToken(email: string, password: string) {
  const res = await fetch(LOGIN_URL, {
    method: 'POST',
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) throw new Error('로그인 실패');
  const json = await res.json();
  const token = json?.token || json?.data?.token;
  if (!token) throw new Error('토큰을 받지 못했습니다.');
  setAccessToken(token, true); // localStorage에 저장
  return token;
}

// 파일명(확장자 유지, 없으면 .png)
function getFileName(file: File) {
  return file.name && file.name.includes('.') ? file.name : `${Date.now()}.png`;
}

// MIME → 백엔드 Enum(JPEG | PNG)
function mimeToImageTypeEnum(file: File): "JPEG" | "PNG" {
  const t = (file.type || "").toLowerCase();
  if (t === "image/jpeg" || t === "image/jpg") return "JPEG";
  if (t === "image/png") return "PNG";
  throw new Error("지원하지 않는 이미지 형식입니다. (허용: JPEG, PNG)");
}

// caution / adviceList 를 유연하게 배열로 정규화
function normalizeCaution(advice: FaceAnalyzeResponse['advice'] | any): string[] {
  if (!advice) return [];
  const c = advice.caution;
  const l = advice.adviceList;
  const toArray = (v: any): string[] =>
    Array.isArray(v) ? v.filter(Boolean).map(String)
    : typeof v === 'string' ? [v]
    : [];
  const out = [ ...toArray(c), ...toArray(l) ];
  return Array.from(new Set(out));
}

// ========= ✅ Presigned URL 발급: authFetch 사용 =========
async function requestPresignedUrl(fileName: string): Promise<string> {
  const res = await authFetch(PRESIGN_URL, {
    method: 'POST',
    body: JSON.stringify({ fileName }),
  });

  const body: APIResponse<{ url: string }> | null = await res.json().catch(() => null);
  if (!res.ok || !body || body.code !== 200 || !body.data?.url) {
    const msg = (body && body.message) || `Presigned URL 발급 실패 (HTTP ${res.status})`;
    throw new Error(msg);
  }
  return body.data.url as string;
}

// ========= ☁️ S3 업로드(무인증): 그대로 PUT =========
async function uploadToS3(presignedUrl: string, file: File): Promise<void> {
  const contentType = file.type || 'application/octet-stream';
  const res = await fetch(presignedUrl, {
    method: 'PUT',
    headers: { 'Content-Type': contentType },
    body: file,
  });
  if (!res.ok) throw new Error(`S3 업로드 실패 (HTTP ${res.status})`);
}

interface PhysiognomyServiceProps {
  onResult: (result: FortuneResult) => void;
  onBack: () => void;
}

export function PhysiognomyService({ onResult }: PhysiognomyServiceProps) {
  const [step, setStep] = useState<'info' | 'input' | 'analyzing' | 'complete'>('info');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentStatus, setCurrentStatus] = useState('');

  // 파일 업로드 핸들러
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { alert('파일 크기는 5MB를 초과할 수 없습니다.'); return; }
    const ok = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!ok.includes((file.type || '').toLowerCase())) { alert('지원 형식은 JPEG, PNG 입니다.'); return; }

    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  // 실제: Presign → S3 PUT → 분석 POST
  const handleAnalyze = async () => {
    if (!photoFile) { alert('얼굴 사진을 업로드해주세요.'); return; }

    setStep('analyzing');
    setCurrentStatus('📸 사진 확인 중...');
    setProgress(10);

    try {
      // 1) Presigned URL 발급
      setCurrentStatus('🔐 업로드 URL 발급 중...');
      setProgress(25);
      const fileName = getFileName(photoFile);
      const presignedUrl = await requestPresignedUrl(fileName);

      // 2) S3 업로드
      setCurrentStatus('☁️ S3로 사진 업로드 중...');
      setProgress(60);
      await uploadToS3(presignedUrl, photoFile);

      // 3) 객체 URL 생성(쿼리 제거)
      const objectUrl = presignedUrl.split('?')[0];

      const displayUrl = presignedUrl;

      // (표시용) 버킷/키 파싱
      let bucketName = '';
      let objectKey = '';
      try {
        const u = new URL(objectUrl);
        const hostParts = u.hostname.split('.');
        if (hostParts[0] !== 's3' && !hostParts[0].startsWith('s3-')) {
          bucketName = hostParts[0];
          objectKey = u.pathname.replace(/^\/+/, '');
        } else {
          const parts = u.pathname.split('/').filter(Boolean);
          bucketName = parts.shift() || '';
          objectKey = parts.join('/');
        }
      } catch {
        const m = objectUrl.match(/amazonaws\.com\/([^/]+)\/(.+)$/);
        if (m) { bucketName = m[1]; objectKey = m[2]; }
      }

      // 4) 분석 요청 — ✅ authFetch 사용(토큰 자동 첨부)
      setCurrentStatus('🧠 서버에 분석 요청 중...');
      setProgress(80);

      const imageType = mimeToImageTypeEnum(photoFile); // "JPEG" | "PNG"
      const analyzeRes = await authFetch(ANALYZE_URL, {
        method: 'POST',
        body: JSON.stringify({ imageUrl: objectUrl, imageType }),
      });

      const analyzeBody: APIResponse<FaceAnalyzeResponse> | null = await analyzeRes.json().catch(() => null);
      if (!analyzeRes.ok || !analyzeBody) {
        const msg = analyzeBody?.message || `분석 요청 실패 (HTTP ${analyzeRes.status})`;
        throw new Error(msg);
      }
      if (analyzeBody.code !== 200 || !analyzeBody.data) {
        const msg = analyzeBody.message || '분석 응답이 올바르지 않습니다.';
        throw new Error(msg);
      }

      const data = analyzeBody.data;
      const cautionList = normalizeCaution(data.advice);
      const adviceKeyword = data.advice?.keyword ?? '';
      const adviceSummary = data.advice?.summary ?? '';

      const stars = (n: number) => {
        const v = Math.max(0, Math.min(5, Math.floor(Number(n) || 0)));
        return '★'.repeat(v) + '☆'.repeat(5 - v);
        };
// 서버 응답을 화면용으로 매핑
const mapped = mapFaceResponse(analyzeBody.data);

// 결과 문자열
const content =
`🎯 **전체 인상**
- 설명: ${mapped.overall.summary}
- 운세: ${mapped.overall.fortune}

👁️ **눈**
- 특징: ${mapped.eye.feature}

👃 **코**
- 특징: ${mapped.nose.feature}

👄 **입**
- 특징: ${mapped.mouth.feature}

💡 **조언**
- 키워드: ${mapped.advice.keyword || '-'}
- 주의:
  ${mapped.advice.caution.length ? mapped.advice.caution.map((c, i) => `${i + 1}. ${c}`).join('\n  ') : '-' }
- 핵심 조언: ${mapped.advice.mainAdvice || '-'}

`;
// 🖼️ **얼굴**
// <img src="displayUrl">

// 🪣 버킷: ${bucketName || 'fortune-ki-bucket'}
// 🔑 키: ${objectKey || '(확인 불가)'}


      setCurrentStatus('🎉 분석 완료!');
      setProgress(100);

      const result: FortuneResult = {
        id: Date.now().toString(),
        type: 'physiognomy',
        title: '관상 분석 결과',
        content,
        date: new Date().toLocaleDateString('ko-KR'),
        paid: false,
      };

      setStep('complete');
      setTimeout(() => onResult(result), 300);
    } catch (e: any) {
      const msg = e?.message || '처리 중 오류가 발생했습니다.';
      alert(msg);
      setCurrentStatus('❌ 오류로 인해 작업이 중단되었습니다.');
      setProgress(0);
      setStep('input');
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* 소개 */}
      {step === 'info' && (
        <div className="space-y-6">
          <Card className="hanji-texture border border-hanbok-gold/30 p-6 rounded-3xl ink-shadow">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-hanbok-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">👤</span>
              </div>
              <h2 className="text-xl text-ink-black dark:text-ink-gray ink-brush">AI 관상 분석</h2>
              <p className="text-muted-foreground leading-relaxed">
                업로드한 얼굴 사진을 기반으로 AI가 관상을 분석해 결과를 제공합니다.
              </p>
            </div>
          </Card>

          <Card className="border border-border p-5 rounded-2xl">
            <h3 className="text-lg text-ink-black dark:text-ink-gray ink-brush mb-4">📋 분석 과정</h3>
            <div className="space-y-3">
              {[
                { icon: '📸', text: '정면 얼굴 사진 업로드' },
                { icon: '☁️', text: 'S3 업로드 (보안 URL 사용)' },
                { icon: '🧠', text: '서버 분석 요청' },
                { icon: '✨', text: '분석 결과 확인' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center space-x-3 p-3 rounded-xl hover:bg-hanbok-gold/5 transition-colors">
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

            <Button
              onClick={() => setStep('input')}
              className="w-full h-14 bg-hanbok-gold hover:bg-hanbok-gold-dark text-ink-black rounded-3xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              관상 분석 시작하기
            </Button>
        </div>
      )}

      {/* 입력 */}
      {step === 'input' && (
        <div className="space-y-6">
          <Card className="hanji-texture border border-hanbok-gold/30 p-6 rounded-3xl ink-shadow">
            <div className="space-y-6">
              <div className="space-y-4">
                <Label className="text-ink-black dark:text-ink-gray mb-2 flex items-center">
                  <Camera className="w-4 h-4 mr-2" />
                  얼굴 사진 업로드
                </Label>

                <div className="relative">
                  <Input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" id="photo-upload" />
                  <label htmlFor="photo-upload" className="cursor-pointer block">
                    <div
                      className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                        photoFile
                          ? 'border-hanbok-gold bg-hanbok-gold/5'
                          : 'border-border hover:border-hanbok-gold/50 hover:bg-hanbok-gold/5'
                      }`}
                    >
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
                              정면을 바라보는 선명한 얼굴 사진 (최대 5MB, 형식: JPEG/PNG)
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </label>
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
              disabled={!photoFile}
              className="flex-2 h-12 bg-hanbok-gold hover:bg-hanbok-gold-dark text-ink-black rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              분석 시작
            </Button>
          </div>
        </div>
      )}

      {/* 진행 중 */}
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
              <Progress value={progress} className="w-full h-3 rounded-full" />
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
