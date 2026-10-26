export const SCOREBOARD_STORAGE_KEY = 'tic-tac-toe-scoreboard';

export const createEmptyScoreboard = () => ({ xWins: 0, oWins: 0, draws: 0 });

function isValidScoreboard(value) {
  return value !== null &&
    typeof value === 'object' &&
    ['xWins', 'oWins', 'draws'].every(
      (key) => Number.isSafeInteger(value[key]) && value[key] >= 0
    );
}

export function loadScoreboard() {
  try {
    const saved = window.localStorage.getItem(SCOREBOARD_STORAGE_KEY);
    if (saved === null) return { scoreboard: createEmptyScoreboard(), message: '' };

    const parsed = JSON.parse(saved);
    if (isValidScoreboard(parsed)) {
      return {
        scoreboard: { xWins: parsed.xWins, oWins: parsed.oWins, draws: parsed.draws },
        message: '',
      };
    }
    return {
      scoreboard: createEmptyScoreboard(),
      message: 'Saved scoreboard data was invalid, so the counts were reset.',
    };
  } catch {
    return {
      scoreboard: createEmptyScoreboard(),
      message: 'Saved scoreboard could not be read; starting with zero counts.',
    };
  }
}

export function saveScoreboard(scoreboard) {
  try {
    window.localStorage.setItem(SCOREBOARD_STORAGE_KEY, JSON.stringify(scoreboard));
    return '';
  } catch {
    return 'Scoreboard could not be saved in this browser.';
  }
}
