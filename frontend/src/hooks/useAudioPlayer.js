import React, { useCallback, useEffect, useRef, useState } from 'react'

function useAudioPlayer() {
  const audioRef = useRef(new Audio())
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)



  useEffect(()=>{
    const audio=audioRef.current;
    const onTime = () => setCurrentTime(audio.currentTime);
    const onDuration = () => setDuration(audio.duration || 0);
    const onEnded = () => setIsPlaying(false)

    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('durationchange', onDuration)
    audio.addEventListener('ended', onEnded)

    return ()=>{
      audio.removeEventListener('timeupdate',onTime)
      audio.removeEventListener('durationchange', onDuration)
      audio.removeEventListener('ended', onEnded)
      audio.pause();
    }
  },[])

  const loadTrack = useCallback((track) => {
    
    const audio = audioRef.current;
    if (!track) return;
    if (currentTrack?.id === track.id) return;
    audio.src = track.streamUrl;
    audio.load();
    setCurrentTrack(track);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, [currentTrack]);

  const play = useCallback(async () => {
    const audio = audioRef.current;
    try {
      await audio.play();
      setIsPlaying(true);
    } catch (err) {
      console.warn('Playback error', err);
      setIsPlaying(false);
    }
  }, []);

  const pause = useCallback(() => {
    audioRef.current.pause();
    setIsPlaying(false);
  }, []);

  const seekTo = useCallback((timeSec) => {
    audioRef.current.currentTime = Math.max(0, Math.min(audioRef.current.duration || 0, timeSec));
    setCurrentTime(audioRef.current.currentTime);
  }, []);

  const setVol = useCallback((v) => {
    const vol = Math.max(0, Math.min(1, v));
    audioRef.current.volume = vol;
    setVolume(vol);
  }, []);

    
  return {
    audioRef,
    isPlaying,
    currentTrack,
    currentTime,
    duration,
    volume,
    loadTrack,
    play,
    pause,
    seekTo,
    setVol,

  }
}

export default useAudioPlayer



