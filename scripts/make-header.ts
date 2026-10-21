// Шапка: `$ whoami` → имя крупными блочными буквами → слоган. Печатается один раз и замирает.
import { NAME_ART, PROMPT_HOST, PROMPT_USER, TAGLINE } from './profile.config.ts';
import {
  CHAR_W, LINE_H, PAD, THEMES, TITLE_H, WIDTH, esc, frame, prompt, save, typedLine,
  type Theme, type ThemeName,
} from './svg.ts';

// Размер одной «клетки» блочных букв
const CW = 7.6;
const CH = 14;

/** Превращает строки ANSI Shadow в векторы: █ → заливка, ╔═╗║╚╝ → тонкая тень. */
function vectorArt(t: Theme, x0: number, y0: number) {
  const rows: Array<{ blocks: string; shadow: string }> = [];
  NAME_ART.forEach((line, r) => {
    const chars = [...line];
    const y = y0 + r * CH;
    const cy = y + CH / 2;
    let blocks = '';
    const shadow: string[] = [];

    for (let c = 0; c < chars.length; c++) {
      const ch = chars[c];
      const x = x0 + c * CW;
      const cx = x + CW / 2;
      if (ch === '█') {
        let run = 1;
        while (chars[c + run] === '█') run++;
        blocks += `<rect x="${x}" y="${y}" width="${run * CW}" height="${CH}"/>`;
        c += run - 1;
        continue;
      }
      const seg: Record<string, string> = {
        '═': `M${x} ${cy}H${x + CW}`,
        '║': `M${cx} ${y}V${y + CH}`,
        '╗': `M${x} ${cy}H${cx}V${y + CH}`,
        '╔': `M${x + CW} ${cy}H${cx}V${y + CH}`,
        '╚': `M${cx} ${y}V${cy}H${x + CW}`,
        '╝': `M${cx} ${y}V${cy}H${x}`,
      };
      if (seg[ch]) shadow.push(seg[ch]);
    }
    rows.push({ blocks, shadow: shadow.join('') });
  });
  return rows;
}

function build(theme: ThemeName): string {
  const t = THEMES[theme];
  let y = TITLE_H + PAD + 12;
  const parts: string[] = [];
  let begin = 0.3;

  // 1. команда
  const cmd = 'whoami';
  parts.push(
    typedLine({
      id: 'l0', x: PAD, y,
      content: prompt(t, PROMPT_USER, PROMPT_HOST, cmd),
      chars: `${PROMPT_USER}@${PROMPT_HOST} ~ $ ${cmd}`.length,
      begin, dur: 0.6, cursorColor: t.text,
    }),
  );
  begin += 0.8;
  y += 34;

  // 2. имя: каждая строка блоков вытирается слева направо
  const cols = Math.max(...NAME_ART.map((l) => [...l].length));
  const artW = cols * CW;
  const artX = Math.round((WIDTH - artW) / 2);
  parts.push(`<defs><linearGradient id="art" gradientUnits="userSpaceOnUse" x1="${artX}" y1="0" x2="${artX + artW}" y2="0">
  <stop offset="0" stop-color="${t.art[0]}"/><stop offset="1" stop-color="${t.art[1]}"/>
</linearGradient></defs>`);

  vectorArt(t, artX, y).forEach((row, r) => {
    const ry = y + r * CH;
    const b = (begin + r * 0.1).toFixed(2);
    parts.push(`<clipPath id="n${r}"><rect x="${artX - 2}" y="${ry - 1}" width="0" height="${CH + 2}">
  <animate attributeName="width" from="0" to="${artW + 4}" begin="${b}s" dur="0.6s" fill="freeze"/>
</rect></clipPath>
<g clip-path="url(#n${r})">
  <path d="${row.shadow}" fill="none" stroke="${t.shadow}" stroke-width="1.6" stroke-linecap="square"/>
  <g fill="url(#art)">${row.blocks}</g>
</g>`);
  });
  begin += NAME_ART.length * 0.1 + 0.6;
  y += NAME_ART.length * CH + 30;

  // 3. слоган по центру
  parts.push(
    `<text x="${WIDTH / 2}" y="${y}" text-anchor="middle" fill="${t.muted}" class="fade" style="animation-delay:${begin.toFixed(2)}s">${esc(TAGLINE)}</text>`,
  );
  begin += 0.4;
  y += LINE_H + 12;

  // 4. пустой промпт с мигающим курсором
  const pLen = `${PROMPT_USER}@${PROMPT_HOST} ~ $ `.length;
  parts.push(
    `<g class="fade" style="animation-delay:${begin.toFixed(2)}s">
  <text x="${PAD}" y="${y}" xml:space="preserve">${prompt(t, PROMPT_USER, PROMPT_HOST, '')}</text>
  <rect class="blink" x="${PAD + pLen * CHAR_W}" y="${y - 13}" width="${CHAR_W}" height="17" fill="${t.text}" opacity=".85"/>
</g>`,
  );

  return frame(t, y + PAD, `${PROMPT_USER}@${PROMPT_HOST}: ~`, parts.join('\n'));
}

for (const theme of ['dark', 'light'] as const) {
  save(`assets/header-${theme}.svg`, build(theme));
}
