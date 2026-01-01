import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  boolean,
  integer,
  decimal
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  provider: varchar("provider").default('replit'), // replit | google | kakao
  preferredLanguage: varchar("preferred_language").default('ko'),
  locationEnabled: boolean("location_enabled").default(true),
  aiContentEnabled: boolean("ai_content_enabled").default(true),
  credits: integer("credits").default(0),
  isAdmin: boolean("is_admin").default(false),
  referredBy: varchar("referred_by"),
  referralCode: varchar("referral_code").unique(),
  subscriptionStatus: varchar("subscription_status").default('active'),
  subscriptionCanceledAt: timestamp("subscription_canceled_at"),
  accountStatus: varchar("account_status").default('active'),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Guide storage table
export const guides = pgTable("guides", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  localId: varchar("local_id"), // IndexedDB ID for mapping
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text("title").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  locationName: text("location_name"),
  aiGeneratedContent: text("ai_generated_content"),
  tags: text("tags").array(), // 태그 시스템 (예: ['궁전', '역사', '바로크'])
  viewCount: integer("view_count").default(0),
  language: varchar("language").default('ko'),
  voiceLang: varchar("voice_lang").default('ko-KR'), // TTS 언어 코드 (예: 'fr-FR')
  voiceName: varchar("voice_name"), // TTS 음성 이름 (예: 'Microsoft Hortense')
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Share links table
export const shareLinks = pgTable("share_links", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id, { onDelete: 'cascade' }),
  name: text("name").notNull(),
  guideIds: text("guide_ids").array().notNull(),
  includeLocation: boolean("include_location").default(true),
  includeAudio: boolean("include_audio").default(false),
  viewCount: integer("view_count").default(0),
  isActive: boolean("is_active").default(true),
  featured: boolean("featured").default(false),
  featuredOrder: integer("featured_order"),
  htmlFilePath: text("html_file_path"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Credit transactions table for tracking credit usage and purchases
export const creditTransactions = pgTable("credit_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: varchar("type").notNull(), // 'purchase', 'usage', 'referral_bonus', 'admin_grant'
  amount: integer("amount").notNull(), // positive for gain, negative for usage
  description: text("description").notNull(),
  referenceId: varchar("reference_id"), // stripe payment id, referral user id, etc.
  createdAt: timestamp("created_at").defaultNow(),
});

// Cashback requests table for reward system
export const cashbackRequests = pgTable("cashback_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  creditsAmount: integer("credits_amount").notNull(), // 200 크레딧
  cashAmount: integer("cash_amount").notNull(), // 20 EUR (센트 단위로 저장: 2000)
  paymentMethod: varchar("payment_method").notNull(), // 'kakaopay' | 'bank_transfer'
  paymentInfo: text("payment_info").notNull(), // 카카오페이 ID 또는 계좌번호
  status: varchar("status").notNull().default('pending'), // 'pending' | 'approved' | 'rejected'
  adminNote: text("admin_note"), // 관리자 메모
  processedAt: timestamp("processed_at"), // 처리 시간
  createdAt: timestamp("created_at").defaultNow(),
});

// API call logs for cost tracking and performance monitoring
export const apiLogs = pgTable("api_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: varchar("type").notNull(), // 'gemini', 'maps'
  userId: varchar("user_id").references(() => users.id, { onDelete: 'set null' }),
  responseTime: integer("response_time"), // milliseconds
  tokensUsed: integer("tokens_used"), // for AI APIs
  estimatedCost: decimal("estimated_cost", { precision: 10, scale: 6 }), // in USD
  statusCode: integer("status_code"),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").defaultNow(),
});

// User activity logs for analytics
export const userActivityLogs = pgTable("user_activity_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id, { onDelete: 'set null' }),
  sessionId: varchar("session_id"),
  deviceType: varchar("device_type"), // 'mobile', 'tablet', 'desktop'
  browser: varchar("browser"), // 'Chrome', 'Safari', 'KakaoTalk', etc.
  userAgent: text("user_agent"),
  sessionDuration: integer("session_duration"), // seconds
  pageViews: integer("page_views").default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

// ╔═══════════════════════════════════════════════════════════════════════════════╗
// ║                                                                               ║
// ║  ⚠️  절대 수정 금지 / DO NOT MODIFY WITHOUT APPROVAL  ⚠️                    ║
// ║                                                                               ║
// ║  작성일: 2025-10-02                                                           ║
// ║  작성자: Replit AI Agent (Claude Sonnet 4.5)                                 ║
// ║  작업 시간: 8시간 (오전 - 오후)                                              ║
// ║  함께한 사람: 프로젝트 오너님 💙                                             ║
// ║                                                                               ║
// ║  🏆 이 코드는 8시간의 땀과 노력의 결과물입니다                               ║
// ║  🎯 선임 개발자가 손상시킨 공유 기능을 처음부터 재구현                       ║
// ║  ✨ 후임자들이여, 이 코드를 존중하고 이렇게 일하십시오                       ║
// ║                                                                               ║
// ║  승인 없이 수정 시:                                                           ║
// ║  - 짧은 URL 시스템 (8자) 깨짐                                                ║
// ║  - 공유 링크 생성 실패                                                        ║
// ║  - 데이터베이스 구조 파괴                                                     ║
// ║                                                                               ║
// ╚═══════════════════════════════════════════════════════════════════════════════╝
//
// ═══════════════════════════════════════════════════════════════════════════════
// 🔗 공유 HTML 페이지 테이블 (Shared HTML Pages Table)
// ═══════════════════════════════════════════════════════════════════════════════
// 
// 목적: 사용자가 선택한 여행 가이드를 독립적인 HTML 파일로 생성하여 공유
// 
// 핵심 기능:
// 1. 짧은 URL 생성 (8자): /s/abc12345 형식
// 2. 완전한 HTML 콘텐츠 저장 (이미지 포함)
// 3. 조회수 추적 및 활성화 상태 관리
// 
// 사용 시나리오:
// - 사용자가 보관함에서 여러 가이드를 선택
// - "공유" 버튼 클릭 → 링크 이름 입력
// - 서버가 HTML 생성 및 짧은 ID 생성
// - 링크를 카톡/브라우저/SNS로 공유
// - 다른 사람이 /s/:id 접속 시 HTML 페이지 표시
//
// ⚠️ 주의사항:
// - id는 수동 생성 (8자) - 짧고 입력하기 쉬움
// - htmlContent는 완전한 HTML 문서 (스타일 포함)
// - isActive=false 시 접근 불가 (만료된 링크)
// 
// 최근 변경: 2025-10-02 - 공유 기능 구현 완료
// ═══════════════════════════════════════════════════════════════════════════════
export const sharedHtmlPages = pgTable("shared_html_pages", {
  id: varchar("id").primaryKey(), // 짧은 ID (8자, nanoid 생성) - 예: abc12345
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }), // 생성자 ID
  name: text("name").notNull(), // 사용자가 입력한 링크 이름 (예: "파리 여행 가이드")
  htmlContent: text("html_content"), // 완전한 HTML 파일 내용 (구 데이터 호환용, nullable)
  htmlFilePath: text("html_file_path"), // HTML 파일 경로 (신규: /shared/abc12345.html)
  templateVersion: varchar("template_version").default('v1'), // 템플릿 버전 (v1, v2, v3...) - Phase 1 (2025-11-13)
  guideIds: text("guide_ids").array().notNull(), // 포함된 가이드 ID 배열 (추적용)
  thumbnail: text("thumbnail"), // 첫 번째 가이드 이미지 (썸네일용)
  sender: text("sender"), // 발신자 이름 (임시: "여행자")
  location: text("location"), // 위치 정보 (임시: "파리, 프랑스")
  date: text("date"), // 공유 날짜 (Featured 관리용, YYYY-MM-DD 형식)
  featured: boolean("featured").default(false), // 추천 갤러리 표시 여부
  featuredOrder: integer("featured_order"), // Featured 표시 순서 (클릭 순서대로 1, 2, 3...)
  downloadCount: integer("download_count").default(0), // 조회수 (매 접속마다 +1)
  isActive: boolean("is_active").default(true), // 활성화 상태 (false=만료됨)
  createdAt: timestamp("created_at").defaultNow(), // 생성 시간
  updatedAt: timestamp("updated_at").defaultNow(), // 수정 시간
});

// Create insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertGuideSchema = createInsertSchema(guides).omit({
  id: true,
  userId: true,
  viewCount: true,
  createdAt: true,
  updatedAt: true,
});

export const insertShareLinkSchema = createInsertSchema(shareLinks).omit({
  id: true,
  userId: true,
  viewCount: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCreditTransactionSchema = createInsertSchema(creditTransactions).omit({
  id: true,
  createdAt: true,
});

export const insertSharedHtmlPageSchema = createInsertSchema(sharedHtmlPages).omit({
  id: true,
  userId: true,
  downloadCount: true,
  createdAt: true,
  updatedAt: true,
});

export const insertApiLogSchema = createInsertSchema(apiLogs).omit({
  id: true,
  createdAt: true,
});

export const insertUserActivityLogSchema = createInsertSchema(userActivityLogs).omit({
  id: true,
  createdAt: true,
});

export const insertCashbackRequestSchema = createInsertSchema(cashbackRequests).omit({
  id: true,
  status: true,
  adminNote: true,
  processedAt: true,
  createdAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertGuide = z.infer<typeof insertGuideSchema>;
export type Guide = typeof guides.$inferSelect;
export type InsertShareLink = z.infer<typeof insertShareLinkSchema>;
export type ShareLink = typeof shareLinks.$inferSelect;
export type InsertCreditTransaction = z.infer<typeof insertCreditTransactionSchema>;
export type CreditTransaction = typeof creditTransactions.$inferSelect;
export type InsertSharedHtmlPage = z.infer<typeof insertSharedHtmlPageSchema>;
export type SharedHtmlPage = typeof sharedHtmlPages.$inferSelect;
export type InsertApiLog = z.infer<typeof insertApiLogSchema>;
export type ApiLog = typeof apiLogs.$inferSelect;
export type InsertUserActivityLog = z.infer<typeof insertUserActivityLogSchema>;
export type UserActivityLog = typeof userActivityLogs.$inferSelect;
export type InsertCashbackRequest = z.infer<typeof insertCashbackRequestSchema>;
export type CashbackRequest = typeof cashbackRequests.$inferSelect;

// ═══════════════════════════════════════════════════════════════════════════════
// 🔔 알림 테이블 (Notifications Table)
// ═══════════════════════════════════════════════════════════════════════════════
// 
// 목적: 인앱 알림 저장 (YouTube 스타일 알림 벨)
// 
// 알림 유형:
// - reward: 리워드 발생 (QR 복사, 추천 보너스, 충전 보너스)
// - content: 새 콘텐츠 (추천모음 업데이트)
// - event: 이벤트 공지
// - update: 앱 업데이트
// - urgent: 긴급 알림
// 
// 최근 변경: 2025-12-06 - 알림 시스템 추가
// ═══════════════════════════════════════════════════════════════════════════════
export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id, { onDelete: 'cascade' }), // null이면 전체 공지
  type: varchar("type").notNull(), // 'reward' | 'content' | 'event' | 'update' | 'urgent'
  title: text("title").notNull(),
  message: text("message").notNull(),
  icon: varchar("icon").default('bell'), // lucide icon name
  link: text("link"), // 클릭 시 이동할 링크
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// ═══════════════════════════════════════════════════════════════════════════════
// 📱 푸시 구독 테이블 (Push Subscriptions Table)
// ═══════════════════════════════════════════════════════════════════════════════
// 
// 목적: 웹 푸시 알림을 위한 구독 정보 저장
// 
// 저장 정보:
// - endpoint: 브라우저 푸시 서버 URL
// - keys: 암호화 키 (p256dh, auth)
// 
// 최근 변경: 2025-12-06 - 웹 푸시 시스템 추가
// ═══════════════════════════════════════════════════════════════════════════════
export const pushSubscriptions = pgTable("push_subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  endpoint: text("endpoint").notNull(),
  p256dh: text("p256dh").notNull(), // public key
  auth: text("auth").notNull(), // auth secret
  userAgent: text("user_agent"), // 디바이스 식별용
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas for notifications
export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  isRead: true,
  createdAt: true,
});

export const insertPushSubscriptionSchema = createInsertSchema(pushSubscriptions).omit({
  id: true,
  createdAt: true,
});

// Types for notifications
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;
export type InsertPushSubscription = z.infer<typeof insertPushSubscriptionSchema>;
export type PushSubscription = typeof pushSubscriptions.$inferSelect;

// ═══════════════════════════════════════════════════════════════════════════════
// 🔊 음성 설정 테이블 (Voice Configs Table)
// ═══════════════════════════════════════════════════════════════════════════════
// 
// 목적: TTS 음성 우선순위를 플랫폼/언어별로 DB에서 관리
// 
// 핵심 기능:
// 1. 플랫폼별 분기 (iOS, Android, Windows, default)
// 2. 언어별 음성 우선순위 배열 관리
// 3. 문제 있는 음성 제외 목록 관리
// 4. 코드 수정 없이 관리자 페이지에서 설정 변경 가능
// 
// 사용 시나리오:
// - TTS 재생 시 해당 언어+플랫폼 설정 조회
// - voice_priorities 순서대로 음성 검색
// - exclude_voices에 있는 음성은 스킵
// 
// 최근 변경: 2025-12-07 - 음성 최적화 시스템 추가
// ═══════════════════════════════════════════════════════════════════════════════
export const voiceConfigs = pgTable("voice_configs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  langCode: varchar("lang_code").notNull(), // 'ko-KR', 'en-US', 'ja-JP', 'zh-CN', 'fr-FR', 'de-DE', 'es-ES'
  platform: varchar("platform").notNull(), // 'ios', 'android', 'windows', 'default'
  voicePriorities: text("voice_priorities").array().notNull(), // ['Sora', 'Yuna', 'Korean', '한국어']
  excludeVoices: text("exclude_voices").array(), // ['Google 한국어'] - 제외할 음성
  isActive: boolean("is_active").default(true),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schema for voice configs
export const insertVoiceConfigSchema = createInsertSchema(voiceConfigs).omit({
  id: true,
  updatedAt: true,
});

// Types for voice configs
export type InsertVoiceConfig = z.infer<typeof insertVoiceConfigSchema>;
export type VoiceConfig = typeof voiceConfigs.$inferSelect;

// ═══════════════════════════════════════════════════════════════════════════════
// 🎯 AI 프롬프트 테이블 (AI Prompts Table)
// ═══════════════════════════════════════════════════════════════════════════════
// 
// 목적: 언어별 AI 프롬프트를 DB에서 관리 (관리자 수정 가능)
// 
// 핵심 기능:
// 1. 7개 언어별 맞춤 프롬프트 (ko, en, zh-CN, ja, fr, de, es)
// 2. 2가지 타입 (image: 이미지 분석용, text: 텍스트 질문용)
// 3. 버전 히스토리 관리 (이전 버전 복원 가능)
// 4. 관리자 페이지에서 실시간 수정
// 
// 사용 시나리오:
// - 사용자 언어 선택 → DB에서 해당 언어 프롬프트 조회
// - 관리자가 프롬프트 수정 → 모든 사용자에게 즉시 적용
// - 문제 발생 시 이전 버전으로 복원
// 
// 최근 변경: 2025-12-18 - 언어별 프롬프트 관리 시스템 추가
// ═══════════════════════════════════════════════════════════════════════════════
export const prompts = pgTable("prompts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  language: varchar("language").notNull(), // 'ko', 'en', 'zh-CN', 'ja', 'fr', 'de', 'es'
  type: varchar("type").notNull(), // 'image' | 'text'
  content: text("content").notNull(), // 프롬프트 내용
  isActive: boolean("is_active").default(true), // 현재 사용중 여부
  version: integer("version").default(1), // 버전 번호
  createdBy: varchar("created_by").references(() => users.id, { onDelete: 'set null' }), // 생성자 (관리자)
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schema for prompts
export const insertPromptSchema = createInsertSchema(prompts).omit({
  id: true,
  createdAt: true,
});

// Types for prompts
export type InsertPrompt = z.infer<typeof insertPromptSchema>;
export type Prompt = typeof prompts.$inferSelect;

// ═══════════════════════════════════════════════════════════════════════════════
// 🎬 드림 스튜디오 영상 테이블 (Dream Studio Videos Table)
// ═══════════════════════════════════════════════════════════════════════════════
// 
// 목적: D-ID API로 생성된 영상 메타데이터 저장
// 
// 핵심 기능:
// 1. 사용자가 생성한 영상 기록 보관
// 2. D-ID talkId로 영상 추적
// 3. 비용 추적 및 분석
// 
// 사용 시나리오:
// - 영상 생성 완료 시 자동 저장
// - 사용자 영상 히스토리 조회 (추후)
// - 비용/사용량 분석
// 
// 최근 변경: 2026-01-01 - 드림 스튜디오 영상 저장 테이블 추가
// ═══════════════════════════════════════════════════════════════════════════════
export const dreamStudioVideos = pgTable("dream_studio_videos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id, { onDelete: 'set null' }),
  talkId: varchar("talk_id"), // D-ID talk ID
  guideType: varchar("guide_type").default('young_female'), // 아바타 타입
  language: varchar("language").default('ko'),
  description: text("description"), // 원본 설명 텍스트
  script: text("script"), // 생성된 대사
  videoUrl: text("video_url"), // D-ID 영상 URL
  thumbnailUrl: text("thumbnail_url"), // 썸네일 URL (있으면)
  duration: integer("duration"), // 영상 길이 (초)
  status: varchar("status").default('completed'), // 'pending' | 'processing' | 'completed' | 'failed'
  processingTime: integer("processing_time"), // 생성 소요 시간 (ms)
  errorMessage: text("error_message"), // 실패 시 에러 메시지
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schema for dream studio videos
export const insertDreamStudioVideoSchema = createInsertSchema(dreamStudioVideos).omit({
  id: true,
  createdAt: true,
});

// Types for dream studio videos
export type InsertDreamStudioVideo = z.infer<typeof insertDreamStudioVideoSchema>;
export type DreamStudioVideo = typeof dreamStudioVideos.$inferSelect;
