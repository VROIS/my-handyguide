// ⚠️ 수정금지(승인필요): LiteRT-LM 네이티브 모듈 JS 인터페이스
import { NativeModule, requireNativeModule } from 'expo';

import { LitertBridgeModuleEvents, InitResult, SelfTestResult } from './LitertBridge.types';

declare class LitertBridgeModule extends NativeModule<LitertBridgeModuleEvents> {
  initialize(modelPath: string, systemPrompt: string): Promise<InitResult>;
  sendMessage(text: string, imageBase64?: string): Promise<{ status: string }>;
  sendAudio(audioBase64: string, text?: string): Promise<{ status: string }>;
  isReady(): boolean;
  release(): Promise<{ success: boolean; error?: string }>;
  selfTest(): Promise<SelfTestResult>;
}

export default requireNativeModule<LitertBridgeModule>('LitertBridge');
