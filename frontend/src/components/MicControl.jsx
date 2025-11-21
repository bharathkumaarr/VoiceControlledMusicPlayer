import React, { useState, useEffect } from 'react';
import useSpeechRecognition from '../hooks/useSpeechRecognition';
import intentMapper from '../utils/intentMapper';
import { handleIntent } from '../services/playerService';
import { usePlayer } from '../contexts/PlayerContext';
import Toast from './Toast';

export default function MicControl() {
  const player = usePlayer();

  const {
    listening,
    finalTranscript,
    interimTranscript,
    error,
    start,
    stop,
    clear
  } = useSpeechRecognition();

  const [showToast, setShowToast] = useState(false);
  const [lastResult, setLastResult] = useState(null);


  useEffect(() => {
    let mounted = true;
    async function processFinal(finalText) {
      if (!finalText) return;
      console.log('AUTO: FINAL TEXT DETECTED:', finalText);

      const intentObj = intentMapper(finalText);
      console.log('INTENT OBJ:', intentObj);

      const result = await handleIntent(intentObj, player);
      console.log('HANDLE INTENT RES:', result);

      if (!mounted) return;
      setLastResult({
        intentObj,
        resultMsg: result.msg || (result.ok ? 'Done' : 'Failed'),
      });
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3500);


      try { stop(); } catch (e) {}
      clear();
    }


    if (finalTranscript && finalTranscript.trim().length > 0) {
      processFinal(finalTranscript.trim());
    }

    return () => { mounted = false; };
  }, [finalTranscript, stop, clear, player]);

  // manual toggle fallback (start/stop)
  async function toggle() {
    if (listening) {

      stop();
      return;
    } else {
      setLastResult(null);
      setShowToast(false);
      start();
    }
  }

  return (
    <>
      <div className="flex items-center gap-4">
        <button
          onClick={toggle}
          className={`w-54 h-54 cursor-pointer hover:scale-110 rounded-full flex items-center justify-center shadow-2xl shadow-black transition-all ease-in-out duration-500 ${
            listening ? 'ring-8 ring-black/60' : ''
          }  `}
        >
          <div className="w-32 h-32 rounded-full bg-black/40 flex items-center justify-center text-white">
            <img src="mic.png" alt="mock" className="w-12 h-12 rounded-xl object-cover shadow-lg" />
          </div>
        </button>

        <div className="min-w-[220px]">
          {/* <div className="text-sm text-slate-300">{listening ? 'Listening…' : 'Tap to speak'}</div> */}
          <div className="text-sm mt-1 text-white/90">
            {listening
              ? (interimTranscript || <span className="text-slate-400">Speak now...</span>)
              : (lastResult?.intentObj?.raw || '')}
          </div>
        </div>
      </div>

      {listening && (
        <div className="fixed inset-0 flex items-center justify-center z-40 pointer-events-none">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative z-50 pointer-events-auto max-w-md w-[92%] p-6 rounded-3xl"
               style={{
                 background: 'linear-gradient(180deg, rgba(10,10,20,0.85), rgba(3,3,10,0.6))',
                 boxShadow: '0 10px 40px rgba(0,0,0,0.6)'
               }}>
            <div className="flex items-center gap-4">
              <img src="mic.png" alt="mock" className="w-12 h-12 rounded-xl object-cover shadow-lg" />
              <div>
                <div className="text-lg font-semibold">Listening</div>
                <div className="text-sm text-slate-300 mt-1">
                  {interimTranscript || finalTranscript || 'Say a command - e.g., "play Starboy"'}
                </div>
              </div>
              <div className="ml-auto">
                <button onClick={toggle} className="px-3 py-2 bg-white/5 rounded-xl">Stop</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showToast && lastResult && (
        <Toast
          title={lastResult.intentObj.intent}
          subtitle={lastResult.resultMsg + (lastResult.intentObj.raw ? ` — "${lastResult.intentObj.raw}"` : '')}
          onClose={() => setShowToast(false)}
        />
      )}

      {error && <div className="text-xs text-red-400 mt-2">{error.message}</div>}
    </>
  );
}
