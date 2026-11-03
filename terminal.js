/* the engine, everything it prints comes from content.js */

(function () {
  'use strict';

  /* setup */

  var C = window.CONTENT;
  var out = document.getElementById('out');
  var input = document.getElementById('cmd');
  var ps1El = document.getElementById('ps1');
  var inrow = document.getElementById('inrow');
  var themeBtn = document.getElementById('theme-btn');
  var metaTheme = document.querySelector('meta[name="theme-color"]');

  if (!C) {
    out.textContent = 'content.js did not load. Check that it sits next to index.html.';
    return;
  }

  var started = Date.now();
  var history = [];
  var hIndex = 0;
  var BLANK = '\u00a0';       // space that doesnt collapse, makes an empty line


  /* helpers */

  // pads with spaces so columns line up
  function pad(text, n) { while (text.length < n) text += ' '; return text; }

  // { text, url } to a link, web links open in a new tab
  function anchor(part) {
    var el = document.createElement('a');
    el.href = part.url;
    el.textContent = part.text;
    if (/^https?:/.test(part.url)) { el.target = '_blank'; el.rel = 'noopener'; }
    return el;
  }

  // prints lines, a line is a string or a list mixing strings and { text, url } links
  function add() {
    for (var i = 0; i < arguments.length; i++) {
      var item = arguments[i];
      var parts = Array.isArray(item) ? item : [item];
      var p = document.createElement('p');
      parts.forEach(function (part) {
        if (part && typeof part === 'object' && part.url) p.append(anchor(part));
        else p.append(String(part));
      });
      out.appendChild(p);
    }
  }

  function prompt() { return C.user + '@' + C.host + ':~$ '; }

  // { key, value } list as columns
  function pairs(list, width) {
    var w = width || Math.max.apply(null, list.map(function (x) { return x.key.length; })) + 2;
    add.apply(null, list.map(function (x) { return pad(x.key, w) + x.value; }));
  }

  function names(list) {
    return list.map(function (x) { return x.name + '/'; }).join('  ');
  }

  function stamp(d) {
    var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var mons = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    function z(n) { return (n < 10 ? '0' : '') + n; }
    return days[d.getDay()] + ' ' + mons[d.getMonth()] + ' ' + d.getDate() + ' ' +
      z(d.getHours()) + ':' + z(d.getMinutes()) + ':' + z(d.getSeconds());
  }


  /* theme */

  function currentTheme() {
    return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }

  function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    try { localStorage.setItem('theme', t); } catch (e) {}   // try/catch in case storage is blocked
    var other = t === 'dark' ? 'light' : 'dark';
    themeBtn.textContent = '[' + other + ']';
    themeBtn.setAttribute('aria-label', 'Switch to ' + other + ' theme');
    if (metaTheme) metaTheme.setAttribute('content', t === 'dark' ? '#000000' : '#ffffff');
  }

  themeBtn.addEventListener('click', function () {
    applyTheme(currentTheme() === 'dark' ? 'light' : 'dark');
    // refocus the prompt, not on phones as it would open the keyboard
    if (!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches)) {
      input.focus({ preventScroll: true });
    }
  });

  applyTheme(currentTheme());


  /* top of page */

  // shows the previous visit, like a real terminal
  function login() {
    var prev = null;
    try { prev = localStorage.getItem('lastLogin'); } catch (e) {}
    var when = prev ? new Date(parseInt(prev, 10)) : new Date();
    try { localStorage.setItem('lastLogin', String(Date.now())); } catch (e) {}
    add('Last login: ' + stamp(when) + ' on ttys001');
  }

  function banner() {
    // style.css uses the width to shrink the art to fit
    var cols = Math.max.apply(null, C.banner.map(function (l) { return l.length; }));
    document.documentElement.style.setProperty('--banner-cols', cols);
    var pre = document.createElement('pre');
    pre.className = 'banner';
    pre.setAttribute('role', 'img');
    pre.setAttribute('aria-label', C.host);
    pre.textContent = C.banner.join('\n');
    out.appendChild(pre);
  }

  function motd() {
    add(C.welcome, BLANK);
    C.motd.forEach(function (line) { add(line); });
    add(BLANK);
  }


  /* commands */

  // files for cat: filename and the command it runs
  var FILE_CMDS = {
    'about.txt': 'about',
    'now.txt': 'now',
    'stack.txt': 'stack',
    'links.txt': 'links',
    'interests.txt': 'interests'
  };
  var FILES = Object.keys(FILE_CMDS);

  // name on the left is what gets typed (simple new ones can go in "extra" in content.js)
  var cmds = {

    help: function () {
      var rows = [
        ['about', 'who i am'],
        ['projects', 'things i am building'],
        ['homelab', 'servers and installs'],
        ['now', 'what i am up to'],
        ['stack', 'tools i use'],
        ['links', 'where to find me'],
        ['neofetch', 'the usual'],
        ['theme', 'switch light and dark'],
        ['ls, cat', 'poke around the files'],
        ['banner', 'show the welcome screen again'],
        ['clear', 'clear the screen']
      ];
      // extras go just before the last two rows
      (C.extra || []).forEach(function (x) { rows.splice(rows.length - 2, 0, [x.name, x.help || '']); });
      add('commands:');
      rows.forEach(function (r) { add('  ' + pad(r[0], 11) + r[1]); });
    },

    about: function () { add.apply(null, C.about); },

    whoami: function () {
      add(C.user, 'that is you. the person who lives here is ' + C.host + ', aka kailah. try about.');
    },

    projects: function () {
      C.projects.forEach(function (p) {
        add(p.name + (p.status ? '  (' + p.status + ')' : ''), '  ' + p.desc);
        if (p.repo) add(['  ', { text: p.repo.replace(/^https?:\/\//, ''), url: p.repo }]);
      });
    },
    homelab: function () {
      C.homelab.forEach(function (p) {
        add(p.name, '  ' + p.desc);
        if (p.repo) add(['  ', { text: p.repo.replace(/^https?:\/\//, ''), url: p.repo }]);
      });
    },

    now: function () { pairs(C.now); },
    stack: function () { pairs(C.stack); },

    links: function () {
      var w = Math.max.apply(null, C.links.map(function (l) { return l.label.length; })) + 2;
      C.links.forEach(function (l) { add([pad(l.label, w), { text: l.text, url: l.url }]); });
    },

    interests: function () { add(C.interests); },

    neofetch: function () {
      var secs = Math.round((Date.now() - started) / 1000);
      var list = C.neofetch.concat([
        { key: 'theme', value: currentTheme() },
        { key: 'uptime', value: secs + 's (since you loaded the page)' }
      ]);
      add(C.user + '@' + C.host, '---------------');
      pairs(list, 10);
    },

    // "theme" flips it, "theme dark" or "theme light" picks one
    theme: function (args) {
      var want = (args[0] || '').toLowerCase();
      if (want !== 'light' && want !== 'dark') want = currentTheme() === 'dark' ? 'light' : 'dark';
      applyTheme(want);
      add('theme set to ' + want);
    },

    banner: function () { banner(); motd(); },

    ls: function (args) {
      var t = (args[0] || '').replace(/\/$/, '');
      if (!t) add(FILES.join('  ') + '  projects/  homelab/');
      else if (t === 'projects') add(names(C.projects));
      else if (t === 'homelab') add(names(C.homelab));
      else add('ls: cannot access ' + args[0] + ': no such file or directory');
    },

    // runs the matching command, so "cat about.txt" is the same as "about"
    cat: function (args) {
      if (!args[0]) add('cat: missing file');
      else if (FILE_CMDS[args[0]]) cmds[FILE_CMDS[args[0]]]([]);
      else add('cat: ' + args[0] + ': no such file');
    },

    pwd: function () { add('/home/' + C.user); },
    cd: function () { add('cd: it is a very small filesystem. try ls.'); },
    date: function () { add(new Date().toString()); },
    echo: function (args) { add(args.join(' ') || BLANK); },
    history: function () {
      if (!history.length) add('(nothing yet)');
      history.forEach(function (h, i) { add((i + 1) + '  ' + h); });
    },
    sudo: function () { add(C.user + ' is not in the sudoers file. this incident will be reported.'); },
    rm: function () { add('nice try.'); },
    exit: function () { add('there is no escape. (close the tab, probably)'); },

    clear: function () { out.innerHTML = ''; }
  };

  cmds.skills = cmds.stack;
  cmds.contact = cmds.links;

  (C.extra || []).forEach(function (x) {
    cmds[x.name] = function () { add.apply(null, x.output || []); };
  });


  /* typing */

  function echoLine(raw, suffix) { add(prompt() + raw + (suffix || '')); }

  function run(raw) {
    var line = raw.trim();
    echoLine(raw);
    if (!line) return;
    history.push(line);
    hIndex = history.length;
    var parts = line.split(/\s+/);
    var name = parts[0].toLowerCase();
    // hasOwnProperty so something like "constructor" doesnt run a built-in
    if (Object.prototype.hasOwnProperty.call(cmds, name)) cmds[name](parts.slice(1));
    else add('command not found: ' + name + ' (try help)');
  }

  function toBottom() { inrow.scrollIntoView({ block: 'end' }); }

  input.addEventListener('keydown', function (e) {

    if (e.key === 'Enter') {
      var raw = input.value;
      input.value = '';
      run(raw);
      toBottom();

    // up/down step through history
    } else if (e.key === 'ArrowUp') {
      if (hIndex > 0) { hIndex--; input.value = history[hIndex]; }
      e.preventDefault();

    } else if (e.key === 'ArrowDown') {
      if (hIndex < history.length - 1) { hIndex++; input.value = history[hIndex]; }
      else { hIndex = history.length; input.value = ''; }
      e.preventDefault();

    // tab completes command names, and file names after cat/ls
    } else if (e.key === 'Tab') {
      var v = input.value.toLowerCase();
      var toks = v.split(/\s+/);
      var hits = [], prefix = '';
      if (toks.length === 1 && v) {
        hits = Object.keys(cmds).filter(function (c) { return c.indexOf(v) === 0; });
      } else if (toks.length === 2 && (toks[0] === 'cat' || toks[0] === 'ls')) {
        var pool = FILES.slice();
        if (toks[0] === 'ls') pool.push('projects/', 'homelab/');
        hits = pool.filter(function (c) { return toks[1] && c.indexOf(toks[1]) === 0; });
        prefix = toks[0] + ' ';
      }
      // only on exactly one match, otherwise tab still moves focus for keyboard users
      if (hits.length === 1) { input.value = prefix + hits[0] + (prefix ? '' : ' '); e.preventDefault(); }

    } else if (e.key === 'l' && e.ctrlKey) {
      out.innerHTML = '';
      e.preventDefault();

    // skipped if text is selected so copying still works
    } else if (e.key === 'c' && e.ctrlKey && !window.getSelection().toString()) {
      echoLine(input.value, '^C');
      input.value = '';
      toBottom();
      e.preventDefault();
    }
  });

  // click anywhere to type, except links/button or while selecting text
  document.addEventListener('click', function (e) {
    if (e.target.closest('a, button')) return;
    if (window.getSelection && window.getSelection().toString()) return;
    input.focus({ preventScroll: true });
  });


  /* start */

  ps1El.textContent = prompt();
  login();
  banner();
  motd();
})();
