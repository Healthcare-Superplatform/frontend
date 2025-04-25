import React, { useState, useEffect, useRef } from "react";

// 🔠 Convert number words like "one zero seven" → "107"
const numberWordsToDigits = (text) => {
  const numbersMap = {
    zero: "0", one: "1", two: "2", three: "3", four: "4",
    five: "5", six: "6", seven: "7", eight: "8", nine: "9", ten: "10",
  };

  return text.split(/\s+/).map(word => {
    const lower = word.toLowerCase();
    return numbersMap[lower] !== undefined ? numbersMap[lower] : word;
  }).join(" ");
};

// 🧠 Fix common misrecognitions
const autoCorrect = (text) => {
  const corrections = {
    sympatom: "symptom",
    symtom: "symptom",
    medecine: "medicine",
    feverr: "fever",
    diabetis: "diabetes",
  };

  return text.split(/\s+/).map(word => {
    const lower = word.toLowerCase();
    return corrections[lower] || word;
  }).join(" ");
};

// 🌍 LibreTranslate endpoint
const API_BASE = "https://translate.astian.org";

// 🌍 Detect language from text
const detectLanguage = async (text) => {
  try {
    const res = await fetch(`${API_BASE}/detect`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ q: text }),
    });
    const data = await res.json();
    return data[0]?.language || "auto";
  } catch {
    return "auto";
  }
};

// 🌐 Translate to English
const translateToEnglish = async (text) => {
  const sourceLang = await detectLanguage(text);

  try {
    const res = await fetch(`${API_BASE}/translate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: text,
        source: sourceLang,
        target: "en",
        format: "text",
      }),
    });
    const data = await res.json();
    if (data?.translatedText) return data.translatedText;
  } catch {}

  // Fallback: Google Translate (unofficial)
  try {
    const res = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(
        text
      )}`
    );
    const data = await res.json();
    return data[0]?.map((seg) => seg[0]).join("") || text;
  } catch {
    return text;
  }
};

const ChatInput = ({ input, setInput, onSend }) => {
  const [listening, setListening] = useState(false);
  const [selectedLang, setSelectedLang] = useState("en-US");
  const recognitionRef = useRef(null);
  const inputBoxRef = useRef(null);
  const transcriptRef = useRef("");
  const silenceTimer = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return console.warn("Speech Recognition not supported");

    const recognition = new SpeechRecognition();
    recognition.lang = selectedLang;
    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.maxAlternatives = 1;

    const resetSilenceTimer = () => {
      clearTimeout(silenceTimer.current);
      silenceTimer.current = setTimeout(() => {
        recognition.stop(); // Stop after ~3s of silence
      }, 2000);
    };

    recognition.onstart = () => {
      transcriptRef.current = "";
      resetSilenceTimer();
    };

    recognition.onresult = (event) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        interim += event.results[i][0].transcript;
      }
      transcriptRef.current = interim;
      setInput(interim);
      resetSilenceTimer();
    };

    recognition.onerror = (event) => {
      console.error("Recognition error:", event.error);
      setListening(false);
      clearTimeout(silenceTimer.current);
    };

    recognition.onend = async () => {
      clearTimeout(silenceTimer.current);
      setListening(false);

      let finalText = transcriptRef.current.trim();
      if (!finalText) return;

      const translated = await translateToEnglish(finalText);
      const corrected = autoCorrect(translated);
      const processed = numberWordsToDigits(corrected);
      setInput(processed);

      setTimeout(() => {
        if (inputBoxRef.current) {
          inputBoxRef.current.dispatchEvent(new KeyboardEvent("keydown", {
            key: "Enter", code: "Enter", bubbles: true
          }));
        }
      }, 200);
    };

    recognitionRef.current = recognition;
  }, [setInput, onSend, selectedLang]);

  const toggleListening = () => {
    if (listening) recognitionRef.current?.stop();
    else recognitionRef.current?.start();
    setListening(!listening);
  };

  return (
    <div className="chat-input">
      <div style={{ marginBottom: "0.5rem" }}>
        <label htmlFor="language-select">🎙️ Voice Language: </label>
        <select
          id="language-select"
          value={selectedLang}
          onChange={(e) => setSelectedLang(e.target.value)}
        >
          <option value="en-US">English</option>
          <option value="bn-BD">Bangla</option>
          <option value="hi-IN">Hindi</option>
          <option value="ur-PK">Urdu</option>
          <option value="es-ES">Spanish</option>
          <option value="fr-FR">French</option>
          <option value="fi-FI">Finnish</option>
          <option value="zh-CN">Chinese</option>
          <option value="ko-KR">Korean</option>
          <option value="ja-JP">Japanese</option>
          <option value="sv-SE">Swedish</option>
          <option value="vi-VN">Vietnamese</option>
        </select>
      </div>

      <input
        ref={inputBoxRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type or speak..."
        onKeyDown={(e) => e.key === "Enter" && onSend()}
      />
      <button onClick={onSend}>Send</button>
      <button onClick={toggleListening} style={{ marginLeft: "8px" }}>
        {listening ? "🎙️ Listening..." : "🎤"}
      </button>
    </div>
  );
};

export default ChatInput;
