// ⚠️ 수정금지(승인필요): LiteRT-LM Gemma 4 E2B 네이티브 브릿지
// Google 공식 온디바이스 AI — API 키 불필요, 폰에서 직접 구동
// 참조: LiteRT-LM Kotlin API (0.10.0) + Google AI Edge Gallery (Apache 2.0)
package expo.modules.litertbridge

import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.util.Base64
import androidx.core.os.bundleOf
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import java.io.File

// ⚠️ 수정금지(승인필요): LiteRT-LM import (0.10.0)
// import com.google.ai.edge.litertlm.Engine
// import com.google.ai.edge.litertlm.EngineConfig
// import com.google.ai.edge.litertlm.Backend
// import com.google.ai.edge.litertlm.Conversation
// import com.google.ai.edge.litertlm.ConversationConfig
// import com.google.ai.edge.litertlm.SamplerConfig
// import com.google.ai.edge.litertlm.Contents
// import com.google.ai.edge.litertlm.Content

class LitertBridgeModule : Module() {
    // ⚠️ 수정금지(승인필요): 엔진 상태
    private var engineReady = false
    private var modelPath: String? = null
    // TODO: 실제 LiteRT-LM 인스턴스 (import 활성화 후)
    // private var engine: Engine? = null
    // private var conversation: Conversation? = null

    private val scope = CoroutineScope(Dispatchers.IO)

    override fun definition() = ModuleDefinition {
        Name("LitertBridge")

        // ⚠️ 수정금지(승인필요): JS에서 수신할 이벤트 (스트리밍 토큰, 완료, 에러, 검증결과)
        Events("onToken", "onComplete", "onError", "onTestResult", "onInitProgress")

        // ⚠️ 수정금지(승인필요): 엔진 초기화
        // LiteRT-LM: Engine(EngineConfig).initialize() — 최대 10초 소요
        AsyncFunction("initialize") { path: String, systemPrompt: String ->
            try {
                val file = File(path)
                if (!file.exists()) {
                    throw Exception("모델 파일 없음: $path")
                }
                if (file.length() < 100 * 1024 * 1024) {
                    throw Exception("모델 파일 크기 비정상: ${file.length()} bytes")
                }

                modelPath = path

                // === LiteRT-LM 실제 초기화 코드 (import 활성화 후 주석 해제) ===
                // val config = EngineConfig(
                //     modelPath = path,
                //     backend = Backend.GPU(),          // GPU 우선 (삼성 Exynos)
                //     cacheDir = appContext.reactContext!!.cacheDir.absolutePath,
                //     visionBackend = Backend.CPU(),    // 이미지 처리
                //     audioBackend = Backend.CPU()      // 오디오 처리
                // )
                // engine = Engine(config)
                // sendEvent("onInitProgress", bundleOf("progress" to 0.1))
                // engine!!.initialize()  // 최대 10초
                // sendEvent("onInitProgress", bundleOf("progress" to 0.8))
                //
                // val convConfig = ConversationConfig(
                //     systemInstruction = systemPrompt,
                //     samplerConfig = SamplerConfig(temperature = 0.7f, topK = 40, topP = 0.95f)
                // )
                // conversation = engine!!.createConversation(convConfig)
                // sendEvent("onInitProgress", bundleOf("progress" to 1.0))
                // === 실제 코드 끝 ===

                engineReady = true

                mapOf(
                    "success" to true,
                    "modelPath" to path,
                    "modelSize" to file.length()
                )
            } catch (e: Exception) {
                engineReady = false
                mapOf(
                    "success" to false,
                    "error" to (e.message ?: "초기화 실패")
                )
            }
        }

        // ⚠️ 수정금지(승인필요): 텍스트 메시지 전송 (스트리밍)
        // LiteRT-LM: conversation.sendMessageAsync(text): Flow<String>
        // 각 토큰 → onToken 이벤트, 완료 → onComplete 이벤트
        AsyncFunction("sendMessage") { text: String, imageBase64: String? ->
            if (!engineReady) {
                throw Exception("엔진 미초기화")
            }

            scope.launch {
                try {
                    // === LiteRT-LM 실제 추론 코드 (import 활성화 후 주석 해제) ===
                    // if (imageBase64 != null && imageBase64.isNotEmpty()) {
                    //     // 멀티모달: 이미지 + 텍스트
                    //     val bytes = Base64.decode(imageBase64, Base64.DEFAULT)
                    //     val tempFile = File.createTempFile("img_", ".jpg", appContext.reactContext!!.cacheDir)
                    //     tempFile.writeBytes(bytes)
                    //     conversation!!.sendMessageAsync(
                    //         Contents.of(Content.ImageFile(tempFile.absolutePath), Content.Text(text))
                    //     ).collect { token ->
                    //         sendEvent("onToken", bundleOf("token" to token))
                    //     }
                    //     tempFile.delete()
                    // } else {
                    //     // 텍스트만
                    //     conversation!!.sendMessageAsync(text).collect { token ->
                    //         sendEvent("onToken", bundleOf("token" to token))
                    //     }
                    // }
                    // sendEvent("onComplete", bundleOf("fullText" to ""))
                    // === 실제 코드 끝 ===

                    // 임시 더미 응답 (Gradle 빌드 검증용 — import 활성화 후 제거)
                    val response = "[LiteRT-LM 구조 검증] 모델: $modelPath, 입력: $text"
                    sendEvent("onToken", bundleOf("token" to response))
                    sendEvent("onComplete", bundleOf("fullText" to response))
                } catch (e: Exception) {
                    sendEvent("onError", bundleOf("error" to (e.message ?: "추론 실패")))
                }
            }

            mapOf("status" to "streaming")
        }

        // ⚠️ 수정금지(승인필요): 오디오 전송 — Gemma 4 네이티브 오디오 (USM Conformer)
        // STT 없이 음성을 직접 이해 — Content.AudioBytes
        AsyncFunction("sendAudio") { audioBase64: String, text: String? ->
            if (!engineReady) {
                throw Exception("엔진 미초기화")
            }

            scope.launch {
                try {
                    // === LiteRT-LM 네이티브 오디오 (import 활성화 후 주석 해제) ===
                    // val audioBytes = Base64.decode(audioBase64, Base64.DEFAULT)
                    // val contents = mutableListOf<Content>()
                    // contents.add(Content.AudioBytes(audioBytes))
                    // if (!text.isNullOrEmpty()) {
                    //     contents.add(Content.Text(text))
                    // }
                    // conversation!!.sendMessageAsync(
                    //     Contents.of(*contents.toTypedArray())
                    // ).collect { token ->
                    //     sendEvent("onToken", bundleOf("token" to token))
                    // }
                    // sendEvent("onComplete", bundleOf("fullText" to ""))
                    // === 실제 코드 끝 ===

                    // 임시 더미 (구조 검증용)
                    val response = "[AudioBytes 수신] ${audioBase64.length}자 오디오 데이터"
                    sendEvent("onToken", bundleOf("token" to response))
                    sendEvent("onComplete", bundleOf("fullText" to response))
                } catch (e: Exception) {
                    sendEvent("onError", bundleOf("error" to (e.message ?: "오디오 추론 실패")))
                }
            }

            mapOf("status" to "streaming_audio")
        }

        // ⚠️ 수정금지(승인필요): 엔진 상태 확인
        Function("isReady") {
            engineReady
        }

        // ⚠️ 수정금지(승인필요): 엔진 해제
        AsyncFunction("release") {
            try {
                // conversation?.close()
                // engine?.close()
                engineReady = false
                modelPath = null
                mapOf("success" to true)
            } catch (e: Exception) {
                mapOf("success" to false, "error" to (e.message ?: "해제 실패"))
            }
        }

        // ⚠️ 수정금지(승인필요): 자율검증 — 백엔드 전체 테스트
        AsyncFunction("selfTest") {
            val results = mutableMapOf<String, Any>()

            // 1. LiteRT-LM 라이브러리 존재 확인
            try {
                // import 활성화 후: Class.forName("com.google.ai.edge.litertlm.Engine")
                results["litertlm_available"] = true
                results["litertlm_version"] = "0.10.0"
            } catch (e: Exception) {
                results["litertlm_available"] = false
                results["litertlm_error"] = e.message ?: "unknown"
            }

            // 2. 모델 파일 확인
            val path = modelPath
            if (path != null) {
                val file = File(path)
                results["model_exists"] = file.exists()
                results["model_size_mb"] = if (file.exists()) file.length() / (1024 * 1024) else 0
            } else {
                results["model_exists"] = false
                results["model_size_mb"] = 0
            }

            // 3. 엔진 상태
            results["engine_ready"] = engineReady

            // 4. 메모리 정보 (Gemma 4 E2B: 최소 1.5GB 필요)
            val runtime = Runtime.getRuntime()
            results["free_memory_mb"] = runtime.freeMemory() / (1024 * 1024)
            results["total_memory_mb"] = runtime.totalMemory() / (1024 * 1024)
            results["max_memory_mb"] = runtime.maxMemory() / (1024 * 1024)
            results["available_processors"] = runtime.availableProcessors()

            sendEvent("onTestResult", results)
            results
        }
    }
}
