import React from 'react';
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Copy, Share2 } from 'lucide-react';
import { FortuneResult } from "../App";

interface ResultScreenProps {
  result: FortuneResult;
  onBack: () => void;
  onShare: () => void;
  onRecommend: (service: 'dailyfortune' | 'dream' | 'physiognomy' | 'lifefortune') => void;
}

export function ResultScreen({ result, onBack, onShare, onRecommend }: ResultScreenProps) {
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
      if (line.trim().startsWith('•')) {
        return (
          <p key={index} className="mb-2 ml-4 text-muted-foreground leading-relaxed">
            {line}
          </p>
        );
      }
      if (line.trim() === '') {
        return <div key={index} className="h-3" />;
      }
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

        {/* 결과 카드 */}
        <Card className="hanji-texture border border-hanbok-gold/30 p-6 rounded-3xl ink-shadow">
          <div className="max-w-none">
            {formatContent(result.content)}
          </div>
        </Card>

        {/* 액션 버튼 */}
        <div className="grid grid-cols-1 gap-4">
          <Button
            onClick={() => {
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

        {/* 추천 서비스 */}
        <Card className="border border-border p-5 rounded-2xl">
          <h3 className="text-lg mb-4 text-ink-black dark:text-ink-gray ink-brush">🎯 추천 서비스</h3>
          <div className="space-y-3">
            {result.type !== 'dailyfortune' && (
              <button
                type="button"
                onClick={() => onRecommend('dailyfortune')}
                className="w-full text-left flex items-center gap-4 p-4 border border-border rounded-2xl hover:border-hanbok-gold/40 hover:bg-hanbok-gold/5 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-hanbok-gold/20 rounded-2xl flex items-center justify-center">
                  <span className="text-xl">📅</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-ink-black dark:text-ink-gray font-medium">오늘의 운세</h4>
                  <p className="text-muted-foreground text-sm">하루의 운세를 확인해보세요</p>
                </div>
                <Share2 className="w-4 h-4 text-muted-foreground" />
              </button>
            )}

            {result.type !== 'dream' && (
              <button
                type="button"
                onClick={() => onRecommend('dream')}
                className="w-full text-left flex items-center gap-4 p-4 border border-border rounded-2xl hover:border-hanbok-gold/40 hover:bg-hanbok-gold/5 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-hanbok-gold/20 rounded-2xl flex items-center justify-center">
                  <span className="text-xl">💭</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-ink-black dark:text-ink-gray font-medium">해몽</h4>
                  <p className="text-muted-foreground text-sm">꿈의 의미를 알아보세요</p>
                </div>
                <Share2 className="w-4 h-4 text-muted-foreground" />
              </button>
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
      </div>
    </div>
  );
}
