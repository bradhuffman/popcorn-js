import { useState, useEffect, useCallback } from 'react';
import type { Game, Pitch, PitchLocation, PitchResult, PitchType, ContactQuality, Pitcher } from './types';
import { CONTACT_RESULTS } from './types';
import { storage } from './storage';
import { StrikeZone } from './components/StrikeZone';
import { PitchControls } from './components/PitchControls';
import { PitchCount } from './components/PitchCount';
import { PitchLog } from './components/PitchLog';
import { GameManager } from './components/GameManager';

type Tab = 'chart' | 'setup' | 'log';

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function App() {
  const [tab, setTab] = useState<Tab>('chart');

  const [pitchers, setPitchers] = useState<Pitcher[]>(() => storage.getPitchers());
  const [games, setGames] = useState<Game[]>(() => storage.getGames());
  const [pitches, setPitches] = useState<Pitch[]>(() => storage.getPitches());

  const [activeGameId, setActiveGameId] = useState<string | null>(() => storage.getActiveGameId());
  const [activePitcherId, setActivePitcherId] = useState<string | null>(() => storage.getActivePitcherId());

  // Current pitch state
  const [location, setLocation] = useState<PitchLocation | null>(null);
  const [pitchType, setPitchType] = useState<PitchType | null>(null);
  const [pitchResult, setPitchResult] = useState<PitchResult | null>(null);
  const [contactQuality, setContactQuality] = useState<ContactQuality | null>(null);

  // At-bat state
  const [balls, setBalls] = useState(0);
  const [strikes, setStrikes] = useState(0);
  const [atBatNumber, setAtBatNumber] = useState(1);

  // Zone view toggle
  const [showAllPitches, setShowAllPitches] = useState(true);

  // Persist on change
  useEffect(() => { storage.savePitchers(pitchers); }, [pitchers]);
  useEffect(() => { storage.saveGames(games); }, [games]);
  useEffect(() => { storage.savePitches(pitches); }, [pitches]);
  useEffect(() => { storage.setActiveGameId(activeGameId); }, [activeGameId]);
  useEffect(() => { storage.setActivePitcherId(activePitcherId); }, [activePitcherId]);

  const gamePitches = pitches.filter((p) => p.gameId === activeGameId);

  const displayedPitches = showAllPitches
    ? gamePitches
    : gamePitches.filter((p) => p.atBatNumber === atBatNumber);

  const canLog =
    location !== null &&
    pitchType !== null &&
    pitchResult !== null &&
    (!CONTACT_RESULTS.includes(pitchResult) || contactQuality !== null);

  const handleLogPitch = useCallback(() => {
    if (!canLog || !activeGameId || !activePitcherId || !location || !pitchType || !pitchResult) return;

    const pitch: Pitch = {
      id: uid(),
      gameId: activeGameId,
      pitcherId: activePitcherId,
      pitchNumber: gamePitches.length + 1,
      atBatNumber,
      timestamp: Date.now(),
      location,
      type: pitchType,
      result: pitchResult,
      contactQuality: CONTACT_RESULTS.includes(pitchResult) ? contactQuality ?? undefined : undefined,
      ballsBefore: balls,
      strikesBefore: strikes,
    };

    setPitches((prev) => [...prev, pitch]);

    // Advance count
    if (pitchResult === 'Ball') {
      const newBalls = balls + 1;
      if (newBalls >= 4) {
        // Walk - new at bat
        setBalls(0);
        setStrikes(0);
        setAtBatNumber((n) => n + 1);
      } else {
        setBalls(newBalls);
      }
    } else if (pitchResult === 'Strike') {
      const newStrikes = strikes + 1;
      if (newStrikes >= 3) {
        // Strikeout - new at bat
        setBalls(0);
        setStrikes(0);
        setAtBatNumber((n) => n + 1);
      } else {
        setStrikes(newStrikes);
      }
    } else if (pitchResult === 'Foul') {
      if (strikes < 2) setStrikes(strikes + 1);
      // Foul with 2 strikes stays at 2 strikes
    } else {
      // Batted ball - new at bat
      setBalls(0);
      setStrikes(0);
      setAtBatNumber((n) => n + 1);
    }

    // Reset pitch entry
    setLocation(null);
    setPitchType(null);
    setPitchResult(null);
    setContactQuality(null);
  }, [canLog, activeGameId, activePitcherId, location, pitchType, pitchResult, contactQuality, balls, strikes, atBatNumber, gamePitches.length]);

  const handleUndo = () => {
    if (gamePitches.length === 0) return;
    const last = gamePitches[gamePitches.length - 1];
    setPitches((prev) => prev.filter((p) => p.id !== last.id));
    // Restore count
    setBalls(last.ballsBefore);
    setStrikes(last.strikesBefore);
    if (last.atBatNumber !== atBatNumber) {
      setAtBatNumber(last.atBatNumber);
    }
  };

  const handleNewAtBat = () => {
    setBalls(0);
    setStrikes(0);
    setAtBatNumber((n) => n + 1);
  };

  const handleAddPitcher = (name: string) => {
    const p: Pitcher = { id: uid(), name };
    setPitchers((prev) => [...prev, p]);
    setActivePitcherId(p.id);
  };

  const handleAddGame = (data: Omit<Game, 'id'>) => {
    const g: Game = { id: uid(), ...data };
    setGames((prev) => [...prev, g]);
    setActiveGameId(g.id);
    setActivePitcherId(data.pitcherId);
    setBalls(0);
    setStrikes(0);
    setAtBatNumber(1);
    setTab('chart');
  };

  const handleSelectGame = (id: string) => {
    setActiveGameId(id);
    const g = games.find((g) => g.id === id);
    if (g) setActivePitcherId(g.pitcherId);
    setBalls(0);
    setStrikes(0);
    setAtBatNumber(1);
  };

  // Stats
  const totalPitches = gamePitches.length;
  const strikeCount = gamePitches.filter(
    (p) => p.result === 'Strike' || p.result === 'Foul' || CONTACT_RESULTS.includes(p.result)
  ).length;
  const strikePercent = totalPitches > 0 ? Math.round((strikeCount / totalPitches) * 100) : 0;

  const activeGame = games.find((g) => g.id === activeGameId);
  const activePitcher = pitchers.find((p) => p.id === activePitcherId);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col max-w-md mx-auto">
      {/* Header */}
      <div className="bg-gray-950 px-4 pt-3 pb-2 flex items-center justify-between sticky top-0 z-10">
        <div>
          <div className="font-bold text-lg leading-none">⚾ Pitch Charter</div>
          {activePitcher && activeGame ? (
            <div className="text-xs text-gray-400 mt-0.5">
              {activePitcher.name} · vs {activeGame.opponent} · {activeGame.date}
            </div>
          ) : (
            <div className="text-xs text-yellow-500 mt-0.5">Set up a game to begin →</div>
          )}
        </div>
        {totalPitches > 0 && (
          <div className="text-right">
            <div className="text-sm font-bold">{totalPitches} pitches</div>
            <div className="text-xs text-gray-400">{strikePercent}% strikes</div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800 bg-gray-950">
        {(['chart', 'setup', 'log'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={[
              'flex-1 py-2.5 text-sm font-medium capitalize transition-colors',
              tab === t
                ? 'text-white border-b-2 border-indigo-500'
                : 'text-gray-500 hover:text-gray-300',
            ].join(' ')}
          >
            {t === 'chart' ? 'Chart' : t === 'setup' ? 'Setup' : 'Log'}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto p-4 pb-8">
        {tab === 'chart' && (
          <div className="flex flex-col gap-4">
            {/* Pitch count */}
            <PitchCount
              balls={balls}
              strikes={strikes}
              totalPitches={totalPitches}
              atBat={atBatNumber}
              onNewAtBat={handleNewAtBat}
            />

            {/* Zone toggle */}
            <div className="flex justify-end">
              <button
                onClick={() => setShowAllPitches((v) => !v)}
                className="text-xs text-gray-400 hover:text-white border border-gray-700 rounded px-2 py-1"
              >
                {showAllPitches ? 'All pitches' : 'Current AB only'}
              </button>
            </div>

            {/* Strike zone */}
            <StrikeZone
              selected={location}
              onSelect={setLocation}
              pitches={displayedPitches}
              showAllPitches={showAllPitches}
            />

            {/* Controls */}
            <PitchControls
              pitchType={pitchType}
              pitchResult={pitchResult}
              contactQuality={contactQuality}
              onTypeChange={(t) => setPitchType(t)}
              onResultChange={(r) => {
                setPitchResult(r);
                if (!CONTACT_RESULTS.includes(r)) setContactQuality(null);
              }}
              onContactChange={setContactQuality}
            />

            {/* Log button */}
            <button
              onClick={handleLogPitch}
              disabled={!canLog || !activeGameId}
              className={[
                'w-full py-4 rounded-xl text-lg font-bold transition-colors',
                canLog && activeGameId
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  : 'bg-gray-800 text-gray-600 cursor-not-allowed',
              ].join(' ')}
            >
              {!activeGameId ? 'Select a game first' : !canLog ? 'Select location, type & result' : 'Log Pitch'}
            </button>
          </div>
        )}

        {tab === 'setup' && (
          <GameManager
            games={games}
            pitchers={pitchers}
            activeGameId={activeGameId}
            activePitcherId={activePitcherId}
            onSelectGame={handleSelectGame}
            onAddGame={handleAddGame}
            onAddPitcher={handleAddPitcher}
            onSelectPitcher={setActivePitcherId}
          />
        )}

        {tab === 'log' && (
          <div className="flex flex-col gap-4">
            {/* Per-game stats */}
            {totalPitches > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Total', value: totalPitches },
                  { label: 'Strikes%', value: `${strikePercent}%` },
                  {
                    label: 'Balls%',
                    value: `${totalPitches > 0 ? Math.round((gamePitches.filter((p) => p.result === 'Ball').length / totalPitches) * 100) : 0}%`,
                  },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-gray-800 rounded-lg px-3 py-3 text-center">
                    <div className="text-xl font-bold">{value}</div>
                    <div className="text-xs text-gray-400">{label}</div>
                  </div>
                ))}
              </div>
            )}
            <PitchLog pitches={gamePitches} onUndo={handleUndo} />
          </div>
        )}
      </div>
    </div>
  );
}
