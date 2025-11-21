export async function handleIntent(intentObj, playerContext) {

  const { intent, slots, raw } = intentObj;
  const { audio, playTrackById, enqueueAndPlay, playNext, playPrev, setShuffle, setRepeat } = playerContext;

  try {
    switch (intent) {
      case 'Play':
        await audio.play();
        return { ok: true, msg: 'Resuming' };
      case 'Pause':
        audio.pause();
        return { ok: true, msg: 'Paused' };
      case 'PlaySong': {
        const name = (slots.songName || '').trim();
        if (!name) return { ok: false, msg: 'No song name provided' };

        // we import axios lazily to avoid circular deps in small apps
        const axios = (await import('../api/api')).default;
        const base = axios.defaults.baseURL;
        // /api/tracks/search?q=
        const res = await axios.get('/tracks/search', { params: { q: name } });
        const items = res.data.items || [];
        if (!items.length) return { ok: false, msg: `No match for "${name}"` };
        const top = items[0];
        await playTrackById(top);
        return { ok: true, msg: `Playing ${top.title}` };
      }
      case 'Next':
        playNext();
        return { ok: true, msg: 'Next track' };
      case 'Previous':
        playPrev();
        return { ok: true, msg: 'Previous track' };
      case 'Search': {
        const q = slots.q;
        const axios = (await import('../api/api')).default;
        const res = await axios.get('/tracks/search', { params: { q } });
        return { ok: true, results: res.data.items || [], msg: `Found ${res.data.items?.length || 0}` };
      }
      case 'Seek':
        if (slots.seconds != null) {
          audio.seekTo(slots.seconds);
          return { ok: true, msg: `Seeked to ${slots.seconds} seconds` };
        }
        return { ok: false, msg: 'No time provided' };
      case 'VolumeUp':
        audio.setVol(Math.min(1, audio.volume + 0.1));
        return { ok: true, msg: 'Volume up' };
      case 'VolumeDown':
        audio.setVol(Math.max(0, audio.volume - 0.1));
        return { ok: true, msg: 'Volume down' };
      case 'ToggleShuffle':
        if (playerContext.toggleShuffle) {
          playerContext.toggleShuffle();
          return { ok: true, msg: `Shuffle ${!playerContext.shuffle ? 'enabled' : 'disabled'}` };
        } else if (playerContext.setShuffle) {
          playerContext.setShuffle(s => !s);
          return { ok: true, msg: 'Toggled shuffle' };
        }
        return { ok: false, msg: 'Shuffle unsupported' };

      case 'ToggleRepeat':
        setRepeat((r) => !r);
        return { ok: true, msg: 'Toggled repeat' };
      default:
        return { ok: false, msg: 'Intent not handled' };
    }
  } catch (err) {
    console.error('handleIntent error', err);
    return { ok: false, msg: err.message || 'Error handling intent' };
  }
}
