import crypto from 'crypto';

const KLING_API_BASE = 'https://api-singapore.klingai.com';

interface KlingVideoRequest {
  imageBase64?: string;
  imageUrl?: string;
  prompt: string;
  duration?: '5' | '10';
  mode?: 'std' | 'pro';
  modelName?: string;
}

interface KlingTaskResponse {
  code: number;
  message: string;
  request_id: string;
  data: {
    task_id: string;
    task_status: string;
  };
}

interface KlingTaskResult {
  code: number;
  message: string;
  request_id: string;
  data: {
    task_id: string;
    task_status: string;
    task_status_msg?: string;
    created_at: number;
    updated_at: number;
    task_result?: {
      videos: Array<{
        id: string;
        url: string;
        duration: string;
      }>;
    };
  };
}

function generateJWT(): string {
  const accessKey = process.env.KLING_ACCESS_KEY;
  const secretKey = process.env.KLING_SECRET_KEY;

  if (!accessKey || !secretKey) {
    throw new Error('KLING_ACCESS_KEY or KLING_SECRET_KEY not set');
  }

  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: accessKey,
    exp: now + 1800,
    nbf: now - 5
  };

  const base64Header = Buffer.from(JSON.stringify(header)).toString('base64url');
  const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  
  const signature = crypto
    .createHmac('sha256', secretKey)
    .update(`${base64Header}.${base64Payload}`)
    .digest('base64url');

  return `${base64Header}.${base64Payload}.${signature}`;
}

async function klingRequest(endpoint: string, body: any): Promise<any> {
  const token = generateJWT();
  
  const response = await fetch(`${KLING_API_BASE}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Kling API error: ${response.status} - ${errorText}`);
  }

  return response.json();
}

async function klingGet(endpoint: string): Promise<any> {
  const token = generateJWT();
  
  const response = await fetch(`${KLING_API_BASE}${endpoint}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Kling API error: ${response.status} - ${errorText}`);
  }

  return response.json();
}

export async function createImageToVideoTask(options: KlingVideoRequest): Promise<KlingTaskResponse> {
  const { imageBase64, imageUrl, prompt, duration = '5', mode = 'std', modelName = 'kling-v2-6' } = options;

  if (!imageBase64 && !imageUrl) {
    throw new Error('Either imageBase64 or imageUrl is required');
  }

  const body: any = {
    model_name: modelName,
    mode,
    duration,
    prompt
  };

  if (imageBase64) {
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    body.image = cleanBase64;
  } else if (imageUrl) {
    body.image = imageUrl;
  }

  console.log(`🎬 [Kling.ai] 영상 생성 요청: model=${modelName}, mode=${mode}, duration=${duration}s`);
  
  const result = await klingRequest('/v1/videos/image2video', body);
  
  console.log(`🎬 [Kling.ai] 태스크 생성됨: ${result.data?.task_id}`);
  
  return result;
}

export async function getTaskResult(taskId: string): Promise<KlingTaskResult> {
  return klingGet(`/v1/videos/image2video/${taskId}`);
}

export async function waitForVideoCompletion(
  taskId: string, 
  maxWaitMs: number = 300000,
  pollIntervalMs: number = 5000
): Promise<string> {
  const startTime = Date.now();
  
  while (Date.now() - startTime < maxWaitMs) {
    const result = await getTaskResult(taskId);
    
    console.log(`🎬 [Kling.ai] 태스크 상태: ${result.data.task_status}`);
    
    if (result.data.task_status === 'succeed') {
      const videoUrl = result.data.task_result?.videos?.[0]?.url;
      if (videoUrl) {
        console.log(`🎬 [Kling.ai] 영상 생성 완료!`);
        return videoUrl;
      }
      throw new Error('Video URL not found in response');
    }
    
    if (result.data.task_status === 'failed') {
      throw new Error(`Video generation failed: ${result.data.task_status_msg || 'Unknown error'}`);
    }
    
    await new Promise(resolve => setTimeout(resolve, pollIntervalMs));
  }
  
  throw new Error('Video generation timeout');
}

export async function generateVideo(options: KlingVideoRequest): Promise<string> {
  const taskResponse = await createImageToVideoTask(options);
  
  if (taskResponse.code !== 0) {
    throw new Error(`Kling API error: ${taskResponse.message}`);
  }
  
  const taskId = taskResponse.data.task_id;
  return waitForVideoCompletion(taskId);
}

export const GUIDE_TEMPLATES = {
  young_female: {
    name: "트렌디한 여행 메이트",
    emoji: "👩",
    age: "20-30대 여성",
    avatarPath: "/avatars/young_female.png",
    promptTemplate: `A friendly Korean woman in her late 20s appears, stylishly dressed. She excitedly points at the scene, takes out her phone to show photo angles, makes heart signs with her hands, and speaks cheerfully to the camera.`
  },
  young_male: {
    name: "열정적인 탐험가", 
    emoji: "👨",
    age: "20-30대 남성",
    avatarPath: "/avatars/young_male.png",
    promptTemplate: `A charismatic Korean man in his late 20s wearing casual streetwear appears. He picks up food with chopsticks, takes a satisfying bite, shows thumbs up with excitement, and gestures invitingly toward the viewer.`
  },
  senior_male: {
    name: "신뢰받는 스마트 집사",
    emoji: "👔", 
    age: "40-50대 남성",
    avatarPath: "/avatars/senior_male.png",
    promptTemplate: `A distinguished Korean man in his late 40s wearing a neat suit appears. He confidently lifts a glass for a toast, nods respectfully, and gestures toward details with professional hand movements.`
  },
  senior_female: {
    name: "우아한 예술 도슨트",
    emoji: "👩‍🏫",
    age: "40-50대 여성", 
    avatarPath: "/avatars/senior_female.png",
    promptTemplate: `An elegant Korean woman in her late 40s in sophisticated attire appears. She gracefully points at artwork details, tilts her head thoughtfully, and gestures softly with refined hand movements.`
  }
};

export type GuideType = keyof typeof GUIDE_TEMPLATES;
