import sharp from 'sharp';
import { removeBackground } from '@imgly/background-removal-node';
import fs from 'fs/promises';
import path from 'path';

const SOURCE_IMAGE = './attached_assets/image_1767231599625.png';
const OUTPUT_DIR = './attached_assets/avatars';

const AVATARS = [
  { name: 'young_female', row: 0, col: 0, label: '20-30대 여성 가이드' },
  { name: 'young_male', row: 0, col: 1, label: '20-30대 남성 가이드' },
  { name: 'senior_male', row: 1, col: 0, label: '40-50대 남성 가이드' },
  { name: 'senior_female', row: 1, col: 1, label: '40-50대 여성 가이드' }
];

async function processAvatars() {
  console.log('🎨 아바타 이미지 처리 시작...\n');

  // 출력 디렉토리 생성
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  // 원본 이미지 로드
  const image = sharp(SOURCE_IMAGE);
  const metadata = await image.metadata();
  
  const width = metadata.width;
  const height = metadata.height;
  const cellWidth = Math.floor(width / 2);
  const cellHeight = Math.floor(height / 2);

  console.log(`📐 원본 크기: ${width}x${height}`);
  console.log(`📐 셀 크기: ${cellWidth}x${cellHeight}\n`);

  for (const avatar of AVATARS) {
    const left = avatar.col * cellWidth;
    const top = avatar.row * cellHeight;

    console.log(`✂️ ${avatar.label} 추출 중...`);

    // 1. 이미지 크롭
    const croppedBuffer = await sharp(SOURCE_IMAGE)
      .extract({ left, top, width: cellWidth, height: cellHeight })
      .png()
      .toBuffer();

    // 크롭된 이미지 임시 저장
    const croppedPath = path.join(OUTPUT_DIR, `${avatar.name}_cropped.png`);
    await fs.writeFile(croppedPath, croppedBuffer);
    console.log(`   → 크롭 완료: ${croppedPath}`);

    // 2. 배경 제거
    console.log(`   → 배경 제거 중... (시간 소요)`);
    try {
      const blob = new Blob([croppedBuffer], { type: 'image/png' });
      const removedBg = await removeBackground(blob);
      const arrayBuffer = await removedBg.arrayBuffer();
      const transparentBuffer = Buffer.from(arrayBuffer);

      // 투명 배경 이미지 저장
      const transparentPath = path.join(OUTPUT_DIR, `${avatar.name}.png`);
      await fs.writeFile(transparentPath, transparentBuffer);
      console.log(`   ✅ 배경 제거 완료: ${transparentPath}\n`);

      // 크롭된 임시 파일 삭제
      await fs.unlink(croppedPath);
    } catch (error) {
      console.log(`   ⚠️ 배경 제거 실패, 크롭 이미지 유지: ${error.message}\n`);
    }
  }

  console.log('🎉 모든 아바타 처리 완료!');
  console.log(`📁 저장 위치: ${OUTPUT_DIR}`);
}

processAvatars().catch(console.error);
