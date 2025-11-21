import React from 'react';
import TrackList from './components/TrackList';
import PlayerBar from './components/PlayerBar';
import MicControl from './components/MicControl';

export default function App() {
  return (
    <div className="min-h-screen bg-[#1b1b1b] text-[#bababa] select-none">
      <header className="p-6 text-4xl font-bold flex justify-center">Voice Controlled Music Player</header>

      <main className="pt-2 pb-40">
        <section className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between px-4">
            <h2 className="text-2xl font-semibold ml-2">My Music</h2>
            <div className="mr-4">
              {/* Dev-only mic demo placeholder */}
              <MicControl />
            </div>
          </div>

          <TrackList />
        </section>
      </main>

      <PlayerBar />
    </div>
  );
}
