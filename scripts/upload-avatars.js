import { Storage } from '@google-cloud/storage';
import fs from 'fs/promises';
import path from 'path';

const AVATAR_DIR = './attached_assets/avatars';
const BUCKET_NAME = process.env.REPLIT_OBJECT_STORAGE_BUCKET_ID || 'replit-objstore-110c4c42-c36a-4085-afe3-5b38194a46f1';

async function uploadAvatars() {
  if (!BUCKET_NAME) {
    console.error('❌ REPLIT_OBJECT_STORAGE_BUCKET_ID 환경변수가 없습니다.');
    return;
  }

  console.log('📤 Object Storage 업로드 시작...\n');
  console.log(`📦 버킷: ${BUCKET_NAME}\n`);

  const storage = new Storage();
  const bucket = storage.bucket(BUCKET_NAME);

  const files = await fs.readdir(AVATAR_DIR);
  const pngFiles = files.filter(f => f.endsWith('.png') && !f.includes('_cropped'));

  for (const file of pngFiles) {
    const localPath = path.join(AVATAR_DIR, file);
    const remotePath = `public/avatars/${file}`;

    console.log(`📤 업로드: ${file}`);
    
    await bucket.upload(localPath, {
      destination: remotePath,
      metadata: {
        contentType: 'image/png',
        cacheControl: 'public, max-age=31536000'
      }
    });

    // Public URL 생성
    const publicUrl = `https://storage.googleapis.com/${BUCKET_NAME}/${remotePath}`;
    console.log(`   ✅ ${publicUrl}\n`);
  }

  console.log('🎉 모든 아바타 업로드 완료!');
}

uploadAvatars().catch(console.error);
