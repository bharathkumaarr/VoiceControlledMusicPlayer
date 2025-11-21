import React from 'react';
import { usePlayer } from '../contexts/PlayerContext';

function formatTime(sec = 0) {
  if (!isFinite(sec)) return '0:00';
  const s = Math.floor(sec % 60).toString().padStart(2, '0');
  const m = Math.floor(sec / 60);
  return `${m}:${s}`;
}

export default function PlayerBar() {
  const { audio, index, queue, playNext, playPrev } = usePlayer();
  const { isPlaying, currentTime, duration, play, pause, seekTo } = audio;

  const current = queue[index];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] md:w-[50%] bg-[#1b1b1b] text-[#737373] backdrop-blur-xl rounded-4xl p-3 flex items-center shadow-2xl shadow-black gap-4">
      <div className="flex items-center gap-3 ">
        <div className="w-14 h-14 rounded-full bg-[#737373] text-[#1b1b1b] flex items-center justify-center text-xl font-semibold">
          {current?.title?.charAt(0) ?? '♫'}
        </div>
        <div>
          <div className="font-semibold">{current?.title ?? 'Nothing playing'}</div>
          <div className="text-sm text-[#c7c7c7]">{current?.artist ?? ''}</div>
        </div>
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-3 justify-center  border  p-1 rounded-2xl">
          <button onClick={playPrev} className="p-2 font-bold"> &lt; &lt;</button>
          {!isPlaying ? (
            <button onClick={play} className="bg-white/10 rounded-full w-12 h-12 flex items-center justify-center font-bold">▶</button>
          ) : (
            <button onClick={pause} className="bg-white/10 rounded-full w-12 h-12 flex items-center justify-center font-bold cursor-pointer">||</button>
          )}
          <button onClick={playNext} className="p-2 flex text-center font-bold"> &gt; &gt;</button>
        </div>

        <div className="mt-2">
          <input
            type="range"
            min="0"
            max={duration || 0}
            step="0.1"
            value={currentTime || 0}
            onChange={(e) => seekTo(Number(e.target.value))}
            className="w-full accent-[#737373]"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <div>{formatTime(currentTime)}</div>
            <div>{formatTime(duration)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
