export function MoveHistory({ history}) {
  return (
    <section className="panel history-panel" aria-labelledby="history-title">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">This game</p>
          <h2 id="history-title">Move history</h2>
        </div>
        <span className="count-pill">{history.length} {history.length === 1 ? 'move' : 'moves'}</span>
      </div>
      {history.length === 0 ? (
        <p className="empty-state">Your moves will appear here.</p>
      ) : (
        <table className="history-table"  >
          <thead>
            <tr>
              <th>Move</th>
              <th>Player</th>
              <th>Position</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {history.map((move) => (
              <tr key={`${move.moveNumber}-${move.player}-${move.row}-${move.column}`}>
                <td>{move.moveNumber}</td>
                <td className={`history-mark mark-${move.player.toLowerCase()}`}>{move.player}</td>
                <td className="history-position">
                  Row {move.row + 1}, Column {move.column + 1}
                </td>
                <td className="history-type">{move.moveType}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
  


}
