/* all the info about me, the only file to edit for updates (loads before terminal.js)
   text goes in 'quotes', list items need a comma after them except the last
   blank page after an edit = usually a missing comma or quote */

window.CONTENT = {

  user: 'guest',
  host: 'kolyps0',

  /* ascii art, one line per string, backslashes need doubling */
  banner: [
    " _         _                  ___  ",
    "| | _____ | |_   _ _ __  ___ / _ \\ ",
    "| |/ / _ \\| | | | | '_ \\/ __| | | |",
    "|   < (_) | | |_| | |_) \\__ \\ |_| |",
    "|_|\\_\\___/|_|\\__, | .__/|___/\\___/ ",
    "             |___/|_|              "
  ],

  welcome: 'Welcome to kolyps0.github.io (browser, JavaScript 1.0 LTS)',
  motd: [
    ' * robotics, ml, security, competitive programming, games',
    ' * type help to list commands, or projects to see my work',
    ' * theme switches between light and dark'
  ],

  about: [
    'i run servers, learn robotics and ml, and write down what broke.',
    'working towards robotics and autonomous systems.'
  ],

  interests: 'robotics / ml / security / comp prog / games',

  /* status and repo are optional, repo shows a link under the project */
  projects: [
    { name: 'inspection-robot', status: 'in progress', desc: 'an autonomous inspection robot built on ROS2' /*, repo: 'https://github.com/kolyps0/REPO' */ },
    { name: 'security-onboarding-game', desc: 'team-built game that teaches security basics' },
    { name: 'virtual-pet-game', status: 'in progress', desc: 'a digimon-style virtual pet game' }
  ],

  homelab: [
    { name: 'azerothcore-llm-bots', desc: 'self-hosted server, bots chat through a local LLM, reached over tailscale' },
    { name: 'jellyfin-server', desc: 'headless macbook media server, streamed to an apple tv' },
    { name: 'arch-install', desc: 'manual arch install on a razer blade 16' },
    { name: 'dual-boot', desc: 'ubuntu 22.04 and windows 11 on the same laptop' }
  ],

  /* update every few weeks */
  now: [
    { key: 'building', value: 'a digimon-style virtual pet game' },
    { key: 'learning', value: 'guide to competitive programming, real-world bug hunting' },
    { key: 'grinding', value: 'the CSES problem set, in C++' },
    { key: 'tinkering', value: 'native ports of open-source game engines' }
  ],

  stack: [
    { key: 'languages', value: 'C++, Python, Bash' },
    { key: 'robotics', value: 'ROS2' },
    { key: 'tools', value: 'Linux, Git, Tailscale, Ollama' }
  ],

  /* TODO add email: { label: 'email', text: 'me@example.com', url: 'mailto:me@example.com' } */
  links: [
    { label: 'github', text: 'github.com/kolyps0', url: 'https://github.com/kolyps0' },
    { label: 'x(twitter)', text: 'x.com/kolyps0', url: 'https://x.com/kolyps0' },
    { label: 'letterboxd', text: 'letterboxd.com/kolypso', url: 'https://letterboxd.com/kolypso' }
  ],

  /* theme and uptime lines are added automatically */
  neofetch: [
    { key: 'os', value: 'whatever you opened this in' },
    { key: 'shell', value: 'some javascript' },
    { key: 'focus', value: 'robotics, ml, security' },
    { key: 'also', value: 'competitive programming, games' }
  ],

  /* own commands, example:
     { name: 'resume', help: 'my cv', output: [ [ 'download: ', { text: 'cv.pdf', url: 'cv.pdf' } ] ] } */
  extra: [
  ]
};
