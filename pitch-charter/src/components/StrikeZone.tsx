import type { Pitch, PitchLocation, PitchResult, ContactQuality } from '../types';

interface Props {
  selected: PitchLocation | null;
  onSelect: (loc: PitchLocation) => void;
  pitches: Pitch[]; // pitches to overlay
  showAllPitches: boolean;
}

// Color for a dot on the zone
function dotColor(result: PitchResult, contact?: ContactQuality): string {
  if (result === 'Ball') return '#3b82f6'; // blue
  if (result === 'Strike') return '#ef4444'; // red
  if (result === 'Foul') return '#f59e0b'; // amber
  // contact
  if (contact === 'Hard') return '#dc2626'; // bright red
  if (contact === 'Normal') return '#f97316'; // orange
  return '#facc15'; // yellow = weak
}

function resultLabel(result: PitchResult): string {
  if (result === 'Ball') return 'B';
  if (result === 'Strike') return 'K';
  if (result === 'Foul') return 'F';
  if (result === 'GroundBall') return 'GB';
  if (result === 'FlyBall') return 'FB';
  return 'LD';
}

// Is this cell inside the strike zone (inner 3x3)?
function inZone(row: number, col: number): boolean {
  return row >= 1 && row <= 3 && col >= 1 && col <= 3;
}

export function StrikeZone({ selected, onSelect, pitches, showAllPitches }: Props) {
  const cells: JSX.Element[] = [];

  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      const isZone = inZone(row, col);
      const isSelected = selected?.row === row && selected?.col === col;

      // find pitches in this cell
      const cellPitches = pitches.filter(
        (p) => p.location.row === row && p.location.col === col
      );

      const key = `${row}-${col}`;

      cells.push(
        <button
          key={key}
          onClick={() => onSelect({ row, col })}
          className={[
            'relative flex items-center justify-center',
            'transition-colors duration-100',
            isZone
              ? 'bg-gray-600 border border-gray-400'
              : 'bg-gray-800 border border-gray-700',
            isSelected ? 'ring-2 ring-white ring-inset' : '',
          ].join(' ')}
          style={{ aspectRatio: '1 / 1' }}
          aria-label={`Zone ${row}-${col}`}
        >
          {/* Dots for logged pitches */}
          {cellPitches.length > 0 && (
            <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-0.5 p-0.5 pointer-events-none">
              {cellPitches.slice(-4).map((p) => (
                <span
                  key={p.id}
                  className="rounded-full flex items-center justify-center text-white font-bold"
                  style={{
                    backgroundColor: dotColor(p.result, p.contactQuality),
                    width: cellPitches.length === 1 ? '60%' : '40%',
                    height: cellPitches.length === 1 ? '60%' : '40%',
                    fontSize: cellPitches.length === 1 ? '0.55rem' : '0.4rem',
                    minWidth: 14,
                    minHeight: 14,
                  }}
                >
                  {resultLabel(p.result)}
                </span>
              ))}
              {cellPitches.length > 4 && (
                <span className="text-gray-300 font-bold" style={{ fontSize: '0.5rem' }}>
                  +{cellPitches.length - 4}
                </span>
              )}
            </div>
          )}

          {/* Selected indicator when empty */}
          {isSelected && cellPitches.length === 0 && (
            <span className="text-white text-lg font-bold pointer-events-none">✕</span>
          )}
        </button>
      );
    }
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="text-xs text-gray-400 mb-1">Tap to select pitch location</div>
      <div
        className="grid w-full max-w-xs"
        style={{ gridTemplateColumns: 'repeat(5, 1fr)', gap: 3 }}
      >
        {cells}
      </div>
      {/* Legend */}
      <div className="flex flex-wrap gap-2 mt-2 justify-center">
        {[
          { color: '#3b82f6', label: 'Ball' },
          { color: '#ef4444', label: 'Strike' },
          { color: '#f59e0b', label: 'Foul' },
          { color: '#facc15', label: 'Weak' },
          { color: '#f97316', label: 'Normal' },
          { color: '#dc2626', label: 'Hard' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-xs text-gray-400">{label}</span>
          </div>
        ))}
      </div>
      {!showAllPitches && (
        <div className="text-xs text-gray-500 mt-1">Showing current at-bat only</div>
      )}
    </div>
  );
}
