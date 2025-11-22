import React from 'react';
import TrackList from './components/TrackList';
import PlayerBar from './components/PlayerBar';
import MicControl from './components/MicControl';

export default function App() {
  return (
    <div className="min-h-screen bg-[#1b1b1b] text-[#bababa] select-none ">
      <header className="p-6 text-4xl font-bold flex justify-center text-shadow-lg text-shadow-black cursor-pointer"><a href="https://voice-controlled-music-player.vercel.app/">Voice Controlled Music Player</a></header>

      <main className="pt-2 pb-40 flex flex-col">
        <section className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center pl-[30%]">
            {/* <h2 className="text-2xl font-semibold ml-2 text-shadow-lg text-shadow-black">My Music</h2> */}
            <div className="mr-4">
              {/* Dev-only mic demo placeholder */}
              <MicControl />
            </div>
          </div>
          <h6 className='text-xs text-red-400 mt-4'>running this on a free instance, <a className='underline' href="https://voicecontrolledmusicplayer.onrender.com/api/health" target='_blank'>click here</a> before you start using voice controlled music player</h6>

          <TrackList />
        </section>
      </main>

      <PlayerBar />
    </div>
  );
}
