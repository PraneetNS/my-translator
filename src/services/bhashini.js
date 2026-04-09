const BHASHINI_BASE = 'https://dhruva-api.bhashini.gov.in/services/inference/pipeline'
const BHASHINI_AUTH = 'https://meity-auth.ulcacontrib.org/ulca/apis/v0/model/getModelsPipeline'

const HEADERS = {
  'userID': import.meta.env.VITE_BHASHINI_USER_ID,
  'ulcaApiKey': import.meta.env.VITE_BHASHINI_API_KEY,
  'Content-Type': 'application/json',
}

// Get pipeline config for STT → Translate → TTS
export async function getPipelineConfig(sourceLang, targetLang) {
  const body = {
    pipelineTasks: [
      { taskType: 'asr', config: { language: { sourceLanguage: sourceLang } } },
      { taskType: 'translation', config: { language: { sourceLanguage: sourceLang, targetLanguage: targetLang } } },
      { taskType: 'tts', config: { language: { sourceLanguage: targetLang } } },
    ],
    pipelineRequestConfig: { pipelineId: '64392f96daac500b55c543cd' }
  }

  const res = await fetch(BHASHINI_AUTH, { method: 'POST', headers: HEADERS, body: JSON.stringify(body) })
  if (!res.ok) throw new Error(`Auth failed: ${res.status}`)
  return res.json()
}

// Full pipeline: audio → translated text + audio
export async function runPipeline({ audioBase64, sourceLang, targetLang, pipelineConfig }) {
  const body = {
    pipelineTasks: [
      {
        taskType: 'asr',
        config: {
          serviceId: pipelineConfig.asr.serviceId,
          language: { sourceLanguage: sourceLang },
          audioFormat: 'wav',
          samplingRate: 16000,
        }
      },
      {
        taskType: 'translation',
        config: {
          serviceId: pipelineConfig.translation.serviceId,
          language: { sourceLanguage: sourceLang, targetLanguage: targetLang }
        }
      },
      {
        taskType: 'tts',
        config: {
          serviceId: pipelineConfig.tts.serviceId,
          language: { sourceLanguage: targetLang },
          gender: 'female',
        }
      }
    ],
    inputData: {
      audio: [{ audioContent: audioBase64 }]
    }
  }

  const res = await fetch(BHASHINI_BASE, { method: 'POST', headers: HEADERS, body: JSON.stringify(body) })
  if (!res.ok) throw new Error(`Pipeline failed: ${res.status}`)
  const data = await res.json()

  return {
    transcript: data.pipelineResponse[0].output[0].source,
    translatedText: data.pipelineResponse[1].output[0].target,
    audioBase64: data.pipelineResponse[2].audio[0].audioContent,
  }
}

// Text-only translation (for quick phrases)
export async function translateText({ text, sourceLang, targetLang, serviceId }) {
  const body = {
    pipelineTasks: [{
      taskType: 'translation',
      config: {
        serviceId,
        language: { sourceLanguage: sourceLang, targetLanguage: targetLang }
      }
    }],
    inputData: { input: [{ source: text }] }
  }

  const res = await fetch(BHASHINI_BASE, { method: 'POST', headers: HEADERS, body: JSON.stringify(body) })
  if (!res.ok) throw new Error(`Translation failed: ${res.status}`)
  const data = await res.json()
  return data.pipelineResponse[0].output[0].target
}
