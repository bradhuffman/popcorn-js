export interface Pitcher {
  id: string;
  name: string;
}

export interface Game {
  id: string;
  date: string;
  opponent: string;
  pitcherId: string;
}

export type PitchType =
  | 'Fastball'
  | 'Sinker'
  | 'Cutter'
  | 'Slider'
  | 'Curveball'
  | 'Changeup'
  | 'Splitter';

export type PitchResult =
  | 'Ball'
  | 'Strike'
  | 'Foul'
  | 'GroundBall'
  | 'FlyBall'
  | 'LineDrive';

export type ContactQuality = 'Weak' | 'Normal' | 'Hard';

export interface PitchLocation {
  row: number; // 0-4 (5 rows: top chase, top, middle, bottom, bottom chase)
  col: number; // 0-4 (5 cols: left chase, left, middle, right, right chase)
}

export interface Pitch {
  id: string;
  gameId: string;
  pitcherId: string;
  pitchNumber: number;
  atBatNumber: number;
  timestamp: number;
  location: PitchLocation;
  type: PitchType;
  result: PitchResult;
  contactQuality?: ContactQuality;
  ballsBefore: number;
  strikesBefore: number;
}

export const CONTACT_RESULTS: PitchResult[] = ['GroundBall', 'FlyBall', 'LineDrive'];

export const RESULT_LABELS: Record<PitchResult, string> = {
  Ball: 'Ball',
  Strike: 'Strike',
  Foul: 'Foul',
  GroundBall: 'Ground Ball',
  FlyBall: 'Fly Ball',
  LineDrive: 'Line Drive',
};

export const PITCH_TYPE_ABBR: Record<PitchType, string> = {
  Fastball: 'FB',
  Sinker: 'SI',
  Cutter: 'CT',
  Slider: 'SL',
  Curveball: 'CB',
  Changeup: 'CH',
  Splitter: 'SP',
};
