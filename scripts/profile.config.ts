// Всё содержимое профиля в одном месте. Поменял текст → `npm run art` → закоммитил SVG.

export const USERNAME = 'atoldiev';

export const PROMPT_USER = 'ahmed';
export const PROMPT_HOST = 'toldiev';

export const TAGLINE = 'Full-stack web developer · Next.js · React · TypeScript';

// Строки карточки в стиле neofetch. key: value
export const CARD_ROWS: Array<[string, string]> = [
  ['Role', 'Full-stack web developer, freelance'],
  ['Location', 'Ingushetia, Russia'],
  ['Experience', '3 years in web development'],
  ['Stack', 'Next.js · React · TypeScript · Redux Toolkit'],
  ['Backend', 'Node.js · Express · PostgreSQL · Sequelize'],
  ['Building', 'Websites, admin panels & CRMs for businesses'],
  ['Clients', 'Clinics · gyms · furniture salons · BIM firms'],
  ['Shipped', 'toldiev-prompts.ru: 600 ChatGPT prompts'],
  ['', 'Delivery tracker: orders + analytics tool'],
  ['Hackathon', 'M.Video, data science track'],
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
