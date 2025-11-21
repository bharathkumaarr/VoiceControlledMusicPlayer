const NUM_WORDS = {
  'zero':0,'one':1,'two':2,'three':3,'four':4,'five':5,'six':6,'seven':7,'eight':8,'nine':9,'ten':10
};

function parseTimeExpression(text) {
  // supports "1 minute 30", "one minute thirty seconds", "90 seconds", "seek to 1:30", "jump to 2 minutes"

  const mmss = text.match(/(\d+):(\d{1,2})/);
  if (mmss) return Number(mmss[1]) * 60 + Number(mmss[2]);

  const secMatch = text.match(/(\d+)(?:\s?seconds?)/i);
  if (secMatch) return Number(secMatch[1]);

  const minMatch = text.match(/(\d+)(?:\s?minutes?)/i);
  if (minMatch) return Number(minMatch[1]) * 60;


  const words = text.toLowerCase().split(/\s+/);
  let minutes = null, seconds = null;
  words.forEach((w,i) => {
    if (w.includes('minute')) {
      const prev = words[i-1];
      minutes = prev && (NUM_WORDS[prev] ?? Number(prev));
    }
    if (w.includes('second')) {
      const prev = words[i-1];
      seconds = prev && (NUM_WORDS[prev] ?? Number(prev));
    }
  });
  if (minutes != null || seconds != null) return (minutes||0)*60 + (seconds||0);
  return null;
}

export default function intentMapper(rawText) {
  const raw = (rawText || '').trim();
  const text = raw.toLowerCase();

  if (!text) return { intent: 'Noop', slots: {}, raw };

  if (/^(pause|stop)$/i.test(text) || text.includes('pause') || text.includes('stop')) {
    return { intent: 'Pause', slots: {}, raw };
  }
  if (text.includes('play') && !text.includes('playlist') && !text.includes('pause')) {
    // "play", "play song", "play starboy"
    // capture "play <song name>" or "play the song <song name>"
    const m = text.match(/play (?:the song |song |track )?(.*)/i);
    if (m && m[1] && m[1].trim()) {
      const songName = m[1].trim();
      return { intent: 'PlaySong', slots: { songName }, raw };
    }
    //"play"
    return { intent: 'Play', slots: {}, raw };
  }

  if (text.match(/\b(next|skip)\b/)) return { intent: 'Next', slots: {}, raw };
  if (text.match(/\b(previous|prev|back)\b/)) return { intent: 'Previous', slots: {}, raw };

  if (text.match(/\b(shuffle)\b/)) return { intent: 'ToggleShuffle', slots: {}, raw };
  if (text.match(/\b(repeat|loop)\b/)) return { intent: 'ToggleRepeat', slots: {}, raw };

  if (text.match(/\b(volume up|turn up|increase volume|loud)\b/)) return { intent: 'VolumeUp', slots: {}, raw };
  if (text.match(/\b(volume down|turn down|decrease volume|quiet)\b/)) return { intent: 'VolumeDown', slots: {}, raw };

  if (text.match(/\b(seek|jump|go to|skip to|move to)\b/)) {
    const seconds = parseTimeExpression(text);
    if (seconds !== null) return { intent: 'Seek', slots: { seconds }, raw };

    const fwd = text.match(/\b(forward|ahead)\s+(\d+)\b/);
    if (fwd) return { intent: 'SeekRelative', slots: { seconds: Number(fwd[2]) }, raw };
    return { intent: 'SeekAsk', slots: {}, raw };
  }

  // "search for <song>"
  const searchM = text.match(/search (?:for )?(.*)/i);
  if (searchM && searchM[1]) return { intent: 'Search', slots: { q: searchM[1].trim() }, raw };

  // if user says "play <song>" handled earlier, otherwise attempt play by name
  // user says a song name alone -> try PlaySong
  if (text.split(' ').length <= 6 && text.length > 2) {
    return { intent: 'PlaySong', slots: { songName: raw }, raw };
  }

  return { intent: 'Unknown', slots: {}, raw };
}
