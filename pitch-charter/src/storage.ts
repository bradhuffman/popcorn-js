import type { Game, Pitch, Pitcher } from './types';

const KEYS = {
  pitchers: 'pc_pitchers',
  games: 'pc_games',
  pitches: 'pc_pitches',
  activeGame: 'pc_activeGame',
  activePitcher: 'pc_activePitcher',
};

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

export const storage = {
  getPitchers: (): Pitcher[] => load(KEYS.pitchers, []),
  savePitchers: (p: Pitcher[]) => save(KEYS.pitchers, p),

  getGames: (): Game[] => load(KEYS.games, []),
  saveGames: (g: Game[]) => save(KEYS.games, g),

  getPitches: (): Pitch[] => load(KEYS.pitches, []),
  savePitches: (p: Pitch[]) => save(KEYS.pitches, p),

  getActiveGameId: (): string | null => load(KEYS.activeGame, null),
  setActiveGameId: (id: string | null) => save(KEYS.activeGame, id),

  getActivePitcherId: (): string | null => load(KEYS.activePitcher, null),
  setActivePitcherId: (id: string | null) => save(KEYS.activePitcher, id),
};
