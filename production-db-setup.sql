-- ═══════════════════════════════════════════════════════════════
-- Production Database Setup - Missing Tables
-- ═══════════════════════════════════════════════════════════════
-- 날짜: 2025-11-16
-- 목적: Production DB에 누락된 2개 테이블 추가
-- 실행: Database Pane → Production Database → My Data → SQL runner
-- ═══════════════════════════════════════════════════════════════

-- 1. api_logs 테이블 (API 호출 로그 및 비용 추적)
CREATE TABLE IF NOT EXISTS api_logs (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR NOT NULL,
    user_id VARCHAR REFERENCES users(id) ON DELETE SET NULL,
    response_time INTEGER,
    tokens_used INTEGER,
    estimated_cost DECIMAL(10, 6),
    status_code INTEGER,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 2. user_activity_logs 테이블 (사용자 활동 분석)
CREATE TABLE IF NOT EXISTS user_activity_logs (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR REFERENCES users(id) ON DELETE SET NULL,
    session_id VARCHAR,
    device_type VARCHAR,
    browser VARCHAR,
    user_agent TEXT,
    session_duration INTEGER,
    page_views INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 완료 메시지
SELECT 'api_logs 테이블 생성 완료' AS status;
SELECT 'user_activity_logs 테이블 생성 완료' AS status;
