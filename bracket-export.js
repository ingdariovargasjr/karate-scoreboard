const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, character => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}[character]));

const sameCompetitor = (left, right) => !!left?.id && !!right?.id && left.id === right.id;

export function getBracketPlacements(bracket) {
  const rounds = bracket?.rounds;
  if (!Array.isArray(rounds) || rounds.length < 2) return null;

  const finalMatch = rounds.at(-1)?.[0];
  const champion = finalMatch?.winner;
  if (!champion) return null;
  if (!sameCompetitor(champion, finalMatch.p1) && !sameCompetitor(champion, finalMatch.p2)) return null;

  const runnerUp = sameCompetitor(champion, finalMatch.p1) ? finalMatch.p2 : finalMatch.p1;
  if (!runnerUp) return null;

  const semifinalMatches = rounds.at(-2) || [];
  const semifinalLoser = finalist => {
    const semifinal = semifinalMatches.find(match =>
      sameCompetitor(match.p1, finalist) || sameCompetitor(match.p2, finalist));
    if (!semifinal?.winner || !sameCompetitor(semifinal.winner, finalist)) return null;
    return sameCompetitor(semifinal.p1, finalist) ? semifinal.p2 : semifinal.p1;
  };

  return {
    first: champion,
    second: runnerUp,
    thirdWithChampion: semifinalLoser(champion),
    thirdWithRunnerUp: semifinalLoser(runnerUp),
  };
}

const roundLabel = (index, total) => {
  const remainingRounds = total - index - 1;
  if (remainingRounds === 0) return 'FINAL';
  if (remainingRounds === 1) return 'SEMIFINAL';
  if (remainingRounds === 2) return 'CUARTOS DE FINAL';
  return `RONDA ${index + 1}`;
};

const renderCompetitor = (competitor, score, winner, side, firstRound) => {
  const name = competitor?.name || (firstRound ? 'BYE' : 'POR DEFINIR');
  const details = [competitor?.dojo, competitor?.municipio].filter(Boolean).join(' · ');
  const visibleScore = score !== undefined && score !== null && Number.isFinite(Number(score))
    ? `<span class="score">${escapeHtml(Number(score).toFixed(competitor?.modality === 'KATA' ? 2 : 0))}</span>`
    : '';

  return `<div class="competitor ${side}${winner ? ' winner' : ''}">
    <div class="competitor-copy"><strong>${escapeHtml(name)}</strong>${details ? `<small>${escapeHtml(details)}</small>` : ''}</div>
    ${visibleScore}
  </div>`;
};

const renderRound = (round, index, totalRounds, modality) => {
  const matches = round.map((match, matchIndex) => {
    const finalWinner = match.winner;
    const hasScores = modality === 'KUMITE';
    return `<article class="match-card">
      <span class="match-number">${escapeHtml(match.id || `#${matchIndex + 1}`)}</span>
      ${renderCompetitor(match.p1, hasScores ? match.score1 : null, sameCompetitor(finalWinner, match.p1), 'aka', index === 0)}
      ${renderCompetitor(match.p2, hasScores ? match.score2 : null, sameCompetitor(finalWinner, match.p2), 'ao', index === 0)}
    </article>`;
  }).join('');

  return `<section class="round-column">
    <h2>${escapeHtml(roundLabel(index, totalRounds))}</h2>
    <div class="match-list">${matches}</div>
  </section>`;
};

const renderPlacement = (label, competitor, className) => `<article class="placement ${className}">
  <span>${escapeHtml(label)}</span>
  <strong>${escapeHtml(competitor?.name || 'SIN DEFINIR')}</strong>
  <small>${escapeHtml(competitor ? [competitor.dojo, competitor.municipio].filter(Boolean).join(' · ') : '')}</small>
</article>`;

export function renderBracketPdfHtml({ eventName, eventLocation, bracket }) {
  const rounds = Array.isArray(bracket?.rounds) ? bracket.rounds : [];
  const placements = getBracketPlacements(bracket);
  const tournamentName = eventName || 'TORNEO LOCAL';
  const category = bracket?.catName || 'Gráfica de competencia';
  const modality = bracket?.modality || '';
  const roundMarkup = rounds.map((round, index) => renderRound(round, index, rounds.length, modality)).join('');
  const placementsMarkup = placements
    ? `<section class="placements" aria-label="Resultados finales">
        <h2>RESULTADOS FINALES</h2>
        <div class="placement-grid">
          ${renderPlacement('1.er lugar', placements.first, 'first')}
          ${renderPlacement('2.º lugar', placements.second, 'second')}
          ${renderPlacement('3.er lugar · semifinal del campeón', placements.thirdWithChampion, 'third')}
          ${renderPlacement('3.er lugar · semifinal del subcampeón', placements.thirdWithRunnerUp, 'third')}
        </div>
      </section>`
    : '';

  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(tournamentName)} · ${escapeHtml(category)}</title>
  <style>
    @page { size: 13.333in 7.5in; margin: 0; }
    * { box-sizing: border-box; }
    html, body { width: 13.333in; height: 7.5in; margin: 0; }
    body { color: #172033; font-family: Arial, Helvetica, sans-serif; background: #fff; }
    .page { width: 100%; height: 100%; padding: .23in .28in .2in; display: grid; grid-template-rows: auto minmax(0, 1fr) auto; gap: .11in; overflow: hidden; }
    .heading { display: flex; justify-content: space-between; align-items: center; min-width: 0; border-bottom: 2px solid #172033; padding-bottom: .08in; }
    .heading-main { min-width: 0; }
    .event { color: #475569; font-size: 9pt; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; }
    h1 { margin: 2pt 0 0; overflow: hidden; color: #111827; font-size: 21pt; line-height: 1.05; text-overflow: ellipsis; white-space: nowrap; }
    .meta { margin-top: 3pt; color: #64748b; font-size: 8pt; font-weight: 700; text-transform: uppercase; }
    .brand { display: grid; width: .48in; height: .48in; flex: 0 0 .48in; place-items: center; border: 2px solid #b91c1c; border-radius: 50%; color: #b91c1c; font-size: 11pt; font-weight: 900; }
    .bracket { display: grid; grid-template-columns: repeat(${Math.max(1, rounds.length)}, minmax(0, 1fr)); gap: .1in; min-height: 0; }
    .round-column { display: flex; min-width: 0; min-height: 0; flex-direction: column; }
    .round-column h2, .placements h2 { margin: 0 0 4pt; color: #475569; font-size: 7.5pt; font-weight: 900; letter-spacing: .1em; text-align: center; text-transform: uppercase; }
    .match-list { display: flex; min-height: 0; flex: 1; flex-direction: column; justify-content: space-around; gap: 2pt; }
    .match-card { position: relative; min-width: 0; overflow: hidden; border: 1px solid #cbd5e1; border-radius: 4pt; background: #fff; break-inside: avoid; }
    .match-number { position: absolute; top: 1pt; right: 3pt; z-index: 1; color: #94a3b8; font-size: 5.2pt; font-weight: 700; }
    .competitor { display: flex; min-height: 13pt; align-items: center; justify-content: space-between; gap: 3pt; padding: 2pt 4pt; border-left: 3pt solid transparent; }
    .competitor + .competitor { border-top: 1px solid #e2e8f0; }
    .competitor.aka { border-left-color: #dc2626; }
    .competitor.ao { border-left-color: #2563eb; }
    .competitor.winner { background: #ecfdf5; }
    .competitor-copy { display: flex; min-width: 0; flex-direction: column; }
    .competitor strong { overflow: hidden; color: #1e293b; font-size: 6.8pt; line-height: 1.1; text-overflow: ellipsis; white-space: nowrap; }
    .competitor small { overflow: hidden; color: #64748b; font-size: 5pt; line-height: 1.1; text-overflow: ellipsis; white-space: nowrap; }
    .score { flex: 0 0 auto; color: #334155; font-size: 7pt; font-weight: 900; }
    .placements { border-top: 1.5px solid #cbd5e1; padding-top: 5pt; }
    .placement-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 5pt; }
    .placement { display: flex; min-width: 0; min-height: 29pt; flex-direction: column; justify-content: center; border: 1px solid #cbd5e1; border-top: 3px solid #94a3b8; border-radius: 4pt; padding: 3pt 6pt; }
    .placement.first { border-top-color: #eab308; background: #fefce8; }
    .placement.second { border-top-color: #94a3b8; background: #f8fafc; }
    .placement.third { border-top-color: #c2410c; background: #fff7ed; }
    .placement span { color: #64748b; font-size: 5.5pt; font-weight: 900; text-transform: uppercase; }
    .placement strong { overflow: hidden; color: #172033; font-size: 8pt; text-overflow: ellipsis; white-space: nowrap; }
    .placement small { overflow: hidden; color: #64748b; font-size: 5pt; text-overflow: ellipsis; white-space: nowrap; }
    @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
  </style>
</head>
<body>
  <main class="page">
    <header class="heading">
      <div class="heading-main">
        <div class="event">${escapeHtml(tournamentName)}</div>
        <h1>${escapeHtml(category)}</h1>
        <div class="meta">${escapeHtml(modality)}${eventLocation ? ` · ${escapeHtml(eventLocation)}` : ''} · GRÁFICA DE COMPETENCIA</div>
      </div>
      <div class="brand" aria-label="Asociación de Karate y Artes Marciales de Tamaulipas">AKT</div>
    </header>
    <section class="bracket" aria-label="Enfrentamientos por ronda">${roundMarkup}</section>
    ${placementsMarkup}
  </main>
</body>
</html>`;
}
