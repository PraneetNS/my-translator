let mediaRecorder = null
let audioChunks = []
let resolveStop = null

export function startRecording() {
  return new Promise(async (resolve, reject) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorder = new MediaRecorder(stream)
      audioChunks = []

      mediaRecorder.ondataavailable = e => {
        if (e.data.size > 0) audioChunks.push(e.data)
      }

      mediaRecorder.onstop = async () => {
        const blob = new Blob(audioChunks, { type: 'audio/wav' })
        const buffer = await blob.arrayBuffer()
        // Safe base64 for large buffers
        const bytes = new Uint8Array(buffer)
        let binary = ''
        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i])
        }
        const base64 = btoa(binary)
        stream.getTracks().forEach(t => t.stop())
        if (resolveStop) {
          resolveStop(base64)
          resolveStop = null
        }
      }

      mediaRecorder.start()
      resolve()
    } catch (err) {
      reject(err)
    }
  })
}

export function stopRecording() {
  return new Promise(resolve => {
    resolveStop = resolve
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop()
    } else {
      resolve(null)
    }
  })
}
