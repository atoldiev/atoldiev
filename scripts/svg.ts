import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname } from 'node:path';

export type ThemeName = 'dark' | 'light';

export interface Theme {
  bg: string;
  panel: string;
  border: string;
  text: string;
  muted: string;
  green: string;
  blue: string;
  amber: string;
  pink: string;
  art: [string, string]; // градиент имени: слева → справа
  shadow: string; // тень блочных букв
  dots: [string, string, string];
  heat: [string, string, string, string, string];
}

// Цвета подобраны с контрастом не ниже 4.5:1 к своему фону (WCAG AA),
// в светлой теме зелёный и синий заметно темнее, чем в тёмной.
export const THEMES: Record<ThemeName, Theme> = {
  dark: {
    bg: '#0d1117',
    panel: '#161b22',
    border: '#30363d',
    text: '#eef2f6',
    muted: '#a3adb8',
    green: '#4ade80',
    blue: '#7dd3fc',
    amber: '#fbbf24',
    pink: '#fb7185',
    art: ['#4ade80', '#38bdf8'],
    shadow: '#3b4b5c',
    dots: ['#ff5f57', '#febc2e', '#28c840'],
    heat: ['#1c2128', '#0e4429', '#006d32', '#26a641', '#39d353'],
  },
  light: {
    bg: '#ffffff',
    panel: '#eef1f5',
    border: '#c8d0da',
    text: '#111827',
    muted: '#475467',
    green: '#0a7a3a',
    blue: '#0b55b5',
    amber: '#8f5b00',
    pink: '#c0262d',
    art: ['#0a7a3a', '#0b6fb8'],
    shadow: '#c3ccd6',
    dots: ['#ff5f57', '#febc2e', '#28c840'],
    heat: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
  },
};

// JetBrains Mono вшивается в каждый SVG: внутри <img> внешние шрифты не грузятся,
// а без своего шрифта на Windows, macOS и телефоне текст выглядит по-разному.
const require = createRequire(import.meta.url);
const fontData = (weight: number) =>
  readFileSync(
    require.resolve(`@fontsource/jetbrains-mono/files/jetbrains-mono-latin-${weight}-normal.woff2`),
  ).toString('base64');
const FONT_FACES = [500, 800]
  .map((w) => `@font-face { font-family: 'JBM'; font-weight: ${w}; src: url(data:font/woff2;base64,${fontData(w)}) format('woff2'); }`)
  .join('\n  ');

export const FONT = "'JBM', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
export const FONT_SIZE = 14;
export const CHAR_W = FONT_SIZE * 0.6; // у JetBrains Mono ширина знака ровно 0.6em
export const LINE_H = 20;
export const WIDTH = 860;
export const PAD = 26;
export const TITLE_H = 36;

export const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Рамка окна терминала: фон, заголовок с тремя точками. */
export function frame(t: Theme, height: number, title: string, body: string, extraCss = ''): string {
  const dots = t.dots
    .map((c, i) => `<circle cx="${20 + i * 18}" cy="${TITLE_H / 2}" r="6" fill="${c}"/>`)
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${height}" viewBox="0 0 ${WIDTH} ${height}" role="img" aria-label="${esc(title)}">
<style>
  ${FONT_FACES}
  text { font-family: ${FONT}; font-size: ${FONT_SIZE}px; font-weight: 500; white-space: pre; font-variant-ligatures: none; font-feature-settings: 'liga' 0, 'calt' 0; }
  .b { font-weight: 800; }
  .fade { opacity: 0; animation: fade .45s ease-out forwards; }
  @keyframes fade { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
  .blink { animation: blink 1s steps(1) infinite; }
  @keyframes blink { 50% { opacity: 0; } }
  @media (prefers-reduced-motion: reduce) {
    .fade { animation: none; opacity: 1; }
    .blink { animation: none; }
  }
  ${extraCss}
</style>
<rect x="0.5" y="0.5" width="${WIDTH - 1}" height="${height - 1}" rx="10" fill="${t.bg}"/>
<path d="M10.5 0.5 H${WIDTH - 10.5} A10 10 0 0 1 ${WIDTH - 0.5} 10.5 V${TITLE_H} H0.5 V10.5 A10 10 0 0 1 10.5 0.5 Z" fill="${t.panel}"/>
<path d="M0.5 ${TITLE_H} H${WIDTH - 0.5}" stroke="${t.border}"/>
<rect x="0.5" y="0.5" width="${WIDTH - 1}" height="${height - 1}" rx="10" fill="none" stroke="${t.border}"/>
${dots}
<text x="${WIDTH / 2}" y="${TITLE_H / 2 + 4}" text-anchor="middle" fill="${t.muted}" style="font-size:12px">${esc(title)}</text>
${body}
</svg>
`;
}

/** Строка, которая «печатается» слева направо: растущая маска + курсор на краю. */
export function typedLine(opts: {
  id: string;
  x: number;
  y: number;
  content: string; // готовые <tspan>, уже экранированные
  chars: number;
  begin: number;
  dur: number;
  cursorColor?: string;
}): string {
  const { id, x, y, content, chars, begin, dur, cursorColor } = opts;
  const w = Math.ceil(chars * CHAR_W) + 4;
  const top = y - FONT_SIZE;
  const cursor = cursorColor
    ? `<rect y="${top + 1}" width="${CHAR_W}" height="${FONT_SIZE + 3}" fill="${cursorColor}" opacity="0">
    <set attributeName="opacity" to="0.85" begin="${begin}s"/>
    <animate attributeName="x" from="${x}" to="${x + w}" begin="${begin}s" dur="${dur}s" fill="freeze"/>
    <set attributeName="opacity" to="0" begin="${(begin + dur + 0.05).toFixed(2)}s"/>
  </rect>`
    : '';
  return `<clipPath id="${id}"><rect x="${x - 2}" y="${top - 2}" width="0" height="${LINE_H + 4}">
    <animate attributeName="width" from="0" to="${w}" begin="${begin}s" dur="${dur}s" fill="freeze"/>
  </rect></clipPath>
<text x="${x}" y="${y}" xml:space="preserve" clip-path="url(#${id})">${content}</text>
${cursor}`;
}

export function prompt(t: Theme, user: string, host: string, cmd: string): string {
  return `<tspan fill="${t.green}" class="b">${esc(user)}@${esc(host)}</tspan><tspan fill="${t.muted}"> ~ $ </tspan><tspan fill="${t.text}">${esc(cmd)}</tspan>`;
}

export function save(path: string, svg: string) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, svg);
  console.log('wrote', path);
}
