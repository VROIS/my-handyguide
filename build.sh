#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# Production Build Script with Database Migration
# ═══════════════════════════════════════════════════════════════
# 목적: 배포 전 DB 스키마 자동 동기화 + 빌드
# 실행: npm run build:with-db (또는 Replit deployment가 자동 실행)
# ═══════════════════════════════════════════════════════════════

set -e  # Exit on error

echo "🔄 Step 1/3: Syncing database schema..."
npm run db:push

echo "🏗️ Step 2/3: Building frontend..."
npm run build

echo "✅ Step 3/3: Build complete!"
echo "📦 Production build ready for deployment"
