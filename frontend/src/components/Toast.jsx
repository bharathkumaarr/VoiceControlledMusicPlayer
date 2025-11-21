import React from 'react';

export default function Toast({ title, subtitle, onClose }) {
  return (
    <div className="fixed top-6 right-6 bg-linear-to-tr from-black/60 to-white/5 backdrop-blur-md border border-white/5 px-4 py-3 rounded-xl shadow-lg max-w-sm">
      <div className="flex justify-between items-start gap-3">
        <div>
          <div className="font-semibold">{title}</div>
          {subtitle && <div className="text-sm text-slate-300 mt-1">{subtitle}</div>}
        </div>
        <button onClick={onClose} className="text-slate-400 text-sm">✕</button>
      </div>
    </div>
  );
}
