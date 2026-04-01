interface Props {
  balls: number;
  strikes: number;
  totalPitches: number;
  atBat: number;
  onNewAtBat: () => void;
}

export function PitchCount({ balls, strikes, totalPitches, atBat, onNewAtBat }: Props) {
  return (
    <div className="flex items-center justify-between bg-gray-800 rounded-xl px-4 py-3">
      {/* Count */}
      <div className="flex items-center gap-3">
        <div className="text-center">
          <div className="text-4xl font-black text-white leading-none">
            {balls}<span className="text-gray-400">-</span>{strikes}
          </div>
          <div className="text-xs text-gray-400 mt-0.5">B - S</div>
        </div>
        <div className="w-px h-10 bg-gray-600" />
        <div className="flex gap-3">
          <div className="text-center">
            <div className="text-xl font-bold text-white">{totalPitches}</div>
            <div className="text-xs text-gray-400">Pitches</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-white">{atBat}</div>
            <div className="text-xs text-gray-400">At-Bat</div>
          </div>
        </div>
      </div>

      {/* Dot indicators */}
      <div className="flex flex-col gap-1.5 items-end">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={[
                'w-4 h-4 rounded-full border-2',
                i < balls ? 'bg-blue-500 border-blue-400' : 'bg-transparent border-gray-500',
              ].join(' ')}
            />
          ))}
        </div>
        <div className="flex gap-1.5">
          {[0, 1].map((i) => (
            <div
              key={i}
              className={[
                'w-4 h-4 rounded-full border-2',
                i < strikes ? 'bg-red-500 border-red-400' : 'bg-transparent border-gray-500',
              ].join(' ')}
            />
          ))}
        </div>
        <button
          onClick={onNewAtBat}
          className="text-xs text-gray-400 hover:text-white underline mt-1"
        >
          New At-Bat
        </button>
      </div>
    </div>
  );
}
