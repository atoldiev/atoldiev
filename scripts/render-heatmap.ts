// Рисует календарь контрибуций из data/contributions.json. Клетки проявляются по диагонали один раз.
import { readFileSync } from 'node:fs';
import type { Contributions } from './fetch-contributions.ts';
import { PROMPT_HOST, PROMPT_USER } from './profile.config.ts';
import {
  LINE_H, PAD, THEMES, TITLE_H, WIDTH, esc, frame, prompt, save, typedLine, type ThemeName,
} from './svg.ts';

const CELL = 11;
const STEP = 14;
const LABEL_W = 32;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const input = process.argv[2] ?? 'data/contributions.json';
const data: Contributions = JSON.parse(readFileSync(input, 'utf8'));

const weekday = (iso: string) => new Date(`${iso}T00:00:00Z`).getUTCDay(); // 0 = Sun
const fmt = (iso: string) => {
  const d = new Date(`${iso}T00:00:00Z`);
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}`;
};
const plural = (n: number, w: string) => `${n.toLocaleString('en-US')} ${w}${n === 1 ? '' : 's'}`;

function build(theme: ThemeName): string {
  const t = THEMES[theme];
  const parts: string[] = [];
  const top = TITLE_H + PAD + 12;

  const cmd = './contributions.sh';
  parts.push(
    typedLine({
      id: 'h0', x: PAD, y: top,
      content: prompt(t, PROMPT_USER, PROMPT_HOST, cmd),
      chars: `${PROMPT_USER}@${PROMPT_HOST} ~ $ ${cmd}`.length,
      begin: 0.2, dur: 0.6, cursorColor: t.text,
    }),
  );

  const offset = weekday(data.days[0].date);
  const weeks = Math.ceil((data.days.length + offset) / 7);
  const gridW = weeks * STEP - (STEP - CELL);
  // сетку центрируем, подписи дней недели висят слева от неё
  const x0 = Math.max(PAD + LABEL_W, Math.round((WIDTH - gridW) / 2));
  const monthY = top + LINE_H + 22;
  const y0 = monthY + 10;

  // подпись месяца над колонкой, где впервые встречается его 1–7 число (как на GitHub)
  let lastLabelCol = -10;
  data.days.forEach((d, i) => {
    const col = Math.floor((i + offset) / 7);
    const date = new Date(`${d.date}T00:00:00Z`);
    const firstWeekOfMonth = date.getUTCDate() <= 7 && weekday(d.date) === 0;
    const firstColumn = i === 0 && date.getUTCDate() <= 21;
    if ((firstWeekOfMonth || firstColumn) && col - lastLabelCol >= 3) {
      parts.push(`<text x="${x0 + col * STEP}" y="${monthY}" fill="${t.muted}" style="font-size:11px">${MONTHS[date.getUTCMonth()]}</text>`);
      lastLabelCol = col;
    }
  });

  for (const [row, name] of [[1, 'Mon'], [3, 'Wed'], [5, 'Fri']] as const) {
    parts.push(
      `<text x="${x0 - 8}" y="${y0 + row * STEP + CELL - 2}" text-anchor="end" fill="${t.muted}" style="font-size:10px">${name}</text>`,
    );
  }

  const base = 1.0;
  const cells = data.days.map((d, i) => {
    const col = Math.floor((i + offset) / 7);
    const row = (i + offset) % 7;
    const lvl = Math.max(0, Math.min(4, d.level));
    const delay = (base + (col + row) * 0.018).toFixed(3);
    return `<rect class="c" x="${x0 + col * STEP}" y="${y0 + row * STEP}" width="${CELL}" height="${CELL}" rx="2.5" fill="${t.heat[lvl]}" style="animation-delay:${delay}s"/>`;
  });
  parts.push(`<g>${cells.join('')}</g>`);

  const gridBottom = y0 + 7 * STEP - (STEP - CELL);
  const done = base + (weeks + 7) * 0.018;

  // итог + легенда
  const fy = gridBottom + 24;
  parts.push(
    `<text x="${x0}" y="${fy}" fill="${t.text}" class="fade" style="font-size:12px;animation-delay:${done.toFixed(2)}s">${esc(plural(data.total, 'contribution'))} in the last year</text>`,
  );
  const legendRight = x0 + weeks * STEP - (STEP - CELL);
  const lx = legendRight - 5 * STEP - 34;
  parts.push(
    `<g class="fade" style="animation-delay:${done.toFixed(2)}s">
  <text x="${lx - 6}" y="${fy}" text-anchor="end" fill="${t.muted}" style="font-size:11px">Less</text>
  ${t.heat.map((c, i) => `<rect x="${lx + i * STEP}" y="${fy - CELL + 1}" width="${CELL}" height="${CELL}" rx="2.5" fill="${c}"/>`).join('')}
  <text x="${lx + 5 * STEP + 3}" y="${fy}" fill="${t.muted}" style="font-size:11px">More</text>
</g>`,
  );

  // серия и лучший день
  const sy = fy + 26;
  const facts = [
    ['current streak', plural(data.currentStreak, 'day')],
    ['longest streak', plural(data.longestStreak, 'day')],
    ...(data.bestDay ? [['best day', `${plural(data.bestDay.count, 'contribution')} on ${fmt(data.bestDay.date)}`]] : []),
  ];
  const statLine = facts
    .map(([k, v], i) => `${i ? `<tspan fill="${t.muted}">  ·  </tspan>` : ''}<tspan fill="${t.muted}">${k}: </tspan><tspan fill="${t.green}">${esc(v)}</tspan>`)
    .join('');
  parts.push(
    `<text x="${WIDTH / 2}" y="${sy}" text-anchor="middle" xml:space="preserve" class="fade" style="font-size:12px;animation-delay:${(done + 0.3).toFixed(2)}s">${statLine}</text>`,
  );

  const css = `.c { opacity: 0; transform-box: fill-box; transform-origin: center; animation: pop .35s ease-out forwards; }
  @keyframes pop { from { opacity: 0; transform: scale(.3); } to { opacity: 1; transform: none; } }
  @media (prefers-reduced-motion: reduce) { .c { animation: none; opacity: 1; } }`;
  return frame(t, sy + PAD, `${PROMPT_USER}@${PROMPT_HOST}: ~/contributions`, parts.join('\n'), css);
}

for (const theme of ['dark', 'light'] as const) {
  save(`assets/heatmap-${theme}.svg`, build(theme));
}
