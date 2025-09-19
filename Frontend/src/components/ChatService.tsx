import React, { useState, useRef, useEffect } from 'react';
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { Send, Bot, User as UserIcon, Sparkles, MessageCircle } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  loginProvider: string;
  birthDate?: string;
  birthTime?: string;
  isPremium?: boolean;
}

interface FortuneResult {
  id: string;
  type: 'physiognomy' | 'lifefortune' | 'dailyfortune' | 'dream' | 'chat';
  title: string;
  content: string;
  date: string;
  paid: boolean;
}

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
}

interface ChatServiceProps {
  user: User;
  onResult: (result: FortuneResult) => void;
  onBack: () => void;
}

export function ChatService({ user, onResult, onBack }: ChatServiceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: `안녕하세요, ${user.name}님! 🌟 

저는 Fortune K.I의 AI 운세 상담사입니다. 운세, 사주, 타로, 꿈해몽 등 궁금한 것이 있으시면 언제든지 물어보세요!

💫 **이런 것들을 도와드릴 수 있어요:**
• 오늘/이번 주/이번 달 운세
• 연애운, 재물운, 건강운, 사업운
• 사주 기반 성격 분석
• 꿈 해몽 및 의미 분석
• 중요한 결정에 대한 조언
• 인간관계 고민 상담

편안하게 대화하듯 질문해 주세요! 😊`,
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // 인사말 패턴
    if (message.includes('안녕') || message.includes('하이') || message.includes('hello')) {
      return `안녕하세요, ${user.name}님! 😊 오늘은 어떤 운세가 궁금하신가요? 연애운, 재물운, 건강운 등 무엇이든 물어보세요!`;
    }
    
    // 연애운 관련
    if (message.includes('연애') || message.includes('사랑') || message.includes('이성') || message.includes('남친') || message.includes('여친')) {
      return `💕 **${user.name}님의 연애운 분석**

현재 연애 에너지가 상승하고 있는 시기예요! 

🌟 **이번 주 연애운**: ★★★★☆
• 새로운 만남의 기회가 열려있어요
• 기존 관계가 있다면 더욱 깊어질 수 있는 시기
• 진실한 마음으로 다가가면 좋은 결과가 있을 거예요

💝 **연애운 상승 팁**
1. 밝고 긍정적인 에너지 유지하기
2. 새로운 환경이나 모임에 적극 참여
3. 외모보다 내면의 매력을 기르는데 집중

더 구체적인 연애 고민이 있으시면 언제든 말씀해 주세요! 🍀`;
    }
    
    // 재물운 관련
    if (message.includes('돈') || message.includes('재물') || message.includes('투자') || message.includes('사업') || message.includes('직장')) {
      return `💰 **${user.name}님의 재물운 분석**

${user.birthDate ? `생년월일(${user.birthDate}) 기반으로 분석한 결과,` : ''} 현재 재물운이 점진적으로 상승하는 시기입니다!

📈 **이번 달 재물운**: ★★★★☆
• 부업이나 사이드 프로젝트 기회가 있을 수 있어요
• 투자보다는 저축에 집중하는 것이 좋겠습니다
• 새로운 수입원이 생길 가능성이 높아요

💡 **재물운 상승 조언**
1. 계획적인 가계 관리가 중요해요
2. 새로운 기술이나 자격증 취득 고려
3. 인맥 관리를 통한 기회 창출

더 자세한 재정 계획이나 투자 관련 질문이 있으시면 말씀해 주세요! 📊`;
    }
    
    // 건강운 관련
    if (message.includes('건강') || message.includes('몸') || message.includes('아프') || message.includes('병')) {
      return `🏥 **${user.name}님의 건강운 분석**

전반적으로 건강한 상태를 유지하고 계시네요!

💪 **이번 주 건강운**: ★★★★★
• 컨디션이 좋은 상태입니다
• 새로운 운동을 시작하기 좋은 때예요
• 규칙적인 생활 패턴 유지가 중요합니다

🌿 **건강 관리 팁**
1. 충분한 수면과 휴식 취하기
2. 스트레스 관리에 신경 쓰세요
3. 균형잡힌 식사와 규칙적인 운동

혹시 특별히 신경 쓰이는 건강 문제가 있으시면 말씀해 주세요! 🌱`;
    }
    
    // 오늘 운세 관련
    if (message.includes('오늘') || message.includes('today') || message.includes('일일')) {
      const today = new Date().toLocaleDateString('ko-KR');
      return `📅 **${today} ${user.name}님의 오늘 운세**

🌟 **오늘의 전체운**: ★★★★☆
오늘은 새로운 시작에 좋은 날이에요!

💰 **재물운**: ★★★☆☆ 
• 의외의 수입이 있을 수 있어요
• 큰 지출은 피하는 것이 좋겠습니다

💕 **연애운**: ★★★★★
• 좋은 만남의 기회가 있을 것 같아요
• 깊은 대화를 나누기 좋은 날입니다

🏥 **건강운**: ★★★★☆
• 컨디션이 좋은 상태예요
• 가벼운 운동을 추천합니다

🎯 **오늘의 조언**
새로운 도전을 두려워하지 마세요. 긍정적인 마음가짐으로 하루를 시작하면 좋은 일이 생길 거예요! ✨`;
    }
    
    // 꿈 해몽 관련
    if (message.includes('꿈') || message.includes('dream') || message.includes('해몽')) {
      return `🌙 **꿈 해몽 상담**

꿈에 대해 자세히 말씀해 주시면 의미를 분석해드릴게요!

💭 **꿈 해몽시 도움이 되는 정보:**
• 꿈의 전체적인 내용
• 꿈에서 느꼈던 감정
• 기억에 남는 특별한 상황이나 물건
• 꿈을 꾼 날짜나 상황

예를 들어 "물에 관한 꿈을 꿨어요", "높은 곳에서 떨어지는 꿈" 등으로 말씀해 주시면 더 정확한 해석을 해드릴 수 있어요! 🔮`;
    }
    
    // 사주 관련
    if (message.includes('사주') || message.includes('성격') || message.includes('팔자') || message.includes('운명')) {
      return `🔮 **${user.name}님의 사주 기반 분석**

${user.birthDate && user.birthTime ? 
  `생년월일: ${user.birthDate}, 생시: ${user.birthTime} 기반으로 분석해드리겠습니다.` : 
  '더 정확한 분석을 위해서는 정확한 생년월일과 생시가 필요해요.'}

🎯 **성격 특성**
• 차분하고 신중한 성격으로 주변의 신뢰를 받으세요
• 책임감이 강하고 맡은 일을 끝까지 해내는 타입
• 예술적 감각이 뛰어나고 창의적 사고가 가능합니다

🌟 **인생 전반기 (20-40세)**
• 기반을 다지는 중요한 시기
• 꾸준한 노력이 후에 큰 결실을 맺을 것

🌅 **인생 후반기 (40세 이후)**
• 본격적인 성공과 안정의 시기
• 사회적 지위와 경제적 안정 확보

더 구체적인 질문이 있으시면 말씀해 주세요! 📿`;
    }
    
    // 기본 응답
    return `${user.name}님의 질문을 잘 받았습니다! 😊

더 정확한 운세 상담을 위해 구체적으로 어떤 부분이 궁금하신지 말씀해 주세요.

💫 **추천 질문 예시:**
• "이번 주 연애운이 궁금해요"
• "투자 계획이 있는데 조언 부탁해요"
• "새 직장으로 이직을 고민 중이에요"
• "최근에 꾼 꿈이 신경 쓰여요"
• "오늘 컨디션이 어떨까요?"

편안하게 질문해 주시면 정성껏 답변드리겠습니다! ✨`;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // AI 응답 시뮬레이션 (실제로는 AI API 호출)
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: generateAIResponse(userMessage.content),
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000); // 1.5-2.5초 랜덤 딜레이
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSaveConversation = () => {
    // 대화 내용을 FortuneResult로 변환
    const conversationContent = messages
      .filter(msg => msg.type === 'user' || msg.type === 'ai')
      .map(msg => `**${msg.type === 'user' ? '질문' : 'AI 답변'}**: ${msg.content}`)
      .join('\n\n');

    const result: FortuneResult = {
      id: Date.now().toString(),
      type: 'chat',
      title: `AI 운세 상담 - ${new Date().toLocaleDateString('ko-KR')}`,
      content: `🤖 **AI 운세 상담사와의 대화**\n\n${conversationContent}`,
      date: new Date().toLocaleDateString('ko-KR'),
      paid: false
    };

    onResult(result);
  };

  const quickQuestions = [
    "오늘 운세가 궁금해요",
    "연애운은 어떤가요?",
    "재물운 조언 부탁해요",
    "건강 상태는 어떨까요?",
    "새로운 시작에 대한 조언"
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black">
      {/* 채팅 영역 */}
      <div className="flex-1 flex flex-col p-4 pb-0">
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-3 max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  {/* 아바타 */}
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === 'user' 
                      ? 'bg-hanbok-gold text-white' 
                      : 'bg-dancheong-blue text-white'
                  }`}>
                    {message.type === 'user' ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  
                  {/* 메시지 버블 */}
                  <div className={`rounded-2xl px-4 py-3 ${
                    message.type === 'user'
                      ? 'bg-hanbok-gold text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-ink-black dark:text-ink-gray'
                  }`}>
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </div>
                    <div className={`text-xs mt-2 ${
                      message.type === 'user' ? 'text-white/70' : 'text-muted-foreground'
                    }`}>
                      {message.timestamp}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* AI 타이핑 표시 */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-3 max-w-[85%]">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-dancheong-blue text-white flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>

        {/* 빠른 질문 버튼들 */}
        {messages.length <= 1 && (
          <div className="mt-4 mb-4">
            <p className="text-sm text-muted-foreground mb-3 text-center">💭 빠른 질문</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {quickQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setInputMessage(question);
                    inputRef.current?.focus();
                  }}
                  className="text-xs rounded-full border-hanbok-gold/30 text-hanbok-gold-dark hover:bg-hanbok-gold/10"
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* 대화 저장 버튼 */}
        {messages.length > 3 && (
          <div className="mb-4 text-center">
            <Button
              onClick={handleSaveConversation}
              variant="outline"
              size="sm"
              className="border-dancheong-green text-dancheong-green hover:bg-dancheong-green/10"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              대화 내용 저장하기
            </Button>
          </div>
        )}

        {/* 입력 영역 */}
        <div className="border-t border-border pt-4">
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <Input
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="운세에 대해 궁금한 것을 물어보세요..."
                disabled={isTyping}
                className="rounded-full border-hanbok-gold/30 focus:border-hanbok-gold/60 bg-input-background"
              />
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              size="sm"
              className="rounded-full w-10 h-10 p-0 bg-hanbok-gold hover:bg-hanbok-gold-dark text-white"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}