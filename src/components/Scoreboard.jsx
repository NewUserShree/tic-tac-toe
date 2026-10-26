export function Scoreboard({ scoreboard, onReset }) {
  return (
    <section className="panel scoreboard-panel" aria-labelledby="scoreboard-title">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Session totals</p>
          <h2 id="scoreboard-title">Scoreboard</h2>
        </div>
        <span className="trophy" aria-hidden="true">✦</span>
      </div>
      <div className="score-grid">
        <div className="score-item score-x">
          <span className="score-symbol">X</span>
          <span className="score-label">X Wins</span>
          <strong>{scoreboard.xWins}</strong>
        </div>
        <div className="score-item score-o">
          <span className="score-symbol">O</span>
          <span className="score-label">O Wins</span>
          <strong>{scoreboard.oWins}</strong>
        </div>
        <div className="score-item score-draw">
          <span className="score-symbol">＝</span>
          <span className="score-label">Draws</span>
          <strong>{scoreboard.draws}</strong>
        </div>
      </div>
      <button className="button button-primary" type="button" onClick={onReset}>
        Reset scoreboard
      </button>
    </section>
  );
}
