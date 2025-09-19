import React, { useState } from 'react';
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { User, FortuneResult } from "../App";
import { AdBanner } from './AdBanner';
import { Search, Filter, TrendingUp, Gift, ChevronRight } from 'lucide-react';

interface MyResultsScreenProps {
  user: User;
  onBack: () => void;
  onResultSelect: (result: FortuneResult) => void;
}

export function MyResultsScreen({ user, onBack, onResultSelect }: MyResultsScreenProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');

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

  // 필터링 및 정렬된 결과
  const filteredResults = user.results
    .filter(result => {
      const matchesSearch = result.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          result.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || result.type === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      if (sortOrder === 'newest') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
    });

  // 통계 계산
  const stats = {
    total: user.results.length,
    physiognomy: user.results.filter(r => r.type === 'physiognomy').length,
    lifefortune: user.results.filter(r => r.type === 'lifefortune').length,
    dailyfortune: user.results.filter(r => r.type === 'dailyfortune').length,
    dream: user.results.filter(r => r.type === 'dream').length,
    paid: user.results.filter(r => r.paid).length,
    free: user.results.filter(r => !r.paid).length
  };

  return (
    <div className="p-6 pb-20 space-y-6">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* 상단 광고 */}
        <AdBanner type="banner" size="medium" />

        {/* 통계 카드 */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="hanji-texture border border-hanbok-gold/30 p-5 text-center rounded-3xl ink-shadow hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 bg-hanbok-gold/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-hanbok-gold-dark" />
            </div>
            <div className="text-2xl font-bold text-hanbok-gold-dark mb-1">{stats.total}</div>
            <div className="text-sm text-muted-foreground">총 이용</div>
          </Card>
          
          <Card className="hanji-texture border border-hanbok-gold/30 p-5 text-center rounded-3xl ink-shadow hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 bg-dancheong-green/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Gift className="w-6 h-6 text-dancheong-green" />
            </div>
            <div className="text-2xl font-bold text-dancheong-green mb-1">{stats.free}</div>
            <div className="text-sm text-muted-foreground">무료 이용</div>
          </Card>
        </div>
        
        <div className="grid grid-cols-4 gap-3">
          <Card className="border border-border p-4 text-center rounded-2xl hover:border-hanbok-gold/40 transition-all duration-300 hover:shadow-md">
            <div className="text-2xl mb-2">👤</div>
            <div className="text-lg font-bold text-hanbok-gold-dark">{stats.physiognomy}</div>
            <div className="text-xs text-muted-foreground">관상</div>
          </Card>
          
          <Card className="border border-border p-4 text-center rounded-2xl hover:border-hanbok-gold/40 transition-all duration-300 hover:shadow-md">
            <div className="text-2xl mb-2">🌟</div>
            <div className="text-lg font-bold text-hanbok-gold-dark">{stats.lifefortune}</div>
            <div className="text-xs text-muted-foreground">평생운세</div>
          </Card>
          
          <Card className="border border-border p-4 text-center rounded-2xl hover:border-hanbok-gold/40 transition-all duration-300 hover:shadow-md">
            <div className="text-2xl mb-2">📅</div>
            <div className="text-lg font-bold text-hanbok-gold-dark">{stats.dailyfortune}</div>
            <div className="text-xs text-muted-foreground">오늘운세</div>
          </Card>
          
          <Card className="border border-border p-4 text-center rounded-2xl hover:border-hanbok-gold/40 transition-all duration-300 hover:shadow-md">
            <div className="text-2xl mb-2">💭</div>
            <div className="text-lg font-bold text-hanbok-gold-dark">{stats.dream}</div>
            <div className="text-xs text-muted-foreground">해몽</div>
          </Card>
        </div>

        {/* 중간 광고 */}
        <AdBanner type="card" />

        {/* 필터 및 검색 */}
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
              <Select value={filterType} onValueChange={setFilterType}>
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
              
              <Select value={sortOrder} onValueChange={setSortOrder}>
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

        {/* 결과 목록 */}
        {filteredResults.length === 0 ? (
          <Card className="hanji-texture border border-hanbok-gold/30 p-8 text-center rounded-3xl ink-shadow">
            <div className="w-16 h-16 bg-hanbok-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔍</span>
            </div>
            <h3 className="text-lg text-ink-black dark:text-ink-gray mb-2 ink-brush">
              {user.results.length === 0 ? '아직 이용한 서비스가 없습니다' : '검색 결과가 없습니다'}
            </h3>
            <p className="text-muted-foreground">
              {user.results.length === 0 
                ? '운세 서비스를 이용해보세요!' 
                : '다른 검색어나 필터를 사용해보세요'}
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredResults.map((result, index) => (
              <div key={result.id}>
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
                          <h3 className="text-base text-ink-black dark:text-ink-gray ink-brush font-medium">{result.title}</h3>
                          <p className="text-sm text-muted-foreground">{result.date}</p>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                        {result.content.replace(/\*\*|\*/g, '').substring(0, 120)}...
                      </p>
                      
                      <div className="flex gap-2">
                        <Badge className="bg-hanbok-gold/20 text-hanbok-gold-dark border border-hanbok-gold/40 rounded-full px-3 py-1 text-xs">
                          {getTypeName(result.type)}
                        </Badge>
                        <Badge 
                          className={`rounded-full px-3 py-1 text-xs border ${
                            result.paid 
                              ? "bg-dancheong-red/20 text-dancheong-red border-dancheong-red/40" 
                              : "bg-dancheong-green/20 text-dancheong-green border-dancheong-green/40"
                          }`}
                        >
                          {result.paid ? '💰 유료' : '🎁 무료'}
                        </Badge>
                      </div>
                    </div>
                    
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-hanbok-gold-dark transition-colors" />
                  </div>
                </Card>
                
                {/* 결과 사이에 광고 삽입 (5개마다) */}
                {(index + 1) % 5 === 0 && index < filteredResults.length - 1 && (
                  <div className="my-4">
                    <AdBanner type="native" size="small" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* 더 많은 결과가 있을 때의 안내 */}
        {filteredResults.length > 0 && (
          <Card className="border border-border p-4 text-center rounded-2xl">
            <p className="text-muted-foreground text-sm">
              총 <span className="text-hanbok-gold-dark font-semibold">{filteredResults.length}개</span>의 결과를 찾았습니다
            </p>
          </Card>
        )}

        {/* 하단 광고 */}
        <AdBanner type="banner" size="large" />
      </div>
    </div>
  );
}