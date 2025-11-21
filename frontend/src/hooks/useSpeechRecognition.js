
import { useEffect, useRef, useState } from 'react';

export default function useSpeechRecognition({ lang = 'en-US', interim = true } = {}) {
  const recognitionRef = useRef(null);
  const [listening, setListening] = useState(false);
  const [finalTranscript, setFinalTranscript] = useState('');    // finalised text
  const [interimTranscript, setInterimTranscript] = useState(''); 
  const [error, setError] = useState(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError(new Error('Web Speech API not supported in this browser.'));
      return;
    }

    const rec = new SpeechRecognition();
    rec.lang = lang;
    rec.interimResults = true;   
    rec.maxAlternatives = 1;
    rec.continuous = true;       

    // DEBUG: log
    rec.onstart = () => {
      console.log('%c[ASR STARTED]', 'color: #0a84ff');
      setListening(true);
      setError(null);
    };

    rec.onend = () => {
      console.log('%c[ASR ENDED]', 'color: #ffb86b');
      setListening(false);

    };

    rec.onerror = (ev) => {
      console.log('[ASR ERROR]', ev);
      setError(new Error(ev.error || 'Speech recognition error'));
      setListening(false);
    };


    rec.onresult = (ev) => {
      console.log('%c[SPEECH RESULT FIRED]', 'color: #0f0', ev);


      let interimParts = [];
      let newFinalParts = [];

      for (let i = 0; i < ev.results.length; i++) {
        const result = ev.results[i];
        const transcript = result[0]?.transcript?.trim() || '';
        if (result.isFinal) {
          newFinalParts.push(transcript);
          console.log('%c[ASR FINAL]', 'color: #8ef', transcript);
        } else {
          interimParts.push(transcript);
          console.log('%c[ASR INTERIM]', 'color: #ccc', transcript);
        }
      }


      const interimText = interimParts.join(' ').trim();
      setInterimTranscript(interimText);


      if (newFinalParts.length) {
        setFinalTranscript((prev) => {
          const appended = (prev ? prev + ' ' : '') + newFinalParts.join(' ');
          console.log('%c[ASR APPENDED FINAL STATE]', 'color: #7fffd4', appended);
          return appended.trim();
        });

        setInterimTranscript('');
      }
    };

    recognitionRef.current = rec;

    return () => {
      try {
        rec.onresult = rec.onend = rec.onerror = rec.onstart = null;
        rec.stop();
      } catch (e) {}
    };
  }, [lang]);

  const start = () => {
    const rec = recognitionRef.current;
    if (!rec) return setError(new Error('SpeechRecognition not available'));
    try {

      setFinalTranscript('');
      setInterimTranscript('');
      setError(null);
      console.log('[ASR] start() called');
      rec.start();
    } catch (err) {

      console.warn('[ASR] start() threw', err);
      try {

        rec.stop();
        setTimeout(() => {
          try { rec.start(); } catch(e) { console.warn('[ASR] restart failed', e); }
        }, 200);
      } catch (_) {}
    }
  };

  const stop = () => {
    const rec = recognitionRef.current;
    if (!rec) return;
    try {
      console.log('[ASR] stop() called');
      rec.stop();
    } catch (err) {
      console.warn('[ASR] stop() error', err);
    }
  };


  const clear = () => {
    setFinalTranscript('');
    setInterimTranscript('');
  };

  return {
    listening,
    finalTranscript,     
    interimTranscript,   
    error,
    start,
    stop,
    clear,
  };
}
