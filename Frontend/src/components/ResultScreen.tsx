import React from 'react';
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { FortuneResult } from "../App";
//import { AdBanner } from './AdBanner';
import { Share2, Copy, MessageCircle } from 'lucide-react';

interface ResultScreenProps {
  result: FortuneResult;
  onBack: () => void;
  onShare: () => void;
}

export function ResultScreen({ result, onBack, onShare }: ResultScreenProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'physiognomy': return '👤';
      case 'lifefortune': return '🌟';
      case 'dailyfortune': return '📅';
      case 'dream': return '💭';
      default: return '🔮';
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'physiognomy': return '관상';
      case 'lifefortune': return '평생 운세';
      case 'dailyfortune': return '오늘의 운세';
      case 'dream': return '해몽';
      default: return '운세';
    }
  };

  const formatContent = (content: string) => {
    return content.split('\n').map((line, index) => {
      // 볼드 텍스트 처리 (**텍스트**)
      if (line.includes('**')) {
        const parts = line.split('**');
        return (
          <p key={index} className="mb-4 leading-relaxed">
            {parts.map((part, i) => 
              i % 2 === 1 ? <strong key={i} className="text-hanbok-gold-dark font-semibold">{part}</strong> : part
            )}
          </p>
        );
      }
      
      // 불릿 포인트 처리
      if (line.trim().startsWith('•')) {
        return (
          <p key={index} className="mb-2 ml-4 text-muted-foreground leading-relaxed">
            {line}
          </p>
        );
      }
      
      // 빈 줄
      if (line.trim() === '') {
        return <div key={index} className="h-3" />;
      }
      
      // 일반 텍스트
      return (
        <p key={index} className="mb-3 text-ink-black dark:text-ink-gray leading-relaxed">
          {line}
        </p>
      );
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="w-full space-y-6">
        
        {/* 상단 광고 */}
{/*         <AdBanner type="banner" size="medium" /> */}

        {/* 상태 뱃지 */}
        {/* <div className="flex gap-3">
          <Badge className={`${result.paid ? 'bg-dancheong-red/20 text-dancheong-red border-dancheong-red/40' : 'bg-dancheong-green/20 text-dancheong-green border-dancheong-green/40'} border rounded-full px-3 py-1`}>
            {result.paid ? '💰 결제 완료' : '🎁 무료 이용'}
          </Badge>
          <Badge className="bg-hanbok-gold/20 text-hanbok-gold-dark border border-hanbok-gold/40 rounded-full px-3 py-1">
            {getTypeIcon(result.type)} {getTypeName(result.type)}
          </Badge>
        </div> */}

        {/* 결과 카드 */}
        <Card className="hanji-texture border border-hanbok-gold/30 p-6 rounded-3xl ink-shadow">
          <div className="max-w-none">
            {formatContent(result.content)}
          </div>
        </Card>

        {/* 액션 버튼들 */}
        <div className="grid grid-cols-1 gap-4">
          <Button 
            onClick={onShare}
            className="h-14 bg-yellow-400 hover:bg-yellow-500 text-black rounded-3xl border border-yellow-500/30 shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            카카오톡으로 공유하기
          </Button>
          
          <Button 
            onClick={() => {
              // 텍스트 복사 기능
              navigator.clipboard.writeText(`${result.title}\n\n${result.content}`)
                .then(() => alert('결과가 클립보드에 복사되었습니다!'))
                .catch(() => alert('복사에 실패했습니다.'));
            }}
            variant="outline"
            className="h-14 border-2 border-border hover:border-hanbok-gold/50 hover:bg-hanbok-gold/5 rounded-3xl font-medium"
          >
            <Copy className="w-5 h-5 mr-2" />
            텍스트 복사하기
          </Button>
        </div>

        {/* 중간 광고 */}
{/*         <AdBanner type="card" /> */}

        {/* 추천 서비스 */}
        <Card className="border border-border p-5 rounded-2xl">
          <h3 className="text-lg mb-4 text-ink-black dark:text-ink-gray ink-brush">🎯 추천 서비스</h3>
          <div className="space-y-3">
            {result.type !== 'dailyfortune' && (
              <div className="flex items-center gap-4 p-4 border border-border rounded-2xl hover:border-hanbok-gold/40 hover:bg-hanbok-gold/5 transition-all duration-300 cursor-pointer">
                <div className="w-12 h-12 bg-hanbok-gold/20 rounded-2xl flex items-center justify-center">
                  <span className="text-xl">📅</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-ink-black dark:text-ink-gray font-medium">오늘의 운세</h4>
                  <p className="text-muted-foreground text-sm">하루의 운세를 확인해보세요</p>
                </div>
                <Share2 className="w-4 h-4 text-muted-foreground" />
              </div>
            )}
            
            {result.type !== 'dream' && (
              <div className="flex items-center gap-4 p-4 border border-border rounded-2xl hover:border-hanbok-gold/40 hover:bg-hanbok-gold/5 transition-all duration-300 cursor-pointer">
                <div className="w-12 h-12 bg-hanbok-gold/20 rounded-2xl flex items-center justify-center">
                  <span className="text-xl">💭</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-ink-black dark:text-ink-gray font-medium">해몽</h4>
                  <p className="text-muted-foreground text-sm">꿈의 의미를 알아보세요</p>
                </div>
                <Share2 className="w-4 h-4 text-muted-foreground" />
              </div>
            )}
          </div>
        </Card>

        {/* 공유 안내 */}
        <Card className="border border-dancheong-blue/30 bg-dancheong-blue/5 p-5 text-center rounded-2xl">
          <div className="w-12 h-12 bg-dancheong-blue/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-xl">💌</span>
          </div>
          <h4 className="text-ink-black dark:text-ink-gray font-medium mb-2">
            결과가 마음에 드셨나요?
          </h4>
          <p className="text-muted-foreground text-sm">
            친구들과 공유하고 함께 운세를 확인해보세요!
          </p>
        </Card>

        {/* 하단 광고 */}
{/*         <AdBanner type="banner" size="large" /> */}
      </div>
    </div>
  );
}
