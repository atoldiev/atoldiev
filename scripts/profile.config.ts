// Всё содержимое профиля в одном месте. Поменял текст → `npm run art` → закоммитил SVG.

export const USERNAME = 'atoldiev';

export const PROMPT_USER = 'ahmed';
export const PROMPT_HOST = 'toldiev';

export const TAGLINE = 'Full-stack developer · TypeScript · Next.js · NestJS · PostgreSQL';

// Строки карточки в стиле neofetch. key: value (значение не длиннее ~54 символов)
export const CARD_ROWS: Array<[string, string]> = [
  ['Role', 'Full-stack developer, freelance'],
  ['Experience', '5 years'],
  ['Location', 'Ingushetia, Russia'],
  ['Frontend', 'React · Next.js · TypeScript · Tailwind CSS'],
  ['', 'Redux Toolkit · React Hook Form · Zod · GSAP'],
  ['Backend', 'Node.js · NestJS · Express · REST · JWT'],
  ['Data', 'PostgreSQL · MongoDB · Redis · Prisma · Drizzle'],
  ['DevOps', 'Docker · Nginx · Linux VPS · GitHub Actions'],
  ['Integrations', 'Telegram bots · WhatsApp · payments · Bitrix24'],
  ['Building', 'Websites, admin panels, CRMs, internal tools'],
  ['Clients', 'Clinics · gyms · furniture salons · BIM firms'],
  ['Shipped', 'toldiev-prompts.ru: 600 ChatGPT prompts'],
  ['', 'Delivery tracker: orders + analytics tool'],
  ['Languages', 'Russian · English'],
  ['Status', 'Open to freelance projects'],
];

// Ингушская боевая башня. Рисуется снизу вверх, как кладка.
export const TOWER = [
  '          ^          ',
  '         /=\\         ',
  '        /===\\        ',
  '       /=====\\       ',
  '      /=======\\      ',
  '      |  ___  |      ',
  '      | |   | |      ',
  '      |   .   |      ',
  '     |    _    |     ',
  '     |   | |   |     ',
  '     |         |     ',
  '     |  _   _  |     ',
  '    |  | | | |  |    ',
  '    |           |    ',
  '    |    ___    |    ',
  '   |    |   |    |   ',
  '/\\ |    |   |    | /\\',
  '  \\|____|___|____|/  ',
];

// Сгенерировано figlet, шрифт "ANSI Shadow", текст "AHMED TOLDIEV".
// █ рисуется залитым блоком, ╔═╗║╚╝ — тонкой тенью. Шрифт для этого не нужен.
export const NAME_ART = [
  " █████╗ ██╗  ██╗███╗   ███╗███████╗██████╗     ████████╗ ██████╗ ██╗     ██████╗ ██╗███████╗██╗   ██╗",
  "██╔══██╗██║  ██║████╗ ████║██╔════╝██╔══██╗    ╚══██╔══╝██╔═══██╗██║     ██╔══██╗██║██╔════╝██║   ██║",
  "███████║███████║██╔████╔██║█████╗  ██║  ██║       ██║   ██║   ██║██║     ██║  ██║██║█████╗  ██║   ██║",
  "██╔══██║██╔══██║██║╚██╔╝██║██╔══╝  ██║  ██║       ██║   ██║   ██║██║     ██║  ██║██║██╔══╝  ╚██╗ ██╔╝",
  "██║  ██║██║  ██║██║ ╚═╝ ██║███████╗██████╔╝       ██║   ╚██████╔╝███████╗██████╔╝██║███████╗ ╚████╔╝ ",
  "╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝╚═════╝        ╚═╝    ╚═════╝ ╚══════╝╚═════╝ ╚═╝╚══════╝  ╚═══╝  ",
];
