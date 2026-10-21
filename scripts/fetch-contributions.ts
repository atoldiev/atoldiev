// Забирает публичный календарь контрибуций (без токена) и пишет data/contributions.json.
// Если включено «Include private contributions», приватные коммиты тоже попадут в счёт.
// При любом сбое скрипт падает: workflow ничего не коммитит и на профиле остаётся прошлый SVG.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { USERNAME } from './profile.config.ts';

export interface Day { date: string; count: number; level: number }
export interface Contributions {
  username: string;
  fetchedAt: string;
  total: number;
  days: Day[];
  currentStreak: number;
  longestStreak: number;
  bestDay: Day | null;
}

const attr = (tag: string, name: string) =>
  tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];

export function parse(html: string): Day[] {
  // подсказки вида: <tool-tip for="contribution-day-component-0-0">3 contributions on May 8th.</tool-tip>
  const counts = new Map<string, number>();
  for (const m of html.matchAll(/<tool-tip\b([^>]*)>([^<]*)<\/tool-tip>/g)) {
    const id = attr(m[1], 'for');
    if (!id) continue;
    const n = m[2].match(/^\s*([\d,]+)\s+contribution/);
    counts.set(id, n ? Number(n[1].replace(/,/g, '')) : 0);
  }

  const days: Day[] = [];
  for (const m of html.matchAll(/<td\b[^>]*ContributionCalendar-day[^>]*>/g)) {
    const tag = m[0];
    const date = attr(tag, 'data-date');
    if (!date) continue;
    const level = Number(attr(tag, 'data-level') ?? 0);
    const id = attr(tag, 'id') ?? '';
    // если подсказок нет, хотя бы отличаем пустой день от непустого
    const count = counts.get(id) ?? (level > 0 ? level : 0);
    days.push({ date, count, level });
  }
  return days.sort((a, b) => a.date.localeCompare(b.date));
}

export function stats(days: Day[]) {
  let longest = 0, run = 0;
  for (const d of days) {
    run = d.count > 0 ? run + 1 : 0;
    longest = Math.max(longest, run);
  }
  // текущая серия: сегодняшний пустой день серию не обрывает
  let current = 0;
  let i = days.length - 1;
  if (i >= 0 && days[i].count === 0) i--;
  for (; i >= 0 && days[i].count > 0; i--) current++;

  const best = days.reduce<Day | null>((b, d) => (!b || d.count > b.count ? d : b), null);
  const total = days.reduce((s, d) => s + d.count, 0);
  return { total, currentStreak: current, longestStreak: longest, bestDay: best && best.count > 0 ? best : null };
}

async function main() {
  // для отладки: node ... fetch-contributions.ts saved.html
  const html = process.argv[2]
    ? readFileSync(process.argv[2], 'utf8')
    : await fetch(`https://github.com/users/${USERNAME}/contributions`, {
        headers: { 'User-Agent': `${USERNAME}-profile-readme` },
      }).then((r) => {
        if (!r.ok) throw new Error(`GitHub responded ${r.status}`);
        return r.text();
      });

  const days = parse(html);
  if (days.length < 300) {
    throw new Error(`Parsed only ${days.length} days, GitHub markup probably changed. Keeping the old SVG.`);
  }

  const out: Contributions = {
    username: USERNAME,
    fetchedAt: new Date().toISOString(),
    days,
    ...stats(days),
  };
  mkdirSync('data', { recursive: true });
  writeFileSync('data/contributions.json', JSON.stringify(out, null, 2));
  console.log(`${days.length} days, ${out.total} contributions, streak ${out.currentStreak}/${out.longestStreak}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((e) => {
    console.error(e.message);
    process.exit(1);
  });
}
