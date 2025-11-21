
import React, { createContext, useContext, useState, useCallback } from 'react';
import useAudioPlayer from '../hooks/useAudioPlayer';
import api from '../api/api';

const PlayerContext = createContext(null);


function shuffleArray(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function PlayerProvider({ children }) {
  const audio = useAudioPlayer();
  const [queue, setQueue] = useState([]);
  const [index, setIndex] = useState(-1);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);

  const playTrackById = useCallback(async (track) => {
    const streamUrl = `${api.defaults.baseURL.replace(/\/api$/, '')}/api/tracks/${track._id}/stream`;
    const t = { id: track._id, streamUrl, title: track.title, artist: track.artist };

    setQueue([t]);
    setIndex(0);
    audio.loadTrack(t);
    await audio.play();
  }, [audio]);

  const enqueueAndPlay = useCallback(async (track) => {
    const streamUrl = `${api.defaults.baseURL.replace(/\/api$/, '')}/api/tracks/${track._id}/stream`;
    const t = { id: track._id, streamUrl, title: track.title, artist: track.artist };
    setQueue((q) => {
      const next = [...q, t];
      return next;
    });
    setIndex((i) => {
      const newIndex = Math.max(i, 0);
      if (i === -1) {
        audio.loadTrack(t);
        audio.play();
        return 0;
      }
      return newIndex;
    });
  }, [audio]);


  const toggleShuffle = useCallback((value) => {
    setShuffle(prev => {
      const nextShuffle = typeof value === 'boolean' ? value : !prev;
      try {
        setQueue((prevQueue) => {
          if (!prevQueue || prevQueue.length <= 1) return prevQueue || [];

          // identify current item
          const curId = audio.currentTrack?.id || (prevQueue[index]?.id);
          // produce a shuffled queue
          const shuffled = shuffleArray(prevQueue);


          if (curId) {
            const found = shuffled.findIndex(q => q.id === curId);
            if (found >= 0) {

              const item = shuffled.splice(found, 1)[0];
              shuffled.unshift(item);

              setIndex(0);
            } else {

              setIndex(0);
            }
          } else {
            setIndex(0);
          }

          return shuffled;
        });
      } catch (err) {
        console.warn('[Player] toggleShuffle error', err);
      }

      return nextShuffle;
    });
  }, [audio, index]);


  const playNext = useCallback(async () => {
    try {
      console.log('[Player] playNext called', { queueLength: queue.length, index, shuffle, repeat });


      if (queue.length > 0 && index + 1 < queue.length) {
        const nextIndex = shuffle ? Math.floor(Math.random() * queue.length) : index + 1;
        const t = queue[nextIndex];
        if (t) {
          audio.loadTrack(t);
          await audio.play();
          setIndex(nextIndex);
          console.log('[Player] advanced to queue next', nextIndex, t);
          return;
        }
      }


      if (repeat && queue.length > 0) {
        const t = queue[0];
        if (t) {
          audio.loadTrack(t);
          await audio.play();
          setIndex(0);
          console.log('[Player] repeat -> playing index 0', t);
          return;
        }
      }


      console.log('[Player] fetching global tracks as fallback');
      const res = await api.get('/tracks', { params: { limit: 200 } });
      const items = res.data.items || [];

      if (!items.length) {
        console.warn('[Player] playNext: no tracks available from backend');
        return;
      }

      const newQueue = items.map(it => ({
        id: it._id,
        streamUrl: `${api.defaults.baseURL.replace(/\/api$/, '')}/api/tracks/${it._id}/stream`,
        title: it.title,
        artist: it.artist,
      }));


      const curId = audio.currentTrack?.id || (queue[index]?.id);
      let startIdx = 0;
      if (curId) {
        const found = newQueue.findIndex(q => q.id === curId);
        startIdx = found >= 0 ? found + 1 : 0;
      }

      if (startIdx >= newQueue.length) {
        if (repeat) startIdx = 0;
        else {
          console.warn('[Player] playNext: no next in fetched queue');
          return;
        }
      }


      if (shuffle) {
        const randIdx = Math.floor(Math.random() * newQueue.length);
        setQueue(newQueue);
        setIndex(randIdx);
        const next = newQueue[randIdx];
        audio.loadTrack(next);
        await audio.play();
        console.log('[Player] playNext fetched new queue (shuffle) and played', randIdx, next);
        return;
      }


      setQueue(newQueue);
      setIndex(startIdx);
      const next = newQueue[startIdx];
      audio.loadTrack(next);
      await audio.play();
      console.log('[Player] playNext fetched new queue and played', startIdx, next);
    } catch (err) {
      console.error('[Player] playNext error', err);
    }
  }, [audio, queue, index, shuffle, repeat]);

  const playPrev = useCallback(() => {
    setIndex((i) => {
      if (queue.length === 0) return -1;
      const prevIndex = Math.max(0, i - 1);
      const t = queue[prevIndex];
      audio.loadTrack(t);
      audio.play();
      return prevIndex;
    });
  }, [audio, queue]);

  return (
    <PlayerContext.Provider value={{
      audio,
      queue,
      index,
      shuffle, setShuffle,
      repeat, setRepeat,
      playTrackById,
      enqueueAndPlay,
      playNext,
      playPrev,
      toggleShuffle 
    }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used inside PlayerProvider');
  return ctx;
}
