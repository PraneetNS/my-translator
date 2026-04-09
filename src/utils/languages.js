// All 22 scheduled languages of India with Bhashini codes, scripts, and TTS locale
export const INDIC_LANGUAGES = [
  { code: 'hi',  label: 'Hindi',       script: 'हिन्दी',        ttsLang: 'hi-IN' },
  { code: 'bn',  label: 'Bengali',     script: 'বাংলা',          ttsLang: 'bn-IN' },
  { code: 'te',  label: 'Telugu',      script: 'తెలుగు',         ttsLang: 'te-IN' },
  { code: 'mr',  label: 'Marathi',     script: 'मराठी',          ttsLang: 'mr-IN' },
  { code: 'ta',  label: 'Tamil',       script: 'தமிழ்',          ttsLang: 'ta-IN' },
  { code: 'gu',  label: 'Gujarati',    script: 'ગુજરાતી',        ttsLang: 'gu-IN' },
  { code: 'kn',  label: 'Kannada',     script: 'ಕನ್ನಡ',          ttsLang: 'kn-IN' },
  { code: 'ml',  label: 'Malayalam',   script: 'മലയാളം',         ttsLang: 'ml-IN' },
  { code: 'pa',  label: 'Punjabi',     script: 'ਪੰਜਾਬੀ',         ttsLang: 'pa-IN' },
  { code: 'or',  label: 'Odia',        script: 'ଓଡ଼ିଆ',           ttsLang: 'or-IN' },
  { code: 'as',  label: 'Assamese',    script: 'অসমীয়া',        ttsLang: 'as-IN' },
  { code: 'mai', label: 'Maithili',    script: 'मैथिली',         ttsLang: 'hi-IN' },
  { code: 'sat', label: 'Santali',     script: 'ᱥᱟᱱᱛᱟᱲᱤ',      ttsLang: 'hi-IN' },
  { code: 'ks',  label: 'Kashmiri',    script: 'کٲشُر',          ttsLang: 'hi-IN' },
  { code: 'ne',  label: 'Nepali',      script: 'नेपाली',         ttsLang: 'ne-IN' },
  { code: 'sd',  label: 'Sindhi',      script: 'سنڌي',           ttsLang: 'hi-IN' },
  { code: 'kok', label: 'Konkani',     script: 'कोंकणी',         ttsLang: 'hi-IN' },
  { code: 'doi', label: 'Dogri',       script: 'डोगरी',          ttsLang: 'hi-IN' },
  { code: 'mni', label: 'Manipuri',    script: 'মৈতৈলোন্',       ttsLang: 'hi-IN' },
  { code: 'brx', label: 'Bodo',        script: 'बड़ो',            ttsLang: 'hi-IN' },
  { code: 'ur',  label: 'Urdu',        script: 'اردو',            ttsLang: 'ur-IN' },
  { code: 'sa',  label: 'Sanskrit',    script: 'संस्कृतम्',      ttsLang: 'hi-IN' },
]

// Keep the older LANGUAGES export for other components that still depend on it
export const LANGUAGES = [
  { code: 'EN', label: 'English',    ttsLang: 'en-US', flag: '🇺🇸' },
  { code: 'ES', label: 'Spanish',    ttsLang: 'es-ES', flag: '🇪🇸' },
  { code: 'FR', label: 'French',     ttsLang: 'fr-FR', flag: '🇫🇷' },
  { code: 'DE', label: 'German',     ttsLang: 'de-DE', flag: '🇩🇪' },
  { code: 'HI', label: 'Hindi',      ttsLang: 'hi-IN', flag: '🇮🇳' },
  { code: 'JA', label: 'Japanese',   ttsLang: 'ja-JP', flag: '🇯🇵' },
  { code: 'ZH', label: 'Chinese',    ttsLang: 'zh-CN', flag: '🇨🇳' },
  { code: 'AR', label: 'Arabic',     ttsLang: 'ar-SA', flag: '🇸🇦' },
  { code: 'PT', label: 'Portuguese', ttsLang: 'pt-PT', flag: '🇵🇹' },
  { code: 'RU', label: 'Russian',    ttsLang: 'ru-RU', flag: '🇷🇺' },
]
