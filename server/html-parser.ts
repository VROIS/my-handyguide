/**
 * ═══════════════════════════════════════════════════════════════
 * 📄 HTML 파서 유틸리티
 * ═══════════════════════════════════════════════════════════════
 * 
 * 목적: 공유 페이지 HTML에서 가이드 데이터 추출
 * 
 * 지원 형식:
 * 1. shareData JSON (generateShareHTML로 생성)
 * 2. gallery-item 태그 (regenerateFeaturedHtml로 생성)
 * 
 * 사용 예:
 * const guides = parseGuidesFromHtml(htmlContent, {
 *   userId: '...',
 *   guideIds: ['...'],
 *   createdAt: new Date()
 * });
 * 
 * ═══════════════════════════════════════════════════════════════
 */

export interface ParsedGuide {
  id: string;
  userId: string;
  title: string;
  description: string;
  imageUrl: string;
  latitude: number | null;
  longitude: number | null;
  locationName: string;
  aiGeneratedContent: string;
  viewCount: number;
  language: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ParseFallbackData {
  userId: string;
  guideIds: string[];
  location?: string;
  createdAt: Date;
}

/**
 * 🔍 HTML에서 가이드 데이터 추출
 * 
 * @param htmlContent - HTML 파일 내용
 * @param fallback - Fallback 데이터 (userId, guideIds 등)
 * @returns ParsedGuide 배열
 */
export function parseGuidesFromHtml(
  htmlContent: string, 
  fallback: ParseFallbackData
): ParsedGuide[] {
  console.log('📄 HTML 파싱 시작...');
  
  // 방법 1: shareData JSON 추출 (generateShareHTML로 생성된 경우)
  const shareDataMatch = htmlContent.match(/const shareData = ({[\s\S]*?});/);
  
  if (shareDataMatch) {
    try {
      const shareData = JSON.parse(shareDataMatch[1]);
      console.log('📦 ShareData 파싱 성공:', { contentsCount: shareData.contents?.length });
      
      const guides = (shareData.contents || []).map((item: any, index: number) => ({
        id: fallback.guideIds[index] || `guide-${Date.now()}-${index}`,
        userId: fallback.userId,
        title: item.description?.substring(0, 100) || `가이드 ${index + 1}`,
        description: item.description || '',
        imageUrl: item.imageDataUrl || '',
        latitude: null,
        longitude: null,
        locationName: item.location || fallback.location || '',
        aiGeneratedContent: item.description || '',
        viewCount: 0,
        language: 'ko',
        createdAt: fallback.createdAt,
        updatedAt: fallback.createdAt
      }));
      
      console.log('✅ ShareData에서 가이드 추출 완료:', { guidesCount: guides.length });
      return guides;
      
    } catch (parseError) {
      console.error('❌ ShareData JSON 파싱 실패:', parseError);
    }
  }
  
  // 방법 2: gallery-item 태그 파싱 (regenerateFeaturedHtml로 생성된 경우)
  console.log('📦 gallery-item 파싱 시도...');
  const galleryItemRegex = /<div[^>]*class="gallery-item"[^>]*data-id="([^"]*)"[^>]*>\s*<img[^>]*src="([^"]*)"[^>]*>\s*<p>([^<]*)<\/p>/g;
  let match;
  const parsedGuides: ParsedGuide[] = [];
  
  while ((match = galleryItemRegex.exec(htmlContent)) !== null) {
    const [, dataId, imgSrc, title] = match;
    parsedGuides.push({
      id: dataId || `guide-${Date.now()}-${parsedGuides.length}`,
      userId: fallback.userId,
      title: title.trim(),
      description: '',
      imageUrl: imgSrc,
      latitude: null,
      longitude: null,
      locationName: fallback.location || '',
      aiGeneratedContent: '',
      viewCount: 0,
      language: 'ko',
      createdAt: fallback.createdAt,
      updatedAt: fallback.createdAt
    });
  }
  
  if (parsedGuides.length > 0) {
    console.log('✅ gallery-item에서 가이드 추출 완료:', { guidesCount: parsedGuides.length });
    return parsedGuides;
  }
  
  console.warn('⚠️ HTML에서 가이드 정보를 찾을 수 없음');
  return [];
}
