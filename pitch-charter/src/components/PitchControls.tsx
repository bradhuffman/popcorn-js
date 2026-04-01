import type { PitchType, PitchResult, ContactQuality } from '../types';
import { CONTACT_RESULTS, RESULT_LABELS } from '../types';

interface Props {
  pitchType: PitchType | null;
  pitchResult: PitchResult | null;
  contactQuality: ContactQuality | null;
  onTypeChange: (t: PitchType) => void;
  onResultChange: (r: PitchResult) => void;
  onContactChange: (c: ContactQuality) => void;
}

const PITCH_TYPES: PitchType[] = [
  'Fastball', 'Sinker', 'Cutter', 'Slider', 'Curveball', 'Changeup', 'Splitter',
];

const PITCH_RESULTS: PitchResult[] = [
  'Ball', 'Strike', 'Foul', 'GroundBall', 'FlyBall', 'LineDrive',
];

const CONTACT_QUALITIES: ContactQuality[] = ['Weak', 'Normal', 'Hard'];

const resultColors: Record<PitchResult, string> = {
  Ball: 'bg-blue-700 border-blue-500 text-white',
  Strike: 'bg-red-700 border-red-500 text-white',
  Foul: 'bg-amber-700 border-amber-500 text-white',
  GroundBall: 'bg-green-700 border-green-500 text-white',
  FlyBall: 'bg-green-700 border-green-500 text-white',
  LineDrive: 'bg-green-700 border-green-500 text-white',
};

const contactColors: Record<ContactQuality, string> = {
  Weak: 'bg-yellow-700 border-yellow-500 text-white',
  Normal: 'bg-orange-700 border-orange-500 text-white',
  Hard: 'bg-red-800 border-red-600 text-white',
};

function ToggleBtn({
  active,
  activeClass,
  onClick,
  children,
}: {
  active: boolean;
  activeClass: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        'px-3 py-2 rounded border text-sm font-medium transition-colors',
        active ? activeClass : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700',
      ].join(' ')}
    >
      {children}
    </button>
  );
}

export function PitchControls({
  pitchType,
  pitchResult,
  contactQuality,
  onTypeChange,
  onResultChange,
  onContactChange,
}: Props) {
  const needsContact = pitchResult !== null && CONTACT_RESULTS.includes(pitchResult);

  return (
    <div className="flex flex-col gap-4">
      {/* Pitch Type */}
      <div>
        <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">Pitch Type</div>
        <div className="flex flex-wrap gap-2">
          {PITCH_TYPES.map((t) => (
            <ToggleBtn
              key={t}
              active={pitchType === t}
              activeClass="bg-indigo-700 border-indigo-500 text-white"
              onClick={() => onTypeChange(t)}
            >
              {t}
            </ToggleBtn>
          ))}
        </div>
      </div>

      {/* Pitch Result */}
      <div>
        <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">Result</div>
        <div className="flex flex-wrap gap-2">
          {PITCH_RESULTS.map((r) => (
            <ToggleBtn
              key={r}
              active={pitchResult === r}
              activeClass={resultColors[r]}
              onClick={() => onResultChange(r)}
            >
              {RESULT_LABELS[r]}
            </ToggleBtn>
          ))}
        </div>
      </div>

      {/* Contact Quality */}
      {needsContact && (
        <div>
          <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">Contact Quality</div>
          <div className="flex gap-2">
            {CONTACT_QUALITIES.map((c) => (
              <ToggleBtn
                key={c}
                active={contactQuality === c}
                activeClass={contactColors[c]}
                onClick={() => onContactChange(c)}
              >
                {c}
              </ToggleBtn>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
