import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Calendar as CalendarIcon, Target, MessageSquare } from 'lucide-react';
import { calendarEvents, getSalesRecommendations, getSATSalesRecommendations, getAPSalesRecommendations } from './data/calendarData';
import './App.css';

function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [recommendations, setRecommendations] = useState([]);
  const [satRecommendations, setSATRecommendations] = useState([]);
  const [apRecommendations, setAPRecommendations] = useState([]);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    updateRecommendations(selectedDate);
  }, [selectedDate]);

  const updateRecommendations = (date) => {
    const newRecommendations = getSalesRecommendations(date);
    const newSATRecommendations = getSATSalesRecommendations(date);
    const newAPRecommendations = getAPSalesRecommendations(date);
    
    setRecommendations(newRecommendations);
    setSATRecommendations(newSATRecommendations);
    setAPRecommendations(newAPRecommendations);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const getEventTypeClass = (type) => {
    const typeMap = {
      sat: 'event-sat',
      ap: 'event-ap',
      score: 'event-score',
      break: 'event-break',
      application: 'event-application',
      result: 'event-result'
    };
    return typeMap[type] || '';
  };

  const getEventTypeName = (type) => {
    const typeMap = {
      sat: 'SAT 시험',
      ap: 'AP 시험',
      score: '성적 발표',
      break: '방학',
      application: '원서 접수',
      result: '합격 발표'
    };
    return typeMap[type] || type;
  };

  const getPriorityColor = (priority) => {
    const colorMap = {
      high: '#ff6b6b',
      medium: '#feca57',
      low: '#48dbfb'
    };
    return colorMap[priority] || '#48dbfb';
  };

  const getPriorityText = (priority) => {
    const textMap = {
      high: '높음',
      medium: '보통',
      low: '낮음'
    };
    return textMap[priority] || '낮음';
  };

  // 선택된 날짜의 이벤트들 (한국시간 기준)
  const selectedDateEvents = calendarEvents.filter(event => {
    const eventDate = new Date(event.date);
    const selectedDateKST = new Date(selectedDate.getTime() + (9 * 60 * 60 * 1000)); // UTC+9
    return eventDate.toDateString() === selectedDateKST.toDateString();
  });


  return (
    <div className="container">
      <header className="header">
        <h1>SAT/AP 세일즈 캘린더</h1>
        <p>시험 일정과 세일즈 액션을 한눈에 관리하세요 (한국시간 기준)</p>
      </header>

      <div className="main-content">
        {/* 세일즈 추천 섹션 */}
        <div className="card">
          <h2>
            <Target className="icon" />
            오늘의 세일즈 액션
          </h2>
          
          <div className="selected-date-info">
            <CalendarIcon className="icon" />
            <span>{format(selectedDate, 'yyyy년 M월 d일 (E)', { locale: ko })} (한국시간)</span>
          </div>

          {selectedDateEvents.length > 0 && (
            <div className="today-events">
              <h3>오늘의 이벤트</h3>
              {selectedDateEvents.map((event, index) => (
                <div key={index} className={`event-badge ${getEventTypeClass(event.type)}`}>
                  {event.title}
                </div>
              ))}
            </div>
          )}

          {/* 탭 메뉴 */}
          <div className="tab-menu">
            <button 
              className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              전체
            </button>
            <button 
              className={`tab-button ${activeTab === 'sat' ? 'active' : ''}`}
              onClick={() => setActiveTab('sat')}
            >
              SAT
            </button>
            <button 
              className={`tab-button ${activeTab === 'ap' ? 'active' : ''}`}
              onClick={() => setActiveTab('ap')}
            >
              AP
            </button>
          </div>

          {/* 추천 액션 표시 */}
          <div className="sales-recommendation">
            <h3>추천 액션</h3>
            <p>
              {activeTab === 'all' && recommendations.length > 0 
                ? recommendations[0].action 
                : activeTab === 'sat' && satRecommendations.length > 0
                ? satRecommendations[0].action
                : activeTab === 'ap' && apRecommendations.length > 0
                ? apRecommendations[0].action
                : '오늘은 특별한 이벤트가 없습니다. 정기적인 체크인을 진행해보세요.'
              }
            </p>
          </div>

          {/* 추천 목록 표시 */}
          <div className="recommendations-list">
            {activeTab === 'all' && recommendations.map((rec, index) => (
              <div key={index} className="action-item">
                <div className="action-header">
                  <h4>{rec.title}</h4>
                  <div className="action-meta">
                    <span className={`category-badge ${rec.category?.toLowerCase() || 'general'}`}>
                      {rec.category || '일반'}
                    </span>
                    <span 
                      className="priority-badge"
                      style={{ backgroundColor: getPriorityColor(rec.priority) }}
                    >
                      {getPriorityText(rec.priority)}
                    </span>
                  </div>
                </div>
                <p>{rec.action}</p>
                {rec.target && (
                  <div className="target-info">
                    <strong>대상:</strong> {rec.target}
                  </div>
                )}
                {rec.subjects && (
                  <div className="subjects-info">
                    <strong>과목:</strong> {rec.subjects}
                  </div>
                )}
                {rec.message && (
                  <div className="message-box">
                    <MessageSquare className="icon" />
                    <span>{rec.message}</span>
                  </div>
                )}
              </div>
            ))}

            {activeTab === 'sat' && satRecommendations.map((rec, index) => (
              <div key={index} className="action-item">
                <div className="action-header">
                  <h4>{rec.title}</h4>
                  <div className="action-meta">
                    <span className="category-badge sat">SAT</span>
                    <span 
                      className="priority-badge"
                      style={{ backgroundColor: getPriorityColor(rec.priority) }}
                    >
                      {getPriorityText(rec.priority)}
                    </span>
                  </div>
                </div>
                <p>{rec.action}</p>
                {rec.target && (
                  <div className="target-info">
                    <strong>대상:</strong> {rec.target}
                  </div>
                )}
                {rec.message && (
                  <div className="message-box">
                    <MessageSquare className="icon" />
                    <span>{rec.message}</span>
                  </div>
                )}
              </div>
            ))}

            {activeTab === 'ap' && apRecommendations.map((rec, index) => (
              <div key={index} className="action-item">
                <div className="action-header">
                  <h4>{rec.title}</h4>
                  <div className="action-meta">
                    <span className="category-badge ap">AP</span>
                    <span 
                      className="priority-badge"
                      style={{ backgroundColor: getPriorityColor(rec.priority) }}
                    >
                      {getPriorityText(rec.priority)}
                    </span>
                  </div>
                </div>
                <p>{rec.action}</p>
                {rec.target && (
                  <div className="target-info">
                    <strong>대상:</strong> {rec.target}
                  </div>
                )}
                {rec.subjects && (
                  <div className="subjects-info">
                    <strong>과목:</strong> {rec.subjects}
                  </div>
                )}
                {rec.message && (
                  <div className="message-box">
                    <MessageSquare className="icon" />
                    <span>{rec.message}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 캘린더 섹션 */}
        <div className="calendar-container">
          <h2>
            <CalendarIcon className="icon" />
            이벤트 캘린더
          </h2>
          
          <Calendar
            onChange={handleDateChange}
            value={selectedDate}
            locale="ko"
            calendarType="US"
            tileContent={({ date, view }) => {
              if (view === 'month') {
                const dayEvents = calendarEvents.filter(event => {
                  const eventDate = new Date(event.date);
                  const dateKST = new Date(date.getTime() + (9 * 60 * 60 * 1000)); // UTC+9
                  return eventDate.toDateString() === dateKST.toDateString();
                });
                
                return (
                  <div className="calendar-events">
                    {dayEvents.map((event, index) => (
                      <div 
                        key={index} 
                        className={`calendar-event ${getEventTypeClass(event.type)}`}
                        title={event.title}
                      />
                    ))}
                  </div>
                );
              }
            }}
          />

          <div className="event-legend">
            <div className="legend-item">
              <div className="legend-color event-sat"></div>
              <span>SAT 시험</span>
            </div>
            <div className="legend-item">
              <div className="legend-color event-ap"></div>
              <span>AP 시험</span>
            </div>
            <div className="legend-item">
              <div className="legend-color event-score"></div>
              <span>성적 발표</span>
            </div>
            <div className="legend-item">
              <div className="legend-color event-break"></div>
              <span>방학</span>
            </div>
            <div className="legend-item">
              <div className="legend-color event-application"></div>
              <span>원서 접수</span>
            </div>
            <div className="legend-item">
              <div className="legend-color event-result"></div>
              <span>합격 발표</span>
            </div>
          </div>
        </div>
      </div>

      {/* 미국 입시 전형 안내 섹션 */}
      <div className="card">
        <h2>
          <MessageSquare className="icon" />
          미국 입시 전형 안내
        </h2>
        <div className="admissions-guide">
          <div className="admission-types">
            <div className="admission-type">
              <div className="type-header">
                <h3>🎯 Early Decision (ED)</h3>
                <span className="type-badge binding">Binding</span>
              </div>
              <div className="type-content">
                <p><strong>정의:</strong> 합격 시 반드시 해당 대학에 입학해야 하는 제약이 있는 조기 지원</p>
                <p><strong>특징:</strong> 가장 높은 합격률, 다른 대학과 중복 지원 불가</p>
                <p><strong>기간:</strong> 11월 1일 마감, 12월 중순 결과 발표</p>
                <p><strong>대상:</strong> 확실한 1지망 대학이 있는 학생</p>
              </div>
            </div>

            <div className="admission-type">
              <div className="type-header">
                <h3>⚡ Early Action (EA)</h3>
                <span className="type-badge non-binding">Non-Binding</span>
              </div>
              <div className="type-content">
                <p><strong>정의:</strong> 조기에 지원하지만 합격해도 입학 의무가 없는 조기 지원</p>
                <p><strong>특징:</strong> 높은 합격률, 다른 대학과 중복 지원 가능</p>
                <p><strong>기간:</strong> 11월 1일 또는 15일 마감, 1월 말 결과 발표</p>
                <p><strong>대상:</strong> 여러 대학을 고려하는 학생</p>
              </div>
            </div>

            <div className="admission-type">
              <div className="type-header">
                <h3>📋 Regular Decision (RD)</h3>
                <span className="type-badge regular">Regular</span>
              </div>
              <div className="type-content">
                <p><strong>정의:</strong> 일반적인 지원 마감일로 지원하는 전형</p>
                <p><strong>특징:</strong> 가장 많은 지원자, 가장 낮은 합격률</p>
                <p><strong>기간:</strong> 1월 1일 마감, 3-4월 결과 발표</p>
                <p><strong>대상:</strong> 모든 지원자</p>
              </div>
            </div>

            <div className="admission-type">
              <div className="type-header">
                <h3>⏰ Deferred (디퍼)</h3>
                <span className="type-badge deferred">Deferred</span>
              </div>
              <div className="type-content">
                <p><strong>정의:</strong> ED/EA에서 합격하지 못하고 RD로 넘어간 상태</p>
                <p><strong>특징:</strong> RD에서 재심사, 추가 자료 제출 가능</p>
                <p><strong>기간:</strong> 12월 중순 통보, 3-4월 최종 결과</p>
                <p><strong>대상:</strong> ED/EA 지원자 중 일부</p>
              </div>
            </div>
          </div>

          <div className="timeline-section">
            <h3>📅 미국 입시 주요 일정</h3>
            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-date">9월</div>
                <div className="timeline-content">
                  <h4>입시 준비 시작</h4>
                  <p>• Common Application 오픈<br/>• 대학별 에세이 주제 공개<br/>• 추천서 요청</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-date">10월</div>
                <div className="timeline-content">
                  <h4>ED/EA 지원 마무리</h4>
                  <p>• SAT/ACT 최종 시험<br/>• 에세이 완성<br/>• 지원서 검토</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-date">11월</div>
                <div className="timeline-content">
                  <h4>ED/EA 마감</h4>
                  <p>• 11월 1일: ED 마감<br/>• 11월 15일: EA 마감<br/>• 지원서 제출 완료</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-date">12월</div>
                <div className="timeline-content">
                  <h4>ED 결과 발표</h4>
                  <p>• 12월 15일: ED 결과 발표<br/>• 합격/불합격/디퍼 통보<br/>• RD 지원 준비</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-date">1월</div>
                <div className="timeline-content">
                  <h4>RD 마감 & EA 결과</h4>
                  <p>• 1월 1일: RD 마감<br/>• 1월 31일: EA 결과 발표<br/>• 추가 지원서 제출</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-date">3-4월</div>
                <div className="timeline-content">
                  <h4>RD 결과 발표</h4>
                  <p>• 3월 15일: RD 결과 발표 시작<br/>• 3월 28일: Ivy League 발표<br/>• 4월 1일: UC 시스템 발표</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-date">5월</div>
                <div className="timeline-content">
                  <h4>최종 결정</h4>
                  <p>• 5월 1일: National Decision Day<br/>• 대학 등록 마감<br/>• 입학 보증금 납부</p>
                </div>
              </div>
            </div>
          </div>

          <div className="tips-section">
            <h3>💡 입시 전략 팁</h3>
            <div className="tips-grid">
              <div className="tip-card">
                <h4>🎯 ED 전략</h4>
                <ul>
                  <li>확실한 1지망 대학만 선택</li>
                  <li>SAT/ACT 점수가 목표 대학 평균보다 높아야 함</li>
                  <li>에세이와 추천서에 특별히 신경 쓰기</li>
                </ul>
              </div>
              <div className="tip-card">
                <h4>⚡ EA 전략</h4>
                <ul>
                  <li>여러 대학에 동시 지원 가능</li>
                  <li>안전한 대학과 도전적인 대학 균형</li>
                  <li>RD에서 더 좋은 결과를 기대할 수 있음</li>
                </ul>
              </div>
              <div className="tip-card">
                <h4>📋 RD 전략</h4>
                <ul>
                  <li>다양한 레벨의 대학에 지원</li>
                  <li>Safety, Match, Reach 균형 맞추기</li>
                  <li>지역별, 전공별 다양성 고려</li>
                </ul>
              </div>
              <div className="tip-card">
                <h4>⏰ 디퍼 대응</h4>
                <ul>
                  <li>추가 성과나 활동 업데이트</li>
                  <li>Letter of Continued Interest 작성</li>
                  <li>RD 지원서 더욱 완벽하게 준비</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default App;
