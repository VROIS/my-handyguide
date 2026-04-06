// ⚠️ 수정금지(승인필요): LiteRT-LM 브릿지 타입 정의

export type LitertBridgeModuleEvents = {
  onToken: (params: { token: string }) => void;
  onComplete: (params: { fullText: string }) => void;
  onError: (params: { error: string }) => void;
  onTestResult: (params: SelfTestResult) => void;
};

export type InitResult = {
  success: boolean;
  modelPath?: string;
  modelSize?: number;
  error?: string;
};

export type SelfTestResult = {
  litertlm_available: boolean;
  litertlm_error?: string;
  model_exists: boolean;
  model_size_mb: number;
  engine_ready: boolean;
  free_memory_mb: number;
  total_memory_mb: number;
  max_memory_mb: number;
  available_processors: number;
};
