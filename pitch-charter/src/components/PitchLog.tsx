import type { Pitch } from '../types';
import { RESULT_LABELS, PITCH_TYPE_ABBR } from '../types';

interface Props {
  pitches: Pitch[];
  onUndo: () => void;
}

const resultBadgeColor: Record<string, string> = {
  Ball: 'bg-blue-800 text-blue-200',
  Strike: 'bg-red-800 text-red-200',
  Foul: 'bg-amber-800 text-amber-200',
  GroundBall: 'bg-green-800 text-green-200',
  FlyBall: 'bg-green-800 text-green-200',
  LineDrive: 'bg-green-800 text-green-200',
};

const contactBadgeColor: Record<string, string> = {
  Weak: 'bg-yellow-800 text-yellow-200',
  Normal: 'bg-orange-800 text-orange-200',
  Hard: 'bg-red-900 text-red-200',
};

const zoneName = (row: number, col: number): string => {
  const rowNames = ['High', 'Up', 'Mid', 'Low', 'Down'];
  const colNames = ['Away', 'Out', 'Mid', 'In', 'Inside'];
  return `${rowNames[row]}-${colNames[col]}`;
};

export function PitchLog({ pitches, onUndo }: Props) {
  const recent = [...pitches].reverse().slice(0, 15);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs text-gray-400 uppercase tracking-wide">Pitch Log</div>
        {pitches.length > 0 && (
          <button
            onClick={onUndo}
            className="text-xs text-red-400 hover:text-red-300 font-medium"
          >
            ↩ Undo Last
          </button>
        )}
      </div>

      {recent.length === 0 ? (
        <div className="text-center text-gray-600 py-6 text-sm">No pitches logged yet</div>
      ) : (
        <div className="flex flex-col gap-1">
          {recent.map((pitch) => (
            <div
              key={pitch.id}
              className="flex items-center gap-2 bg-gray-800 rounded-lg px-3 py-2 text-sm"
            >
              <span className="text-gray-500 font-mono w-6 text-right text-xs">
                #{pitch.pitchNumber}
              </span>
              <span className="text-gray-300 font-medium w-8 text-xs">
                {PITCH_TYPE_ABBR[pitch.type]}
              </span>
              <span className="text-gray-500 text-xs flex-1">
                {zoneName(pitch.location.row, pitch.location.col)}
              </span>
              <span
                className={`text-xs px-1.5 py-0.5 rounded font-medium ${resultBadgeColor[pitch.result] ?? 'bg-gray-700 text-gray-300'}`}
              >
                {RESULT_LABELS[pitch.result]}
              </span>
              {pitch.contactQuality && (
                <span
                  className={`text-xs px-1.5 py-0.5 rounded font-medium ${contactBadgeColor[pitch.contactQuality]}`}
                >
                  {pitch.contactQuality}
                </span>
              )}
              <span className="text-gray-600 text-xs w-8 text-right">
                {pitch.ballsBefore}-{pitch.strikesBefore}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
