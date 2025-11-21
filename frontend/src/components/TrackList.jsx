import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { usePlayer } from '../contexts/PlayerContext';

export default function TrackList() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const player = usePlayer();

  useEffect(() => {
    let mounted = true;
    api.get('/tracks')
      .then(res => {
        if (!mounted) return;
        setTracks(res.data.items || []);
      })
      .catch(err => {
        console.error('Failed to load tracks', err);
      })
      .finally(() => setLoading(false));
    return () => { mounted = false; };
  }, []);

  if (loading) return <div className="p-4">Loading tracks...</div>;
  if (!tracks.length) return <div className="p-4">No tracks found. Add some MP3s to backend/src/media/ and run seed.</div>;

  return (
    <div className="space-y-3 p-4">
      {tracks.map(t => (
        <div key={t._id} className="flex items-center justify-between text-[#1b1b1b] bg-[#737373] rounded-4xl p-3 ">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-3xl bg-[#1b1b1b] text-[#737373] flex items-center justify-center text-sm font-semibold">
              {t.title.charAt(0) || '♫'}
            </div>
            <div>
              <div className="font-semibold">{t.title}</div>
              <div className="text-sm text-[#2d2d2d]">{t.artist || 'Unknown'}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => player.playTrackById(t)}
              className="px-3 py-2 bg-white/10 rounded-md rounded-r-4xl hover:bg-white/20 cursor-pointer font-extrabold"
            >
              Play
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
