// Карточка в стиле neofetch: слева башня (строится снизу вверх), справа key: value.
import { CARD_ROWS, PROMPT_HOST, PROMPT_USER, TOWER } from './profile.config.ts';
import {
  CHAR_W, LINE_H, PAD, THEMES, TITLE_H, WIDTH, esc, frame, prompt, save, typedLine, type ThemeName,
} from './svg.ts';

const TOWER_LINE_H = 17;

function build(theme: ThemeName): string {
  const t = THEMES[theme];
  const parts: string[] = [];
  const top = TITLE_H + PAD + 12;

  // команда сверху
  const cmd = 'neofetch';
  parts.push(
    typedLine({
      id: 'c0', x: PAD, y: top,
      content: prompt(t, PROMPT_USER, PROMPT_HOST, cmd),
      chars: `${PROMPT_USER}@${PROMPT_HOST} ~ $ ${cmd}`.length,
      begin: 0.2, dur: 0.5, cursorColor: t.text,
    }),
  );

  const bodyTop = top + LINE_H + 16;
  const start = 0.9;

  // башня: последняя строка появляется первой
  const towerX = PAD + 14;
  TOWER.forEach((line, i) => {
    const order = TOWER.length - 1 - i;
    const y = bodyTop + i * TOWER_LINE_H;
    parts.push(
      `<text x="${towerX}" y="${y}" xml:space="preserve" fill="${t.green}" class="fade b" style="animation-delay:${(start + order * 0.06).toFixed(2)}s">${esc(line)}</text>`,
    );
  });
  const towerH = TOWER.length * TOWER_LINE_H;

  // правая колонка
  const colX = towerX + TOWER[0].length * CHAR_W + 44;
  const keyW = Math.max(...CARD_ROWS.map(([k]) => k.length)) + 2;
  let y = bodyTop;
  let d = start + 0.2;
  const step = 0.07;

  const title = `${PROMPT_USER}@${PROMPT_HOST}`;
  parts.push(
    `<text x="${colX}" y="${y}" class="fade" style="animation-delay:${d.toFixed(2)}s"><tspan fill="${t.green}" class="b">${PROMPT_USER}</tspan><tspan fill="${t.text}">@</tspan><tspan fill="${t.green}" class="b">${PROMPT_HOST}</tspan></text>`,
  );
  y += LINE_H; d += step;
  parts.push(
    `<text x="${colX}" y="${y}" fill="${t.muted}" class="fade" style="animation-delay:${d.toFixed(2)}s">${'-'.repeat(title.length)}</text>`,
  );
  y += LINE_H; d += step;

  for (const [k, v] of CARD_ROWS) {
    const key = k ? `${k}:`.padEnd(keyW) : ''.padEnd(keyW);
    parts.push(
      `<text x="${colX}" y="${y}" xml:space="preserve" class="fade" style="animation-delay:${d.toFixed(2)}s"><tspan fill="${t.blue}" class="b">${esc(key)}</tspan><tspan fill="${t.text}">${esc(v)}</tspan></text>`,
    );
    y += LINE_H; d += step;
  }

  // полоска цветов, как в настоящем neofetch
  y += 8;
  const colors = [t.pink, t.amber, t.green, t.blue, t.muted, t.text];
  parts.push(
    `<g class="fade" style="animation-delay:${d.toFixed(2)}s">${colors
      .map((c, i) => `<rect x="${colX + i * 30}" y="${y - 12}" width="26" height="14" rx="2" fill="${c}"/>`)
      .join('')}</g>`,
  );

  const bottom = Math.max(y + 6, bodyTop + towerH - TOWER_LINE_H + 4);
  return frame(t, bottom + PAD, `${PROMPT_USER}@${PROMPT_HOST}: ~/about`, parts.join('\n'));
}

for (const theme of ['dark', 'light'] as const) {
  save(`assets/card-${theme}.svg`, build(theme));
}
