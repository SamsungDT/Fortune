import React, { useEffect, useMemo, useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { User, FortuneResult } from "../App";
import { Search, Filter, TrendingUp, ChevronRight } from "lucide-react";

/** ============================
 *  🔐 Auth / Common
 * ============================ */
const API_BASE = "https://fortuneki.site";

const getToken = () => {
  try {
    return localStorage.getItem("accessToken");
  } catch {
    return null;
  }
};

// 어떤 값이 와도 보기 좋은 텍스트로 만들어 주는 헬퍼
function asText(value: any): string {
  if (value == null) return "";
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) {
    const items = value.map((v) => asText(v)).filter(Boolean);
    return items.join(", ");
  }
  if (typeof value === "object") {
    // 1순위로 많이 쓰는 키 우선 추출
    const prefer = ["summary", "overall", "description", "advice", "text", "content", "value", "message"];
    for (const k of prefer) {
      if (typeof value[k] === "string" && value[k].trim()) return value[k].trim();
    }
    // 그래도 문자열이 없으면 평탄화해서 key: value 형태로 합치기
    const parts: string[] = [];
    for (const [k, v] of Object.entries(value)) {
      const t = asText(v);
      if (t) parts.push(`${k}: ${t}`);
    }
    return parts.join(" / ");
  }
  return String(value);
}

async function fetchWithAuthJson<T>(url: string): Promise<T> {
  const token = getToken();
  if (!token) throw new Error("NO_TOKEN");

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  const ct = res.headers.get("content-type") || "";
  const isJson = ct.toLowerCase().includes("application/json");

  if (!res.ok) {
    if (isJson) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(`HTTP ${res.status} ${errJson?.message || ""}`.trim());
    } else {
      const text = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status} NON-JSON: ${text.slice(0, 120)}`);
    }
  }

  if (!isJson) {
    const text = await res.text().catch(() => "");
    throw new Error(`NON-JSON RESPONSE: ${text.slice(0, 120)}`);
  }

  return res.json();
}

/** ============================
 *  🧭 타입 매핑 (백엔드 → 프론트)
 * ============================ */
type ResultType = "physiognomy" | "lifefortune" | "dailyfortune" | "dream";

const typeMap: Record<string, ResultType> = {
  FACE: "physiognomy",
  LIFE_LONG: "lifefortune",
  DAILY_FORTUNE: "dailyfortune",
  DREAM: "dream",
};

const titleMap: Record<ResultType, string> = {
  physiognomy: "관상 분석 결과",
  lifefortune: "평생 운세 분석 결과",
  dailyfortune: "오늘의 운세 결과",
  dream: "해몽 결과",
};

/** ============================
 *  📃 “내 결과 인덱스” API
 *  GET /api/fortune/statistics/findAll
 * ============================ */
interface MyResultIndexItem {
  resultType: "DAILY_FORTUNE" | "DREAM" | "FACE" | "LIFE_LONG";
  resultId: string;
  createdAt: string; // ISO
}

type GetAllResponseA = {
  success: boolean;
  data?: { results?: MyResultIndexItem[] } | null;
};

type GetAllResponseB = {
  code: number | string;
  message?: string;
  data?: { results?: MyResultIndexItem[] } | null;
};

function extractResultsFromIndexResponse(raw: any): MyResultIndexItem[] | null {
  if (!raw) return null;
  if (Array.isArray(raw?.data?.results)) return raw.data.results as MyResultIndexItem[];
  if (Array.isArray(raw?.results)) return raw.results as MyResultIndexItem[];
  if (Array.isArray(raw?.data)) return raw.data as MyResultIndexItem[];
  return null;
}

async function fetchMyResultIndex(): Promise<MyResultIndexItem[]> {
  const raw = await fetchWithAuthJson<GetAllResponseA | GetAllResponseB>(
    `${API_BASE}/api/fortune/statistics/findAll`
  );

  const results = extractResultsFromIndexResponse(raw);
  const ok =
    (typeof (raw as any)?.success === "boolean" ? (raw as any).success : false) ||
    (String((raw as any)?.code) === "200") ||
    Array.isArray(results);

  if (!ok || !results) {
    // 개발 중 로그 (필요 없으면 제거)
    // eslint-disable-next-line no-console
    console.warn("[findAll] unexpected response shape:", raw);
    throw new Error("INDEX_API_FAIL");
  }
  return results;
}

/** ============================
 *  👤 관상 단건 조회
 *  GET /api/fortune/face/{resultId}
 * ============================ */
interface APIResponse<T> {
  code: number | string;
  message: string;
  data: T;
}

interface FaceAnalyzeResponse {
  overallImpression: {
    overallImpression?: string; // 전반 인상
    overallFortune?: string;    // 전반 운세
  };
  eye?: { feature?: string };
  nose?: { feature?: string };
  mouth?: { feature?: string };
  advice?: {
    keyword?: string;
    caution?: string | string[];   // 문자열 또는 배열 둘 다 올 수 있음
    mainAdvice?: string;           // (명세에선 summary일 수도 있었지만 예시에선 mainAdvice)
    summary?: string;              // 혹시 다른 응답에서 올 수도 있어 대비
    tomorrowHint?: string;
  };
}


async function fetchFaceById(resultId: string) {
  return fetchWithAuthJson<APIResponse<FaceAnalyzeResponse>>(
    `${API_BASE}/api/fortune/face/${resultId}`
  );
}

// 쉼표/개행/세미콜론 등으로 구분된 문자열을 목록으로 바꿔줌
function toList(v?: string | string[]): string[] {
  if (!v) return [];
  if (Array.isArray(v)) return v.map(s => String(s).trim()).filter(Boolean);
  // 한글/영문 쉼표, 세미콜론, 개행까지 모두 분리
  return String(v)
    .split(/[,\n;]+/)
    .map(s => s.trim())
    .filter(Boolean);
}

// 관상 결과를 "전체 인상/눈/코/입/조언" 섹션과 불릿으로 포매팅
function buildFaceText(d: FaceAnalyzeResponse) {
  const out: string[] = [];
  const oi = d.overallImpression || {};
  const eye = d.eye || {};
  const nose = d.nose || {};
  const mouth = d.mouth || {};
  const adv = d.advice || {};
  const cautions = toList(adv.caution);

  // 전체 인상
  out.push("🧾 전체 인상");
  if (oi.overallImpression) out.push(`- 설명: ${oi.overallImpression}`);
  if (oi.overallFortune)    out.push(`- 운세: ${oi.overallFortune}`);
  out.push(""); // 빈 줄

  // 눈
  out.push("👁 눈");
  if (eye.feature) out.push(`- 특징: ${eye.feature}`);
  out.push("");

  // 코
  out.push("👃 코");
  if (nose.feature) out.push(`- 특징: ${nose.feature}`);
  out.push("");

  // 입
  out.push("👄 입");
  if (mouth.feature) out.push(`- 특징: ${mouth.feature}`);
  out.push("");

  // 조언
  out.push("💡 조언");
  if (adv.keyword) out.push(`- 키워드: ${adv.keyword}`);

if (cautions.length) {
  out.push(`- 주의:\n`);
  cautions.forEach((c) => {
    out.push(`  ${c}\n`);   // 번호 안 붙임
  });
}
  const main = adv.summary || adv.mainAdvice;
  if (main) out.push(`- 핵심 조언: ${main}`);
  if (adv.tomorrowHint) out.push(`- 내일 힌트: ${adv.tomorrowHint}`);

  // 끝의 불필요한 빈 줄 제거
  while (out.length && out[out.length - 1] === "") out.pop();

  return out.join("\n");
}



/** ============================
 *  💭 해몽 단건 조회
 *  GET /api/fortune/dream/{resultId}
 * ============================ */
interface DreamResponse {
  summary?: string;
  symbolInterpretation?: {
    symbolText?: string;
  };
  psychologicalAnalysis?: {
    tip1?: string;
    tip2?: string;
    tip3?: string;
    tip4?: string;
  };
  fortuneProspects?: {
    shortTermOutlook?: string;
    mediumTermOutlook?: string;
    longTermOutlook?: string;
  };
  precautions?: {
    precaution1?: string;
    precaution2?: string;
    precaution3?: string;
  };
  adviceAndLuck?: {
    advice1?: string;
    advice2?: string;
    advice3?: string;
    advice4?: string;
    advice5?: string;
  };
  specialMessage?: {
    messageText?: string;
  };
}

async function fetchDreamById(resultId: string) {
  return fetchWithAuthJson<APIResponse<DreamResponse>>(
    `${API_BASE}/api/fortune/dream/${resultId}`
  );
}

function buildDreamText(d: DreamResponse) {
  const out: string[] = [];
  const section = (title: string) => out.push(title);
  const bullet = (label: string, v?: any) => {
    if (v) out.push(`• ${label}: ${v}`);
  };

  // 요약
  if (d.summary) {
    section("✨ 요약");
    out.push(d.summary);
    out.push("");
  }

  // 상징 해석
  if (d.symbolInterpretation?.symbolText) {
    section("🔮 상징 해석");
    out.push(d.symbolInterpretation.symbolText);
    out.push("");
  }

  // 심리 분석
  if (d.psychologicalAnalysis && Object.values(d.psychologicalAnalysis).some(Boolean)) {
    section("🧠 심리 분석");
    bullet("Tip1", d.psychologicalAnalysis.tip1);
    bullet("Tip2", d.psychologicalAnalysis.tip2);
    bullet("Tip3", d.psychologicalAnalysis.tip3);
    bullet("Tip4", d.psychologicalAnalysis.tip4);
    out.push("");
  }

  // 전망
  if (d.fortuneProspects && Object.values(d.fortuneProspects).some(Boolean)) {
    section("📈 전망");
    bullet("단기", d.fortuneProspects.shortTermOutlook);
    bullet("중기", d.fortuneProspects.mediumTermOutlook);
    bullet("장기", d.fortuneProspects.longTermOutlook);
    out.push("");
  }

  // 주의
  if (d.precautions && Object.values(d.precautions).some(Boolean)) {
    section("⚠️ 주의사항");
    bullet("1", d.precautions.precaution1);
    bullet("2", d.precautions.precaution2);
    bullet("3", d.precautions.precaution3);
    out.push("");
  }

  // 조언 & 행운
  if (d.adviceAndLuck && Object.values(d.adviceAndLuck).some(Boolean)) {
    section("💡 조언 & 행운");
    bullet("1", d.adviceAndLuck.advice1);
    bullet("2", d.adviceAndLuck.advice2);
    bullet("3", d.adviceAndLuck.advice3);
    bullet("4", d.adviceAndLuck.advice4);
    bullet("5", d.adviceAndLuck.advice5);
    out.push("");
  }

  // 특별 메시지
  if (d.specialMessage?.messageText) {
    section("🌟 특별 메시지");
    out.push(d.specialMessage.messageText);
    out.push("");
  }

  if (out.length === 0) return "해몽 데이터가 준비되지 않았습니다.";

  while (out.length && out[out.length - 1] === "") out.pop();
  return out.join("\n");
}

/* ============================ */
// 📅 오늘의 운세 단건 조회
// GET /api/fortune/daily/{resultId}
interface DailyFortuneResponse {
  id: string;
  fortuneDate?: string;
  overallRating?: number;
  overallSummary?: string;

  wealth?: {
    wealthSummary?: string;
    wealthTip1?: string;
    wealthTip2?: string;
    lottoNumbers?: string;
  };

  love?: {
    single?: string;
    inRelationship?: string;
    married?: string;
  };

  career?: {
    tip1?: string;
    tip2?: string;
    tip3?: string;
    tip4?: string;
  };

  health?: {
    tip1?: string;
    tip2?: string;
    tip3?: string;
    tip4?: string;
  };

  keywords?: {
    luckyColors?: string;
    luckyNumbers?: string;
    luckyTimes?: string;
    luckyDirection?: string;
    goodFoods?: string;
  };

  precautions?: {
    precaution1?: string;
    precaution2?: string;
    precaution3?: string;
    precaution4?: string;
  };

  advice?: {
    adviceText?: string;
  };

  tomorrowPreview?: string;
}

async function fetchDailyById(resultId: string) {
  return fetchWithAuthJson<APIResponse<DailyFortuneResponse>>(
    `${API_BASE}/api/fortune/daily/${resultId}`
  );
}



function buildDailyText(d: DailyFortuneResponse) {
  const out: string[] = [];
  const section = (title: string) => out.push(title);
  const bullet = (label: string, v?: any) => {
    if (v) out.push(`• ${label}: ${v}`);
  };

  // 전반 요약
  if (d.overallSummary) {
    section("✨ 오늘의 총평");
    out.push(d.overallSummary);
    if (d.overallRating) out.push(`(별점: ${"⭐".repeat(d.overallRating)})`);
    out.push("");
  }

  // 재물운
  if (d.wealth && Object.values(d.wealth).some(Boolean)) {
    section("💰 재물운");
    bullet("요약", d.wealth.wealthSummary);
    bullet("Tip1", d.wealth.wealthTip1);
    bullet("Tip2", d.wealth.wealthTip2);
    bullet("로또 번호", d.wealth.lottoNumbers);
    out.push("");
  }

  // 연애운
  if (d.love && Object.values(d.love).some(Boolean)) {
    section("❤️ 연애운");
    bullet("싱글", d.love.single);
    bullet("연인", d.love.inRelationship);
    bullet("기혼", d.love.married);
    out.push("");
  }

  // 직업/커리어
  if (d.career && Object.values(d.career).some(Boolean)) {
    section("💼 커리어");
    bullet("Tip1", d.career.tip1);
    bullet("Tip2", d.career.tip2);
    bullet("Tip3", d.career.tip3);
    bullet("Tip4", d.career.tip4);
    out.push("");
  }

  // 건강
  if (d.health && Object.values(d.health).some(Boolean)) {
    section("🩺 건강");
    bullet("Tip1", d.health.tip1);
    bullet("Tip2", d.health.tip2);
    bullet("Tip3", d.health.tip3);
    bullet("Tip4", d.health.tip4);
    out.push("");
  }

  // 행운 키워드
  if (d.keywords && Object.values(d.keywords).some(Boolean)) {
    section("🍀 오늘의 행운 포인트");
    bullet("색상", d.keywords.luckyColors);
    bullet("숫자", d.keywords.luckyNumbers);
    bullet("시간", d.keywords.luckyTimes);
    bullet("방향", d.keywords.luckyDirection);
    bullet("음식", d.keywords.goodFoods);
    out.push("");
  }

  // 주의사항
  if (d.precautions && Object.values(d.precautions).some(Boolean)) {
    section("⚠️ 주의사항");
    bullet("1", d.precautions.precaution1);
    bullet("2", d.precautions.precaution2);
    bullet("3", d.precautions.precaution3);
    bullet("4", d.precautions.precaution4);
    out.push("");
  }

  // 조언
  if (d.advice?.adviceText) {
    section("💡 오늘의 조언");
    out.push(d.advice.adviceText);
    out.push("");
  }

  // 내일 미리보기
  if (d.tomorrowPreview) {
    section("🔮 내일 미리보기");
    out.push(d.tomorrowPreview);
    out.push("");
  }

  if (out.length === 0) return "오늘의 운세 데이터가 준비되지 않았습니다.";

  while (out.length && out[out.length - 1] === "") out.pop();
  return out.join("\n");
}

/** ============================
 *  🌟 평생 운세 단건 조회
 *  GET /api/fortune/total/{resultId}
 * ============================ */
// 🌟 평생 운세 단건 조회
// GET /api/fortune/total/{resultId}
interface LifeLongResponse {
  id: string;
  personality?: {
    strength?: string;
    talent?: string;
    responsibility?: string;
    empathy?: string;
  };
  wealth?: {
    twenties?: string;
    thirties?: string;
    forties?: string;
    fiftiesAndBeyond?: string;
  };
  loveAndMarriage?: {
    firstLove?: string;
    marriageAge?: string;
    spouseMeeting?: string;
    marriedLife?: string;
  };
  career?: {
    successfulFields?: string;
    careerChangeAge?: string;
    leadershipStyle?: string;
    entrepreneurship?: string;
  };
  health?: {
    generalHealth?: string;
    weakPoint?: string;
    checkupReminder?: string;
    recommendedExercise?: string;
  };
  turningPoints?: {
    ein?: string;
    zwei?: string;
    drei?: string;
  };
  goodLuck?: {
    luckyColors?: string;
    luckyNumbers?: string;
    luckyDirection?: string;
    goodDays?: string;
    avoidances?: string;
  };
}

async function fetchLifeLongById(resultId: string) {
  return fetchWithAuthJson<APIResponse<LifeLongResponse>>(
    `${API_BASE}/api/fortune/total/${resultId}`
  );
}


function buildLifeLongText(d: LifeLongResponse) {
  const out: string[] = [];
  const section = (title: string) => out.push(title);
  const bullet = (label: string, v?: any) => {
    const t = asText(v);
    if (t) out.push(`• ${label}: ${t}`);
  };

  // 성향/성격
  if (d.personality && Object.values(d.personality).some(Boolean)) {
    section("🧭 성향·성격");
    bullet("장점", d.personality.strength);
    bullet("재능", d.personality.talent);
    bullet("책임감", d.personality.responsibility);
    bullet("공감 능력", d.personality.empathy);
    out.push(""); // 빈 줄
  }

  // 재물운
  if (d.wealth && Object.values(d.wealth).some(Boolean)) {
    section("💰 재물운");
    bullet("20대", d.wealth.twenties);
    bullet("30대", d.wealth.thirties);
    bullet("40대", d.wealth.forties);
    bullet("50대 이후", d.wealth.fiftiesAndBeyond);
    out.push("");
  }

  // 연애·결혼
  if (d.loveAndMarriage && Object.values(d.loveAndMarriage).some(Boolean)) {
    section("❤️ 연애·결혼운");
    bullet("첫사랑", d.loveAndMarriage.firstLove);
    bullet("결혼 시기", d.loveAndMarriage.marriageAge);
    bullet("배우자 만남", d.loveAndMarriage.spouseMeeting);
    bullet("결혼 생활", d.loveAndMarriage.marriedLife);
    out.push("");
  }

  // 직업·커리어
  if (d.career && Object.values(d.career).some(Boolean)) {
    section("🏆 직업·커리어");
    bullet("적합 분야", d.career.successfulFields);
    bullet("전환 시기", d.career.careerChangeAge);
    bullet("리더십 스타일", d.career.leadershipStyle);
    bullet("창업 기질", d.career.entrepreneurship);
    out.push("");
  }

  // 건강
  if (d.health && Object.values(d.health).some(Boolean)) {
    section("🩺 건강운");
    bullet("종합", d.health.generalHealth);
    bullet("약점", d.health.weakPoint);
    bullet("점검 포인트", d.health.checkupReminder);
    bullet("추천 운동", d.health.recommendedExercise);
    out.push("");
  }

  // 전환점
  if (d.turningPoints && Object.values(d.turningPoints).some(Boolean)) {
    section("🔀 전환점");
    bullet("1차", d.turningPoints.ein);
    bullet("2차", d.turningPoints.zwei);
    bullet("3차", d.turningPoints.drei);
    out.push("");
  }

  // 행운 포인트
  if (d.goodLuck && Object.values(d.goodLuck).some(Boolean)) {
    section("🍀 행운 포인트");
    bullet("행운의 색", d.goodLuck.luckyColors);
    bullet("행운의 숫자", d.goodLuck.luckyNumbers);
    bullet("행운의 방향", d.goodLuck.luckyDirection);
    bullet("좋은 요일", d.goodLuck.goodDays);
    bullet("피해야 할 것", d.goodLuck.avoidances);
    out.push("");
  }

  // 모든 섹션이 비어 있으면 안전망
  if (out.length === 0) return "추후 평생 운세 상세가 준비됩니다.";

  // 마지막 공백 줄 제거
  while (out.length && out[out.length - 1] === "") out.pop();

  return out.join("\n");
}

/** ============================
 *  🎨 UI utils
 * ============================ */
const getTypeIcon = (type: string) => {
  switch (type) {
    case "physiognomy":
      return "👤";
    case "lifefortune":
      return "🌟";
    case "dailyfortune":
      return "📅";
    case "dream":
      return "💭";
    default:
      return "🔮";
  }
};
const getTypeName = (type: string) => {
  switch (type) {
    case "physiognomy":
      return "관상";
    case "lifefortune":
      return "평생운세";
    case "dailyfortune":
      return "오늘운세";
    case "dream":
      return "해몽";
    default:
      return "운세";
  }
};

/** ============================
 *  🧩 Component
 * ============================ */
interface MyResultsScreenProps {
  user: User;
  onBack: () => void;
  onResultSelect: (result: FortuneResult) => void;
}

export function MyResultsScreen({
  user,
  onBack,
  onResultSelect,
}: MyResultsScreenProps) {
  // 서버 + 기존(user.results) 병합 결과
  const [results, setResults] = useState<FortuneResult[]>(user.results || []);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<ResultType | "all">("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  /** 🔁 마운트/로그인 시: 서버 인덱스 → 타입별 상세 hydrate */
  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      setLoading(true);
      setLoadError(null);

      try {
        // 1) 내 결과 인덱스 받아오기
        const index = await fetchMyResultIndex(); // [{ resultType, resultId, createdAt }]

        // 2) 인덱스를 FortuneResult 스텁으로 매핑
        const stubs: FortuneResult[] = index.map((it) => {
          const t = typeMap[it.resultType] || "physiognomy";
          return {
            id: it.resultId,
            type: t,
            title: titleMap[t],
            date: it.createdAt, // 서버 시간 그대로
            content: "", // 상세 채우기 전
            paid: true, // 필요 시 서버 값으로 교체
          };
        });

        // 기존 state와 중복 제거(최신 우선)
        const existingById = new Map(results.map((r) => [r.id, r]));
        const merged: FortuneResult[] = [];
        for (const s of stubs) {
          existingById.set(s.id, {
            ...(existingById.get(s.id) || ({} as FortuneResult)),
            ...s,
          });
        }
        existingById.forEach((v) => merged.push(v));

        // 3) 타입별 상세 조회로 content 채우기
        // 관상
        const needFaceFetch = merged.filter(
          (r) => r.type === "physiognomy" && !r.content
        );
        // 해몽
        const needDreamFetch = merged.filter(
          (r) => r.type === "dream" && !r.content
        );
        // 오늘의 운세
        const needDailyFetch = merged.filter(
          (r) => r.type === "dailyfortune" && !r.content
        );
        // 평생 운세
        const needLifeFetch = merged.filter(
          (r) => r.type === "lifefortune" && !r.content
        );

        // 병렬 조회 (한 타입씩 Promise.all)
        await Promise.all([
          Promise.all(
            needFaceFetch.map(async (item) => {
              try {
                const json = await fetchFaceById(item.id);
                item.content = buildFaceText(json.data);
              } catch {}
            })
          ),
          Promise.all(
            needDreamFetch.map(async (item) => {
              try {
                const json = await fetchDreamById(item.id);
                item.content = buildDreamText(json.data);
              } catch {}
            })
          ),
          Promise.all(
            needDailyFetch.map(async (item) => {
              try {
                const json = await fetchDailyById(item.id);
                item.content = buildDailyText(json.data);
              } catch {}
            })
          ),
          Promise.all(
            needLifeFetch.map(async (item) => {
              try {
                const json = await fetchLifeLongById(item.id);
                item.content = buildLifeLongText(json.data);
              } catch {}
            })
          ),
        ]);

        if (!cancelled) setResults(merged);
      } catch (e: any) {
        if (!cancelled) setLoadError(e?.message || "불러오기 실패");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    hydrate();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id]); // 사용자 변경 시 다시

  /** 🔎 필터/검색/정렬 */
  const filteredResults = useMemo(() => {
    const list = (results || []).filter((result) => {
      const matchesSearch =
        result.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === "all" || result.type === filterType;
      return matchesSearch && matchesType;
    });
    return list.sort((a, b) =>
      sortOrder === "newest"
        ? new Date(b.date).getTime() - new Date(a.date).getTime()
        : new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [results, searchTerm, filterType, sortOrder]);

  /** 📊 통계 */
  const stats = useMemo(
    () => ({
      total: results.length,
      physiognomy: results.filter((r) => r.type === "physiognomy").length,
      lifefortune: results.filter((r) => r.type === "lifefortune").length,
      dailyfortune: results.filter((r) => r.type === "dailyfortune").length,
      dream: results.filter((r) => r.type === "dream").length,
      paid: results.filter((r) => r.paid).length,
      free: results.filter((r) => !r.paid).length,
    }),
    [results]
  );

  return (
    <div className="p-6 pb-20 space-y-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* 상단 카드 */}
        <div className="gap-4">
          <Card className="hanji-texture border border-hanbok-gold/30 p-5 text-center rounded-3xl ink-shadow hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 bg-hanbok-gold/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-hanbok-gold-dark" />
            </div>
            <div className="text-2xl font-bold text-hanbok-gold-dark mb-1">
              {stats.total}
            </div>
            <div className="text-sm text-muted-foreground">총 이용</div>
          </Card>
        </div>

        {/* 카운터 */}
        <div className="grid grid-cols-4 gap-3">
          <Card className="border border-border p-4 text-center rounded-2xl hover:border-hanbok-gold/40 transition-all duration-300 hover:shadow-md">
            <div className="text-2xl mb-2">👤</div>
            <div className="text-lg font-bold text-hanbok-gold-dark">
              {stats.physiognomy}
            </div>
            <div className="text-xs text-muted-foreground">관상</div>
          </Card>
          <Card className="border border-border p-4 text-center rounded-2xl hover:border-hanbok-gold/40 transition-all duration-300 hover:shadow-md">
            <div className="text-2xl mb-2">🌟</div>
            <div className="text-lg font-bold text-hanbok-gold-dark">
              {stats.lifefortune}
            </div>
            <div className="text-xs text-muted-foreground">평생운세</div>
          </Card>
          <Card className="border border-border p-4 text-center rounded-2xl hover:border-hanbok-gold/40 transition-all duration-300 hover:shadow-md">
            <div className="text-2xl mb-2">📅</div>
            <div className="text-lg font-bold text-hanbok-gold-dark">
              {stats.dailyfortune}
            </div>
            <div className="text-xs text-muted-foreground">오늘운세</div>
          </Card>
          <Card className="border border-border p-4 text-center rounded-2xl hover:border-hanbok-gold/40 transition-all duration-300 hover:shadow-md">
            <div className="text-2xl mb-2">💭</div>
            <div className="text-lg font-bold text-hanbok-gold-dark">
              {stats.dream}
            </div>
            <div className="text-xs text-muted-foreground">해몽</div>
          </Card>
        </div>

        {/* 검색/필터 */}
        <Card className="border border-border p-5 rounded-3xl ink-shadow">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="결과 내용 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-12 pl-10 rounded-2xl border-border focus:border-hanbok-gold/50 focus:ring-hanbok-gold/20"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Select
                value={filterType}
                onValueChange={(v: any) => setFilterType(v)}
              >
                <SelectTrigger className="h-12 rounded-2xl border-border focus:border-hanbok-gold/50 focus:ring-hanbok-gold/20">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="서비스 유형" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  <SelectItem value="all">🔮 전체</SelectItem>
                  <SelectItem value="physiognomy">👤 관상</SelectItem>
                  <SelectItem value="lifefortune">🌟 평생 운세</SelectItem>
                  <SelectItem value="dailyfortune">📅 오늘의 운세</SelectItem>
                  <SelectItem value="dream">💭 해몽</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={sortOrder}
                onValueChange={(v: any) => setSortOrder(v)}
              >
                <SelectTrigger className="h-12 rounded-2xl border-border focus:border-hanbok-gold/50 focus:ring-hanbok-gold/20">
                  <SelectValue placeholder="정렬 순서" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  <SelectItem value="newest">🕐 최신순</SelectItem>
                  <SelectItem value="oldest">📅 오래된순</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* 로딩/에러 */}
        {loading && (
          <Card className="border border-hanbok-gold/30 p-4 rounded-2xl">
            <p className="text-sm text-muted-foreground">
              서버에서 내 결과를 불러오는 중…
            </p>
          </Card>
        )}
        {loadError && (
          <Card className="border border-red-300 p-4 rounded-2xl">
            <p className="text-sm text-red-600">불러오기 오류: {loadError}</p>
          </Card>
        )}

        {/* 결과 목록 */}
        {filteredResults.length === 0 && !loading ? (
          <Card className="hanji-texture border border-hanbok-gold/30 p-8 text-center rounded-3xl ink-shadow">
            <div className="w-16 h-16 bg-hanbok-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔍</span>
            </div>
            <h3 className="text-lg text-ink-black dark:text-ink-gray mb-2 ink-brush">
              {results.length === 0 ? "아직 이용한 서비스가 없습니다" : "검색 결과가 없습니다"}
            </h3>
            <p className="text-muted-foreground">
              {results.length === 0 ? "운세 서비스를 이용해보세요!" : "다른 검색어나 필터를 사용해보세요"}
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredResults.map((result, index) => (
              <div key={`${result.id}-${index}`}>
                <Card
                  className="border border-border p-5 hover:border-hanbok-gold/60 hover:shadow-lg transition-all duration-300 cursor-pointer rounded-2xl group"
                  onClick={() => onResultSelect(result)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="w-12 h-12 bg-hanbok-gold/20 rounded-2xl flex items-center justify-center group-hover:bg-hanbok-gold/30 transition-colors">
                          <span className="text-xl">{getTypeIcon(result.type)}</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-base text-ink-black dark:text-ink-gray ink-brush font-medium">
                            {result.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {result.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Badge className="bg-hanbok-gold/20 text-hanbok-gold-dark border border-hanbok-gold/40 rounded-full px-3 py-1 text-xs">
                          {getTypeName(result.type)}
                        </Badge>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-hanbok-gold-dark transition-colors" />
                  </div>
                </Card>
              </div>
            ))}
          </div>
        )}

        {/* 총 개수 안내 */}
        {filteredResults.length > 0 && (
          <Card className="border border-border p-4 text-center rounded-2xl">
            <p className="text-muted-foreground text-sm">
              총{" "}
              <span className="text-hanbok-gold-dark font-semibold">
                {filteredResults.length}개
              </span>
              의 결과를 찾았습니다
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
