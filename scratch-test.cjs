const http = require('https');

const API_KEY = 'sk_4gy0ntfh_SsDANXJ1bqQxDEIwTfiyDaTt';

async function testTranslation(sourceLang, targetLang, text) {
  try {
    console.log(`\nTesting Translation: ${sourceLang} -> ${targetLang}`);
    const translateData = JSON.stringify({
      input: text,
      source_language_code: sourceLang,
      target_language_code: targetLang,
      speaker_gender: "Female",
      mode: "formal",
      model: "mayura:v1"
    });

    const translateRes = await new Promise((resolve, reject) => {
      const req = http.request('https://api.sarvam.ai/translate', {
        method: 'POST',
        headers: {
          'api-subscription-key': API_KEY,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(translateData)
        }
      }, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => resolve({ status: res.statusCode, body }));
      });
      req.on('error', reject);
      req.write(translateData);
      req.end();
    });

    console.log(`Translate Status: ${translateRes.status}`);
    if (translateRes.status !== 200) {
      console.error(`Translate Error Body: ${translateRes.body}`);
      return null;
    }
    const parsed = JSON.parse(translateRes.body);
    const resultText = Array.isArray(parsed.translated_text) ? parsed.translated_text[0] : parsed.translated_text;
    console.log(`Translated text: ${resultText}`);
    return resultText;
  } catch (e) {
    console.error(e);
    return null;
  }
}

async function testTTS(targetLang, text) {
  try {
    console.log(`\nTesting TTS for language: ${targetLang}`);
    const ttsData = JSON.stringify({
      inputs: [text],
      target_language_code: targetLang,
      speaker: "ritu",
      model: "bulbul:v3"
    });

    const ttsRes = await new Promise((resolve, reject) => {
      const req = http.request('https://api.sarvam.ai/text-to-speech', {
        method: 'POST',
        headers: {
          'api-subscription-key': API_KEY,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(ttsData)
        }
      }, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => resolve({ status: res.statusCode, body }));
      });
      req.on('error', reject);
      req.write(ttsData);
      req.end();
    });

    console.log(`TTS Status: ${ttsRes.status}`);
    if (ttsRes.status !== 200) {
      console.error(`TTS Error Body: ${ttsRes.body}`);
    } else {
      console.log(`TTS Success!`);
    }
  } catch (e) {
    console.error(e);
  }
}

async function run() {
  const tamilText = await testTranslation("hi-IN", "ta-IN", "नमस्ते, आप कैसे हैं?");
  if (tamilText) await testTTS("ta-IN", tamilText);
}

run();
