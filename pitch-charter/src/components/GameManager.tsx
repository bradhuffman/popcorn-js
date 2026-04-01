import { useState } from 'react';
import type { Game, Pitcher } from '../types';

interface Props {
  games: Game[];
  pitchers: Pitcher[];
  activeGameId: string | null;
  activePitcherId: string | null;
  onSelectGame: (id: string) => void;
  onAddGame: (game: Omit<Game, 'id'>) => void;
  onAddPitcher: (name: string) => void;
  onSelectPitcher: (id: string) => void;
}

export function GameManager({
  games,
  pitchers,
  activeGameId,
  activePitcherId,
  onSelectGame,
  onAddGame,
  onAddPitcher,
  onSelectPitcher,
}: Props) {
  const [showNewGame, setShowNewGame] = useState(false);
  const [showNewPitcher, setShowNewPitcher] = useState(false);
  const [newOpponent, setNewOpponent] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newPitcherName, setNewPitcherName] = useState('');
  const [newGamePitcherId, setNewGamePitcherId] = useState('');

  const activeGame = games.find((g) => g.id === activeGameId);
  const activePitcher = pitchers.find((p) => p.id === activePitcherId);

  function handleAddGame() {
    if (!newOpponent.trim() || !newGamePitcherId) return;
    onAddGame({ date: newDate, opponent: newOpponent.trim(), pitcherId: newGamePitcherId });
    setNewOpponent('');
    setShowNewGame(false);
  }

  function handleAddPitcher() {
    if (!newPitcherName.trim()) return;
    onAddPitcher(newPitcherName.trim());
    setNewPitcherName('');
    setShowNewPitcher(false);
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Active info */}
      <div className="flex gap-2">
        <div className="flex-1 bg-gray-800 rounded-lg px-3 py-2">
          <div className="text-xs text-gray-500">Pitcher</div>
          <div className="text-sm font-semibold text-white">
            {activePitcher?.name ?? <span className="text-gray-500">None selected</span>}
          </div>
        </div>
        <div className="flex-1 bg-gray-800 rounded-lg px-3 py-2">
          <div className="text-xs text-gray-500">Game</div>
          <div className="text-sm font-semibold text-white">
            {activeGame ? (
              `vs ${activeGame.opponent}`
            ) : (
              <span className="text-gray-500">None selected</span>
            )}
          </div>
        </div>
      </div>

      {/* Pitcher selector */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-gray-400 uppercase tracking-wide">Pitcher</span>
          <button
            onClick={() => setShowNewPitcher(!showNewPitcher)}
            className="text-xs text-indigo-400 hover:text-indigo-300"
          >
            + Add
          </button>
        </div>
        {showNewPitcher && (
          <div className="flex gap-2 mb-2">
            <input
              className="flex-1 bg-gray-700 text-white text-sm rounded px-2 py-1.5 outline-none border border-gray-600 focus:border-indigo-500"
              placeholder="Pitcher name"
              value={newPitcherName}
              onChange={(e) => setNewPitcherName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddPitcher()}
            />
            <button
              onClick={handleAddPitcher}
              className="bg-indigo-600 text-white text-sm px-3 rounded hover:bg-indigo-700"
            >
              Save
            </button>
          </div>
        )}
        <div className="flex flex-wrap gap-1.5">
          {pitchers.map((p) => (
            <button
              key={p.id}
              onClick={() => onSelectPitcher(p.id)}
              className={[
                'px-3 py-1.5 rounded-full text-sm border transition-colors',
                p.id === activePitcherId
                  ? 'bg-indigo-700 border-indigo-500 text-white'
                  : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700',
              ].join(' ')}
            >
              {p.name}
            </button>
          ))}
          {pitchers.length === 0 && (
            <span className="text-xs text-gray-600">No pitchers added yet</span>
          )}
        </div>
      </div>

      {/* Game selector */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-gray-400 uppercase tracking-wide">Game</span>
          <button
            onClick={() => setShowNewGame(!showNewGame)}
            className="text-xs text-indigo-400 hover:text-indigo-300"
          >
            + Add
          </button>
        </div>
        {showNewGame && (
          <div className="flex flex-col gap-2 mb-2 bg-gray-800 rounded-lg p-3">
            <input
              type="date"
              className="bg-gray-700 text-white text-sm rounded px-2 py-1.5 outline-none border border-gray-600 focus:border-indigo-500"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
            />
            <input
              className="bg-gray-700 text-white text-sm rounded px-2 py-1.5 outline-none border border-gray-600 focus:border-indigo-500"
              placeholder="Opponent"
              value={newOpponent}
              onChange={(e) => setNewOpponent(e.target.value)}
            />
            <select
              className="bg-gray-700 text-white text-sm rounded px-2 py-1.5 outline-none border border-gray-600 focus:border-indigo-500"
              value={newGamePitcherId}
              onChange={(e) => setNewGamePitcherId(e.target.value)}
            >
              <option value="">Select pitcher...</option>
              {pitchers.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <button
              onClick={handleAddGame}
              className="bg-indigo-600 text-white text-sm py-1.5 rounded hover:bg-indigo-700"
            >
              Create Game
            </button>
          </div>
        )}
        <div className="flex flex-col gap-1.5">
          {[...games].reverse().slice(0, 5).map((g) => {
            const pitcher = pitchers.find((p) => p.id === g.pitcherId);
            return (
              <button
                key={g.id}
                onClick={() => onSelectGame(g.id)}
                className={[
                  'flex items-center justify-between px-3 py-2 rounded-lg border text-sm transition-colors text-left',
                  g.id === activeGameId
                    ? 'bg-indigo-900 border-indigo-600 text-white'
                    : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700',
                ].join(' ')}
              >
                <div>
                  <span className="font-medium">vs {g.opponent}</span>
                  {pitcher && (
                    <span className="text-gray-400 ml-2 text-xs">{pitcher.name}</span>
                  )}
                </div>
                <span className="text-gray-500 text-xs">{g.date}</span>
              </button>
            );
          })}
          {games.length === 0 && (
            <span className="text-xs text-gray-600">No games added yet</span>
          )}
        </div>
      </div>
    </div>
  );
}
